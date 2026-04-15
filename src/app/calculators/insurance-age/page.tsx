"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Cake, Calendar, Calculator } from "lucide-react";
import { calcInsuranceAge } from "@/lib/insurance-age";

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function InsuranceAgePage() {
  const [birth, setBirth] = useState("1990-01-01");
  const [ref, setRef] = useState(todayISO());
  const result = useMemo(() => calcInsuranceAge(birth, ref), [birth, ref]);

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
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          보험나이 계산
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          계약일 기준 만 나이에서 직전 생일로부터 6개월 경과 여부에 따라 ±1을 계산합니다.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        <Field
          label="생년월일"
          icon={<Cake className="h-4 w-4" />}
          value={birth}
          onChange={setBirth}
        />
        <Field
          label="기준일 (보통 계약일)"
          icon={<Calendar className="h-4 w-4" />}
          value={ref}
          onChange={setRef}
        />
      </section>

      {result ? (
        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Stat
              big
              label="보험나이"
              value={`${result.insuranceAge}세`}
              hint={
                result.bumpedUp
                  ? "직전 생일로부터 6개월 이상 경과 → +1 적용"
                  : "직전 생일로부터 6개월 미만 → 만나이 그대로"
              }
              tone="primary"
            />
            <Stat label="만 나이" value={`${result.age}세`} />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label="직전 생일" value={result.lastBirthday} />
            <Stat label="6개월 기준일" value={result.halfYearMark} />
            <Stat label="다음 생일" value={result.nextBirthday} />
          </div>
          <div className="rounded-2xl border bg-card p-5 text-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground">
              <Calculator className="h-3.5 w-3.5 text-primary" />
              계산 근거
            </div>
            <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
              <li>직전 생일로부터 경과 일수: {result.daysSinceLastBday}일</li>
              <li>다음 생일까지 남은 일수: {result.daysToNextBday}일</li>
              <li>판정: 경과일 ≥ 6개월 → 보험나이 = 만나이 + 1</li>
            </ul>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          입력값을 확인해주세요 (생년월일·기준일).
        </div>
      )}

      <details className="rounded-2xl border bg-card/60 p-4 text-sm">
        <summary className="cursor-pointer font-medium">보험나이란?</summary>
        <div className="mt-2 space-y-2 text-muted-foreground">
          <p>
            보험계약에서 보험료·가입한도를 산정할 때 쓰는 나이입니다. 보험업감독규정과 표준약관에
            따라, 계약일 시점의 만 나이를 기준으로 직전 생일로부터 6개월이 지났으면 한 살을 더하고
            그렇지 않으면 만 나이를 그대로 씁니다.
          </p>
          <p>
            예) 1990년 1월 1일생이 2026년 8월 1일에 가입 → 만 36세, 직전 생일(2026-01-01)에서 7개월
            경과 → 보험나이 37세.
          </p>
        </div>
      </details>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 rounded-2xl border bg-card p-4">
      <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border bg-background px-3 text-base outline-none focus:border-primary"
      />
    </label>
  );
}

function Stat({
  label,
  value,
  hint,
  big,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  big?: boolean;
  tone?: "primary";
}) {
  return (
    <div
      className={
        "rounded-2xl border bg-card p-5 " +
        (tone === "primary" ? "border-primary/40 bg-primary/5" : "")
      }
    >
      <div className="text-xs font-semibold tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={
          "mt-1 font-bold tracking-tight tabular-nums " +
          (big ? "text-4xl md:text-5xl" : "text-2xl")
        }
      >
        {value}
      </div>
      {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
