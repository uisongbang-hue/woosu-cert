/**
 * Supabase 시드 적재 — service role 키 필요.
 * 실행:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     npx tsx scripts/seed-supabase.ts
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("env missing: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supa = createClient(url, key, { auth: { persistSession: false } });

const seedPath = path.join(process.cwd(), "data", "seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

async function upsertInsurers() {
  const rows = seed.insurers.map((i: any) => ({
    slug: i.slug,
    name_ko: i.name_ko,
    category: i.category,
    sort_order: i.sort,
  }));
  const { error } = await supa.from("insurers").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`insurers upserted: ${rows.length}`);
}

async function upsertTools() {
  const { error } = await supa.from("tools").upsert(seed.tools);
  if (error) throw error;
  console.log(`tools upserted: ${seed.tools.length}`);
}

async function main() {
  await upsertInsurers();
  await upsertTools();
  console.log("done");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
