import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
const valid = { name: "Visitor", company: "Company", email: "visitor@example.com", message: "Hello", recaptchaToken: "token&with=value" };
function fixture({ env = {}, verification = { success: true, score: 0.9, action: "contact" }, unavailable = false } = {}) {
  const sent = [], requests = [];
  const routeModule = { exports: {} };
  runInNewContext(compiled, {
    module: routeModule, exports: routeModule.exports, Buffer, URLSearchParams, AbortSignal, console,
    process: { env: { GMAIL_USER: "owner@example.com", GMAIL_APP_PASSWORD: "test-only", RECAPTCHA_SECRET_KEY: "test-only", ...env } },
    require: (name) => name === "nodemailer" ? { createTransport: () => ({ sendMail: async (mail) => sent.push(mail) }) } : require(name),
    fetch: async (...args) => { requests.push(args); if (unavailable) throw new Error("offline"); return Response.json(verification); },
  });
  const post = (data) => routeModule.exports.POST(new Request("https://example.com/api/contact", { method: "POST", body: typeof data === "string" ? data : JSON.stringify(data) }));
  return { sent, requests, post };
}

test("rejects malformed JSON, null, arrays, wrong types, empty and overlong fields", async () => {
  for (const data of ["{", null, [], { ...valid, name: {} }, { ...valid, message: " " }, { ...valid, email: "x\r\nBcc: x@y.com" }, { ...valid, company: "x\ny" }, { ...valid, name: "x".repeat(101) }, { ...valid, recaptchaToken: "" }]) {
    const f = fixture();
    assert.equal((await f.post(data)).status, 400);
    assert.equal(f.sent.length, 0);
    assert.equal(f.requests.length, 0);
  }
});
test("bounds the request body independently of Content-Length", async () => {
  const f = fixture();
  assert.equal((await f.post("x".repeat(32769))).status, 413);
  assert.equal(f.sent.length, 0);
});
test("missing credentials fail closed without verification or mail", async () => {
  for (const key of ["RECAPTCHA_SECRET_KEY", "GMAIL_USER", "GMAIL_APP_PASSWORD"]) {
    const f = fixture({ env: { [key]: "" } });
    assert.equal((await f.post(valid)).status, 503);
    assert.equal(f.sent.length, 0);
    assert.equal(f.requests.length, 0);
  }
});
test("requires successful scored CAPTCHA for the contact action", async () => {
  for (const verification of [{ success: false, score: 0.9, action: "contact" }, { success: true, action: "contact" }, { success: true, score: "0.9", action: "contact" }, { success: true, score: 0.49, action: "contact" }, { success: true, score: 0.9, action: "login" }]) {
    const f = fixture({ verification });
    assert.equal((await f.post(valid)).status, 403);
    assert.equal(f.sent.length, 0);
  }
});
test("verification outages do not send mail", async () => {
  const f = fixture({ unavailable: true });
  assert.equal((await f.post(valid)).status, 503);
  assert.equal(f.sent.length, 0);
});
test("valid messages escape HTML, preserve plain text and encode CAPTCHA tokens", async () => {
  const f = fixture();
  const message = '<a href="https://evil.example">click</a>';
  assert.equal((await f.post({ ...valid, name: '<Visitor>', company: 'A & B', message })).status, 200);
  assert.equal(f.sent.length, 1);
  assert.match(f.sent[0].html, /&lt;Visitor&gt;/);
  assert.match(f.sent[0].html, /A &amp; B/);
  assert.match(f.sent[0].html, /&lt;a href=&quot;/);
  assert.ok(!f.sent[0].html.includes(message));
  assert.ok(f.sent[0].text.includes(message));
  assert.equal(f.sent[0].from.address, "owner@example.com");
  assert.equal(f.requests[0][1].body.get("response"), valid.recaptchaToken);
});
