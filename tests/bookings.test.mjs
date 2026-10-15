import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../server.mjs";
const good = {
  name: "Website test",
  email: "test@example.com",
  message: "A new website for our business.",
  service: "Web Development",
  plan: "Growth",
  website: "",
};
async function withServer(options, fn) {
  const server = createServer(options);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((r) => server.close(r));
  }
}
test("valid enquiry uses fixed recipient, visitor reply-to and idempotency key", async () => {
  let called = 0;
  await withServer(
    {
      env: {
        RESEND_API_KEY: "test-key",
        RESEND_FROM_EMAIL: "Octave labs <bookings@octavelabs.co>",
        BOOKING_TO_EMAIL: "clinton@octavelabs.co",
      },
      send: async (url, options) => {
        called++;
        assert.equal(url, "https://api.resend.com/emails");
        const payload = JSON.parse(options.body);
        assert.deepEqual(payload.to, ["clinton@octavelabs.co"]);
        assert.equal(payload.reply_to, good.email);
        assert.match(payload.text, /A new website/);
        assert.equal(
          options.headers["Idempotency-Key"],
          "booking-12345678-1234-1234-1234-123456789abc",
        );
        return Response.json({ id: "test-email-id" });
      },
    },
    async (url) => {
      const result = await fetch(url + "/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": "12345678-1234-1234-1234-123456789abc",
        },
        body: JSON.stringify({ ...good, to: "attacker@example.com" }),
      });
      assert.equal(result.status, 200);
      assert.deepEqual(await result.json(), { ok: true });
      assert.equal(called, 1);
    },
  );
});
test("rejects invalid enquiries before invoking Resend", async () => {
  await withServer(
    {
      env: {},
      send: () => {
        throw Error("Should not be called");
      },
    },
    async (url) => {
      for (const body of [
        { ...good, email: "invalid" },
        { ...good, message: "short" },
        { ...good, service: "unknown" },
        { ...good, website: "spam" },
      ]) {
        const r = await fetch(url + "/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        assert.ok([400, 422].includes(r.status));
      }
    },
  );
});
test("missing credentials and provider failure never report success", async () => {
  await withServer({ env: {} }, async (url) => {
    const r = await fetch(url + "/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(good),
    });
    assert.equal(r.status, 503);
    assert.match((await r.json()).error, /clinton@octavelabs.co/);
  });
  await withServer(
    {
      env: {
        RESEND_API_KEY: "test",
        RESEND_FROM_EMAIL: "test@example.com",
        BOOKING_TO_EMAIL: "test@example.com",
      },
      send: async () => new Response("", { status: 429 }),
    },
    async (url) => {
      const r = await fetch(url + "/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(good),
      });
      assert.equal(r.status, 502);
    },
  );
});
test("blocks cross-origin submissions and private files", async () => {
  await withServer({ env: {} }, async (url) => {
    const r = await fetch(url + "/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://unrelated.example",
      },
      body: JSON.stringify(good),
    });
    assert.equal(r.status, 403);
    for (const file of ["/.env", "/server.mjs", "/package.json"])
      assert.equal((await fetch(url + file)).status, 404);
    assert.equal((await fetch(url + "/")).status, 200);
  });
});
