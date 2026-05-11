// 실손의료비(실비) 보험금 추정 계산기 — 표준약관 기반
// 1·2·3·4세대 + 유병자실손

export type Generation = "1" | "2" | "3" | "4" | "sick";
export type SubGen2 = "2a" | "2b" | "2c"; // 2세대 1차·2차·3차
export type Plan = "std" | "sel"; // 표준형·선택형
export type Nhis = "yes" | "no"; // 유병자 건강보험 적용 여부
export type VisitType = "in" | "out" | "rx"; // 입원·통원·처방
export type Hospital = "clinic" | "hosp" | "gen" | "top"; // 의원·병원·종합·상급종합
export type BiType = "gen" | "physio" | "inject" | "mri"; // 일반비급여·도수·주사·MRI

export type CalcInput = {
  gen: Generation;
  subgen: SubGen2;
  plan: Plan;
  nhis: Nhis;
  type: VisitType;
  hospital: Hospital;
  bitype: BiType;
  /** 급여 본인부담금 */
  covered: number;
  /** 비급여 금액 */
  nonCovered: number;
};

export type CalcResult = {
  /** 보장대상 의료비 합계 */
  total: number;
  /** 보험사 지급(예상) */
  payout: number;
  /** 본인부담 (총액 - 지급) */
  selfPay: number;
  /** 실질 보장률 (%) */
  coverageRate: number;
  /** 계산 근거 라인 */
  basis: string[];
  /** 보장 한도 안내 */
  limitNote: string | null;
};

// ── 표준 약관 기반 상수 ──
// 통원 시 병원급별 공제액 (1~3세대 3단계)
const HOSPITAL_DEDUCT: Record<Hospital, number> = {
  clinic: 10000,
  hosp: 15000,
  gen: 20000,
  top: 20000,
};
// 4세대 전용 (2단계: 의원·병원 1만원 / 종합·상급 2만원)
const HOSPITAL_DEDUCT_4: Record<Hospital, number> = {
  clinic: 10000,
  hosp: 10000,
  gen: 20000,
  top: 20000,
};

type CapKey = "1" | "2a" | "2b" | "2c" | "3" | "4" | "sick";
// 세대·유형별 건당 한도
const CAP_TABLE: Record<CapKey, { in: number; out: number; rx: number }> = {
  "1": { in: 100_000_000, out: 500_000, rx: 500_000 },
  "2a": { in: 50_000_000, out: 300_000, rx: 300_000 },
  "2b": { in: 50_000_000, out: 300_000, rx: 300_000 },
  "2c": { in: 50_000_000, out: 300_000, rx: 300_000 },
  "3": { in: 50_000_000, out: 250_000, rx: 50_000 },
  "4": { in: 50_000_000, out: 400_000, rx: 400_000 },
  sick: { in: 50_000_000, out: 200_000, rx: 0 },
};

// 연간 한도 안내문
type AnnualInfo = Partial<Record<VisitType | BiType, string>>;
const ANNUAL_INFO: Record<CapKey, AnnualInfo> = {
  "1": { in: "최대 1억원/건", out: "50만원/건·연 30회", rx: "" },
  "2a": { in: "5천만원/연", out: "30만원/건·연 30회", rx: "8천원 공제" },
  "2b": {
    in: "5천만원/연",
    out: "30만원/건·연 180회",
    rx: "8천원 또는 급여10%+비급여20% 중 큰 금액 공제",
  },
  "2c": {
    in: "5천만원/연",
    out: "30만원/건·연 180회",
    rx: "8천원 또는 급여10%+비급여20% 중 큰 금액 공제",
  },
  "3": {
    in: "5천만원/연 · 자기부담 연 200만원 초과분 전액보상",
    out: "외래 25만원/건·연 180회",
    rx: "5만원/건·연 180회",
    physio: "도수·체외충격파·증식치료 합산 350만원/연 50회",
    inject: "250만원/연 50회",
    mri: "300만원/연",
  },
  "4": {
    in: "급여 5천만원/연 + 비급여 5천만원/연",
    out: "급여 20만원+비급여 20만원 합산 40만원/건 · 비급여 연 100회",
    rx: "급여+비급여 합산 40만원/건",
    physio: "도수·체외충격파·증식치료 합산 350만원/연 50회",
    inject: "250만원/연 50회",
    mri: "300만원/연",
  },
  sick: {
    in: "5천만원/연 · 자기부담 연 200만원 초과분 전액보상 (상급병실료 차액 제외)",
    out: "20만원/건·연 180회",
    rx: "보장 제외",
  },
};

function fmtWon(n: number): string {
  return Math.max(0, Math.round(n)).toLocaleString() + "원";
}

function calcRaw(input: CalcInput): { payout: number; basis: string[] } {
  const { gen, subgen, plan, nhis, type, hospital, bitype } = input;
  const G = Math.max(0, input.covered || 0);
  const B = Math.max(0, input.nonCovered || 0);
  const T = G + B;
  const hd = HOSPITAL_DEDUCT[hospital] || 10000;
  const basis: string[] = [];
  let pay = 0;

  // ── 1세대 ──
  if (gen === "1") {
    if (type === "in") {
      pay = T;
      basis.push("1세대 입원: 보장대상의료비 100% 보장 (자기부담금 없음)");
      basis.push("※ 가입금액 1천만원의 경우만 20% 자기부담 적용됨");
    } else if (type === "out") {
      pay = Math.max(0, T - 5000);
      basis.push("1세대 통원: 5천원 공제 후 전액 보장");
      basis.push(`${fmtWon(T)} - 5,000원 = ${fmtWon(pay)}`);
    } else {
      pay = Math.max(0, T - 5000);
      basis.push("1세대 처방: 통원의료비와 합산 · 5천원 공제 후 보장");
      basis.push(`${fmtWon(T)} - 5,000원 = ${fmtWon(pay)}`);
    }
  }

  // ── 2세대 ──
  else if (gen === "2") {
    const planLabel = plan === "std" ? "표준형" : "선택형";

    if (subgen === "2a") {
      // 1차(0908~1303): 급여+비급여 구분 없이 90% 보장
      if (type === "in") {
        pay = T * 0.9;
        basis.push("2세대 1차 입원: 보장대상의료비 × 90% (본인부담 10%)");
        basis.push(`${fmtWon(T)} × 90% = ${fmtWon(pay)}`);
      } else if (type === "out") {
        pay = Math.max(0, T - hd);
        basis.push(`2세대 1차 통원: 병원급 공제액 ${fmtWon(hd)} 차감`);
        basis.push(`${fmtWon(T)} - ${fmtWon(hd)} = ${fmtWon(pay)}`);
      } else {
        pay = Math.max(0, T - 8000);
        basis.push("2세대 1차 처방: 8천원 공제 후 보장");
        basis.push(`${fmtWon(T)} - 8,000원 = ${fmtWon(pay)}`);
      }
    } else if (subgen === "2b") {
      // 2차(1304~1508): 표준형20% / 선택형10%
      if (type === "in") {
        if (plan === "std") {
          pay = T * 0.8;
          basis.push(`2세대 2차 입원(${planLabel}): 보장대상의료비 × 80% (본인부담 20%)`);
          basis.push(`${fmtWon(T)} × 80% = ${fmtWon(pay)}`);
        } else {
          pay = T * 0.9;
          basis.push(`2세대 2차 입원(${planLabel}): 보장대상의료비 × 90% (본인부담 10%)`);
          basis.push(`${fmtWon(T)} × 90% = ${fmtWon(pay)}`);
        }
      } else if (type === "out") {
        const selfAmt = plan === "std" ? T * 0.2 : G * 0.1 + B * 0.2;
        const deduct = Math.max(hd, selfAmt);
        pay = Math.max(0, T - deduct);
        const fml =
          plan === "std"
            ? `보장대상의료비×20% = ${fmtWon(T * 0.2)}`
            : `급여10%+비급여20% = ${fmtWon(G * 0.1 + B * 0.2)}`;
        basis.push(`2세대 2차 통원(${planLabel}): MAX(병원급 ${fmtWon(hd)}, ${fml}) 공제`);
        basis.push(`${fmtWon(T)} - ${fmtWon(deduct)} = ${fmtWon(pay)}`);
      } else {
        const selfAmt = plan === "std" ? T * 0.2 : G * 0.1 + B * 0.2;
        const deduct = Math.max(8000, selfAmt);
        pay = Math.max(0, T - deduct);
        const fml =
          plan === "std"
            ? `보장대상의료비×20% = ${fmtWon(T * 0.2)}`
            : `급여10%+비급여20% = ${fmtWon(G * 0.1 + B * 0.2)}`;
        basis.push(`2세대 2차 처방(${planLabel}): MAX(8천원, ${fml}) 공제`);
        basis.push(`${fmtWon(T)} - ${fmtWon(deduct)} = ${fmtWon(pay)}`);
      }
    } else {
      // 3차(1509~1703): 표준형20% / 선택형(급여90% + 비급여80%)
      if (type === "in") {
        if (plan === "std") {
          pay = T * 0.8;
          basis.push(`2세대 3차 입원(${planLabel}): 보장대상의료비 × 80% (본인부담 20%)`);
          basis.push(`${fmtWon(T)} × 80% = ${fmtWon(pay)}`);
        } else {
          pay = G * 0.9 + B * 0.8;
          basis.push(`2세대 3차 입원(${planLabel}): 급여 × 90% + 비급여 × 80%`);
          basis.push(`급여 ${fmtWon(G)} × 90% + 비급여 ${fmtWon(B)} × 80% = ${fmtWon(pay)}`);
        }
      } else if (type === "out") {
        const selfAmt = plan === "std" ? T * 0.2 : G * 0.1 + B * 0.2;
        const deduct = Math.max(hd, selfAmt);
        pay = Math.max(0, T - deduct);
        const fml =
          plan === "std"
            ? `보장대상의료비×20% = ${fmtWon(T * 0.2)}`
            : `급여10%+비급여20% = ${fmtWon(G * 0.1 + B * 0.2)}`;
        basis.push(`2세대 3차 통원(${planLabel}): MAX(병원급 ${fmtWon(hd)}, ${fml}) 공제`);
        basis.push(`${fmtWon(T)} - ${fmtWon(deduct)} = ${fmtWon(pay)}`);
      } else {
        const selfAmt = plan === "std" ? T * 0.2 : G * 0.1 + B * 0.2;
        const deduct = Math.max(8000, selfAmt);
        pay = Math.max(0, T - deduct);
        const fml =
          plan === "std"
            ? `보장대상의료비×20% = ${fmtWon(T * 0.2)}`
            : `급여10%+비급여20% = ${fmtWon(G * 0.1 + B * 0.2)}`;
        basis.push(`2세대 3차 처방(${planLabel}): MAX(8천원, ${fml}) 공제`);
        basis.push(`${fmtWon(T)} - ${fmtWon(deduct)} = ${fmtWon(pay)}`);
      }
    }
  }

  // ── 3세대 (착한실손 1704~2106) ──
  else if (gen === "3") {
    const label3: Record<BiType, string> = {
      gen: "",
      physio: "도수·체외충격파·증식치료",
      inject: "비급여 주사",
      mri: "MRI/MRA",
    };
    const planLabel = plan === "std" ? "표준형" : "선택형";

    if (bitype !== "gen" && type !== "rx") {
      // 3대 비급여 특약: 자기부담 MAX(2만원, 30%)
      const deduct = Math.max(20000, B * 0.3);
      pay = Math.max(0, B - deduct);
      basis.push(`3세대 ${label3[bitype]} 특약 — 70% 보상`);
      basis.push(
        `자기부담: MAX(2만원, 비급여 ${fmtWon(B)} × 30% = ${fmtWon(B * 0.3)}) = ${fmtWon(deduct)}`,
      );
      basis.push(`비급여 ${fmtWon(B)} - 공제 ${fmtWon(deduct)} = ${fmtWon(pay)}`);
    } else if (type === "in") {
      if (plan === "std") {
        pay = T * 0.8;
        basis.push(`3세대 입원(${planLabel}): 보장대상의료비 × 80% (본인부담 20%)`);
        basis.push(`${fmtWon(T)} × 80% = ${fmtWon(pay)}`);
      } else {
        pay = G * 0.9 + B * 0.8;
        basis.push(`3세대 입원(${planLabel}): 급여 × 90% + 비급여 × 80%`);
        basis.push(`급여 ${fmtWon(G)} × 90% + 비급여 ${fmtWon(B)} × 80% = ${fmtWon(pay)}`);
      }
      basis.push("※ 자기부담 연간 200만원 초과분은 전액 보상");
    } else if (type === "out") {
      const selfAmt = plan === "std" ? T * 0.2 : G * 0.1 + B * 0.2;
      const deduct = Math.max(hd, selfAmt);
      pay = Math.max(0, T - deduct);
      const fml =
        plan === "std"
          ? `보장대상의료비×20% = ${fmtWon(T * 0.2)}`
          : `급여10%+비급여20% = ${fmtWon(G * 0.1 + B * 0.2)}`;
      basis.push(`3세대 통원(${planLabel}): MAX(병원급 ${fmtWon(hd)}, ${fml}) 공제`);
      basis.push(`${fmtWon(T)} - ${fmtWon(deduct)} = ${fmtWon(pay)}`);
    } else {
      const selfAmt = plan === "std" ? T * 0.2 : G * 0.1 + B * 0.2;
      const deduct = Math.max(8000, selfAmt);
      pay = Math.max(0, T - deduct);
      const fml =
        plan === "std"
          ? `보장대상의료비×20% = ${fmtWon(T * 0.2)}`
          : `급여10%+비급여20% = ${fmtWon(G * 0.1 + B * 0.2)}`;
      basis.push(`3세대 처방(${planLabel}): MAX(8천원, ${fml}) 공제`);
      basis.push(`${fmtWon(T)} - ${fmtWon(deduct)} = ${fmtWon(pay)}`);
    }
  }

  // ── 4세대 (2107~) ──
  else if (gen === "4") {
    const hd4 = HOSPITAL_DEDUCT_4[hospital] || 10000;
    const label4: Record<BiType, string> = {
      gen: "",
      physio: "도수·체외충격파·증식치료",
      inject: "비급여 주사",
      mri: "MRI/MRA",
    };

    if (bitype !== "gen" && type !== "rx") {
      // 3대 비급여 특약: 자기부담 MAX(3만원, 30%)
      const deduct = Math.max(30000, B * 0.3);
      pay = Math.max(0, B - deduct);
      basis.push(`4세대 ${label4[bitype]} 특약 — 70% 보상`);
      basis.push(
        `자기부담: MAX(3만원, 비급여 ${fmtWon(B)} × 30% = ${fmtWon(B * 0.3)}) = ${fmtWon(deduct)}`,
      );
      basis.push(`비급여 ${fmtWon(B)} - 공제 ${fmtWon(deduct)} = ${fmtWon(pay)}`);
    } else if (type === "in") {
      const payG = G * 0.8;
      const payB = B * 0.7;
      pay = payG + payB;
      basis.push("4세대 입원 — 급여 80% · 비급여 70% 보상 (분리계산)");
      basis.push(`급여 ${fmtWon(G)} × 80% = ${fmtWon(payG)}`);
      basis.push(`비급여 ${fmtWon(B)} × 70% = ${fmtWon(payB)}`);
      basis.push(`합계 = ${fmtWon(pay)}`);
    } else if (type === "out") {
      const deductG = Math.max(hd4, G * 0.2);
      const deductB = Math.max(30000, B * 0.3);
      const payG = Math.max(0, G - deductG);
      const payB = Math.max(0, B - deductB);
      pay = payG + payB;
      basis.push("4세대 통원 — 급여 80% · 비급여 70% 보상 (분리계산)");
      basis.push(`급여: ${fmtWon(G)} - MAX(${fmtWon(hd4)}, ${fmtWon(G * 0.2)}) = ${fmtWon(payG)}`);
      basis.push(`비급여: ${fmtWon(B)} - MAX(3만원, ${fmtWon(B * 0.3)}) = ${fmtWon(payB)}`);
      basis.push(`합계 ${fmtWon(pay)} (합산 한도 40만원/건 · 비급여 연 100회)`);
    } else {
      const deductG = Math.max(hd4, G * 0.2);
      const deductB = Math.max(30000, B * 0.3);
      pay = Math.max(0, G - deductG) + Math.max(0, B - deductB);
      basis.push("4세대 처방 — 통원에 포함 (급여 80% · 비급여 70%)");
      basis.push(
        `급여 ${fmtWon(G)} - MAX(${fmtWon(hd4)}, ${fmtWon(G * 0.2)}) + 비급여 ${fmtWon(B)} - MAX(3만원, ${fmtWon(B * 0.3)}) = ${fmtWon(pay)}`,
      );
    }
  }

  // ── 유병자실손 ──
  else if (gen === "sick") {
    const floorAmt = type === "in" ? 100_000 : 20_000;
    const typeLabel = type === "in" ? "입원" : "통원";
    if (nhis === "yes") {
      // 건강보험 적용: (급여+비급여) - MAX(공제, 30%) → 약 70% 보상
      const base = G + B;
      const deduct = Math.max(floorAmt, base * 0.3);
      pay = Math.max(0, base - deduct);
      basis.push(`유병자실손 ${typeLabel}(건강보험 적용)`);
      basis.push(
        `공제: MAX(${fmtWon(floorAmt)}, 보장대상 ${fmtWon(base)} × 30% = ${fmtWon(base * 0.3)}) = ${fmtWon(deduct)}`,
      );
      basis.push(`${fmtWon(base)} - ${fmtWon(deduct)} = ${fmtWon(pay)}`);
    } else {
      // 건강보험 미적용: (본인부담 - MAX(공제, 30%)) × 40% 보상
      const deduct = Math.max(floorAmt, G * 0.3);
      pay = Math.max(0, G - deduct) * 0.4;
      basis.push(`유병자실손 ${typeLabel}(건강보험 미적용)`);
      basis.push(
        `공제: MAX(${fmtWon(floorAmt)}, ${fmtWon(G)} × 30% = ${fmtWon(G * 0.3)}) = ${fmtWon(deduct)}`,
      );
      basis.push(`(${fmtWon(G)} - ${fmtWon(deduct)}) × 40% = ${fmtWon(pay)}`);
      basis.push("※ 건강보험 미적용 시 잔여금액의 40%만 보상");
    }
    basis.push("※ 3대비급여(도수/주사/MRI) · 처방조제비 보장 제외");
  }

  return { payout: pay, basis };
}

export function calcMedicalExpense(input: CalcInput): CalcResult {
  const G = Math.max(0, input.covered || 0);
  const B = Math.max(0, input.nonCovered || 0);
  const T = G + B;

  if (T === 0) {
    return { total: 0, payout: 0, selfPay: 0, coverageRate: 0, basis: [], limitNote: null };
  }

  const { gen, subgen, type, bitype } = input;
  const raw = calcRaw(input);
  let pay = raw.payout;
  const basis = [...raw.basis];

  // ── 건당 한도 적용 ──
  const is3대 = (gen === "3" || gen === "4") && bitype !== "gen" && type !== "rx";
  const capKey: CapKey = gen === "2" ? subgen : (gen as CapKey);
  const caps = CAP_TABLE[capKey] || { in: Infinity, out: Infinity, rx: Infinity };
  let capVal = is3대 ? Infinity : caps[type] ?? Infinity;
  // 4세대 통원/처방: 합산 40만원 캡
  if (gen === "4" && (type === "out" || type === "rx") && !is3대) capVal = 400_000;

  const preCap = pay;
  pay = Math.min(pay, capVal);
  if (pay < preCap - 1) {
    basis.push(`⚠️ 건당 보장 한도 적용: ${fmtWon(preCap)} → ${fmtWon(capVal)} 한도 적용`);
  }

  // ── 한도 안내 라벨 ──
  const ai = ANNUAL_INFO[capKey] || {};
  const limitNote = is3대 ? ai[bitype] || null : ai[type] || null;

  pay = Math.round(pay);
  const selfPay = Math.round(Math.max(0, T - pay));
  const coverageRate = T > 0 ? Math.round((pay / T) * 100) : 0;

  return { total: T, payout: pay, selfPay, coverageRate, basis, limitNote };
}

export function formatWon(n: number): string {
  return fmtWon(n);
}
