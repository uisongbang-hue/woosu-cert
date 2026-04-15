import Link from "next/link";
import {
  Building2,
  FileText,
  Car,
  Calculator,
  GraduationCap,
  Stethoscope,
  Newspaper,
  Users,
  ExternalLink,
} from "lucide-react";

type Tile = {
  href: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
};

const tiles: Tile[] = [
  { href: "/insurers", label: "보험사 바로가기", desc: "손해·생명·공제 통합 디렉토리", icon: Building2 },
  { href: "/claim-forms", label: "청구 양식 도우미", desc: "회사별 청구서 작성 지원", icon: FileText },
  { href: "/auto-insurance", label: "자동차 실무", desc: "견적·과실·할인할증 등", icon: Car },
  { href: "/calculators/insurance-age", label: "보험나이 계산기", desc: "만나이 + 6개월 보정", icon: Calculator },
  { href: "/education", label: "교육 자료", desc: "자격·보수교육 통합 안내", icon: GraduationCap },
  {
    href: "https://www.koicd.kr/",
    label: "질병분류표 (KCD)",
    desc: "KOICD 공식 검색 (새 창)",
    icon: Stethoscope,
    external: true,
  },
  { href: "/insurance-history", label: "실손보험 변천사", desc: "세대별 자기부담·갱신 비교", icon: Newspaper },
  { href: "/community", label: "설계사 라운지", desc: "익명 게시판·댓글", icon: Users },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-6 md:p-10">
        <p className="text-xs font-semibold tracking-wide text-primary md:text-sm">
          우수인증설계사 워크스페이스
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          현장에서 바로 쓰는 <br className="hidden md:block" />
          보험 실무 도구
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          전산 접속, 청구 양식, 비교 견적, 교육 자료까지 — 흩어진 링크를 한 화면에 모았습니다.
          상단 검색창(⌘K)으로 보험사·도구를 즉시 찾아보세요.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {tiles.map(({ href, label, desc, icon: Icon, external }) => {
          const content = (
            <>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground md:h-12 md:w-12">
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-semibold md:text-lg">{label}</span>
                {external && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{desc}</div>
            </>
          );
          const cls =
            "group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md md:p-6";
          return external ? (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
              {content}
            </a>
          ) : (
            <Link key={href} href={href} className={cls}>
              {content}
            </Link>
          );
        })}
      </section>

      <section className="rounded-2xl border bg-card p-6 text-sm md:p-7">
        <div className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">
          서비스 안내
        </div>
        <div className="text-base font-semibold md:text-lg">우수인증설계사 워크스페이스</div>
        <div className="mt-2 text-muted-foreground md:text-[15px]">
          개선 의견 · 자료 제보 · 제휴 문의는 추후 오픈되는 문의 폼을 통해 받을 예정입니다.
        </div>
      </section>
    </div>
  );
}
