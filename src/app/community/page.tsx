import Link from "next/link";
import { listPosts, formatTime } from "@/lib/community";
import { PageHeader } from "@/components/page-header";
import { MessageSquare, Eye, PenSquare } from "lucide-react";

export const revalidate = 30;

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const posts = await listPosts(searchParams.q);
  return (
    <div className="space-y-5">
      <PageHeader
        title="설계사 라운지"
        description="익명 게시판. 로그인 없이 바로 쓰고 댓글 다세요. 닉네임 미입력 시 IP 해시로 자동 생성."
      />

      <div className="flex items-center gap-2">
        <form className="flex flex-1 items-center gap-2" action="/community">
          <input
            name="q"
            defaultValue={searchParams.q || ""}
            placeholder="제목·본문 검색"
            className="h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:border-primary"
          />
        </form>
        <Link
          href="/community/new"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <PenSquare className="h-4 w-4" />
          글쓰기
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {posts.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            첫 글을 써보세요.
          </div>
        ) : (
          <ul className="divide-y">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/community/${p.id}`}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-accent/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">{p.title}</span>
                      {p.commentCount > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary">
                          <MessageSquare className="h-3 w-3" />
                          {p.commentCount}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="truncate">{p.nickname}</span>
                      <span>·</span>
                      <span>{formatTime(p.createdAt)}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-0.5">
                        <Eye className="h-3 w-3" />
                        {p.views}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        ⚠️ 익명 게시판입니다. 욕설·비방·스팸·개인정보 노출은 관리자 판단으로 예고 없이 삭제될 수 있습니다.
      </p>
    </div>
  );
}
