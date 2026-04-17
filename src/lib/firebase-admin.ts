import fs from "node:fs";
import path from "node:path";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function loadCredential() {
  const jsonEnv = process.env.FIREBASE_ADMIN_SA_JSON;
  if (jsonEnv) {
    try {
      return JSON.parse(jsonEnv);
    } catch {
      throw new Error("FIREBASE_ADMIN_SA_JSON is not valid JSON");
    }
  }
  const rawPath =
    process.env.FIREBASE_ADMIN_SA_PATH || "secrets/firebase-admin.json";
  const abs = path.isAbsolute(rawPath)
    ? rawPath
    : path.join(process.cwd(), rawPath);
  if (!fs.existsSync(abs)) return null;
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch {
    throw new Error(`Service account JSON at ${abs} is malformed`);
  }
}

export function isAdminConfigured(): boolean {
  try {
    return loadCredential() !== null;
  } catch {
    return false;
  }
}

export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;
  if (!adminApp) {
    const existing = getApps().find((a) => a.name === "admin");
    if (existing) {
      adminApp = existing;
    } else {
      const sa = loadCredential();
      if (!sa)
        throw new Error(
          "Firebase Admin SDK credential missing. Set FIREBASE_ADMIN_SA_PATH or FIREBASE_ADMIN_SA_JSON."
        );
      adminApp = initializeApp({ credential: cert(sa) }, "admin");
    }
  }
  adminDb = getFirestore(adminApp);
  return adminDb;
}
