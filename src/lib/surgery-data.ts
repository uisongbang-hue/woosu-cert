// 생명보험 표준 수술분류표 기반 데이터
// 1종(경미한 소수술) ~ 5종(이식·개심술 등 최중증)

export type SurgeryGrade = 1 | 2 | 3 | 4 | 5;

export type Surgery = {
  /** 수술명 */
  name: string;
  /** 종(1~5) */
  grade: SurgeryGrade;
  /** 카테고리 */
  category: string;
};

export const GRADE_INFO: {
  grade: SurgeryGrade;
  label: string;
  desc: string;
  color: string;
}[] = [
  { grade: 1, label: "1종", desc: "경미한 소수술", color: "#10b981" },
  { grade: 2, label: "2종", desc: "일반 수술", color: "#3b82f6" },
  { grade: 3, label: "3종", desc: "중등도 수술", color: "#f59e0b" },
  { grade: 4, label: "4종", desc: "중증 수술", color: "#ef4444" },
  { grade: 5, label: "5종", desc: "이식·개심술 등 최중증", color: "#7c3aed" },
];

export const SURGERIES: Surgery[] = [
  // 피부·연부조직
  { name: "피부 봉합술 (단순)", grade: 1, category: "피부·연부조직" },
  { name: "피부 절개·배농술", grade: 1, category: "피부·연부조직" },
  { name: "피부 이식술 (소범위)", grade: 1, category: "피부·연부조직" },
  { name: "피부 이식술 (광범위)", grade: 2, category: "피부·연부조직" },
  { name: "피부 종양 절제술 (양성)", grade: 1, category: "피부·연부조직" },
  { name: "악성 피부 종양 절제술", grade: 2, category: "피부·연부조직" },
  { name: "발톱 제거술", grade: 1, category: "피부·연부조직" },
  { name: "화상 수술 (소범위)", grade: 1, category: "피부·연부조직" },
  { name: "화상 수술 (중·대범위)", grade: 3, category: "피부·연부조직" },
  { name: "지방종 절제술", grade: 1, category: "피부·연부조직" },
  { name: "신경종 절제술", grade: 2, category: "피부·연부조직" },
  { name: "혈관종 절제술", grade: 1, category: "피부·연부조직" },
  { name: "켈로이드 절제술", grade: 1, category: "피부·연부조직" },
  { name: "흉터 교정술", grade: 1, category: "피부·연부조직" },
  { name: "근막 절개술", grade: 2, category: "피부·연부조직" },

  // 유방
  { name: "유방 종양 절제술 (양성)", grade: 1, category: "유방" },
  { name: "유방 종양 절제술 (악성)", grade: 2, category: "유방" },
  { name: "유방 부분 절제술", grade: 2, category: "유방" },
  { name: "유방 전절제술", grade: 3, category: "유방" },
  { name: "변형 근치 유방 절제술", grade: 3, category: "유방" },
  { name: "근치 유방 절제술", grade: 4, category: "유방" },
  { name: "유방 재건술", grade: 3, category: "유방" },
  { name: "유방 성형술 (보형물)", grade: 2, category: "유방" },
  { name: "액와부 림프절 곽청술", grade: 2, category: "유방" },

  // 눈
  { name: "결막 수술 (익상편 등)", grade: 1, category: "눈" },
  { name: "눈꺼풀 수술 (단순)", grade: 1, category: "눈" },
  { name: "눈꺼풀 종양 절제술", grade: 1, category: "눈" },
  { name: "사시 수술", grade: 2, category: "눈" },
  { name: "누낭비강문합술", grade: 2, category: "눈" },
  { name: "백내장 수술", grade: 2, category: "눈" },
  { name: "녹내장 수술", grade: 2, category: "눈" },
  { name: "망막 광응고술", grade: 2, category: "눈" },
  { name: "망막 박리 수술", grade: 3, category: "눈" },
  { name: "유리체 수술", grade: 3, category: "눈" },
  { name: "각막 이식술", grade: 3, category: "눈" },
  { name: "안구 적출술", grade: 3, category: "눈" },
  { name: "라식·라섹 수술", grade: 1, category: "눈" },
  { name: "안내렌즈삽입술", grade: 2, category: "눈" },

  // 귀·코·인후
  { name: "고막 절개술", grade: 1, category: "귀·코·인후" },
  { name: "고막 성형술", grade: 2, category: "귀·코·인후" },
  { name: "유양돌기 절제술 (중이염)", grade: 2, category: "귀·코·인후" },
  { name: "고실 성형술", grade: 2, category: "귀·코·인후" },
  { name: "인공와우 이식술", grade: 3, category: "귀·코·인후" },
  { name: "이소골 성형술", grade: 2, category: "귀·코·인후" },
  { name: "외이도 수술", grade: 1, category: "귀·코·인후" },
  { name: "비중격 교정술", grade: 1, category: "귀·코·인후" },
  { name: "하비갑개 축소술", grade: 1, category: "귀·코·인후" },
  { name: "부비동 내시경 수술 (FESS)", grade: 2, category: "귀·코·인후" },
  { name: "부비동 수술 (Caldwell-Luc)", grade: 2, category: "귀·코·인후" },
  { name: "비용종 절제술", grade: 1, category: "귀·코·인후" },
  { name: "코 성형술", grade: 1, category: "귀·코·인후" },

  // 구강·인두·후두
  { name: "편도 절제술", grade: 1, category: "구강·인두·후두" },
  { name: "아데노이드 절제술", grade: 1, category: "구강·인두·후두" },
  { name: "편도 및 아데노이드 절제술", grade: 1, category: "구강·인두·후두" },
  { name: "이하선 절제술", grade: 2, category: "구강·인두·후두" },
  { name: "악하선 절제술", grade: 2, category: "구강·인두·후두" },
  { name: "혀 수술 (혀 절제)", grade: 2, category: "구강·인두·후두" },
  { name: "악교정 수술 (악골 수술)", grade: 3, category: "구강·인두·후두" },
  { name: "기관 절개술", grade: 2, category: "구강·인두·후두" },
  { name: "기관 성형술", grade: 3, category: "구강·인두·후두" },
  { name: "후두 내시경 수술", grade: 1, category: "구강·인두·후두" },
  { name: "후두 부분 절제술", grade: 3, category: "구강·인두·후두" },
  { name: "후두 전절제술", grade: 4, category: "구강·인두·후두" },
  { name: "경부 림프절 곽청술", grade: 3, category: "구강·인두·후두" },
  { name: "구순열 교정술", grade: 2, category: "구강·인두·후두" },
  { name: "구개열 교정술", grade: 2, category: "구강·인두·후두" },

  // 갑상선·부갑상선
  { name: "갑상선 낭종 절제술", grade: 1, category: "갑상선·부갑상선" },
  { name: "갑상선 엽절제술 (반절제)", grade: 2, category: "갑상선·부갑상선" },
  { name: "갑상선 아전절제술", grade: 2, category: "갑상선·부갑상선" },
  { name: "갑상선 전절제술", grade: 3, category: "갑상선·부갑상선" },
  { name: "갑상선 전절제 + 림프절 곽청", grade: 3, category: "갑상선·부갑상선" },
  { name: "부갑상선 절제술", grade: 2, category: "갑상선·부갑상선" },

  // 식도
  { name: "식도 확장술", grade: 1, category: "식도" },
  { name: "식도 게실 수술", grade: 2, category: "식도" },
  { name: "식도 부분 절제술", grade: 4, category: "식도" },
  { name: "식도 전절제 및 재건술", grade: 4, category: "식도" },
  { name: "식도 이물 제거술", grade: 1, category: "식도" },
  { name: "위식도 역류 항역류술", grade: 3, category: "식도" },
  { name: "열공 탈장 교정술 (하이탈 탈장)", grade: 3, category: "식도" },

  // 위·십이지장
  { name: "위 내시경적 점막 절제술 (EMR)", grade: 1, category: "위·십이지장" },
  { name: "위 내시경 점막하 박리술 (ESD)", grade: 2, category: "위·십이지장" },
  { name: "위 부분 절제술 (Billroth I·II)", grade: 3, category: "위·십이지장" },
  { name: "위 전절제술", grade: 4, category: "위·십이지장" },
  { name: "복강경 위 부분 절제술", grade: 3, category: "위·십이지장" },
  { name: "복강경 위 전절제술", grade: 4, category: "위·십이지장" },
  { name: "위 천공 봉합술", grade: 3, category: "위·십이지장" },
  { name: "위루 형성술", grade: 2, category: "위·십이지장" },
  { name: "비만 수술 (위 소매절제술)", grade: 3, category: "위·십이지장" },
  { name: "비만 수술 (루와이 위우회술)", grade: 4, category: "위·십이지장" },
  { name: "위장관 기질종양 절제술 (GIST)", grade: 3, category: "위·십이지장" },
  { name: "십이지장 절제술", grade: 3, category: "위·십이지장" },

  // 소장·대장
  { name: "충수절제술 (맹장 수술)", grade: 2, category: "소장·대장" },
  { name: "복강경 충수절제술", grade: 2, category: "소장·대장" },
  { name: "소장 절제술", grade: 3, category: "소장·대장" },
  { name: "우반결장 절제술", grade: 3, category: "소장·대장" },
  { name: "좌반결장 절제술", grade: 3, category: "소장·대장" },
  { name: "복강경 대장 절제술", grade: 3, category: "소장·대장" },
  { name: "S자결장 절제술", grade: 3, category: "소장·대장" },
  { name: "장루 형성술 (인공항문)", grade: 3, category: "소장·대장" },
  { name: "대장 내시경 용종 절제술", grade: 1, category: "소장·대장" },
  { name: "복강경 장 유착 박리술", grade: 2, category: "소장·대장" },
  { name: "장중첩증 수술", grade: 2, category: "소장·대장" },
  { name: "소장 이식술", grade: 5, category: "소장·대장" },

  // 직장·항문
  { name: "치핵 수술 (치질 수술)", grade: 1, category: "직장·항문" },
  { name: "치루 수술", grade: 1, category: "직장·항문" },
  { name: "치열 수술", grade: 1, category: "직장·항문" },
  { name: "항문 농양 절개·배농술", grade: 1, category: "직장·항문" },
  { name: "항문 괄약근 수술", grade: 2, category: "직장·항문" },
  { name: "직장 탈출증 수술", grade: 2, category: "직장·항문" },
  { name: "전방 절제술 (직장암)", grade: 3, category: "직장·항문" },
  { name: "복강경 직장 전방 절제술", grade: 3, category: "직장·항문" },
  { name: "복회음 절제술 (Miles 수술)", grade: 4, category: "직장·항문" },

  // 간·담도·췌장
  { name: "담낭 절제술 (복강경)", grade: 2, category: "간·담도·췌장" },
  { name: "담낭 절제술 (개복)", grade: 3, category: "간·담도·췌장" },
  { name: "담석 내시경 제거술", grade: 1, category: "간·담도·췌장" },
  { name: "담관 절개술", grade: 3, category: "간·담도·췌장" },
  { name: "담관 재건술", grade: 4, category: "간·담도·췌장" },
  { name: "간 부분 절제술 (소범위)", grade: 3, category: "간·담도·췌장" },
  { name: "간 부분 절제술 (반간 이상)", grade: 4, category: "간·담도·췌장" },
  { name: "간내 담석 수술", grade: 3, category: "간·담도·췌장" },
  { name: "간낭종 절제술", grade: 2, category: "간·담도·췌장" },
  { name: "간 이식술 (생체 공여자)", grade: 5, category: "간·담도·췌장" },
  { name: "간 이식술 (뇌사자)", grade: 5, category: "간·담도·췌장" },
  { name: "췌장 원위부 절제술", grade: 4, category: "간·담도·췌장" },
  { name: "췌십이지장 절제술 (Whipple)", grade: 5, category: "간·담도·췌장" },
  { name: "췌장 전절제술", grade: 5, category: "간·담도·췌장" },
  { name: "췌장 낭종 수술", grade: 3, category: "간·담도·췌장" },
  { name: "췌장 이식술", grade: 5, category: "간·담도·췌장" },

  // 비장
  { name: "비장 절제술 (개복)", grade: 3, category: "비장" },
  { name: "비장 절제술 (복강경)", grade: 3, category: "비장" },
  { name: "부분 비장 절제술", grade: 3, category: "비장" },

  // 탈장
  { name: "서혜부 탈장 수술 (성인)", grade: 2, category: "탈장" },
  { name: "서혜부 탈장 수술 (소아)", grade: 1, category: "탈장" },
  { name: "복강경 서혜부 탈장 수술", grade: 2, category: "탈장" },
  { name: "대퇴부 탈장 수술", grade: 2, category: "탈장" },
  { name: "배꼽 탈장 수술 (복벽 탈장)", grade: 2, category: "탈장" },
  { name: "반흔성 탈장 수술", grade: 2, category: "탈장" },

  // 흉부·폐
  { name: "기흉 수술 (흉강경)", grade: 2, category: "흉부·폐" },
  { name: "흉강경 수술 (VATS) 단순", grade: 2, category: "흉부·폐" },
  { name: "폐 설상 절제술", grade: 3, category: "흉부·폐" },
  { name: "폐엽 절제술", grade: 4, category: "흉부·폐" },
  { name: "전폐 절제술", grade: 4, category: "흉부·폐" },
  { name: "폐 이식술", grade: 5, category: "흉부·폐" },
  { name: "종격동 종양 절제술", grade: 3, category: "흉부·폐" },
  { name: "흉막 박피술", grade: 3, category: "흉부·폐" },
  { name: "흉벽 절제 재건술", grade: 3, category: "흉부·폐" },
  { name: "늑골 절제술", grade: 2, category: "흉부·폐" },
  { name: "기관 절제 및 재건술", grade: 4, category: "흉부·폐" },
  { name: "흉막유착술", grade: 1, category: "흉부·폐" },

  // 심장·대혈관
  { name: "관상동맥 우회술 (CABG)", grade: 5, category: "심장·대혈관" },
  { name: "관상동맥 우회술 비체외순환 (OPCAB)", grade: 5, category: "심장·대혈관" },
  { name: "판막 성형술", grade: 5, category: "심장·대혈관" },
  { name: "판막 치환술 (기계·조직 판막)", grade: 5, category: "심장·대혈관" },
  { name: "대동맥판막 치환술 (TAVI)", grade: 5, category: "심장·대혈관" },
  { name: "심방중격결손 교정술", grade: 4, category: "심장·대혈관" },
  { name: "심실중격결손 교정술", grade: 4, category: "심장·대혈관" },
  { name: "팔로사징증 교정술", grade: 5, category: "심장·대혈관" },
  { name: "복부 대동맥류 수술", grade: 4, category: "심장·대혈관" },
  { name: "흉부 대동맥 수술", grade: 5, category: "심장·대혈관" },
  { name: "대동맥류 스텐트 그라프트", grade: 4, category: "심장·대혈관" },
  { name: "심막 절제술 (수축성 심막염)", grade: 4, category: "심장·대혈관" },
  { name: "심막 천자·배액", grade: 1, category: "심장·대혈관" },
  { name: "심장 종양 절제술", grade: 5, category: "심장·대혈관" },
  { name: "인공 심박동기 삽입술", grade: 3, category: "심장·대혈관" },
  { name: "제세동기 삽입술 (ICD)", grade: 3, category: "심장·대혈관" },
  { name: "좌심실 보조장치 삽입술", grade: 5, category: "심장·대혈관" },
  { name: "심장 이식술", grade: 5, category: "심장·대혈관" },

  // 말초혈관
  { name: "하지 정맥류 수술", grade: 2, category: "말초혈관" },
  { name: "말초 동맥류 수술", grade: 3, category: "말초혈관" },
  { name: "혈관 우회술 (말초동맥 폐색)", grade: 3, category: "말초혈관" },
  { name: "동정맥루 형성술 (투석용)", grade: 2, category: "말초혈관" },
  { name: "경동맥 내막 절제술", grade: 4, category: "말초혈관" },
  { name: "대퇴동맥 수술", grade: 3, category: "말초혈관" },

  // 뇌·신경외과
  { name: "두개골 천공술", grade: 2, category: "뇌·신경외과" },
  { name: "뇌실복강간 단락술 (뇌수두증)", grade: 3, category: "뇌·신경외과" },
  { name: "뇌종양 절제술 (양성)", grade: 4, category: "뇌·신경외과" },
  { name: "뇌종양 절제술 (악성)", grade: 5, category: "뇌·신경외과" },
  { name: "뇌동맥류 결찰술 (개두술)", grade: 5, category: "뇌·신경외과" },
  { name: "뇌동맥류 코일색전술", grade: 4, category: "뇌·신경외과" },
  { name: "뇌출혈 혈종 제거술", grade: 4, category: "뇌·신경외과" },
  { name: "경막하 혈종 제거술", grade: 3, category: "뇌·신경외과" },
  { name: "뇌경색 혈전 제거술 (혈관내치료)", grade: 4, category: "뇌·신경외과" },
  { name: "두개저 수술", grade: 5, category: "뇌·신경외과" },
  { name: "정위적 뇌수술 (DBS 등)", grade: 4, category: "뇌·신경외과" },
  { name: "뇌하수체 종양 수술 (경접형동)", grade: 4, category: "뇌·신경외과" },
  { name: "감마나이프 방사선 수술", grade: 3, category: "뇌·신경외과" },
  { name: "삼차신경통 수술", grade: 3, category: "뇌·신경외과" },

  // 척추
  { name: "경추 추간판 수술 (미세·내시경)", grade: 2, category: "척추" },
  { name: "경추 전방 고정술", grade: 3, category: "척추" },
  { name: "경추 후방 감압·고정술", grade: 3, category: "척추" },
  { name: "요추 추간판 수술 (미세·내시경)", grade: 2, category: "척추" },
  { name: "요추 추간판 수술 (개방)", grade: 2, category: "척추" },
  { name: "요추 척추 유합술", grade: 3, category: "척추" },
  { name: "척추관 협착증 감압술", grade: 2, category: "척추" },
  { name: "척추 종양 절제술", grade: 4, category: "척추" },
  { name: "경피적 척추 성형술 (풍선 성형)", grade: 2, category: "척추" },
  { name: "척추 측만증 교정 수술", grade: 4, category: "척추" },
  { name: "요추 인공 디스크 치환술", grade: 3, category: "척추" },

  // 정형외과·관절
  { name: "골절 정복술 (비관혈적)", grade: 1, category: "정형외과·관절" },
  { name: "골절 정복술 (관혈적·내고정)", grade: 2, category: "정형외과·관절" },
  { name: "골절 정복술 (복잡·복합)", grade: 3, category: "정형외과·관절" },
  { name: "내고정물 제거술", grade: 1, category: "정형외과·관절" },
  { name: "인공 고관절 전치환술 (THA)", grade: 3, category: "정형외과·관절" },
  { name: "인공 고관절 반치환술 (BHA)", grade: 3, category: "정형외과·관절" },
  { name: "인공 슬관절 전치환술 (TKA)", grade: 3, category: "정형외과·관절" },
  { name: "인공 슬관절 반치환술 (UKA)", grade: 3, category: "정형외과·관절" },
  { name: "인공 견관절 치환술", grade: 3, category: "정형외과·관절" },
  { name: "관절경 수술 (슬관절)", grade: 2, category: "정형외과·관절" },
  { name: "관절경 수술 (견관절·회전근개 봉합)", grade: 2, category: "정형외과·관절" },
  { name: "관절경 수술 (고관절)", grade: 2, category: "정형외과·관절" },
  { name: "관절경 수술 (발목관절)", grade: 2, category: "정형외과·관절" },
  { name: "전방십자인대 재건술 (ACL)", grade: 2, category: "정형외과·관절" },
  { name: "후방십자인대 재건술 (PCL)", grade: 2, category: "정형외과·관절" },
  { name: "반월판 봉합·절제술", grade: 2, category: "정형외과·관절" },
  { name: "골종양 절제술 (양성)", grade: 2, category: "정형외과·관절" },
  { name: "골종양 절제술 (악성·사지 보존)", grade: 4, category: "정형외과·관절" },
  { name: "절단술 (상지·하지)", grade: 3, category: "정형외과·관절" },
  { name: "무지외반증 교정술", grade: 2, category: "정형외과·관절" },
  { name: "수근관 증후군 수술", grade: 1, category: "정형외과·관절" },
  { name: "방아쇠 수지 수술", grade: 1, category: "정형외과·관절" },
  { name: "건 봉합술 (단순)", grade: 1, category: "정형외과·관절" },
  { name: "건 재건술", grade: 2, category: "정형외과·관절" },
  { name: "대퇴골 골절 수술", grade: 3, category: "정형외과·관절" },
  { name: "고관절 골절 수술", grade: 3, category: "정형외과·관절" },
  { name: "골반 골절 수술", grade: 3, category: "정형외과·관절" },
  { name: "골 이식술", grade: 2, category: "정형외과·관절" },
  { name: "연골 이식술", grade: 3, category: "정형외과·관절" },

  // 비뇨기과
  { name: "경요도 방광 종양 절제술 (TURBT)", grade: 2, category: "비뇨기과" },
  { name: "방광 부분 절제술", grade: 3, category: "비뇨기과" },
  { name: "방광 전절제 + 요로전환술", grade: 5, category: "비뇨기과" },
  { name: "요관 수술 (요관 절제·재건)", grade: 3, category: "비뇨기과" },
  { name: "경요도 전립선 절제술 (TURP)", grade: 2, category: "비뇨기과" },
  { name: "전립선 레이저 수술 (HoLEP)", grade: 2, category: "비뇨기과" },
  { name: "전립선 근치적 절제술", grade: 4, category: "비뇨기과" },
  { name: "신장 부분 절제술", grade: 3, category: "비뇨기과" },
  { name: "신장 전절제술 (근치적)", grade: 4, category: "비뇨기과" },
  { name: "복강경 신장 절제술", grade: 3, category: "비뇨기과" },
  { name: "신장 이식술", grade: 5, category: "비뇨기과" },
  { name: "요로결석 내시경 수술 (PCNL·URS)", grade: 2, category: "비뇨기과" },
  { name: "요로결석 체외충격파 쇄석술 (ESWL)", grade: 1, category: "비뇨기과" },
  { name: "부신 절제술", grade: 3, category: "비뇨기과" },
  { name: "요도 수술 (단순)", grade: 1, category: "비뇨기과" },
  { name: "신우 성형술", grade: 3, category: "비뇨기과" },
  { name: "방광요관역류 수술", grade: 2, category: "비뇨기과" },

  // 남성 생식기
  { name: "고환 고정술 (정류 고환)", grade: 1, category: "남성 생식기" },
  { name: "고환 절제술", grade: 1, category: "남성 생식기" },
  { name: "정계 정맥류 수술", grade: 1, category: "남성 생식기" },
  { name: "귀두포피 수술", grade: 1, category: "남성 생식기" },
  { name: "음낭 수종 수술", grade: 1, category: "남성 생식기" },
  { name: "페이로니병 수술", grade: 2, category: "남성 생식기" },

  // 여성 생식기
  { name: "자궁 내막 소파술 (D&C)", grade: 1, category: "여성 생식기" },
  { name: "자궁경부 원추절제술 (LEEP·CKC)", grade: 1, category: "여성 생식기" },
  { name: "자궁경 수술 (내막 종양)", grade: 1, category: "여성 생식기" },
  { name: "자궁근종 절제술 (복강경)", grade: 2, category: "여성 생식기" },
  { name: "자궁근종 절제술 (개복)", grade: 3, category: "여성 생식기" },
  { name: "자궁 전절제술 (복강경)", grade: 3, category: "여성 생식기" },
  { name: "자궁 전절제술 (개복)", grade: 3, category: "여성 생식기" },
  { name: "자궁암 광범위 절제술", grade: 4, category: "여성 생식기" },
  { name: "난소 낭종 절제술 (복강경)", grade: 2, category: "여성 생식기" },
  { name: "난소 낭종 절제술 (개복)", grade: 2, category: "여성 생식기" },
  { name: "난소 절제술", grade: 2, category: "여성 생식기" },
  { name: "자궁부속기 절제술", grade: 2, category: "여성 생식기" },
  { name: "이소성 임신 수술 (자궁외임신)", grade: 2, category: "여성 생식기" },
  { name: "난소암 수술 (종양 축소술)", grade: 4, category: "여성 생식기" },
  { name: "자궁 탈출증 수술", grade: 2, category: "여성 생식기" },
  { name: "자궁내막증 수술 (복강경)", grade: 2, category: "여성 생식기" },
  { name: "난관 결찰·절제술", grade: 1, category: "여성 생식기" },
  { name: "자궁 성형술", grade: 3, category: "여성 생식기" },

  // 산과
  { name: "제왕절개술", grade: 2, category: "산과" },
  { name: "제왕절개 + 자궁근종 절제", grade: 3, category: "산과" },

  // 이식
  { name: "신장 이식 (뇌사자)", grade: 5, category: "이식" },
  { name: "신장 이식 (생체)", grade: 5, category: "이식" },
  { name: "간 이식 (뇌사자)", grade: 5, category: "이식" },
  { name: "간 이식 (생체)", grade: 5, category: "이식" },
  { name: "심장 이식", grade: 5, category: "이식" },
  { name: "폐 이식", grade: 5, category: "이식" },
  { name: "췌장 이식", grade: 5, category: "이식" },
  { name: "소장 이식", grade: 5, category: "이식" },
  { name: "각막 이식", grade: 3, category: "이식" },
  { name: "조혈모세포 이식 (골수 이식)", grade: 4, category: "이식" },
  { name: "복합 장기 이식", grade: 5, category: "이식" },

  // 성형외과
  { name: "반흔 구축 교정술", grade: 2, category: "성형외과" },
  { name: "화상 후 재건술 (대범위)", grade: 3, category: "성형외과" },
  { name: "안면 골절 수술", grade: 2, category: "성형외과" },
  { name: "두개골 재건술", grade: 4, category: "성형외과" },
  { name: "미세재접합술 (절단 부위)", grade: 4, category: "성형외과" },
  { name: "유리 피판 수술", grade: 4, category: "성형외과" },

  // 소아외과
  { name: "유문 협착증 수술", grade: 2, category: "소아외과" },
  { name: "선천성 거대결장 수술 (Hirschsprung)", grade: 3, category: "소아외과" },
  { name: "선천성 항문직장 기형 교정술", grade: 3, category: "소아외과" },

  // 말초신경
  { name: "말초신경 봉합술", grade: 2, category: "말초신경" },
  { name: "말초신경 이식술", grade: 2, category: "말초신경" },
  { name: "신경 압박 해제술", grade: 1, category: "말초신경" },
];
