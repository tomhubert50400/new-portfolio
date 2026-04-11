"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const stats = [
  { value: "6", labelKey: "stats.years", color: "text-accent-cyan" },
  { value: "10+", labelKey: "stats.projects", color: "text-accent-violet" },
  { value: "3", labelKey: "stats.languages", color: "text-accent-pink" },
];

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t("title")} />
        <div className="flex flex-col items-center gap-10 md:flex-row">
          <ScrollReveal className="flex-shrink-0">
            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-0.5">
              <div className="h-full w-full overflow-hidden rounded-2xl">
                <img src="/images/tom2.jpg" alt="Tom Hubert" className="h-full w-full object-cover object-[center_25%] scale-150" />
              </div>
            </div>
          </ScrollReveal>
          <div className="flex-1">
            <ScrollReveal>
              <p className="max-w-lg text-text-secondary leading-relaxed">{t("bio")}</p>
            </ScrollReveal>
            <StaggerContainer className="mt-8 flex gap-10">
              {stats.map((stat) => (
                <StaggerItem key={stat.labelKey}>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="mt-1 text-xs text-text-muted">{t(stat.labelKey)}</div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
