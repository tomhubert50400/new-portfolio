"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

const orbits = [
  { radius: 110, speedRange: [35, 50], items: skills.filter((s) => s.size === "lg") },
  { radius: 170, speedRange: [50, 70], items: skills.filter((s) => s.size === "md") },
  { radius: 225, speedRange: [65, 90], items: skills.filter((s) => s.size === "sm") },
];

const sizeMap = { sm: 48, md: 56, lg: 64 };

// Seeded random so positions are stable per skill but look random
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return ((hash & 0x7fffffff) % 1000) / 1000;
}

export function OrbitalSystem() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);

  // Generate stable random speeds and start offsets per skill
  const skillConfigs = useMemo(() => {
    const configs: Record<string, { speed: number; startOffset: number }> = {};
    orbits.forEach(({ speedRange, items }) => {
      items.forEach((skill) => {
        const r1 = seededRandom(skill.name + "speed");
        const r2 = seededRandom(skill.name + "offset");
        const speed = speedRange[0] + r1 * (speedRange[1] - speedRange[0]);
        const startOffset = r2 * speed; // random point in the cycle
        configs[skill.name] = { speed, startOffset };
      });
    });
    return configs;
  }, []);

  function handleClick(skill: Skill) {
    setSelected(selected?.name === skill.name ? null : skill);
  }

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[520px]" style={{ height: 520 }}>
        {/* Orbit rings */}
        {orbits.map(({ radius }) => (
          <div
            key={radius}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-card-border/15"
            style={{ width: radius * 2, height: radius * 2 }}
          />
        ))}

        {/* Glow */}
        <div
          className="absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{ width: 160, height: 160, background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
        />

        {/* Center photo */}
        <div className="absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-[2.5px] shadow-lg shadow-accent-violet/30">
          <div className="h-full w-full overflow-hidden rounded-full bg-bg">
            <img
              src="/images/tom.jpg"
              alt="Tom Hubert"
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback to initials if image not found
                const el = e.currentTarget;
                el.style.display = "none";
                el.parentElement!.classList.add("flex", "items-center", "justify-center");
                el.parentElement!.innerHTML = '<span class="text-2xl font-extrabold text-text-primary">TH</span>';
              }}
            />
          </div>
        </div>

        {/* Orbiting skills */}
        {orbits.map(({ radius, items }) =>
          items.map((skill, i) => {
            const size = sizeMap[skill.size];
            const isSelected = selected?.name === skill.name;
            const { speed, startOffset } = skillConfigs[skill.name];
            const animName = `orbit-r${radius}-${i}`;

            return (
              <div
                key={skill.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 0,
                  height: 0,
                  animationName: isSelected ? "none" : animName,
                  animationDuration: `${speed}s`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationDelay: `-${startOffset}s`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -size / 2,
                    top: -(radius + size / 2),
                    width: size,
                    height: size,
                    animationName: isSelected ? "none" : `${animName}-rev`,
                    animationDuration: `${speed}s`,
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationDelay: `-${startOffset}s`,
                  }}
                >
                  <motion.button
                    onClick={() => handleClick(skill)}
                    className="flex h-full w-full items-center justify-center rounded-full border backdrop-blur-sm"
                    style={{
                      backgroundColor: isSelected ? skill.color + "25" : skill.color + "12",
                      borderColor: isSelected ? skill.color + "60" : skill.color + "30",
                      boxShadow: isSelected ? `0 0 24px ${skill.color}40` : "none",
                    }}
                    animate={{ scale: isSelected ? 1.4 : 1, zIndex: isSelected ? 20 : 1 }}
                    whileHover={{ scale: isSelected ? 1.4 : 1.15 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span style={{ color: skill.color, fontSize: skill.size === "sm" ? 14 : 16 }}>
                        {skill.icon.length <= 2 ? <span className="font-bold">{skill.icon}</span> : skill.icon}
                      </span>
                      <span
                        className="font-medium leading-none"
                        style={{ color: skill.color, fontSize: skill.size === "sm" ? 8 : 9 }}
                      >
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

      {/* Dynamic keyframes — one pair per skill for unique speeds */}
      <style jsx global>{`
        ${orbits
          .map(({ radius, items }) =>
            items
              .map((_, i) => {
                const name = `orbit-r${radius}-${i}`;
                return `
                  @keyframes ${name} { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                  @keyframes ${name}-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                `;
              })
              .join("")
          )
          .join("")}
      `}</style>
    </div>
  );
}
