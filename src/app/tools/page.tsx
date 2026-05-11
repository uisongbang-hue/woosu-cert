import Link from "next/link";
import { getTools } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { ExternalLink, Microscope } from "lucide-react";

export const dynamic = "force-dynamic";

const GROUPS: { key: string; title: string }[] = [
  { key: "fire", title: "화재보험" },
  { key: "child", title: "자녀보험" },
  { key: "real_loss", title: "실손보험" },
  { key: "elevator", title: "승강기" },
  { key: "ga", title: "GA 필수 링크" },
  { key: "misc", title: "기타" },
];

const BUILTIN_TOOLS = [
  {
    href: "/tools/surgery-search",
    title: "수술명 검색",
    desc: "표준 수술분류표 1~5종 즉시 조회",
    icon: Microscope,
  },
];

export default async function ToolsPage() {
  const tools = await getTools();
  return (
    <div className="space-y-8">
      <PageHeader title="도구·조회" description="실무에 자주 쓰는 외부 조회 링크." />

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">사이트 내장</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BUILTIN_TOOLS.map(({ href, title, desc, icon: Icon }) => (
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

      {GROUPS.map(({ key, title }) => {
        const list = tools.filter((t) => t.category === key);
        if (list.length === 0) return null;
        return (
          <section key={key}>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{title}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {list.map((t) => (
                <a
                  key={t.title}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition hover:border-primary hover:bg-accent"
                >
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
          </section>
        );
      })}
    </div>
  );
}

function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
