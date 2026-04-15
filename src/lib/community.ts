import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";

export type Post = {
  id: string;
  nickname: string;
  title: string;
  body: string;
  createdAt: number;
  views: number;
  ip?: string;
};

export type Comment = {
  id: string;
  postId: string;
  nickname: string;
  body: string;
  createdAt: number;
  ip?: string;
};

export function ipTag(ip: string) {
  const hash = crypto.createHash("sha1").update(ip + "woosu").digest("hex");
  return hash.slice(0, 6).toUpperCase();
}

export function sanitize(s: string, max = 10000) {
  return String(s || "").slice(0, max).replace(/\r\n/g, "\n");
}

export function formatTime(t: number) {
  const d = new Date(t);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear().toString().slice(2)}.${pad(d.getMonth() + 1)}.${pad(
    d.getDate()
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function tsToMs(v: unknown): number {
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "number") return v;
  return Date.now();
}

// ─── 로컬 JSON 폴백 (Firebase 미설정 시 dev 전용) ───
const FILE = path.join(process.cwd(), "data", "community.json");
type LocalStore = { posts: Post[]; comments: Comment[] };
function loadLocal(): LocalStore {
  if (!fs.existsSync(FILE)) return { posts: [], comments: [] };
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { posts: [], comments: [] };
  }
}
function saveLocal(s: LocalStore) {
  fs.writeFileSync(FILE, JSON.stringify(s, null, 2), "utf8");
}

// ─── listPosts ───
export async function listPosts(q?: string) {
  if (isFirebaseConfigured()) {
    const db = getDb();
    const snap = await getDocs(
      query(collection(db, "posts"), orderBy("createdAt", "desc"))
    );
    const posts: (Post & { commentCount: number })[] = [];
    for (const d of snap.docs) {
      const data = d.data();
      const csnap = await getDocs(collection(db, "posts", d.id, "comments"));
      posts.push({
        id: d.id,
        nickname: data.nickname,
        title: data.title,
        body: data.body,
        createdAt: tsToMs(data.createdAt),
        views: data.views || 0,
        ip: data.ip,
        commentCount: csnap.size,
      });
    }
    if (q) {
      const t = q.toLowerCase();
      return posts.filter(
        (p) =>
          p.title.toLowerCase().includes(t) || p.body.toLowerCase().includes(t)
      );
    }
    return posts;
  }
  // 로컬 폴백
  const s = loadLocal();
  let posts = [...s.posts].sort((a, b) => b.createdAt - a.createdAt);
  if (q) {
    const t = q.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(t) || p.body.toLowerCase().includes(t)
    );
  }
  return posts.map((p) => ({
    ...p,
    commentCount: s.comments.filter((c) => c.postId === p.id).length,
  }));
}

// ─── getPost ───
export async function getPost(id: string) {
  if (isFirebaseConfigured()) {
    const db = getDb();
    const ref = doc(db, "posts", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    // 조회수 +1 (best-effort)
    updateDoc(ref, { views: increment(1) }).catch(() => {});
    const data = snap.data();
    const post: Post = {
      id: snap.id,
      nickname: data.nickname,
      title: data.title,
      body: data.body,
      createdAt: tsToMs(data.createdAt),
      views: (data.views || 0) + 1,
      ip: data.ip,
    };
    const csnap = await getDocs(
      query(collection(db, "posts", id, "comments"), orderBy("createdAt", "asc"))
    );
    const comments: Comment[] = csnap.docs.map((d) => {
      const c = d.data();
      return {
        id: d.id,
        postId: id,
        nickname: c.nickname,
        body: c.body,
        createdAt: tsToMs(c.createdAt),
        ip: c.ip,
      };
    });
    return { post, comments };
  }
  // 로컬
  const s = loadLocal();
  const post = s.posts.find((p) => p.id === id);
  if (!post) return null;
  post.views = (post.views || 0) + 1;
  saveLocal(s);
  const comments = s.comments
    .filter((c) => c.postId === id)
    .sort((a, b) => a.createdAt - b.createdAt);
  return { post, comments };
}

// ─── createPost ───
export async function createPost(input: {
  nickname?: string;
  title: string;
  body: string;
  ip: string;
}) {
  const tag = ipTag(input.ip);
  const title = sanitize(input.title, 120).trim();
  const body = sanitize(input.body, 10000);
  const nickname =
    (input.nickname && sanitize(input.nickname, 20).trim()) || `ㅇㅇ(${tag})`;
  if (!title || !body) return null;

  if (isFirebaseConfigured()) {
    const db = getDb();
    const ref = await addDoc(collection(db, "posts"), {
      title,
      body,
      nickname,
      ip: tag,
      views: 0,
      createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      title,
      body,
      nickname,
      ip: tag,
      views: 0,
      createdAt: Date.now(),
    } as Post;
  }
  // 로컬
  const s = loadLocal();
  const post: Post = {
    id: crypto.randomBytes(5).toString("hex"),
    title,
    body,
    nickname,
    createdAt: Date.now(),
    views: 0,
    ip: tag,
  };
  s.posts.unshift(post);
  saveLocal(s);
  return post;
}

// ─── createComment ───
export async function createComment(input: {
  postId: string;
  nickname?: string;
  body: string;
  ip: string;
}) {
  const tag = ipTag(input.ip);
  const body = sanitize(input.body, 2000).trim();
  const nickname =
    (input.nickname && sanitize(input.nickname, 20).trim()) || `ㅇㅇ(${tag})`;
  if (!body) return null;

  if (isFirebaseConfigured()) {
    const db = getDb();
    const parent = await getDoc(doc(db, "posts", input.postId));
    if (!parent.exists()) return null;
    const ref = await addDoc(
      collection(db, "posts", input.postId, "comments"),
      {
        body,
        nickname,
        ip: tag,
        createdAt: serverTimestamp(),
      }
    );
    return {
      id: ref.id,
      postId: input.postId,
      body,
      nickname,
      ip: tag,
      createdAt: Date.now(),
    } as Comment;
  }
  // 로컬
  const s = loadLocal();
  if (!s.posts.find((p) => p.id === input.postId)) return null;
  const c: Comment = {
    id: crypto.randomBytes(4).toString("hex"),
    postId: input.postId,
    body,
    nickname,
    createdAt: Date.now(),
    ip: tag,
  };
  s.comments.push(c);
  saveLocal(s);
  return c;
}
