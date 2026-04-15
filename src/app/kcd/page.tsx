"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Stethoscope, ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";

type Code = { code: string; name: string; chapter?: string };

export default function KcdPage() {
  const [data, setData] = useState<Code[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/kcd")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toUpperCase();
    if (!s) return data;
    return data.filter(
      (c) =>
        c.code.toUpperCase().includes(s) ||
        c.name.toUpperCase().includes(s) ||
        (c.chapter && c.chapter.toUpperCase().includes(s))
    );
  }, [q, data]);

  const grouped = useMemo(() => {
    const map = new Map<string, Code[]>();
    filtered.forEach((c) => {
      const k = c.chapter || "기타";
      const arr = map.get(k) || [];
      arr.push(c);
      map.set(k, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="질병분류표 (KCD) 검색"
        description="자주 쓰는 코드는 이 페이지에서 바로, 전체 분류는 공식 DB(KOICD·KSSC)에서 검색하세요."
      />

      <div className="rounded-2xl border bg-card p-4 md:p-5">
        <div className="flex items-center gap-2 rounded-xl border bg-background px-3 focus-within:border-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="예: I21, 심근경색, C34, 악성신생물…"
            className="h-12 w-full bg-transparent text-base outline-none"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
            >
              초기화
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {data ? `${filtered.length}건 / 자주 쓰는 코드 ${data.length}건` : "불러오는 중…"}
          </span>
          <span>코드·명칭·분류 중 어디든 매칭</span>
        </div>
        {q && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <a
              href={`https://www.koicd.kr/kcd/kcd.do?mode=&searchText=${encodeURIComponent(
                q
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/5 px-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              KOICD 전체 DB에서 &quot;{q}&quot; 검색
            </a>
            <a
              href={`https://kcdcode.kr/search?q=${encodeURIComponent(q)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border bg-card px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              kcdcode.kr 에서 검색
            </a>
          </div>
        )}
      </div>

      {data && filtered.length === 0 && (
        <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
          결과 없음
        </div>
      )}

      <div className="space-y-5">
        {grouped.map(([chapter, list]) => (
          <section key={chapter}>
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">
              {chapter}
              <span className="ml-1.5 text-muted-foreground/60">{list.length}</span>
            </h2>
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
              {list.map((c) => (
                <li
                  key={c.code}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50"
                >
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-base font-bold tracking-tight">
                        {c.code}
                      </span>
                      <span className="truncate text-sm">{c.name}</span>
                    </div>
                  </div>
                  <CopyButton value={`${c.code} ${c.name}`} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="rounded-2xl border bg-card/60 p-5 text-sm">
        <div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">
          전체 분류 (약 12,000 코드)는 공식 DB에서
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <a
            href="https://www.koicd.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs hover:border-primary hover:bg-accent"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            <span className="flex-1">
              <div className="font-semibold text-foreground">KOICD</div>
              <div className="text-muted-foreground">질병분류정보센터 · 검색·트리</div>
            </span>
          </a>
          <a
            href="https://kcdcode.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs hover:border-primary hover:bg-accent"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            <span className="flex-1">
              <div className="font-semibold text-foreground">kcdcode.kr</div>
              <div className="text-muted-foreground">가벼운 검색 UI</div>
            </span>
          </a>
          <a
            href="https://kssc.kostat.go.kr/ksscNew_web/kssc/ccc/forwardPage.do?gubun=001_1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs hover:border-primary hover:bg-accent"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            <span className="flex-1">
              <div className="font-semibold text-foreground">통계청 KSSC</div>
              <div className="text-muted-foreground">원본 분류표 · 엑셀 다운로드</div>
            </span>
          </a>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          이 페이지의 내장 목록은 보험 실무에서 자주 조회되는 코드만 빠르게 꺼내 쓰도록 요약한
          것입니다. 정확한 세분 코드(.0/.1/.9 등)와 최신 개정은 공식 DB를 기준으로 확인하세요.
        </div>
      </div>
    </div>
  );
}
