import type { NextRequest } from "next/server";

// Vercel overwrites x-forwarded-for at its edge and strips client-supplied
// values (see https://vercel.com/docs/edge-network/headers/request-headers).
// x-vercel-forwarded-for is preferred because it cannot be contaminated even
// when another proxy (e.g. Cloudflare) sits in front of Vercel.
export function getClientIp(req: NextRequest): string {
  const vercel = req.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "0.0.0.0";
}
