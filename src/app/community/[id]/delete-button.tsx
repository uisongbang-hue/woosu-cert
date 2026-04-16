"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

async function tryDelete(
  url: string,
  options?: RequestInit
): Promise<boolean> {
  const r = await fetch(url, options);
  if (r.ok) return true;
  if (r.status !== 403) {
    alert("삭제 실패");
    return false;
  }
  const key = prompt("관리자 비밀번호를 입력하세요:");
  if (!key) return false;
  const r2 = await fetch(url, {
    ...options,
    headers: { ...((options?.headers as Record<string, string>) || {}), "x-admin-key": key },
  });
  if (r2.ok) return true;
  if (r2.status === 403) alert("비밀번호가 틀렸습니다.");
  else alert("삭제 실패");
  return false;
}

export function DeletePostButton({ postId }: { postId: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    setBusy(true);
    const ok = await tryDelete(`/api/community/posts/${postId}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (ok) {
      router.push("/community");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="h-3 w-3" />
      {busy ? "삭제 중…" : "삭제"}
    </button>
  );
}

export function DeleteCommentButton({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("이 댓글을 삭제하시겠습니까?")) return;
    setBusy(true);
    const ok = await tryDelete(`/api/community/posts/${postId}/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    setBusy(false);
    if (ok) router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="text-[11px] text-muted-foreground hover:text-destructive disabled:opacity-50"
    >
      {busy ? "삭제 중…" : "삭제"}
    </button>
  );
}
