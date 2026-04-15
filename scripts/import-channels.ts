/**
 * data/channels.csv 를 읽어 data/channels.json 과 Supabase(옵션)에 적재.
 *
 * 실행:
 *   npx tsx scripts/import-channels.ts              # 로컬 JSON만
 *   DO_SUPABASE=1 \
 *     NEXT_PUBLIC_SUPABASE_URL=... \
 *     SUPABASE_SERVICE_ROLE_KEY=... \
 *     npx tsx scripts/import-channels.ts            # Supabase 업서트까지
 *
 * CSV 스펙은 data/channels.template.csv 의 주석 참조.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CSV = path.join(ROOT, "data", "channels.csv");
const OUT = path.join(ROOT, "data", "channels.json");
const SEED = path.join(ROOT, "data", "seed.json");

const VALID_KINDS = new Set([
  "browser",
  "customer",
  "incall",
  "monitor",
  "helpdesk",
  "fax_claim",
  "terms",
  "claim_form",
  "caregiver",
]);

type Row = {
  insurer_slug: string;
  kind: string;
  value: string;
  url: string;
  note: string;
  _line: number;
};

function parseCsvLine(line: string): string[] {
  // 간단 CSV 파서 (따옴표 내부 쉼표 지원)
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") {
        out.push(cur);
        cur = "";
      } else cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function readCsv(): Row[] {
  if (!fs.existsSync(CSV)) {
    console.error(`✗ ${CSV} 없음. template 복사:`);
    console.error("  cp data/channels.template.csv data/channels.csv");
    process.exit(1);
  }
  const raw = fs.readFileSync(CSV, "utf8");
  const rows: Row[] = [];
  const lines = raw.split(/\r?\n/);
  let header: string[] | null = null;
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const cells = parseCsvLine(line);
    if (!header) {
      header = cells.map((h) => h.toLowerCase());
      return;
    }
    const o: any = { _line: idx + 1 };
    header!.forEach((h, i) => (o[h] = cells[i] ?? ""));
    rows.push(o as Row);
  });
  return rows;
}

function validate(rows: Row[]) {
  const seed = JSON.parse(fs.readFileSync(SEED, "utf8"));
  const slugs = new Set<string>((seed.insurers || []).map((i: any) => i.slug));
  const errors: string[] = [];
  rows.forEach((r) => {
    if (!slugs.has(r.insurer_slug))
      errors.push(`line ${r._line}: 알 수 없는 insurer_slug '${r.insurer_slug}'`);
    if (!VALID_KINDS.has(r.kind))
      errors.push(`line ${r._line}: 알 수 없는 kind '${r.kind}'`);
    if (!r.value && !r.url)
      errors.push(`line ${r._line}: value/url 둘 다 비어있음`);
  });
  if (errors.length) {
    console.error("✗ 검증 실패:\n" + errors.map((e) => "  - " + e).join("\n"));
    process.exit(1);
  }
}

async function writeJson(rows: Row[]) {
  const out = rows.map(({ _line, ...r }) => r);
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
  console.log(`✓ wrote ${OUT} (${out.length} rows)`);
}

async function pushSupabase(rows: Row[]) {
  if (process.env.DO_SUPABASE !== "1") return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("✗ DO_SUPABASE=1 이지만 env 누락");
    process.exit(1);
  }
  const { createClient } = await import("@supabase/supabase-js");
  const supa = createClient(url, key, { auth: { persistSession: false } });

  const { data: insurers, error: e1 } = await supa
    .from("insurers")
    .select("id, slug");
  if (e1) throw e1;
  const idBySlug = new Map<string, string>(
    (insurers || []).map((i: any) => [i.slug, i.id])
  );

  const payload = rows
    .map((r) => ({
      insurer_id: idBySlug.get(r.insurer_slug),
      kind: r.kind,
      value: r.value || null,
      url: r.url || null,
      note: r.note || null,
    }))
    .filter((p) => p.insurer_id);

  // 기존 채널 비우고 새로 넣기 (간단화)
  const slugs = Array.from(new Set(rows.map((r) => r.insurer_slug)));
  const ids = slugs.map((s) => idBySlug.get(s)).filter(Boolean) as string[];
  if (ids.length) {
    const { error: eDel } = await supa
      .from("insurer_channels")
      .delete()
      .in("insurer_id", ids);
    if (eDel) throw eDel;
  }
  const { error: eIns } = await supa.from("insurer_channels").insert(payload);
  if (eIns) throw eIns;
  console.log(`✓ Supabase upsert: ${payload.length} channels`);
}

async function main() {
  const rows = readCsv();
  validate(rows);
  await writeJson(rows);
  await pushSupabase(rows);
  console.log("done");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
