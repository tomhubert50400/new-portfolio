import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32_768) {
        await reader.cancel();
        return NextResponse.json({ error: "Request too large" }, { status: 413 });
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }
  const fields = body as Record<string, unknown>;
  const limits = { name: 100, company: 200, email: 254, message: 5000, recaptchaToken: 4096 };
  for (const [field, limit] of Object.entries(limits)) {
    const value = fields[field];
    if (field === "company" && value === undefined) continue;
    if (typeof value !== "string" || value.length > limit || (field !== "company" && !value.trim())) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
  }
  const name = (fields.name as string).trim();
  const company = ((fields.company as string | undefined) ?? "").trim();
  const email = (fields.email as string).trim();
  const message = (fields.message as string).trim();
  const recaptchaToken = fields.recaptchaToken as string;
  if (!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email) || /[\r\n]/.test(name + company)) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  // Never silently accept unverified submissions when configuration is missing.
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: "Contact service unavailable" }, { status: 503 });
  }

  try {
    const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: recaptchaToken }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!recaptchaRes.ok) throw new Error("Verification unavailable");
    const recaptchaData = await recaptchaRes.json();
    if (
      recaptchaData.success !== true ||
      typeof recaptchaData.score !== "number" ||
      !Number.isFinite(recaptchaData.score) ||
      recaptchaData.score < 0.5 ||
      recaptchaData.action !== "contact"
    ) {
      return NextResponse.json({ error: "reCAPTCHA failed" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Verification unavailable" }, { status: 503 });
  }

  try {
    const companyLine = company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : "";
    const companyText = company ? ` (${company})` : "";

    await transporter.sendMail({
      from: { name, address: process.env.GMAIL_USER },
      replyTo: email,
      to: process.env.GMAIL_USER,
      subject: `Portfolio Contact — ${name}${companyText}`,
      text: `From: ${name}${companyText} (${email})\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #06b6d4;">New message from your portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          ${companyLine}
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}
