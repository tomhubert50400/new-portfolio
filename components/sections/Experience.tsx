"use client";

import { useTranslations } from "next-intl";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { experiences } from "@/data/experiences";

export function Experience() {
  const t = useTranslations("experience");

  return (
    <section id="experience" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t("title")} />
        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {experiences.map((exp) => (
            <StaggerItem key={exp.company}>
              <ExperienceCard experience={exp} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
