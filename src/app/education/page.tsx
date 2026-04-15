import { getTools } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { GraduationCap, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EducationPage() {
  const list = await getTools("education");
  return (
    <div className="space-y-6">
      <PageHeader
        title="교육·자격 자료실"
        description="협회·연수원·감독원 공식 출처만 큐레이션. 최신 공지·교재는 각 기관 사이트에서 제공."
      />

      {list.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {list.map((t) => (
            <a
              key={t.title}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{t.title}</div>
                {t.description && (
                  <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {t.description}
                  </div>
                )}
                <div className="mt-1 truncate text-[11px] text-muted-foreground/70">
                  {hostOf(t.url)}
                </div>
              </div>
              <ExternalLink className="mt-0.5 h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}

      <div className="rounded-2xl border bg-card/60 p-5 text-sm text-muted-foreground">
        <div className="mb-1 text-xs font-semibold tracking-wide text-foreground">
          등록·보수교육 안내
        </div>
        각 보험사·대리점 소속 설계사의 법정 의무 교육은 보험연수원(KIT)과 협회 e-Campus를 통해 이수할 수 있습니다.
        시행령 개정·시험 일정 변경은 협회 공지사항을 참고하세요.
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
      등록된 교육 자료가 없습니다.
    </div>
  );
}
function hostOf(u: string) {
  try {
    return new URL(u).host.replace(/^www\./, "");
  } catch {
    return u;
  }
}
