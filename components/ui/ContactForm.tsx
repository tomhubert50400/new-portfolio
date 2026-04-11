"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { executeRecaptcha } = useGoogleReCaptcha();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      let token = "";
      if (executeRecaptcha) {
        token = await executeRecaptcha("contact");
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken: token }),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "rounded-card border border-card-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4">
      <input name="name" type="text" required placeholder={t("name")} className={inputClass} />
      <input name="company" type="text" placeholder={t("company")} className={inputClass} />
      <input name="email" type="email" required placeholder={t("email")} className={inputClass} />
      <textarea name="message" required rows={4} placeholder={t("message")} className={`resize-none ${inputClass}`} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-pill bg-text-primary px-6 py-3 text-sm font-medium text-bg transition-all hover:scale-105 disabled:opacity-50"
      >
        {status === "sending" ? "..." : status === "sent" ? "✓" : t("send")}
      </button>
      {status === "error" && <p className="text-center text-xs text-red-400">Something went wrong. Try again.</p>}
    </form>
  );
}
