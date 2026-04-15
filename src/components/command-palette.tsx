"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Building2, Wrench, ExternalLink } from "lucide-react";
import type { SearchItem } from "@/app/api/search-index/route";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<SearchItem[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const onOpen = () => setOpen(true);
    window.addEventListener("cmdk:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", onOpen);
    };
  }, []);

  React.useEffect(() => {
    if (!open || loaded) return;
    fetch("/api/search-index")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded]);

  const go = (item: SearchItem) => {
    setOpen(false);
    if (item.external) window.open(item.href, "_blank", "noopener");
    else router.push(item.href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 p-4 pt-[10vh] backdrop-blur"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="검색" className="flex flex-col">
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="보험사·도구·전산·청구팩스…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
          </div>
          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
              {loaded ? "결과 없음" : "불러오는 중…"}
            </Command.Empty>
            {["보험사", "도구"].map((g) => {
              const group = items.filter((i) => i.group === g);
              if (group.length === 0) return null;
              return (
                <Command.Group
                  key={g}
                  heading={g}
                  className="px-1 pb-2 text-[11px] font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1"
                >
                  {group.map((item) => (
                    <Command.Item
                      key={`${g}-${item.title}-${item.href}`}
                      value={`${item.title} ${item.subtitle || ""}`}
                      onSelect={() => go(item)}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground aria-selected:bg-accent"
                    >
                      {g === "보험사" ? (
                        <Building2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Wrench className="h-4 w-4 text-primary" />
                      )}
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {item.subtitle}
                        </span>
                      )}
                      {item.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
