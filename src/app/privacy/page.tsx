import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "개인정보처리방침 — 우수인증설계사 워크스페이스",
};

export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <PageHeader
        title="개인정보처리방침"
        description="시행일: 2026년 4월 15일"
      />

      <section className="space-y-3 text-sm leading-relaxed">
        <p>
          우수인증설계사 워크스페이스(이하 &ldquo;서비스&rdquo;)는 「개인정보 보호법」에 따라
          이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하게 처리하기 위해 다음과 같은
          방침을 두고 있습니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">1. 개인정보의 수집 항목 및 수집 방법</h2>
        <p>
          본 서비스는 별도의 회원가입 없이 열람 가능하며, 다음의 경우에만 최소한의 정보를
          수집합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>커뮤니티 이용 시: 게시글/댓글 내용, 접속 IP(스팸·어뷰징 방지 목적으로 해시 처리)</li>
          <li>쿠키: 화면 테마 등 이용자 편의 설정값 (광고·추적 목적 없음)</li>
          <li>문의 메일 수신 시: 이메일 주소 및 문의 내용</li>
        </ul>

        <h2 className="pt-4 text-base font-semibold">2. 개인정보의 이용 목적</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>서비스 제공 및 이용자 식별(익명 닉네임 자동 생성)</li>
          <li>커뮤니티 운영 및 불법·유해 게시물 대응</li>
          <li>이용자 문의 응대</li>
        </ul>

        <h2 className="pt-4 text-base font-semibold">3. 개인정보의 보관 및 파기</h2>
        <p>
          수집된 정보는 이용자의 게시물 삭제 요청 시 또는 관련 법령상 보존 의무 기간이 만료된
          때 즉시 파기합니다. 법령상 보존 의무가 있는 경우 해당 기간 동안 보관합니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">4. 개인정보의 제3자 제공</h2>
        <p>
          본 서비스는 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 법령에 따라 수사기관
          등의 요청이 있는 경우에 한해 제공할 수 있습니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">5. 개인정보 처리의 위탁</h2>
        <p>
          안정적인 서비스 제공을 위해 다음의 업체에 일부 처리를 위탁하고 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Vercel Inc. — 웹 호스팅 및 배포 인프라</li>
          <li>Google LLC (Firebase/Firestore) — 커뮤니티 데이터 저장</li>
        </ul>

        <h2 className="pt-4 text-base font-semibold">6. 이용자의 권리</h2>
        <p>
          이용자는 언제든지 본인이 작성한 게시물에 대한 삭제를 요청할 수 있으며, 개인정보
          처리에 관한 열람·정정·삭제·처리정지를 요구할 수 있습니다. 요청은 아래 연락처로
          접수해 주시기 바랍니다.
        </p>

        <h2 className="pt-4 text-base font-semibold">7. 개인정보 보호책임자</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>성명: 방의송</li>
          <li>
            이메일:{" "}
            <a
              href="mailto:uisongbang@gmail.com"
              className="underline hover:text-primary"
            >
              uisongbang@gmail.com
            </a>
          </li>
        </ul>

        <h2 className="pt-4 text-base font-semibold">8. 방침의 변경</h2>
        <p>
          본 방침은 법령 또는 서비스 변경에 따라 개정될 수 있으며, 변경 시 본 페이지를 통해
          공지합니다.
        </p>
      </section>
    </article>
  );
}
