# 우수인증설계사 — 프로젝트 빌드 프롬프트

> 영역: 보험설계사 실무용 정보·도구 디렉토리(공개 자료 기반)
> 목표: 같은 카테고리를 모던 반응형 웹으로 자체 기획·재구축 + 커뮤니티 확장

---

## 0. 한 줄 요약

> "보험설계사가 매일 쓰는 모든 외부 링크·청구서·계산기·교육 자료를
> **3초 안에 찾는** 모바일 퍼스트 PWA 허브. 추후 설계사 커뮤니티로 진화."

---

## 1. 기술 스택 (확정)

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | **Next.js 14 (App Router) + TypeScript** | SSR/PWA/SEO/API 한방 |
| UI | **Tailwind CSS + shadcn/ui** | 모던, 일관성, 다크모드 무료 |
| 아이콘 | lucide-react | shadcn 표준 |
| 검색 | **cmdk** (Command Palette ⌘K) | 즉시 전산검색 핵심 UX |
| 데이터 | **Supabase** (Postgres + Auth + Storage + Realtime) | 커뮤니티 확장 대비 |
| 테이블 | tanstack/react-table | 보험사 전산표 정렬/필터 |
| 폼 | react-hook-form + zod | 상담신청·게시판 |
| PWA | next-pwa + manifest | "앱처럼" 요구사항 충족 |
| 배포 | Vercel | Next.js 네이티브 |

---

## 2. 정보구조 (IA)

원본은 **단일 페이지 거대 표**. 우리는 다음으로 분해:

```
/                       대시보드(자주쓰는 링크 상위 + ⌘K 검색)
/insurers               보험사 전산 (손보 / 생보 / 공제 탭)
  /insurers/[slug]      개별 보험사 상세 (전산·콜·팩스·약관·청구서 다운로드)
/claim-forms            청구서 자동작성 프로그램 다운로드
  - 손보 25개사 / 생보 16개사 카드 그리드
/auto-insurance         자동차보험 도구 모음
  - 비교견적, 합의금 계산기, 과실비율, 무이자할부, 체크리스트
/calculators            계산기 모음 (합의금/호프만/자손자상 등)
/education              보험교육 (손보·생보·변액 교재/모의고사)
/tools                  기타 (건축물대장·승강기·실손인수기준·등기우편주소)
/newsletter             월간 소식지 아카이브
/community  ★Phase 2   설계사 게시판/Q&A/노하우 공유
/auth                   로그인 (Phase 2 진입과 동시 활성)
/admin                  운영자 CMS (전산정보 갱신)
```

---

## 3. 핵심 UX 원칙

1. **⌘K 글로벌 검색이 1순위**: "DB손보 청구팩스" 입력 → 바로 결과+복사 버튼.
2. **전화번호 = 탭 한 번에 통화/복사** (모바일 최우선).
3. **다운로드는 클릭 1회**, 외부링크는 새 탭 + 출처 라벨.
4. **다크모드 기본 제공**, 모바일에서 한 손 조작 가능한 하단 탭바.
5. **PWA 설치 유도 배너**(첫 3회 방문 후).
6. **속도 예산**: LCP < 1.8s, 초기 JS < 150KB.

---

## 4. 데이터 모델 (Supabase)

```sql
-- 보험사
insurers(
  id, slug, name_ko, category enum('손보','생보','공제'),
  logo_url, sort_order
)
-- 보험사별 채널 (전산/콜/팩스/약관/청구서)
insurer_channels(
  id, insurer_id, kind enum('browser','customer','incall','monitor','helpdesk','fax_claim','terms','claim_form'),
  label, value, url, note
)
-- 청구서 자동작성 프로그램
claim_form_programs(
  id, insurer_id, file_url, version, updated_at
)
-- 도구/링크 (자동차/계산기/교육/기타)
tools(
  id, category, title, description, url, icon, sort_order, is_external bool
)
-- 소식지
newsletters(id, year, month, file_url, title)
-- 커뮤니티 (Phase 2)
profiles(id, user_id, nickname, agency, role)
posts(id, author_id, board, title, body, created_at)
comments(id, post_id, author_id, body)
```
RLS: 읽기는 공개, 커뮤니티 쓰기는 인증 사용자만.

---

## 5. 페이지별 컴포넌트 사양

### `/` 대시보드
- 헤더: 로고 + ⌘K 검색바 + 다크모드 토글 + 로그인
- 즐겨찾기 8개 카드(자주 쓰는 보험사·계산기)
- 카테고리 진입 6개 타일
- 하단: 서비스 안내 카드(문의 폼 안내)

### `/insurers`
- 상단 탭: 손보 / 생보 / 공제
- 검색 인풋 + 카테고리 필터(간병 보유 여부 등)
- 카드 그리드(로고 + 이름 + 핵심 번호 3개) → 클릭 시 상세

### `/insurers/[slug]`
- 상단: 로고/이름/카테고리
- 채널 8종 그리드(브라우저, 고객센터, 인콜모니터링, 헬프데스크, 청구팩스, 약관, 청구서, 간병)
- 각 항목 우측: [복사] [전화] [열기]
- 하단: 청구서 자동작성 프로그램 다운로드 버튼

### `/auto-insurance` `/calculators` `/education` `/tools`
- 카드형 링크 모음 + 카테고리 칩
- 외부링크는 new tab + 출처 도메인 표기

### `/community` (Phase 2)
- 게시판: 자유/질문/노하우/거래
- 에디터: 마크다운 + 이미지 첨부
- 좋아요/댓글/북마크
- 실시간 새 글 알림(Supabase Realtime)

---

## 6. 디자인 톤

- **컬러**: 메인 #0F172A(slate-900) + 포인트 #2563EB(blue-600), 다크모드 우선 설계
- **타이포**: Pretendard Variable
- **모서리**: rounded-2xl, 그림자는 soft (shadow-sm)
- **여백**: 모바일 16px / 데스크톱 32px 그리드
- 참고할 톤: Linear, Vercel Dashboard, Toss

---

## 7. 빌드 단계

**Phase 1 — MVP (2주 목표)**
1. Next.js 14 + Tailwind + shadcn/ui 셋업, PWA 매니페스트
2. Supabase 프로젝트 + 위 스키마 + 시드 데이터(원본 사이트 파싱)
3. `/insurers`, `/insurers/[slug]`, `/claim-forms`, `/auto-insurance` 구현
4. ⌘K 글로벌 검색 (cmdk + 로컬 인덱스)
5. 다크모드, 모바일 하단 탭바
6. Vercel 배포 + 도메인 연결

**Phase 2 — 커뮤니티 (MVP 이후)**
1. Supabase Auth (카카오/구글)
2. profiles, posts, comments + RLS
3. Realtime 알림, 북마크
4. 운영자 CMS 페이지

**Phase 3 — 앱화**
1. PWA 푸시 알림(소식지/공지)
2. 오프라인 캐시(보험사 전산 데이터)
3. iOS/Android 설치 가이드 페이지

---

## 8. 데이터 마이그레이션

- 원본 사이트 HTML 파싱 스크립트 작성 (`scripts/seed.ts`)
  - 손보/생보/공제 표 → `insurers` + `insurer_channels`
  - 외부링크 섹션 → `tools`
  - 청구서 다운로드 링크 → `claim_form_programs`
- 운영자 계정에 데이터 갱신 권한을 위임할 수 있는 구조

---

## 9. 활용 스킬

**데스크톱 (`/Users/wy/Desktop/skills/`)**
- `웹디자인` — WCAG·반응형·접근성 게이트
- `랜딩페이지구조전문가` — 대시보드 섹션 순서 검증
- `홈페이지카피전문가` — 카피톤(설계사 대상 신뢰감)
- `Supabase전문가` — Auth/RLS/Realtime 설계
- `NextJS_Restaurant_CMS` — CMS 패턴 참고
- `기능점검전문가` — 빌드 후 누락 검증

**추가 도입 권장**
- shadcn/ui CLI, lucide-react, cmdk, tanstack-table, next-pwa, react-hook-form, zod, @supabase/ssr

---

## 10. 성공 지표

- 보험사 전산 페이지 진입 → 원하는 번호 복사까지 **3초 이내**
- Lighthouse: Performance 95+, A11y 100, PWA 100
- 모바일 1주차 재방문율 40%+
- Phase 2 오픈 후 1개월 내 게시글 100건+

---

## 11. Claude Code 시작 프롬프트 (복붙용)

```
역할: Next.js 14 풀스택 시니어. Tailwind + shadcn/ui + Supabase 능숙.

배경:
원본 http://xn--989an19aika.com/ 은 보험설계사용 리소스 허브(보험사 전산
번호·청구서·계산기·교육 링크 모음)인데 90년대 스타일 단일 거대 표라
모바일에서 못 쓴다. 이걸 모던 PWA 웹앱으로 재구축한다.
상세 사양은 같은 폴더의 PROMPT.md 전체를 먼저 읽고 따른다.

요청:
1) PROMPT.md 읽고 Phase 1 MVP 1단계(프로젝트 셋업)부터 시작.
2) 각 단계 끝마다 무엇을 했는지 1~2문장 보고.
3) 디자인 결정은 PROMPT.md "6. 디자인 톤" 준수.
4) 데이터 시드는 scripts/seed.ts 만들어 원본 HTML 파싱으로 채운다.
5) 진행 중 막히면 추측 말고 질문할 것.

작업 디렉토리: /Volumes/T7/사업자홈페이지제작/우수인증설계사
사용 가능 스킬: 웹디자인, 랜딩페이지구조전문가, Supabase전문가, 기능점검전문가
```
