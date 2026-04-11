"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { setStatus("sent"); form.reset(); } else { setStatus("error"); }
    } catch { setStatus("error"); }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4">
      <input name="name" type="text" required placeholder={t("name")} className="rounded-card border border-card-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none" />
      <input name="email" type="email" required placeholder={t("email")} className="rounded-card border border-card-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none" />
      <textarea name="message" required rows={4} placeholder={t("message")} className="resize-none rounded-card border border-card-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none" />
      <button type="submit" disabled={status === "sending"} className="rounded-pill bg-text-primary px-6 py-3 text-sm font-medium text-bg transition-all hover:scale-105 disabled:opacity-50">
        {status === "sending" ? "..." : status === "sent" ? "✓" : t("send")}
      </button>
      {status === "error" && <p className="text-center text-xs text-red-400">Something went wrong. Try again.</p>}
    </form>
  );
}
