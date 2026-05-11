"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Stethoscope, Calculator, Info } from "lucide-react";
import {
  calcMedicalExpense,
  formatWon,
  type Generation,
  type SubGen2,
  type Plan,
  type Nhis,
  type VisitType,
  type Hospital,
  type BiType,
} from "@/lib/medical-expense-calc";

const GEN_OPTIONS: { value: Generation; label: string }[] = [
  { value: "1", label: "1세대" },
  { value: "2", label: "2세대" },
  { value: "3", label: "3세대" },
  { value: "4", label: "4세대" },
  { value: "sick", label: "유병자" },
];

const SUBGEN_OPTIONS: { value: SubGen2; label: string }[] = [
  { value: "2a", label: "1차 (~2013.03)" },
  { value: "2b", label: "2차 (~2015.08)" },
  { value: "2c", label: "3차 (~2017.03)" },
];

const PLAN_OPTIONS: { value: Plan; label: string }[] = [
  { value: "std", label: "표준형" },
  { value: "sel", label: "선택형" },
];

const NHIS_OPTIONS: { value: Nhis; label: string }[] = [
  { value: "yes", label: "건강보험 적용" },
  { value: "no", label: "건강보험 미적용" },
];

const TYPE_OPTIONS: { value: VisitType; label: string }[] = [
  { value: "in", label: "입원" },
  { value: "out", label: "통원(외래)" },
  { value: "rx", label: "처방조제" },
];

const HOSPITAL_OPTIONS: { value: Hospital; label: string }[] = [
  { value: "clinic", label: "의원" },
  { value: "hosp", label: "병원" },
  { value: "gen", label: "종합병원" },
  { value: "top", label: "상급종합" },
];

const BITYPE_OPTIONS: { value: BiType; label: string }[] = [
  { value: "gen", label: "일반 비급여" },
  { value: "physio", label: "도수치료" },
  { value: "inject", label: "비급여 주사" },
  { value: "mri", label: "MRI/MRA" },
];

export default function MedicalExpensePage() {
  const [gen, setGen] = useState<Generation>("4");
  const [subgen, setSubgen] = useState<SubGen2>("2a");
  const [plan, setPlan] = useState<Plan>("std");
  const [nhis, setNhis] = useState<Nhis>("yes");
  const [type, setType] = useState<VisitType>("in");
  const [hospital, setHospital] = useState<Hospital>("clinic");
  const [bitype, setBitype] = useState<BiType>("gen");
  const [covered, setCovered] = useState<string>("");
  const [nonCovered, setNonCovered] = useState<string>("");

  // 조건부 노출 규칙
  const showSubgen = gen === "2";
  const showPlan = gen === "3" || (gen === "2" && (subgen === "2b" || subgen === "2c"));
  const showNhis = gen === "sick";
  const showHospital = type === "out" || type === "rx";
  const showBiType = (gen === "3" || gen === "4") && type !== "rx";
  const showNonCoveredInput = !(gen === "sick" && nhis === "no");

  const result = useMemo(
    () =>
      calcMedicalExpense({
        gen,
        subgen,
        plan,
        nhis,
        type,
        hospital,
        bitype,
        covered: parseFloat(covered) || 0,
        nonCovered: parseFloat(nonCovered) || 0,
      }),
    [gen, subgen, plan, nhis, type, hospital, bitype, covered, nonCovered],
  );

  const hasInput = result.total > 0;

  return (
    <div className="space-y-6">
      <Link
        href="/calculators"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        계산기 목록
      </Link>

      <header className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-6 md:p-8">
        <p className="text-xs font-semibold text-primary md:text-sm">계산기</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">실손의료비 계산기</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          1·2·3·4세대 및 유병자실손까지 — 표준약관 기준 예상 보상금액을 자동 계산합니다.
        </p>
      </header>

      {/* 세대 선택 (탭 형태) */}
      <section className="rounded-2xl border bg-card p-4 md:p-5">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
          <Stethoscope className="h-3.5 w-3.5 text-primary" />
          실손 세대
        </div>
        <div className="flex flex-wrap gap-2">
          {GEN_OPTIONS.map((o) => (
            <TabBtn key={o.value} active={gen === o.value} onClick={() => setGen(o.value)}>
              {o.label}
            </TabBtn>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {showSubgen && (
          <SegField label="2세대 차수">
            <Segment
              options={SUBGEN_OPTIONS}
              value={subgen}
              onChange={(v) => setSubgen(v as SubGen2)}
            />
          </SegField>
        )}

        {showPlan && (
          <SegField label="보장 플랜">
            <Segment options={PLAN_OPTIONS} value={plan} onChange={(v) => setPlan(v as Plan)} />
          </SegField>
        )}

        {showNhis && (
          <SegField label="건강보험 적용 여부">
            <Segment options={NHIS_OPTIONS} value={nhis} onChange={(v) => setNhis(v as Nhis)} />
          </SegField>
        )}

        <SegField label="진료 유형">
          <Segment options={TYPE_OPTIONS} value={type} onChange={(v) => setType(v as VisitType)} />
        </SegField>

        {showHospital && (
          <SegField label="병원 종류">
            <Segment
              options={HOSPITAL_OPTIONS}
              value={hospital}
              onChange={(v) => setHospital(v as Hospital)}
            />
          </SegField>
        )}

        {showBiType && (
          <SegField label="비급여 항목 종류">
            <Segment
              options={BITYPE_OPTIONS}
              value={bitype}
              onChange={(v) => setBitype(v as BiType)}
            />
          </SegField>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <MoneyField label="급여 본인부담금" value={covered} onChange={setCovered} />
        {showNonCoveredInput && (
          <MoneyField label="비급여 금액" value={nonCovered} onChange={setNonCovered} />
        )}
      </section>

      {/* 결과 */}
      {hasInput ? (
        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label="총 의료비" value={formatWon(result.total)} />
            <Stat label="자기부담(공제)" value={formatWon(result.selfPay)} tone="deduct" />
            <Stat label="예상 지급액" value={formatWon(result.payout)} tone="primary" big />
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                실질 보장률
              </span>
              <span className="text-lg font-bold tabular-nums text-primary">
                {result.coverageRate}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, result.coverageRate)}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 text-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground">
              <Calculator className="h-3.5 w-3.5 text-primary" />
              계산 근거
            </div>
            <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
              {result.basis.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
              {result.limitNote && (
                <li>
                  <strong className="text-foreground">보장 한도</strong>: {result.limitNote}
                </li>
              )}
            </ul>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed bg-card/60 p-8 text-center text-sm text-muted-foreground">
          금액을 입력하면 예상 보상금이 표시됩니다.
        </div>
      )}

      <details className="rounded-2xl border bg-card/60 p-4 text-sm">
        <summary className="flex cursor-pointer items-center gap-2 font-medium">
          <Info className="h-3.5 w-3.5 text-primary" />
          실손보험 세대 안내
        </summary>
        <div className="mt-3 space-y-2 text-muted-foreground">
          <p>
            <strong className="text-foreground">1세대</strong> (2009.10 이전): 보장범위 가장 넓고
            본인부담 거의 없음
          </p>
          <p>
            <strong className="text-foreground">2세대</strong> (2009.10~2017.03): 1차·2차·3차로 세분,
            표준형/선택형 도입
          </p>
          <p>
            <strong className="text-foreground">3세대</strong> (2017.04~2021.06): 일명 ‘착한실손’.
            도수·주사·MRI 특약 분리
          </p>
          <p>
            <strong className="text-foreground">4세대</strong> (2021.07~): 급여·비급여 완전 분리,
            비급여 사용량 기반 할인할증
          </p>
          <p>
            <strong className="text-foreground">유병자실손</strong>: 고혈압·당뇨 등 유병자도 가입
            가능, 자기부담 30%
          </p>
        </div>
      </details>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        ※ 본 계산기는 표준약관 기준의 <strong className="text-foreground">참고용</strong> 계산입니다.
        실제 보상금액은 가입 약관·특약·보험사 심사 기준에 따라 다를 수 있습니다.
      </div>
    </div>
  );
}

function TabBtn({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-xl border px-4 py-2 text-sm font-medium transition " +
        (active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "bg-card hover:border-primary/40 hover:bg-accent")
      }
    >
      {children}
    </button>
  );
}

function SegField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Segment<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={
            "rounded-lg border px-3 py-1.5 text-sm transition " +
            (value === o.value
              ? "border-primary bg-primary/10 text-primary"
              : "bg-background hover:border-primary/40 hover:bg-accent")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 rounded-2xl border bg-card p-4">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-lg border bg-background pl-3 pr-10 text-base tabular-nums outline-none focus:border-primary"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          원
        </span>
      </div>
    </label>
  );
}

function Stat({
  label,
  value,
  tone,
  big,
}: {
  label: string;
  value: string;
  tone?: "primary" | "deduct";
  big?: boolean;
}) {
  const toneCls =
    tone === "primary"
      ? "border-primary/40 bg-primary/5"
      : tone === "deduct"
        ? "border-amber-500/30 bg-amber-500/5"
        : "";
  return (
    <div className={`rounded-2xl border bg-card p-5 ${toneCls}`}>
      <div className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</div>
      <div
        className={
          "mt-1 font-bold tracking-tight tabular-nums " +
          (big ? "text-3xl md:text-4xl text-primary" : "text-2xl")
        }
      >
        {value}
      </div>
    </div>
  );
}
