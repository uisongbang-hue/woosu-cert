import Link from "next/link";
import { getInsurers } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

const TABS: { key: "손보" | "생보" | "공제"; label: string }[] = [
  { key: "손보", label: "손해보험" },
  { key: "생보", label: "생명보험" },
  { key: "공제", label: "공제" },
];

export default async function InsurersPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = (searchParams.tab as "손보" | "생보" | "공제") || "손보";
  const all = await getInsurers();
  const list = all.filter((i) => i.category === tab);

  return (
    <div>
      <PageHeader
        title="보험사 전산"
        description="고객센터·인콜·헬프데스크·청구팩스·약관·청구서 한곳에서."
      />

      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/insurers?tab=${encodeURIComponent(t.key)}`}
            className={
              "rounded-full border px-4 py-1.5 text-sm transition " +
              (tab === t.key
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground")
            }
          >
            {t.label}
            <span className="ml-1.5 text-xs opacity-70">
              {all.filter((i) => i.category === t.key).length}
            </span>
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
          데이터가 비어 있습니다. <code>scripts/parse-source.ts</code> 실행 후 다시 확인하세요.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {list.map((i) => (
            <Link
              key={i.slug}
              href={`/insurers/${i.slug}`}
              className="group rounded-2xl border bg-card p-4 transition hover:border-primary hover:bg-accent"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">{i.name_ko}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{i.category}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
