import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "우수인증설계사 — 보험 실무 워크스페이스";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0b1220 0%, #111827 55%, #1e3a8a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#93c5fd",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              background: "#3b82f6",
            }}
          />
          우수인증설계사
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          보험 실무 워크스페이스
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#cbd5e1",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          보험사 접속 · 청구 양식 · 계산기 · 교육 자료까지
          <br />한 화면에서 바로 쓰는 현장 도구
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 26,
            color: "#94a3b8",
          }}
        >
          <div>우수인증설계사.com</div>
          <div style={{ color: "#60a5fa", fontWeight: 600 }}>⌘K 로 빠른 검색</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
