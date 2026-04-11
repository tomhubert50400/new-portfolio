"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactForm } from "@/components/ui/ContactForm";

export function Contact() {
  const t = useTranslations("contact");
  return (
    <section id="contact" className="relative px-6 py-20" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.03) 100%)" }}>
      <div className="mx-auto max-w-6xl text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-text-primary md:text-5xl">
            {t("title")}<br /><span className="gradient-text">{t("titleHighlight")}</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}><div className="mt-10"><ContactForm /></div></ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex justify-center gap-4">
            {[{ href: "https://github.com", label: "GitHub" }, { href: "https://linkedin.com", label: "LinkedIn" }, { href: "https://twitter.com", label: "X" }].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-card-border px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent-cyan/50 hover:text-text-primary">{link.label}</a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
