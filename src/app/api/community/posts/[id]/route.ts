import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deletePost } from "@/lib/community";
import { getClientIp } from "@/lib/request-ip";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminKey = req.headers.get("x-admin-key") || undefined;
  const result = await deletePost(params.id, getClientIp(req), adminKey);
  if (!result.ok) {
    const status = result.reason === "not_found" ? 404 : 403;
    return NextResponse.json({ error: result.reason }, { status });
  }
  revalidatePath("/community");
  return NextResponse.json({ ok: true });
}
