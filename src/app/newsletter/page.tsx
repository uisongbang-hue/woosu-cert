import { PageHeader } from "@/components/page-header";

export default function NewsletterPage() {
  return (
    <div>
      <PageHeader title="월간 소식지" description="최신호와 지난 호 아카이브." />
      <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
        곧 등록됩니다.
      </div>
    </div>
  );
}
