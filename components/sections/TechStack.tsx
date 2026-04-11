"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { OrbitalSystem } from "@/components/ui/OrbitalSystem";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

export function TechStack() {
  const t = useTranslations("techStack");
  return (
    <section id="techStack" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} centered />
        <ScrollReveal className="hidden md:block"><OrbitalSystem /></ScrollReveal>
        <div className="md:hidden"><MobileSkillGrid /></div>
      </div>
    </section>
  );
}

function MobileSkillGrid() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);
  return (
    <div>
      <StaggerContainer className="grid grid-cols-3 gap-3">
        {skills.map((skill) => (
          <StaggerItem key={skill.name}>
            <button onClick={() => setSelected(selected?.name === skill.name ? null : skill)}
              className="flex w-full flex-col items-center gap-1 rounded-card border p-4 text-center transition-colors"
              style={{ borderColor: selected?.name === skill.name ? skill.color + "60" : "#2e2e38", backgroundColor: selected?.name === skill.name ? skill.color + "10" : "#22222a" }}>
              <span className="text-lg">{skill.icon}</span>
              <span className="text-xs text-text-secondary">{skill.name}</span>
            </button>
          </StaggerItem>
        ))}
      </StaggerContainer>
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-4 rounded-card border border-card-border bg-card p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{selected.icon}</span>
              <span className="font-bold" style={{ color: selected.color }}>{selected.name}</span>
              <span className="text-xs text-text-muted">{selected.yearsOfExperience}y</span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{t(selected.descriptionKey)}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {selected.subSkills.map((sub) => (<span key={sub} className="rounded-md px-2 py-0.5 text-xs" style={{ backgroundColor: selected.color + "15", color: selected.color }}>{sub}</span>))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
