/**
 * 데이터 액세스 — Supabase 환경변수가 있으면 Supabase, 없으면 로컬 seed.json.
 * 페이지 컴포넌트에서는 이 모듈만 import.
 */
import fs from "node:fs";
import path from "node:path";
import { createSupabaseServer } from "./supabase/server";

export type Insurer = {
  id?: string;
  slug: string;
  name_ko: string;
  category: "손보" | "생보" | "공제";
  sort_order: number;
};

export type Tool = {
  id?: string;
  category: string;
  title: string;
  description?: string | null;
  url: string;
  is_external?: boolean;
  sort_order: number;
};

const seedPath = path.join(process.cwd(), "data", "seed.json");
type SeedInsurer = { slug: string; name_ko: string; category: "손보" | "생보" | "공제"; sort?: number; sort_order?: number };
type SeedShape = { insurers: SeedInsurer[]; tools: Tool[] };
function loadSeed(): SeedShape {
  if (!fs.existsSync(seedPath)) return { insurers: [], tools: [] };
  return JSON.parse(fs.readFileSync(seedPath, "utf8"));
}

function hasSupabase() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getInsurers(): Promise<Insurer[]> {
  if (hasSupabase()) {
    const supa = createSupabaseServer();
    const { data, error } = await supa
      .from("insurers")
      .select("*")
      .order("sort_order");
    if (!error && data) return data as Insurer[];
  }
  const seed = loadSeed();
  return (seed.insurers || []).map((i) => ({
    slug: i.slug,
    name_ko: i.name_ko,
    category: i.category,
    sort_order: i.sort ?? i.sort_order ?? 0,
  }));
}

export async function getInsurerBySlug(slug: string): Promise<Insurer | null> {
  const list = await getInsurers();
  return list.find((i) => i.slug === slug) || null;
}

export type Channel = {
  insurer_slug?: string;
  insurer_id?: string;
  kind: string;
  value?: string | null;
  url?: string | null;
  note?: string | null;
};

const channelsPath = path.join(process.cwd(), "data", "channels.json");
function loadChannelsLocal(): Channel[] {
  if (!fs.existsSync(channelsPath)) return [];
  return JSON.parse(fs.readFileSync(channelsPath, "utf8"));
}

export async function getChannelsByKind(kind: string): Promise<Channel[]> {
  if (hasSupabase()) {
    const supa = createSupabaseServer();
    const { data, error } = await supa
      .from("insurer_channels")
      .select("*, insurers(slug,name_ko,category)")
      .eq("kind", kind);
    if (!error && data) return data as unknown as Channel[];
  }
  return loadChannelsLocal().filter((c) => c.kind === kind);
}

export async function getChannelsBySlug(slug: string): Promise<Channel[]> {
  if (hasSupabase()) {
    const supa = createSupabaseServer();
    const { data: ins } = await supa
      .from("insurers")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (ins?.id) {
      const { data, error } = await supa
        .from("insurer_channels")
        .select("*")
        .eq("insurer_id", ins.id);
      if (!error && data) return data as Channel[];
    }
  }
  return loadChannelsLocal().filter((c) => c.insurer_slug === slug);
}

export async function getTools(category?: string): Promise<Tool[]> {
  if (hasSupabase()) {
    const supa = createSupabaseServer();
    let q = supa.from("tools").select("*").order("sort_order");
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (!error && data) return data as Tool[];
  }
  const seed = loadSeed();
  let tools: Tool[] = seed.tools || [];
  if (category) tools = tools.filter((t) => t.category === category);
  return tools;
}
