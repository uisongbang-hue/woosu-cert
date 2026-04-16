import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createComment, deleteComment } from "@/lib/community";

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
  revalidatePath("/community");
  revalidatePath(`/community/${params.id}`);
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
  const result = await deleteComment(params.id, commentId, getIp(req), adminKey);
  if (!result.ok) {
    const status = result.reason === "not_found" ? 404 : 403;
    return NextResponse.json({ error: result.reason }, { status });
  }
  revalidatePath("/community");
  revalidatePath(`/community/${params.id}`);
  return NextResponse.json({ ok: true });
}
