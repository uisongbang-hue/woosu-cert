import { NextResponse } from "next/server";
import { getInsurers, getTools } from "@/lib/data";

export const dynamic = "force-dynamic";

export type SearchItem = {
  group: "보험사" | "도구";
  title: string;
  subtitle?: string;
  href: string;
  external?: boolean;
};

export async function GET() {
  const [insurers, tools] = await Promise.all([getInsurers(), getTools()]);
  const items: SearchItem[] = [
    ...insurers.map<SearchItem>((i) => ({
      group: "보험사",
      title: i.name_ko,
      subtitle: i.category,
      href: `/insurers/${i.slug}`,
    })),
    ...tools.map<SearchItem>((t) => ({
      group: "도구",
      title: t.title,
      subtitle: t.category,
      href: t.url,
      external: true,
    })),
  ];
  return NextResponse.json({ items });
}
