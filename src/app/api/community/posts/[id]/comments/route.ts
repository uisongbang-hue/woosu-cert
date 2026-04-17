import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createComment, deleteComment } from "@/lib/community";
import { getClientIp } from "@/lib/request-ip";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));
  const c = await createComment({
    postId: params.id,
    nickname: body.nickname,
    body: body.body,
    ip: getClientIp(req),
  });
  if (!c) return NextResponse.json({ error: "invalid" }, { status: 400 });
  revalidatePath("/community");
  revalidatePath(`/community/${params.id}`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ip: _ip, ...safe } = c!;
  return NextResponse.json(safe);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { commentId } = await req.json().catch(() => ({ commentId: "" }));
  if (!commentId)
    return NextResponse.json({ error: "missing commentId" }, { status: 400 });
  const adminKey = req.headers.get("x-admin-key") || undefined;
  const result = await deleteComment(params.id, commentId, getClientIp(req), adminKey);
  if (!result.ok) {
    const status = result.reason === "not_found" ? 404 : 403;
    return NextResponse.json({ error: result.reason }, { status });
  }
  revalidatePath("/community");
  revalidatePath(`/community/${params.id}`);
  return NextResponse.json({ ok: true });
}
