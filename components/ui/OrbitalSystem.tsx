"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

// Distribute skills across 3 orbits based on size
const orbitConfig = [
  { radius: 100, speed: 40, items: skills.filter((s) => s.size === "lg") },   // Inner orbit — large skills
  { radius: 155, speed: 55, items: skills.filter((s) => s.size === "md") },   // Mid orbit
  { radius: 210, speed: 75, items: skills.filter((s) => s.size === "sm") },   // Outer orbit — small skills
];

const sizeMap = { sm: 42, md: 50, lg: 58 };

export function OrbitalSystem() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);
  const [paused, setPaused] = useState(false);

  function handleClick(skill: Skill) {
    setSelected(selected?.name === skill.name ? null : skill);
    setPaused(selected?.name === skill.name ? false : true);
  }

  return (
    <div>
      <div
        className="relative mx-auto w-full max-w-[500px]"
        style={{ height: 500 }}
      >
        {/* Orbit ring lines */}
        {orbitConfig.map(({ radius }) => (
          <div
            key={radius}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-card-border/20"
            style={{ width: radius * 2, height: radius * 2 }}
          />
        ))}

        {/* Center photo */}
        <div className="absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-[2px] shadow-lg shadow-accent-violet/30">
          <div className="h-full w-full overflow-hidden rounded-full">
            <img
              src="/images/tom.jpg"
              alt="Tom Hubert"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Glow effect behind photo */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-2xl"
          style={{
            width: 120,
            height: 120,
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          }}
        />

        {/* Orbiting bubbles */}
        {orbitConfig.map(({ radius, speed, items }) =>
          items.map((skill, i) => {
            const angle = (360 / items.length) * i;
            const size = sizeMap[skill.size];
            const isSelected = selected?.name === skill.name;

            return (
              <div
                key={skill.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 0,
                  height: 0,
                  animation: paused ? "none" : `orbit-spin ${speed}s linear infinite`,
                  animationDelay: `${-(speed / items.length) * i}s`,
                }}
              >
                <motion.button
                  onClick={() => handleClick(skill)}
                  className="absolute flex items-center justify-center rounded-full border text-center"
                  style={{
                    width: size,
                    height: size,
                    left: -size / 2,
                    top: -size / 2,
                    transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
                    backgroundColor: isSelected ? skill.color + "25" : skill.color + "12",
                    borderColor: isSelected ? skill.color + "60" : skill.color + "25",
                    boxShadow: isSelected ? `0 0 24px ${skill.color}40` : "none",
                    // Counter-rotate to keep text upright
                    animation: paused ? "none" : `orbit-counter-spin ${speed}s linear infinite`,
                    animationDelay: `${-(speed / items.length) * i}s`,
                  }}
                  animate={{
                    scale: isSelected ? 1.3 : 1,
                    zIndex: isSelected ? 20 : 1,
                  }}
                  whileHover={{ scale: isSelected ? 1.3 : 1.15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className="leading-none"
                      style={{ color: skill.color, fontSize: skill.size === "lg" ? 14 : 12 }}
                    >
                      {skill.icon.length <= 2 ? (
                        <span className="font-bold">{skill.icon}</span>
                      ) : (
                        skill.icon
                      )}
                    </span>
                    <span
                      className="mt-0.5 leading-none"
                      style={{ color: skill.color, fontSize: 7 }}
                    >
                      {skill.name}
                    </span>
                  </div>
                </motion.button>
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
              <span
                className="text-lg font-bold"
                style={{ color: selected.color }}
              >
                {selected.name}
              </span>
              <span className="rounded-md bg-surface px-2 py-0.5 text-xs text-text-muted">
                {selected.yearsOfExperience} years
              </span>
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              {t(selected.descriptionKey)}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {selected.subSkills.map((sub) => (
                <span
                  key={sub}
                  className="rounded-md px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: selected.color + "15",
                    color: selected.color,
                  }}
                >
                  {sub}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orbital animation keyframes */}
      <style jsx global>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-counter-spin {
          from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg); }
          to { transform: rotate(-360deg) translateX(var(--radius)) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
