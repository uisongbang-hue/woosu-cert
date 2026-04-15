import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const p = path.join(process.cwd(), "data", "kcd.json");
  if (!fs.existsSync(p)) return NextResponse.json([]);
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  return NextResponse.json(raw);
}
