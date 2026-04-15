"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewPostPage() {
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      alert("제목과 본문을 입력하세요.");
      return;
    }
    setBusy(true);
    const r = await fetch("/api/community/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, title, body }),
    });
    setBusy(false);
    if (!r.ok) {
      alert("등록 실패");
      return;
    }
    const p = await r.json();
    router.push(`/community/${p.id}`);
  };

  return (
    <div className="space-y-5">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        게시판으로
      </Link>

      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">글쓰기</h1>

      <div className="space-y-3">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (비우면 자동 — 예: ㅇㅇ(AB12CD))"
          className="h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:border-primary"
          maxLength={20}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="h-12 w-full rounded-xl border bg-card px-3 text-base font-semibold outline-none focus:border-primary"
          maxLength={120}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="본문 (최대 10,000자)"
          className="min-h-[280px] w-full resize-y rounded-xl border bg-card p-3 text-sm outline-none focus:border-primary"
          maxLength={10000}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Link
          href="/community"
          className="inline-flex h-10 items-center rounded-xl border px-4 text-sm text-muted-foreground hover:bg-accent"
        >
          취소
        </Link>
        <button
          onClick={submit}
          disabled={busy}
          className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "등록 중…" : "등록"}
        </button>
      </div>
    </div>
  );
}
