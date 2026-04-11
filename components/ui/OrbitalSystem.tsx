"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

const sizeMap = { sm: 48, md: 56, lg: 64 };

// Seeded random for stable but varied positions
function seeded(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return ((h & 0x7fffffff) % 1000) / 1000;
}

// Place skills on orbits with even angular distribution + random offset per orbit
function computePlacements() {
  const orbits = [
    { radius: 110, baseSpeed: 60, items: skills.filter((s) => s.size === "lg") },
    { radius: 170, baseSpeed: 80, items: skills.filter((s) => s.size === "md") },
    { radius: 225, baseSpeed: 100, items: skills.filter((s) => s.size === "sm") },
  ];

  const placements: {
    skill: Skill;
    radius: number;
    startAngle: number;
    speed: number;
  }[] = [];

  orbits.forEach(({ radius, baseSpeed, items }) => {
    const orbitOffset = seeded(`orbit-${radius}`) * 360; // random rotation offset per orbit
    items.forEach((skill, i) => {
      const evenAngle = (360 / items.length) * i;
      const jitter = (seeded(skill.name + "jitter") - 0.5) * 20; // ±10° jitter
      const speedVariation = 0.8 + seeded(skill.name + "speed") * 0.4; // 0.8x - 1.2x speed

      placements.push({
        skill,
        radius,
        startAngle: orbitOffset + evenAngle + jitter,
        speed: baseSpeed * speedVariation,
      });
    });
  });

  return placements;
}

export function OrbitalSystem() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);
  const placements = useMemo(computePlacements, []);

  function handleClick(skill: Skill) {
    setSelected(selected?.name === skill.name ? null : skill);
  }

  const containerSize = 520;
  const center = containerSize / 2;

  return (
    <div>
      <div
        className="relative mx-auto"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* Orbit rings */}
        {[110, 170, 225].map((r) => (
          <div
            key={r}
            className="absolute rounded-full border border-card-border/15"
            style={{
              width: r * 2,
              height: r * 2,
              left: center - r,
              top: center - r,
            }}
          />
        ))}

        {/* Glow behind photo */}
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: 160,
            height: 160,
            left: center - 80,
            top: center - 80,
            background: "radial-gradient(circle, #8b5cf6, transparent 70%)",
          }}
        />

        {/* Center photo */}
        <div
          className="absolute z-10 rounded-full bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-[2.5px] shadow-lg shadow-accent-violet/30"
          style={{ width: 112, height: 112, left: center - 56, top: center - 56 }}
        >
          <div className="h-full w-full overflow-hidden rounded-full bg-bg">
            <img
              src="/images/tom.jpg"
              alt="Tom Hubert"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Orbiting skills */}
        {placements.map(({ skill, radius, startAngle, speed }) => {
          const size = sizeMap[skill.size];
          const isSelected = selected?.name === skill.name;
          const id = skill.name.replace(/[^a-zA-Z]/g, "");

          return (
            <div
              key={skill.name}
              className="absolute"
              style={{
                width: size,
                height: size,
                left: center - size / 2,
                top: center - size / 2,
                animation: isSelected ? "none" : `spin-${id} ${speed}s linear infinite`,
                transformOrigin: `${size / 2}px ${size / 2}px`,
              }}
            >
              <motion.button
                onClick={() => handleClick(skill)}
                className="flex h-full w-full items-center justify-center rounded-full border backdrop-blur-sm"
                style={{
                  backgroundColor: isSelected ? skill.color + "25" : skill.color + "12",
                  borderColor: isSelected ? skill.color + "60" : skill.color + "30",
                  boxShadow: isSelected ? `0 0 24px ${skill.color}40` : "none",
                  // Counter-rotate to keep text upright
                  animation: isSelected ? "none" : `counterspin-${id} ${speed}s linear infinite`,
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
          );
        })}
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

      {/* Per-skill keyframes with unique orbit paths */}
      <style jsx global>{`
        ${placements
          .map(({ skill, radius, startAngle, speed }) => {
            const id = skill.name.replace(/[^a-zA-Z]/g, "");
            return `
              @keyframes spin-${id} {
                from { transform: rotate(${startAngle}deg) translateX(${radius}px); }
                to { transform: rotate(${startAngle + 360}deg) translateX(${radius}px); }
              }
              @keyframes counterspin-${id} {
                from { transform: rotate(-${startAngle}deg); }
                to { transform: rotate(-${startAngle + 360}deg); }
              }
            `;
          })
          .join("\n")}
      `}</style>
    </div>
  );
}
