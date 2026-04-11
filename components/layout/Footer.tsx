"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-card-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-text-muted">{t("copyright")}</p>
        <div className="flex items-center gap-6">
          <div className="flex gap-3">
            {["GitHub", "LinkedIn", "X"].map((name) => (
              <a key={name} href="#" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted transition-colors hover:text-text-primary">{name}</a>
            ))}
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
