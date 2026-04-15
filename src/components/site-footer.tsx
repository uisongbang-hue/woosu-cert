import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/30">
      <div className="container py-8 text-xs text-muted-foreground md:py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-foreground">
              우수인증설계사 워크스페이스
            </div>
            <p className="mt-2 leading-relaxed">
              현직 보험설계사용 무료 실무 도구.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">운영자</div>
            <ul className="mt-2 space-y-1 leading-relaxed">
              <li>방설계사</li>
              <li>
                <a
                  href="mailto:uisongbang@gmail.com"
                  className="hover:text-foreground"
                >
                  uisongbang@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:010-2632-1281" className="hover:text-foreground">
                  010-2632-1281
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">정책</div>
            <ul className="mt-2 space-y-1 leading-relaxed">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t pt-4 text-[11px] leading-relaxed">
          본 사이트는 비영리 무료 정보 제공 서비스이며, 보험 상품 판매·중개 창구가
          아닙니다. 게시된 보험사 청구서 양식은 각 보험사 공식 자료를 업무 편의 목적으로
          제공하는 것으로, 양식은 개정될 수 있으므로 제출 전 해당 보험사 최신본 확인을
          권장합니다. 모든 권리는 해당 보험사에 귀속됩니다.
          <div className="mt-2">
            © {new Date().getFullYear()} 우수인증설계사 워크스페이스. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
