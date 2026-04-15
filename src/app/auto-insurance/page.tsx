import { getTools } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { ExternalLink, Car } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AutoInsurancePage() {
  const tools = (await getTools()).filter((t) =>
    ["auto", "calc"].includes(t.category)
  );
  return (
    <div>
      <PageHeader
        title="자동차보험"
        description="비교견적·과실비율·할인할증·합의금 계산기 모음."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tools.map((t) => (
          <a
            key={t.title}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition hover:border-primary hover:bg-accent"
          >
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Car className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground">
                {hostOf(t.url)}
              </div>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
}
function hostOf(u: string) {
  try {
    return new URL(u).host;
  } catch {
    return u;
  }
}
