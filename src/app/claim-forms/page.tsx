import Image from "next/image";
import { getInsurers, getChannelsByKind } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { FileDown, ExternalLink, PawPrint, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClaimFormsPage() {
  const [insurers, channels, petChannels] = await Promise.all([
    getInsurers(),
    getChannelsByKind("claim_form"),
    getChannelsByKind("claim_form_pet"),
  ]);
  const urlBySlug = new Map<string, { url: string; note?: string | null }>();
  channels.forEach((c) => {
    if (c.insurer_slug && c.url) urlBySlug.set(c.insurer_slug, { url: c.url, note: c.note });
  });
  const petBySlug = new Map<string, { url: string; note?: string | null }>();
  petChannels.forEach((c) => {
    if (c.insurer_slug && c.url) petBySlug.set(c.insurer_slug, { url: c.url, note: c.note });
  });
  const petList = insurers.filter((i) => petBySlug.has(i.slug));

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

      {petList.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline gap-2">
            <PawPrint className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground">펫보험 청구서</h2>
            <span className="text-xs text-muted-foreground/70">{petList.length}사</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {petList.map((i) => {
              const ch = petBySlug.get(i.slug)!;
              return (
                <a
                  key={i.slug}
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileDown className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{i.name_ko}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">펫보험 PDF</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl border bg-card p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">청구 제출 도우미</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-semibold text-muted-foreground">
              우체국보험 팩스 접수 안내
            </div>
            <div className="overflow-hidden rounded-xl border bg-background">
              <Image
                src="/claim-forms/assets/post-fax-numbers.png"
                alt="우체국보험 팩스 번호"
                width={900}
                height={600}
                className="h-auto w-full"
                unoptimized
              />
            </div>
            <div className="mt-2 overflow-hidden rounded-xl border bg-background">
              <Image
                src="/claim-forms/assets/post-fax-list.png"
                alt="우체국보험 청구 팩스 리스트"
                width={900}
                height={600}
                className="h-auto w-full"
                unoptimized
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold text-muted-foreground">
              공통 제출 서류 가이드
            </div>
            <div className="overflow-hidden rounded-xl border bg-background">
              <Image
                src="/claim-forms/assets/claim-guide.png"
                alt="청구 안내"
                width={900}
                height={700}
                className="h-auto w-full"
                unoptimized
              />
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <li>• 진단서/소견서, 진료비 영수증, 세부내역서는 원본 또는 사본 제출</li>
              <li>• 100만원 이상 청구는 보험사 지정 서류(원본/입원확인서) 필요</li>
              <li>• 수령 계좌는 피보험자/계약자 본인 계좌 원칙</li>
              <li>• 청구권 소멸시효는 사고일로부터 3년</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
