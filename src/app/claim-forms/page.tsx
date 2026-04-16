import Image from "next/image";
import { getInsurers, getChannelsByKind } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { FileDown, ExternalLink, Phone, PawPrint } from "lucide-react";

export const dynamic = "force-dynamic";

const contactMap: Record<string, { call: string; fax: string }> = {
  "samsung-life": { call: "1588-3114", fax: "콜센터 가상팩스" },
  "kyobo": { call: "1588-1001", fax: "콜센터 가상팩스" },
  "kb-life": { call: "1599-0882", fax: "02-6220-9912" },
  "abl": { call: "1588-6500", fax: "02-3299-5544" },
  "hanwha-life": { call: "1588-6363", fax: "콜센터 가상팩스" },
  "heungkuk-life": { call: "1588-2288", fax: "콜센터 가상팩스" },
  "dongyang": { call: "1577-1004", fax: "02-3289-4517" },
  "lotte": { call: "1588-3344", fax: "0507-333-9999" },
  "nh-life": { call: "1833-4100", fax: "02-6971-6040" },
  "db-life": { call: "1588-3131", fax: "0505-129-3134" },
  "aia": { call: "1588-9898", fax: "02-2021-4508" },
  "lina-life": { call: "1588-0058", fax: "02-6944-1200" },
  "kdb": { call: "1588-4040", fax: "02-2669-7930" },
  "miraeasset": { call: "1588-0220", fax: "콜센터 가상팩스" },
  "met": { call: "1588-9600", fax: "02-3469-9428" },
  "shinhan": { call: "1588-5580", fax: "콜센터 가상팩스" },
  "chubb-life": { call: "1599-4600", fax: "02-3480-7801" },
  "pubon": { call: "1577-3311", fax: "0505-106-0311" },
};

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
        description="보험사 공식 청구서 양식 + 콜센터·팩스 안내. PDF 또는 안내 페이지로 바로 이동합니다."
      />

      <div className="rounded-xl border bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">청구 안내</span> ·
        진단서/소견서, 진료비 영수증, 세부내역서는 원본 또는 사본 제출 ·
        100만원 이상은 보험사 지정 서류 필요 ·
        수령 계좌는 피보험자/계약자 본인 계좌 원칙 ·
        청구권 소멸시효 사고일로부터 3년
      </div>

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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {ready.map((i) => {
                  const ch = urlBySlug.get(i.slug)!;
                  const isPdf = ch.url.toLowerCase().includes(".pdf");
                  const contact = contactMap[i.slug];
                  return (
                    <div
                      key={i.slug}
                      className="rounded-2xl border bg-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          {isPdf ? (
                            <FileDown className="h-4 w-4" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <a
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold hover:text-primary hover:underline"
                          >
                            {i.name_ko}
                          </a>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {isPdf ? "PDF 다운로드" : ch.note || "안내 페이지"}
                          </div>
                        </div>
                      </div>
                      {contact && (
                        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t pt-2.5 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <a
                              href={`tel:${contact.call}`}
                              className="hover:text-foreground"
                            >
                              {contact.call}
                            </a>
                          </span>
                          <span>
                            팩스 {contact.fax}
                          </span>
                        </div>
                      )}
                    </div>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
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

      <details className="rounded-2xl border bg-card p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          우체국보험 팩스 접수 안내
        </summary>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
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
          <div className="overflow-hidden rounded-xl border bg-background">
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
      </details>
    </div>
  );
}
