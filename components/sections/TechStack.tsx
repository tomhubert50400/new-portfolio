"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

const topRow = skills.slice(0, 6);
const bottomRow = skills.slice(6);

export function TechStack() {
  const t = useTranslations();
  const tSection = useTranslations("techStack");
  const [selected, setSelected] = useState<Skill | null>(null);

  function handleClick(skill: Skill) {
    setSelected(selected?.name === skill.name ? null : skill);
  }

  return (
    <section id="techStack" className="py-20 overflow-hidden">
      <div className="px-6">
        <SectionHeader title={tSection("title")} subtitle={tSection("subtitle")} centered />
      </div>

      {/* Desktop: double marquee */}
      <div className="hidden md:block">
        {/* Row 1 — scrolls left */}
        <MarqueeRow skills={topRow} direction="left" speed={30} selected={selected} onSelect={handleClick} />

        {/* Row 2 — scrolls right */}
        <MarqueeRow skills={bottomRow} direction="right" speed={35} selected={selected} onSelect={handleClick} />

        {/* Detail panel */}
        <div className="px-6">
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mx-auto mt-8 max-w-md rounded-card border border-card-border bg-card p-5 text-center"
              >
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
      </div>

      {/* Mobile: grid fallback */}
      <div className="md:hidden px-6">
        <MobileSkillGrid />
      </div>
    </section>
  );
}

function MarqueeRow({ skills: items, direction, speed, selected, onSelect }: {
  skills: Skill[];
  direction: "left" | "right";
  speed: number;
  selected: Skill | null;
  onSelect: (s: Skill) => void;
}) {
  const anim = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="relative mb-3 group/marquee">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-bg to-transparent" />
      <div
        className="flex gap-3 group-hover/marquee:[animation-play-state:paused]"
        style={{ animation: `${anim} ${speed}s linear infinite`, width: "max-content" }}
      >
        {/* Repeat 3x to ensure seamless loop on wide screens */}
        {[...items, ...items, ...items].map((skill, i) => (
          <SkillBadge
            key={`${skill.name}-${i}`}
            skill={skill}
            isSelected={selected?.name === skill.name}
            onClick={() => onSelect(skill)}
          />
        ))}
      </div>
    </div>
  );
}

function SkillBadge({ skill, isSelected, onClick }: { skill: Skill; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-shrink-0 items-center gap-2.5 rounded-xl border px-5 py-3 transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: isSelected ? skill.color + "15" : skill.color + "08",
        borderColor: isSelected ? skill.color + "50" : skill.color + "20",
        boxShadow: isSelected ? `0 0 20px ${skill.color}25` : "none",
      }}
    >
      <span className="text-lg leading-none">
        {skill.icon.length <= 2 ? (
          <span className="text-sm font-bold" style={{ color: skill.color }}>{skill.icon}</span>
        ) : (
          skill.icon
        )}
      </span>
      <div className="text-left">
        <div className="text-sm font-semibold" style={{ color: skill.color }}>{skill.name}</div>
        <div className="text-[10px] text-text-muted">{skill.yearsOfExperience} years</div>
      </div>
    </button>
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
