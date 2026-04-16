import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, formatTime } from "@/lib/community";
import { ChevronLeft, Eye, MessageSquare } from "lucide-react";
import { CommentBox } from "./comment-box";

export const revalidate = 30;

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getPost(params.id);
  if (!data) notFound();
  const { post, comments } = data;

  return (
    <div className="space-y-5">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        게시판으로
      </Link>

      <article className="rounded-2xl border bg-card p-5 md:p-6">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">
          {post.title}
        </h1>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.nickname}</span>
          <span>·</span>
          <span>{formatTime(post.createdAt)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5">
            <Eye className="h-3 w-3" />
            {post.views}
          </span>
        </div>
        <div className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed">
          {post.body}
        </div>
      </article>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          댓글 {comments.length}
        </h2>
        <div className="overflow-hidden rounded-2xl border bg-card">
          {comments.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              첫 댓글을 남겨보세요.
            </div>
          ) : (
            <ul className="divide-y">
              {comments.map((c) => (
                <li key={c.id} className="px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {c.nickname}
                    </span>
                    <span>·</span>
                    <span>{formatTime(c.createdAt)}</span>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                    {c.body}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <CommentBox postId={post.id} />
        </div>
      </section>
    </div>
  );
}
