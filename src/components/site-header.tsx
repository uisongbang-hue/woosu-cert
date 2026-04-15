"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const openPalette = () => window.dispatchEvent(new Event("cmdk:open"));
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center gap-3 md:h-[72px]">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="inline-block h-6 w-6 rounded-lg bg-primary" />
          우수인증설계사
        </Link>
        <button
          type="button"
          onClick={openPalette}
          className="ml-auto inline-flex h-9 flex-1 max-w-md items-center gap-2 rounded-xl border bg-card px-3 text-sm text-muted-foreground transition hover:bg-accent"
          aria-label="검색 (⌘K)"
        >
          <Search className="h-4 w-4" />
          <span>전산·번호·링크 검색</span>
          <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
            ⌘K
          </kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
