# Supabase 셋업

## 1) 프로젝트 생성
1. https://supabase.com 접속 → New project
2. Region: `Northeast Asia (Seoul)` 권장
3. DB 비밀번호 저장

## 2) 환경변수
프로젝트 루트에 `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # 시드 스크립트 실행용 (Git에 올리지 않음)
```

## 3) 스키마 적용
Supabase Dashboard → SQL Editor → `supabase/schema.sql` 전체 복붙 후 Run.

## 4) 시드 적재
```bash
# 원본 사이트 HTML 다운로드(이미 /tmp/site.html 있으면 생략)
curl -sL -A "Mozilla/5.0" http://xn--989an19aika.com/ -o /tmp/site.html

# seed.json 생성
npx tsx scripts/parse-source.ts

# Supabase 업로드
export $(cat .env.local | xargs)
npx tsx scripts/seed-supabase.ts
```

## 5) 확인
SQL Editor:
```sql
select count(*) from insurers;   -- 30
select count(*) from tools;      -- 22
```
