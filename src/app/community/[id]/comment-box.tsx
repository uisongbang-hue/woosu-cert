"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CommentBox({ postId }: { postId: string }) {
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!body.trim()) return;
    setBusy(true);
    const r = await fetch(`/api/community/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, body }),
    });
    setBusy(false);
    if (!r.ok) {
      alert("등록 실패");
      return;
    }
    setBody("");
    router.refresh();
  };

  return (
    <div className="space-y-2 border-t bg-muted/30 p-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (선택)"
          maxLength={20}
          className="h-9 w-full rounded-lg border bg-background px-2 text-xs outline-none focus:border-primary sm:w-40"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="댓글 입력… (최대 2,000자)"
          maxLength={2000}
          className="min-h-[44px] w-full resize-y rounded-lg border bg-background p-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={submit}
          disabled={busy || !body.trim()}
          className="h-9 shrink-0 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-50 sm:h-auto"
        >
          {busy ? "등록…" : "댓글 등록"}
        </button>
      </div>
    </div>
  );
}
