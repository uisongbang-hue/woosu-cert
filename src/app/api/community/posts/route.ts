import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPost, listPosts } from "@/lib/community";

export const dynamic = "force-dynamic";

function getIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || undefined;
  return NextResponse.json(await listPosts(q));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const post = await createPost({
    nickname: body.nickname,
    title: body.title,
    body: body.body,
    ip: getIp(req),
  });
  if (!post) return NextResponse.json({ error: "invalid" }, { status: 400 });
  revalidatePath("/community");
  const { ip: _ip, ...safe } = post!;
  return NextResponse.json(safe);
}
