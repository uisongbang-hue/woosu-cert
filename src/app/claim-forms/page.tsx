import { getInsurers, getChannelsByKind } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { FileDown, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClaimFormsPage() {
  const [insurers, channels] = await Promise.all([
    getInsurers(),
    getChannelsByKind("claim_form"),
  ]);
  const urlBySlug = new Map<string, { url: string; note?: string | null }>();
  channels.forEach((c) => {
    if (c.insurer_slug && c.url) urlBySlug.set(c.insurer_slug, { url: c.url, note: c.note });
  });

  const groups: { key: "손보" | "생보" | "공제"; title: string }[] = [
    { key: "손보", title: "손해보험" },
    { key: "생보", title: "생명보험" },
    { key: "공제", title: "공제" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="보험금 청구서"
        description="보험사 공식 청구서 양식·필요서류 안내. PDF 또는 안내 페이지로 바로 이동합니다."
      />

      {groups.map(({ key, title }) => {
        const list = insurers.filter((i) => i.category === key);
        const ready = list.filter((i) => urlBySlug.has(i.slug));
        const pending = list.filter((i) => !urlBySlug.has(i.slug));
        if (list.length === 0) return null;
        return (
          <section key={key}>
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
              <span className="text-xs text-muted-foreground/70">
                {ready.length}/{list.length}
              </span>
            </div>
            {ready.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {ready.map((i) => {
                  const ch = urlBySlug.get(i.slug)!;
                  const isPdf = ch.url.toLowerCase().includes(".pdf");
                  return (
                    <a
                      key={i.slug}
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                    >
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {isPdf ? (
                          <FileDown className="h-4 w-4" />
                        ) : (
                          <ExternalLink className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{i.name_ko}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {isPdf ? "PDF 다운로드" : ch.note || "안내 페이지"}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
            {pending.length > 0 && (
              <details className="mt-3 rounded-xl border border-dashed bg-card/50 p-3 text-xs text-muted-foreground">
                <summary className="cursor-pointer">
                  미등록 {pending.length}사 보기
                </summary>
                <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
                  {pending.map((i) => (
                    <li key={i.slug} className="rounded border px-2 py-1">
                      {i.name_ko}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}
