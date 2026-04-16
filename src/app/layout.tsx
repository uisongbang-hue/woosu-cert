import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileTabBar } from "@/components/mobile-tabbar";

const CommandPalette = dynamic(
  () => import("@/components/command-palette").then((m) => m.CommandPalette),
  { ssr: false }
);

export const metadata: Metadata = {
  metadataBase: new URL("https://우수인증설계사.com"),
  title: "우수인증설계사 — 보험 실무 워크스페이스",
  description:
    "보험사 접속·청구 양식·계산기·교육을 한 화면에서. 우수인증설계사 워크스페이스.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "우수인증설계사 워크스페이스",
    title: "우수인증설계사 — 보험 실무 워크스페이스",
    description:
      "보험사 접속·청구 양식·계산기·교육을 한 화면에서. 현장에서 바로 쓰는 실무 도구.",
  },
  twitter: {
    card: "summary_large_image",
    title: "우수인증설계사 — 보험 실무 워크스페이스",
    description: "보험사 접속·청구 양식·계산기·교육을 한 화면에서.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SiteHeader />
          <main className="container pb-24 pt-6 md:pb-12">{children}</main>
          <SiteFooter />
          <MobileTabBar />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
