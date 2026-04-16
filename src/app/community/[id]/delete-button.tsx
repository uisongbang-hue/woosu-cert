"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeletePostButton({ postId }: { postId: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    setBusy(true);
    const r = await fetch(`/api/community/posts/${postId}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (r.status === 403) {
      alert("본인이 작성한 글만 삭제할 수 있습니다.");
      return;
    }
    if (!r.ok) {
      alert("삭제 실패");
      return;
    }
    router.push("/community");
    router.refresh();
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
    const r = await fetch(`/api/community/posts/${postId}/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    setBusy(false);
    if (r.status === 403) {
      alert("본인이 작성한 댓글만 삭제할 수 있습니다.");
      return;
    }
    if (!r.ok) {
      alert("삭제 실패");
      return;
    }
    router.refresh();
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
