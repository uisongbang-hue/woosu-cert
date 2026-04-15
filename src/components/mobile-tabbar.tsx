"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, FileText, Calculator, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "홈", icon: Home },
  { href: "/insurers", label: "보험사", icon: Building2 },
  { href: "/claim-forms", label: "청구서", icon: FileText },
  { href: "/calculators", label: "계산기", icon: Calculator },
  { href: "/education", label: "교육", icon: GraduationCap },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-between">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] transition",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
