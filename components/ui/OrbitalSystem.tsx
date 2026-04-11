"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

const orbits = [
  { radius: 105, speed: 45, items: skills.filter((s) => s.size === "lg") },
  { radius: 160, speed: 60, items: skills.filter((s) => s.size === "md") },
  { radius: 215, speed: 80, items: skills.filter((s) => s.size === "sm") },
];

const sizeMap = { sm: 42, md: 50, lg: 58 };

export function OrbitalSystem() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);

  function handleClick(skill: Skill) {
    setSelected(selected?.name === skill.name ? null : skill);
  }

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[500px]" style={{ height: 500 }}>
        {/* Orbit rings */}
        {orbits.map(({ radius }) => (
          <div
            key={radius}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-card-border/20"
            style={{ width: radius * 2, height: radius * 2 }}
          />
        ))}

        {/* Glow */}
        <div
          className="absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{ width: 140, height: 140, background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
        />

        {/* Center photo */}
        <div className="absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-[2px] shadow-lg shadow-accent-violet/30">
          <div className="h-full w-full overflow-hidden rounded-full">
            <img src="/images/tom.jpg" alt="Tom Hubert" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Orbiting skills */}
        {orbits.map(({ radius, speed, items }) =>
          items.map((skill, i) => {
            const startAngle = (360 / items.length) * i;
            const size = sizeMap[skill.size];
            const isSelected = selected?.name === skill.name;
            const animClass = `orbit-${radius}`;

            return (
              <div
                key={skill.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 0,
                  height: 0,
                  animation: isSelected ? "none" : `${animClass} ${speed}s linear infinite`,
                  animationDelay: `${-((speed / items.length) * i)}s`,
                }}
              >
                {/* The bubble is positioned at radius distance, then counter-rotated */}
                <div
                  style={{
                    position: "absolute",
                    left: -size / 2,
                    top: -(radius + size / 2),
                    width: size,
                    height: size,
                    animation: isSelected ? "none" : `${animClass}-reverse ${speed}s linear infinite`,
                    animationDelay: `${-((speed / items.length) * i)}s`,
                  }}
                >
                  <motion.button
                    onClick={() => handleClick(skill)}
                    className="flex h-full w-full items-center justify-center rounded-full border text-center"
                    style={{
                      backgroundColor: isSelected ? skill.color + "25" : skill.color + "12",
                      borderColor: isSelected ? skill.color + "60" : skill.color + "25",
                      boxShadow: isSelected ? `0 0 24px ${skill.color}40` : "none",
                    }}
                    animate={{ scale: isSelected ? 1.4 : 1, zIndex: isSelected ? 20 : 1 }}
                    whileHover={{ scale: isSelected ? 1.4 : 1.15 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="leading-none" style={{ color: skill.color, fontSize: skill.size === "lg" ? 14 : 12 }}>
                        {skill.icon.length <= 2 ? <span className="font-bold">{skill.icon}</span> : skill.icon}
                      </span>
                      <span className="mt-0.5 leading-none" style={{ color: skill.color, fontSize: 7 }}>
                        {skill.name}
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail panel */}
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

      <style jsx global>{`
        @keyframes orbit-105 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-105-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes orbit-160 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-160-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes orbit-215 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-215-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
