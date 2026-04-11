"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SkillBubble } from "./SkillBubble";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

const positions = [
  { top: "22%", left: "70%" }, { top: "5%", left: "42%" }, { top: "12%", left: "14%" },
  { top: "50%", left: "2%" }, { top: "75%", left: "15%" }, { top: "82%", left: "42%" },
  { top: "75%", left: "70%" }, { top: "50%", left: "88%" }, { top: "30%", left: "92%" },
  { top: "62%", left: "92%" }, { top: "38%", left: "5%" }, { top: "88%", left: "60%" },
];

export function OrbitalSystem() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);

  function handleClick(skill: Skill) {
    setSelected(selected?.name === skill.name ? null : skill);
  }

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        {[200, 300, 400].map((size) => (
          <div key={size} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-card-border/30" style={{ width: size, height: size }} />
        ))}
        <div className="absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-0.5 shadow-lg shadow-accent-cyan/20">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-bg text-xl font-extrabold text-text-primary">TH</div>
        </div>
        {skills.map((skill, i) => (
          <SkillBubble key={skill.name} skill={skill} isSelected={selected?.name === skill.name} onClick={() => handleClick(skill)} style={positions[i] ? { top: positions[i].top, left: positions[i].left } : undefined} />
        ))}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className="mx-auto mt-8 max-w-md rounded-card border border-card-border bg-card p-5 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{selected.icon}</span>
              <span className="text-lg font-bold" style={{ color: selected.color }}>{selected.name}</span>
              <span className="rounded-md bg-surface px-2 py-0.5 text-xs text-text-muted">{selected.yearsOfExperience} years</span>
            </div>
            <p className="mt-3 text-sm text-text-secondary">{t(selected.descriptionKey)}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {selected.subSkills.map((sub) => (
                <span key={sub} className="rounded-md px-2 py-0.5 text-xs" style={{ backgroundColor: selected.color + "15", color: selected.color }}>{sub}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
