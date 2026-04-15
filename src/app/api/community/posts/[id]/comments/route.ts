import { NextRequest, NextResponse } from "next/server";
import { createComment } from "@/lib/community";

export const dynamic = "force-dynamic";

function getIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));
  const c = await createComment({
    postId: params.id,
    nickname: body.nickname,
    body: body.body,
    ip: getIp(req),
  });
  if (!c) return NextResponse.json({ error: "invalid" }, { status: 400 });
  return NextResponse.json(c);
}
