import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPost, listPosts } from "@/lib/community";
import { getClientIp } from "@/lib/request-ip";

export const dynamic = "force-dynamic";

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
    ip: getClientIp(req),
  });
  if (!post) return NextResponse.json({ error: "invalid" }, { status: 400 });
  revalidatePath("/community");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ip: _ip, ...safe } = post!;
  return NextResponse.json(safe);
}
