import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Local writing tool. `npm run write` → http://localhost:3001
 *
 * Deliberately outside the Next app. `output: "export"` forbids route handlers
 * that write to disk, and anything under `src/app/` would land in `out/` and
 * ship. Living in `scripts/` it cannot reach the published site at all.
 *
 * Binds to loopback only — it writes files, so it must not be reachable from
 * the network.
 */
const PORT = 3001;
const HOST = "127.0.0.1";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content", "blog");
const ASSETS = path.join(ROOT, "public", "blog-assets");
const EDITOR = path.join(ROOT, "scripts", "write-editor.html");

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

/** Strips directory parts and anything that would be awkward in a URL. */
function safeName(name) {
  return path
    .basename(String(name))
    .replace(/[^\w.\-가-힣]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function safeSlug(slug) {
  return String(slug)
    .trim()
    .replace(/[^\w\-가-힣]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function json(res, code, body) {
  const data = JSON.stringify(body);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(data);
}

function readBody(req, limit = 25 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// --- posts -----------------------------------------------------------------

function listPosts() {
  if (!fs.existsSync(CONTENT)) return [];
  return fs
    .readdirSync(CONTENT)
    .filter((f) => /\.mdx?$/i.test(f))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT, file), "utf8");
      const title = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? file;
      const date = raw.match(/^date:\s*(.+)$/m)?.[1]?.trim() ?? "";
      const draft = /^draft:\s*true\s*$/m.test(raw);
      return { slug: file.replace(/\.mdx?$/i, ""), title, date, draft };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Splits a post into its frontmatter fields and body. */
function readPost(slug) {
  const file = path.join(CONTENT, `${slug}.mdx`);
  if (!file.startsWith(CONTENT) || !fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { slug, title: "", summary: "", date: "", tags: "", draft: false, body: raw };

  const [, front, body] = match;
  const field = (name) =>
    front.match(new RegExp(`^${name}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? "";
  const unquote = (v) => v.replace(/^["'](.*)["']$/s, "$1");

  return {
    slug,
    title: unquote(field("title")),
    summary: unquote(field("summary")),
    date: unquote(field("date")),
    tags: field("tags").replace(/^\[|\]$/g, "").trim(),
    draft: field("draft") === "true",
    body: body.replace(/^\n+/, ""),
  };
}

/**
 * Writes a post. `oldSlug` is the name it was loaded under: when the slug has
 * been edited, the previous file is removed instead of being left behind as a
 * duplicate the author never sees.
 */
function writePost({ slug, oldSlug, title, summary, date, tags, draft, body }) {
  const clean = safeSlug(slug);
  if (!clean) throw new Error("슬러그가 비어 있습니다");
  if (!title?.trim()) throw new Error("제목이 필요합니다");
  if (!date?.trim()) throw new Error("날짜가 필요합니다");

  const tagList = String(tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const front = [
    "---",
    `title: ${JSON.stringify(title.trim())}`,
    summary?.trim() ? `summary: ${JSON.stringify(summary.trim())}` : null,
    `date: ${date.trim()}`,
    tagList.length ? `tags: [${tagList.join(", ")}]` : null,
    draft ? "draft: true" : null,
    "---",
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");

  fs.mkdirSync(CONTENT, { recursive: true });
  fs.writeFileSync(path.join(CONTENT, `${clean}.mdx`), `${front}\n${body ?? ""}`);

  const previous = safeSlug(oldSlug ?? "");
  if (previous && previous !== clean) {
    const stale = path.join(CONTENT, `${previous}.mdx`);
    if (stale.startsWith(CONTENT) && fs.existsSync(stale)) fs.rmSync(stale);
  }
  return clean;
}

function deletePost(slug) {
  const clean = safeSlug(slug);
  const file = path.join(CONTENT, `${clean}.mdx`);
  if (!clean || !file.startsWith(CONTENT) || !fs.existsSync(file)) {
    throw new Error("글을 찾을 수 없습니다");
  }
  fs.rmSync(file);
  return clean;
}

// --- images ----------------------------------------------------------------

/**
 * Writes an upload beside the posts and mirrors it into `public/blog-assets/`
 * straight away, so the running dev server picks it up without a restart —
 * the sync script only runs at startup.
 */
function saveImage(name, buffer) {
  const base = safeName(name) || "image.png";
  if (!IMAGE_EXT.test(base)) throw new Error(`이미지 파일이 아닙니다: ${base}`);

  const ext = path.extname(base);
  const stem = base.slice(0, -ext.length);

  let file = base;
  for (let i = 2; fs.existsSync(path.join(CONTENT, file)); i++) {
    file = `${stem}-${i}${ext}`;
  }

  fs.mkdirSync(CONTENT, { recursive: true });
  fs.writeFileSync(path.join(CONTENT, file), buffer);
  fs.mkdirSync(ASSETS, { recursive: true });
  fs.writeFileSync(path.join(ASSETS, file), buffer);

  return file;
}

// --- server ----------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  try {
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync(EDITOR));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/posts") {
      return json(res, 200, { posts: listPosts() });
    }

    if (req.method === "GET" && url.pathname === "/api/post") {
      const post = readPost(safeSlug(url.searchParams.get("slug") ?? ""));
      return post
        ? json(res, 200, post)
        : json(res, 404, { error: "글을 찾을 수 없습니다" });
    }

    if (req.method === "DELETE" && url.pathname === "/api/post") {
      return json(res, 200, { slug: deletePost(url.searchParams.get("slug") ?? "") });
    }

    if (req.method === "POST" && url.pathname === "/api/post") {
      const slug = writePost(JSON.parse((await readBody(req)).toString("utf8")));
      return json(res, 200, { slug });
    }

    if (req.method === "POST" && url.pathname === "/api/upload") {
      const name = req.headers["x-filename"];
      if (!name) return json(res, 400, { error: "x-filename 헤더가 없습니다" });
      const file = saveImage(decodeURIComponent(name), await readBody(req));
      return json(res, 200, { file, markdown: `![](./${file})` });
    }

    // Serve the images themselves so the preview can show them.
    if (req.method === "GET" && url.pathname.startsWith("/blog-assets/")) {
      const file = path.join(CONTENT, safeName(url.pathname.slice(13)));
      if (file.startsWith(CONTENT) && fs.existsSync(file)) {
        res.writeHead(200, { "Cache-Control": "no-store" });
        res.end(fs.readFileSync(file));
        return;
      }
    }

    json(res, 404, { error: "not found" });
  } catch (err) {
    json(res, 400, { error: err.message ?? String(err) });
  }
});

// A raw EADDRINUSE stack trace reads as a crash, and the still-running old
// instance keeps answering — so it looks like the new code simply did nothing.
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n  ✗ 포트 ${PORT}이 이미 사용 중입니다.\n` +
        `    글쓰기 서버가 이미 떠 있는지 확인하세요: http://localhost:${PORT}\n` +
        `    (종료하려면 그 터미널에서 Ctrl+C)\n`,
    );
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, HOST, () => {
  console.log(`\n  ✍  글쓰기  →  http://localhost:${PORT}\n`);
  console.log(`     저장 위치: content/blog/`);
  console.log(`     미리보기 : http://localhost:3000  (npm run dev)\n`);
});
