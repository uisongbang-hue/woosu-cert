import Link from "next/link";
import { getTools } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Calculator, ExternalLink, Cake, Stethoscope } from "lucide-react";

export const dynamic = "force-dynamic";

const BUILTIN = [
  {
    href: "/calculators/insurance-age",
    title: "보험나이 계산",
    desc: "만나이 + 6개월 보정",
    icon: Cake,
  },
  {
    href: "/calculators/medical-expense",
    title: "실손의료비 계산기",
    desc: "1~4세대·유병자 자동 계산",
    icon: Stethoscope,
  },
];

export default async function CalculatorsPage() {
  const list = await getTools("calc");
  return (
    <div className="space-y-8">
      <PageHeader title="계산기" description="보험나이·합의금·일실수익 등 실무 계산 도구." />

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">사이트 내장</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {BUILTIN.map(({ href, title, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">외부 링크</h2>
      {list.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {list.map((t) => (
            <a
              key={t.title}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition hover:border-primary hover:bg-accent"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calculator className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{t.title}</div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  파일 다운로드
                </div>
              </div>
              <ExternalLink className="mt-0.5 h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}
      </section>
    </div>
  );
}
function Empty() {
  return (
    <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
      등록된 계산기가 없습니다.
    </div>
  );
}
