import { createBookingHandler } from "./lib/bookings.mjs";
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const directory = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(path.join(directory, ".env"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
export function createServer({
  env = process.env,
  send = fetch,
  root = path.join(directory, "src"),
} = {}) {
  const bookingHandler = createBookingHandler({ env, send });
  return http.createServer(async (req, res) => {
    const json = (status, data) => {
      res.writeHead(status, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(JSON.stringify(data));
    };
    let url;
    try {
      url = new URL(req.url, "http://localhost");
    } catch {
      return json(400, { error: "Invalid request." });
    }
    if (url.pathname === "/api/bookings") return bookingHandler(req, res);
    if (!["GET", "HEAD"].includes(req.method))
      return json(405, { error: "Method not allowed." });
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return json(400, { error: "Invalid path." });
    }
    const file = path.resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (
      !file.startsWith(root + path.sep) ||
      pathname.split("/").some((p) => p.startsWith("."))
    )
      return json(404, { error: "Not found." });
    try {
      const info = await stat(file);
      if (!info.isFile()) return json(404, { error: "Not found." });
      const types = {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".woff2": "font/woff2",
        ".json": "application/json",
      };
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Cache-Control": "no-cache",
      });
      res.end(req.method === "HEAD" ? undefined : await readFile(file));
    } catch {
      return json(404, { error: "Not found." });
    }
  });
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 3000);
  const server = createServer({
    root:
      process.env.NODE_ENV === "production"
        ? path.join(directory, "dist")
        : path.join(directory, "src"),
  });
  server.listen(port, process.env.HOST || "127.0.0.1", () =>
    console.log(`Octave labs — http://localhost:${port}`),
  );
}
