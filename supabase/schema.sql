-- 우수인증설계사 Phase 1 schema
-- Apply in Supabase SQL editor or via `supabase db push`

create extension if not exists "pgcrypto";

-- ========== 보험사 ==========
create table if not exists insurers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ko text not null,
  category text not null check (category in ('손보','생보','공제')),
  logo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ========== 보험사 채널(전산/콜/팩스/약관/청구서/간병 등) ==========
create table if not exists insurer_channels (
  id uuid primary key default gen_random_uuid(),
  insurer_id uuid not null references insurers(id) on delete cascade,
  kind text not null check (kind in (
    'browser','customer','incall','monitor','helpdesk',
    'fax_claim','terms','claim_form','caregiver'
  )),
  label text,
  value text,
  url text,
  note text,
  sort_order int not null default 0
);
create index if not exists insurer_channels_insurer_idx on insurer_channels(insurer_id);

-- ========== 청구서 자동작성 프로그램 ==========
create table if not exists claim_form_programs (
  id uuid primary key default gen_random_uuid(),
  insurer_id uuid references insurers(id) on delete cascade,
  category text not null check (category in ('손보','생보')),
  file_url text not null,
  version text,
  updated_at timestamptz not null default now()
);

-- ========== 도구/링크 (자동차/계산기/교육/기타) ==========
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  category text not null,         -- 'auto','calc','fire','child','real_loss','elevator','education','ga','misc'
  title text not null,
  description text,
  url text not null,
  is_external boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists tools_category_idx on tools(category);

-- ========== 소식지 ==========
create table if not exists newsletters (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  month int not null,
  title text,
  file_url text not null,
  created_at timestamptz not null default now(),
  unique (year, month)
);

-- ========== 커뮤니티 (Phase 2 준비) ==========
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique,
  agency text,
  role text default 'member',
  created_at timestamptz not null default now()
);
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete set null,
  board text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists posts_board_idx on posts(board, created_at desc);
create index if not exists comments_post_idx on comments(post_id, created_at);

-- ========== RLS ==========
alter table insurers enable row level security;
alter table insurer_channels enable row level security;
alter table claim_form_programs enable row level security;
alter table tools enable row level security;
alter table newsletters enable row level security;
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

-- 공개 읽기
drop policy if exists "read_insurers" on insurers;
create policy "read_insurers" on insurers for select using (true);
drop policy if exists "read_channels" on insurer_channels;
create policy "read_channels" on insurer_channels for select using (true);
drop policy if exists "read_programs" on claim_form_programs;
create policy "read_programs" on claim_form_programs for select using (true);
drop policy if exists "read_tools" on tools;
create policy "read_tools" on tools for select using (true);
drop policy if exists "read_newsletters" on newsletters;
create policy "read_newsletters" on newsletters for select using (true);
drop policy if exists "read_profiles" on profiles;
create policy "read_profiles" on profiles for select using (true);
drop policy if exists "read_posts" on posts;
create policy "read_posts" on posts for select using (true);
drop policy if exists "read_comments" on comments;
create policy "read_comments" on comments for select using (true);

-- 커뮤니티 쓰기: 인증 사용자 & 본인만
drop policy if exists "insert_own_post" on posts;
create policy "insert_own_post" on posts for insert
  with check (auth.uid() = author_id);
drop policy if exists "update_own_post" on posts;
create policy "update_own_post" on posts for update
  using (auth.uid() = author_id);
drop policy if exists "delete_own_post" on posts;
create policy "delete_own_post" on posts for delete
  using (auth.uid() = author_id);

drop policy if exists "insert_own_comment" on comments;
create policy "insert_own_comment" on comments for insert
  with check (auth.uid() = author_id);
drop policy if exists "update_own_comment" on comments;
create policy "update_own_comment" on comments for update
  using (auth.uid() = author_id);
drop policy if exists "delete_own_comment" on comments;
create policy "delete_own_comment" on comments for delete
  using (auth.uid() = author_id);

drop policy if exists "insert_own_profile" on profiles;
create policy "insert_own_profile" on profiles for insert
  with check (auth.uid() = id);
drop policy if exists "update_own_profile" on profiles;
create policy "update_own_profile" on profiles for update
  using (auth.uid() = id);
