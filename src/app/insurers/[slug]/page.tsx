import { notFound } from "next/navigation";
import Link from "next/link";
import { getInsurerBySlug, getChannelsBySlug, type Channel } from "@/lib/data";
import { CopyButton } from "@/components/copy-button";
import {
  Phone,
  ExternalLink,
  Globe,
  Headphones,
  LifeBuoy,
  Activity,
  Printer,
  BookOpen,
  FileText,
  Heart,
  Building2,
  ChevronLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

const CHANNEL_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; tone: "link" | "phone" }
> = {
  browser: { label: "설계사 전산", icon: Globe, tone: "link" },
  customer: { label: "고객센터", icon: Headphones, tone: "phone" },
  incall: { label: "인콜 모니터링", icon: Activity, tone: "phone" },
  monitor: { label: "모니터링 전산", icon: Activity, tone: "link" },
  helpdesk: { label: "전산 헬프데스크", icon: LifeBuoy, tone: "phone" },
  fax_claim: { label: "보험금 청구팩스", icon: Printer, tone: "phone" },
  terms: { label: "약관 확인", icon: BookOpen, tone: "link" },
  claim_form: { label: "청구서 양식", icon: FileText, tone: "link" },
  caregiver: { label: "간병", icon: Heart, tone: "link" },
};
const ORDER = [
  "browser",
  "customer",
  "incall",
  "helpdesk",
  "monitor",
  "fax_claim",
  "terms",
  "claim_form",
  "caregiver",
];

export default async function InsurerDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const insurer = await getInsurerBySlug(params.slug);
  if (!insurer) notFound();
  const channels = await getChannelsBySlug(params.slug);
  const byKind = new Map<string, Channel[]>();
  channels.forEach((c) => {
    const arr = byKind.get(c.kind) || [];
    arr.push(c);
    byKind.set(c.kind, arr);
  });

  const filled = ORDER.filter((k) => byKind.has(k));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/insurers?tab=${encodeURIComponent(insurer.category)}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          보험사 목록
        </Link>
      </div>

      <header className="flex items-center gap-4 rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-5 md:p-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary md:h-16 md:w-16">
          <Building2 className="h-7 w-7 md:h-8 md:w-8" />
        </div>
        <div>
          <div className="text-xs font-semibold text-primary md:text-sm">
            {insurer.category}
          </div>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight md:text-3xl">
            {insurer.name_ko}
          </h1>
        </div>
      </header>

      {filled.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:auto-rows-fr">
          {filled.map((kind) => (
            <ChannelCard key={kind} kind={kind} items={byKind.get(kind)!} />
          ))}
        </div>
      ) : (
        <EmptyHint slug={params.slug} />
      )}

    </div>
  );
}

function ChannelCard({ kind, items }: { kind: string; items: Channel[] }) {
  const meta = CHANNEL_META[kind] ?? {
    label: kind,
    icon: FileText,
    tone: "link" as const,
  };
  const Icon = meta.icon;
  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-5 transition hover:border-primary/40">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {meta.label}
      </div>
      <ul className="flex flex-1 flex-col justify-center space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2">
            {it.value && (
              <>
                <a
                  href={`tel:${it.value.replace(/[^\d+]/g, "")}`}
                  className="text-lg font-semibold tabular-nums tracking-tight text-foreground hover:text-primary"
                >
                  {it.value}
                </a>
                <CopyButton value={it.value} />
                <a
                  href={`tel:${it.value.replace(/[^\d+]/g, "")}`}
                  className="inline-flex h-7 items-center gap-1 rounded-md border bg-card px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Phone className="h-3 w-3" /> 전화
                </a>
              </>
            )}
            {it.url && (
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 px-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" /> 바로 열기
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyHint({ slug }: { slug: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/50 p-6 text-sm">
      <div className="mb-2 font-semibold">아직 채널 데이터가 없습니다.</div>
      <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
        <li>
          <code className="rounded bg-muted px-1">data/channels.csv</code> 에 행 추가
        </li>
        <li>
          첫 칸 slug = <code className="rounded bg-muted px-1">{slug}</code>
        </li>
        <li>
          저장 후{" "}
          <code className="rounded bg-muted px-1">npx tsx scripts/import-channels.ts</code>
        </li>
      </ol>
    </div>
  );
}
