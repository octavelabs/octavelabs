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
const allowedServices = [
  "Web Development",
  "Mobile Development",
  "UI/UX & Brand Design",
  "Product Strategy",
  "Let’s explore together",
];
const allowedPlans = ["Not sure yet", "Starter", "Growth", "Scale"];
const rates = new Map();
export function createServer({
  env = process.env,
  send = fetch,
  root = path.join(directory, "src"),
} = {}) {
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
    if (url.pathname === "/api/bookings") {
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return json(405, { error: "Use POST to submit an enquiry." });
      }
      const origin = req.headers.origin;
      if (origin) {
        try {
          if (new URL(origin).host !== req.headers.host)
            return json(403, { error: "This request is not allowed." });
        } catch {
          return json(403, { error: "This request is not allowed." });
        }
      }
      if (!req.headers["content-type"]?.startsWith("application/json"))
        return json(415, { error: "Please submit the enquiry as JSON." });
      const key = req.socket.remoteAddress;
      const now = Date.now();
      for (const [ip, entry] of rates) {
        if (now - entry.start > 600000) rates.delete(ip);
      }
      let entry = rates.get(key) || { start: now, count: 0 };
      if (++entry.count > 10)
        return json(429, {
          error: "Too many attempts. Please try again in a few minutes.",
        });
      rates.set(key, entry);
      let raw = "";
      try {
        for await (const chunk of req) {
          raw += chunk;
          if (Buffer.byteLength(raw) > 16384)
            return json(413, { error: "Your message is too long." });
        }
      } catch {
        return json(400, { error: "We couldn’t read your enquiry." });
      }
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return json(400, { error: "Please check your enquiry and try again." });
      }
      if (!data || typeof data !== "object" || Array.isArray(data))
        return json(400, { error: "Please check your enquiry." });
      if (data.website)
        return json(400, { error: "Unable to submit this enquiry." });
      const name = typeof data.name === "string" ? data.name.trim() : "";
      const email = typeof data.email === "string" ? data.email.trim() : "";
      const message =
        typeof data.message === "string" ? data.message.trim() : "";
      if (
        !name ||
        name.length > 100 ||
        /[\r\n]/.test(name) ||
        email.length > 254 ||
        !/^\S+@[^\s@]+\.[^\s@]+$/.test(email) ||
        message.length < 10 ||
        message.length > 5000 ||
        !allowedServices.includes(data.service) ||
        !allowedPlans.includes(data.plan)
      )
        return json(422, {
          error:
            "Please enter your name, a valid email, and a project description of at least 10 characters.",
        });
      if (
        !env.RESEND_API_KEY ||
        !env.RESEND_FROM_EMAIL ||
        !env.BOOKING_TO_EMAIL
      )
        return json(503, {
          error:
            "Our enquiry form is temporarily unavailable. Please email clinton@octavelabs.co directly.",
        });
      const idempotency = req.headers["idempotency-key"];
      if (idempotency && !/^[a-zA-Z0-9-]{16,80}$/.test(idempotency))
        return json(400, { error: "Invalid submission identifier." });
      try {
        const result = await send("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
            ...(idempotency
              ? { "Idempotency-Key": `booking-${idempotency}` }
              : {}),
          },
          body: JSON.stringify({
            from: env.RESEND_FROM_EMAIL,
            to: [env.BOOKING_TO_EMAIL],
            reply_to: email,
            subject: `New enquiry — ${data.service} / ${data.plan}`,
            text: `New Octave labs enquiry\n\nName: ${name}\nEmail: ${email}\nService: ${data.service}\nPackage: ${data.plan}\n\nProject details:\n${message}\n`,
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (!result.ok) {
          console.error("Resend rejected a booking email:", result.status);
          return json(502, {
            error:
              "We couldn’t send your enquiry. Please retry, or email clinton@octavelabs.co directly.",
          });
        }
        const sent = await result.json();
        if (!sent.id)
          return json(502, {
            error: "We couldn’t confirm delivery. Please retry.",
          });
        return json(200, { ok: true });
      } catch {
        return json(502, {
          error:
            "The email service is unavailable. Please retry, or email clinton@octavelabs.co directly.",
        });
      }
    }
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
