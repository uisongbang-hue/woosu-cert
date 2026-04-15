import { PageHeader } from "@/components/page-header";

const GENERATIONS = [
  {
    gen: "1세대",
    sub: "구(舊)실손",
    period: "2009.09 이전",
    deductible: "자기부담 없음 (100% 보장)",
    renewal: "1~5년 (상품별 상이)",
    notes: [
      "보장 범위가 넓고 자기부담률 0%가 일반적",
      "갱신 시 보험료 인상 폭이 큰 사례 다수",
    ],
  },
  {
    gen: "표준화 실손",
    sub: "1.5세대로도 부름",
    period: "2009.10 ~ 2013.03",
    deductible: "급여·비급여 모두 자기부담 10%, 통원 외래 별도 공제(1만~2만)",
    renewal: "1~3년",
    notes: [
      "전 보험사 표준약관 통일이 시작된 시기",
      "자기부담 도입으로 의료 이용 통제 효과 시작",
    ],
  },
  {
    gen: "2세대",
    sub: "표준화 1년 갱신",
    period: "2013.04 ~ 2017.03",
    deductible: "입원 10%, 통원 외래공제 + 10%",
    renewal: "매 1년 갱신",
    notes: ["갱신 주기 1년으로 단축", "재가입 주기 15년"],
  },
  {
    gen: "3세대",
    sub: "착한실손",
    period: "2017.04 ~ 2021.06",
    deductible: "기본형 자기부담 10/20%, 특약(도수·MRI·주사) 30%",
    renewal: "1년 갱신 / 15년 재가입",
    notes: [
      "기본형 + 3종 특약 분리 구조",
      "비급여 도수·MRI·주사 특약은 별도 공제",
    ],
  },
  {
    gen: "4세대",
    sub: "현행 (2026 기준)",
    period: "2021.07 ~ 현재",
    deductible: "급여 20% / 비급여 30%",
    renewal: "1년 갱신 / 5년 재가입",
    notes: [
      "급여·비급여 보장 분리",
      "비급여 사용량 기반 보험료 할인·할증(연단위)",
      "재가입 주기 5년으로 단축",
    ],
  },
] as const;

export default function InsuranceHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="실손보험 변천사"
        description="세대별 자기부담률·갱신주기·주요 변화 비교. 공개된 표준약관·금감원 자료 기반."
      />

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-xs font-semibold tracking-wide text-muted-foreground">
              <th className="px-4 py-3">세대</th>
              <th className="px-4 py-3">판매 시기</th>
              <th className="px-4 py-3">자기부담 구조</th>
              <th className="px-4 py-3">갱신·재가입</th>
              <th className="px-4 py-3">특징</th>
            </tr>
          </thead>
          <tbody>
            {GENERATIONS.map((g) => (
              <tr key={g.gen} className="border-b last:border-0 align-top">
                <td className="px-4 py-3">
                  <div className="font-bold">{g.gen}</div>
                  <div className="text-xs text-muted-foreground">{g.sub}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{g.period}</td>
                <td className="px-4 py-3">{g.deductible}</td>
                <td className="px-4 py-3 text-muted-foreground">{g.renewal}</td>
                <td className="px-4 py-3">
                  <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
                    {g.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border bg-card p-5 text-sm">
        <div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">
          참고
        </div>
        <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
          <li>
            세대 구분과 자기부담률은 금융감독원·생명/손해보험협회의 공개 자료를 바탕으로 정리한
            요약본입니다. 가입 상품의 약관·특약에 따라 실제 조건이 달라질 수 있어요.
          </li>
          <li>5세대(가칭) 재편안이 정책 단위에서 논의 중이며 변동 가능합니다.</li>
        </ul>
      </div>
    </div>
  );
}
