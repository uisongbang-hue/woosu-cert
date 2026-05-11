"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, Microscope } from "lucide-react";
import { SURGERIES, GRADE_INFO, type SurgeryGrade } from "@/lib/surgery-data";

type GradeFilter = 0 | SurgeryGrade;

export default function SurgerySearchPage() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState<GradeFilter>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SURGERIES.filter((s) => {
      const matchG = grade === 0 || s.grade === grade;
      const matchQ =
        !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      return matchG && matchQ;
    });
  }, [query, grade]);

  return (
    <div className="space-y-6">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        도구·조회
      </Link>

      <header className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-6 md:p-8">
        <p className="text-xs font-semibold text-primary md:text-sm">실무 도구</p>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
          <Microscope className="h-6 w-6 text-primary md:h-7 md:w-7" />
          수술명 검색
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          생명보험 표준 수술분류표 기준 1~5종 즉시 조회. 키워드·분류·종 필터로 검색하세요.
        </p>
      </header>

      {/* 검색창 */}
      <section className="rounded-2xl border bg-card p-4 md:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="수술명을 입력하세요 (예: 충수절제, 담낭, 관절경…)"
            className="h-12 w-full rounded-xl border bg-background pl-10 pr-3 text-base outline-none focus:border-primary"
          />
        </div>

        {/* 종 필터 */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <FilterBtn active={grade === 0} onClick={() => setGrade(0)}>
            전체
          </FilterBtn>
          {GRADE_INFO.map((g) => (
            <FilterBtn
              key={g.grade}
              active={grade === g.grade}
              onClick={() => setGrade(g.grade)}
              color={g.color}
            >
              {g.label}
            </FilterBtn>
          ))}
        </div>
      </section>

      {/* 결과 카운트 */}
      <div className="text-xs text-muted-foreground">
        <strong className="text-foreground">{filtered.length}</strong>건 / 전체 {SURGERIES.length}건
      </div>

      {/* 결과 리스트 */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card/60 p-10 text-center">
          <div className="text-3xl">🔍</div>
          <div className="mt-2 text-sm font-medium">검색 결과가 없습니다</div>
          <div className="mt-1 text-xs text-muted-foreground">
            다른 키워드나 종 필터를 확인해보세요.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {filtered.map((s, i) => {
            const info = GRADE_INFO[s.grade - 1];
            return (
              <div
                key={`${s.name}-${i}`}
                className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5"
              >
                <span
                  className="inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-md px-2 text-xs font-bold text-white"
                  style={{ background: info.color }}
                >
                  {s.grade}종
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                </div>
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {s.category}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 종 안내 */}
      <section className="rounded-2xl border bg-card p-5">
        <div className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground">
          수술 종 기준 (생명보험 표준 수술분류표)
        </div>
        <div className="flex flex-wrap gap-2">
          {GRADE_INFO.map((g) => (
            <div
              key={g.grade}
              className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-xs"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: g.color }}
              />
              <strong className="text-foreground">{g.label}</strong>
              <span className="text-muted-foreground">— {g.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        ※ 본 분류는 일반적인 <strong className="text-foreground">참고용</strong>이며, 실제 보험금 지급
        등급은 가입 보험사 약관과 진단서·수술명세에 따라 달라질 수 있습니다.
      </div>
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition " +
        (active
          ? "border-primary bg-primary/10 text-primary"
          : "bg-background hover:border-primary/40 hover:bg-accent")
      }
    >
      {color && (
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      )}
      {children}
    </button>
  );
}
