"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const locales = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "kr", label: "KR" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex gap-1">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            locale === code
              ? "bg-accent-cyan/20 text-accent-cyan"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
