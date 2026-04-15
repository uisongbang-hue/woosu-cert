/**
 * 보험설계사 실무 디렉토리 시드 데이터 빌더.
 * 보험사 메타·도구 큐레이션 리스트를 data/seed.json 으로 출력.
 * 실행: npx tsx scripts/parse-source.ts
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "data", "seed.json");

// 보험사 메타·도구 카테고리는 자체 큐레이션 리스트로 관리한다.
// 채널(전화/팩스/약관 등) 실데이터는 data/channels.csv 에서 임포트.

type Insurer = { slug: string; name_ko: string; category: "손보" | "생보" | "공제"; sort: number };

const INSURERS: Insurer[] = [
  // 손해보험
  { slug: "samsung-fire", name_ko: "삼성화재", category: "손보", sort: 10 },
  { slug: "meritz", name_ko: "메리츠화재", category: "손보", sort: 20 },
  { slug: "db", name_ko: "DB손해보험", category: "손보", sort: 30 },
  { slug: "kb", name_ko: "KB손해보험", category: "손보", sort: 40 },
  { slug: "hyundai", name_ko: "현대해상", category: "손보", sort: 50 },
  { slug: "hanwha-son", name_ko: "한화손해보험", category: "손보", sort: 60 },
  { slug: "lotte", name_ko: "롯데손해보험", category: "손보", sort: 70 },
  { slug: "heungkuk-son", name_ko: "흥국화재", category: "손보", sort: 80 },
  { slug: "hana-son", name_ko: "하나손해보험", category: "손보", sort: 90 },
  { slug: "nh-son", name_ko: "NH농협손해보험", category: "손보", sort: 100 },
  { slug: "lina", name_ko: "라이나손해보험", category: "손보", sort: 110 },
  { slug: "aig", name_ko: "AIG손해보험", category: "손보", sort: 120 },
  { slug: "axa", name_ko: "AXA손해보험", category: "손보", sort: 130 },
  { slug: "yebyeol", name_ko: "예별손해보험", category: "손보", sort: 140 },
  // 생명보험
  { slug: "samsung-life", name_ko: "삼성생명", category: "생보", sort: 210 },
  { slug: "hanwha-life", name_ko: "한화생명", category: "생보", sort: 220 },
  { slug: "kyobo", name_ko: "교보생명", category: "생보", sort: 230 },
  { slug: "shinhan", name_ko: "신한라이프", category: "생보", sort: 240 },
  { slug: "kb-life", name_ko: "KB라이프", category: "생보", sort: 250 },
  { slug: "nh-life", name_ko: "NH농협생명", category: "생보", sort: 260 },
  { slug: "dongyang", name_ko: "동양생명", category: "생보", sort: 270 },
  { slug: "miraeasset", name_ko: "미래에셋생명", category: "생보", sort: 280 },
  { slug: "kdb", name_ko: "KDB생명", category: "생보", sort: 290 },
  { slug: "im-life", name_ko: "iM라이프", category: "생보", sort: 300 },
  { slug: "abl", name_ko: "ABL생명", category: "생보", sort: 310 },
  { slug: "heungkuk-life", name_ko: "흥국생명", category: "생보", sort: 320 },
  { slug: "hana-life", name_ko: "하나생명", category: "생보", sort: 330 },
  { slug: "db-life", name_ko: "DB생명", category: "생보", sort: 340 },
  { slug: "lina-life", name_ko: "라이나생명", category: "생보", sort: 350 },
  { slug: "ibk", name_ko: "IBK연금보험", category: "생보", sort: 360 },
  { slug: "met", name_ko: "메트라이프생명", category: "생보", sort: 370 },
  { slug: "chubb-life", name_ko: "처브라이프생명", category: "생보", sort: 380 },
  { slug: "pubon", name_ko: "푸본현대생명", category: "생보", sort: 390 },
  { slug: "cardif", name_ko: "BNP파리바카디프", category: "생보", sort: 400 },
  { slug: "aia", name_ko: "AIA생명", category: "생보", sort: 410 },
  // 공제
  { slug: "post", name_ko: "우체국보험", category: "공제", sort: 510 },
  { slug: "thek", name_ko: "더케이공제", category: "공제", sort: 520 },
  { slug: "mg", name_ko: "MG새마을금고공제", category: "공제", sort: 530 },
  { slug: "suhyup", name_ko: "수협공제", category: "공제", sort: 540 },
  { slug: "shinhyup", name_ko: "신협공제", category: "공제", sort: 550 },
];

// "도구" 카테고리 — 보험설계사 실무에 자주 쓰이는 공공·협회 페이지 큐레이션
const TOOLS = [
  { category: "auto", title: "자동차보험 대면 간편견적", url: "https://kpub.knia.or.kr/carInsuranceDisc/insurance/carInsurance.do" },
  { category: "auto", title: "보험다모아 비교견적", url: "https://e-insmarket.or.kr/aimt/aimtRealIntro.knia" },
  { category: "auto", title: "다이렉트 계약 체결", url: "http://다이렉트비교견적.com" },
  { category: "auto", title: "할인·할증요인 조회시스템", url: "https://prem.kidi.or.kr:1443/" },
  { category: "auto", title: "보험개발원 등록", url: "https://iics.kidi.or.kr/insuUserReal/viewInsuUserReal.do" },
  // 합의금 계산기 파일은 자체 호스팅 전까지 비공개
  // { category: "calc", title: "합의금 계산기 (사망·후유장해)", url: "" },
  // { category: "calc", title: "합의금 계산기 (자손·자상)", url: "" },
  { category: "auto", title: "과실비율 정보포털", url: "https://accident.knia.or.kr/" },
  { category: "auto", title: "카드사 무이자 할부", url: "https://www.bss-a.co.kr/common_popup/card.html" },
  // { category: "auto", title: "자동차보험 체크리스트", url: "" },
  // { category: "child", title: "자녀보험 표준 키/몸무게", url: "" },
  { category: "fire", title: "사업장 화재보험 체크리스트", url: "https://drive.google.com/file/d/1EonSnWsfZyOFjG7C5QjBbnutYbDyb9Ej/view?usp=drive_link" },
  { category: "fire", title: "특수건물 정보조회", url: "https://ucis.kfpa.or.kr/underlist.do" },
  { category: "fire", title: "건축물대장", url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=15000000098&HighCtgCD=A02004002&Mcode=10205" },
  { category: "real_loss", title: "실손보험 인수기준 확인", url: "https://kpub.knia.or.kr/productDisc/lostHealth/lostHealthDisclosure.do" },
  { category: "elevator", title: "승강기 정보 열람", url: "https://www.elevator.go.kr/opn/MainPage.do" },
  { category: "education", title: "손보 교재/모의고사", url: "https://drive.google.com/file/d/1QELPqi9tYbXuAEIytcbAKGq0b7c-g_PS/view?usp=drive_link" },
  { category: "education", title: "생보 교재/모의고사", url: "https://drive.google.com/file/d/1rAuGAZG4BFECbC1e7pUFbtOnl8QFhsHz/view?usp=drive_link" },
  { category: "education", title: "변액 교재/모의고사", url: "https://drive.google.com/file/d/1hfKSMkm0jlFwi9ttgpti3EP36k7x9BCI/view?usp=drive_link" },
  { category: "education", title: "보험연수원 (등록·보수교육)", url: "https://www.in.or.kr/" },
  { category: "ga", title: "대리점 협회 상품 비교", url: "https://pcs.iaa.or.kr/comm/login.do" },
  // { category: "ga", title: "보험사별 등기우편 접수 주소", url: "" },
];

async function main() {
  const seed = {
    insurers: INSURERS,
    tools: TOOLS.map((t, i) => ({ ...t, sort_order: i * 10 })),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(seed, null, 2), "utf8");
  console.log(`wrote ${OUT}`);
  console.log(`insurers=${seed.insurers.length} tools=${seed.tools.length}`);
}

main();
