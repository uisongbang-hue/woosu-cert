import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "이용약관 — 우수인증설계사 워크스페이스",
};

export default function TermsPage() {
  return (
    <article className="space-y-6">
      <PageHeader title="이용약관" description="시행일: 2026년 4월 15일" />

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="pt-2 text-base font-semibold">제1조 (목적)</h2>
        <p>
          본 약관은 우수인증설계사 워크스페이스(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여
          운영자와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">제2조 (서비스의 성격)</h2>
        <p>
          본 서비스는 현직 보험설계사 및 관련 종사자에게 보험사 접속·청구 양식·계산기·교육
          자료 등 실무 편의 정보를 무료로 제공하는 비영리 정보 서비스입니다. 본 서비스는 보험
          상품의 판매·중개·비교 서비스가 아니며, 특정 보험사·상품을 추천하거나 대리하지
          않습니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">제3조 (정보의 정확성)</h2>
        <p>
          본 서비스가 제공하는 각종 링크·양식·계산식 등은 공개된 자료를 기반으로 하며, 운영자는
          그 최신성·정확성을 보장하지 않습니다. 실제 계약·청구·신고 등 법적 효력이 발생하는
          업무는 반드시 해당 보험사 및 관계 기관의 공식 절차를 통해 확인·진행하시기 바랍니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">제4조 (커뮤니티 이용)</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>이용자는 타인의 권리를 침해하거나 불법·음란·명예훼손적 내용을 게시할 수 없습니다.</li>
          <li>상업적 광고, 스팸, 반복 도배, 개인정보 노출 게시물은 사전 통지 없이 삭제될 수 있습니다.</li>
          <li>운영자는 관련 법령 위반 또는 본 약관 위반 시 해당 게시물의 삭제 및 이용 제한 조치를 취할 수 있습니다.</li>
        </ul>

        <h2 className="pt-4 text-base font-semibold">제5조 (저작권)</h2>
        <p>
          본 서비스에 게시된 보험사 청구서·안내자료 등은 각 보험사의 저작물로, 모든 권리는
          해당 보험사에 귀속됩니다. 이용자는 개인적·업무적 편의 범위 내에서 이용할 수 있으며,
          상업적 재배포는 금지됩니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">제6조 (면책)</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>운영자는 이용자가 본 서비스의 정보를 활용해 발생시킨 손해에 대해 책임지지 않습니다.</li>
          <li>외부 링크로 연결된 사이트에서 발생한 사항은 해당 사이트의 정책에 따릅니다.</li>
          <li>천재지변·서비스 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.</li>
        </ul>

        <h2 className="pt-4 text-base font-semibold">제7조 (약관의 변경)</h2>
        <p>
          운영자는 필요 시 본 약관을 변경할 수 있으며, 변경된 약관은 본 페이지에 게시함으로써
          효력이 발생합니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">제8조 (문의)</h2>
        <p>
          서비스 이용 관련 문의, 권리 침해 신고, 게시물 삭제 요청은{" "}
          <a
            href="mailto:uisongbang@gmail.com"
            className="underline hover:text-primary"
          >
            uisongbang@gmail.com
          </a>
          으로 접수해 주시기 바랍니다.
        </p>
      </section>
    </article>
  );
}
