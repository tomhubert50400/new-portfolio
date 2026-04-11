"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

const sizeMap = { sm: 48, md: 56, lg: 64 };

function seeded(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return ((h & 0x7fffffff) % 1000) / 1000;
}

const orbitDefs = [
  { radius: 110, baseSpeed: 0.008, items: skills.filter((s) => s.size === "lg") },
  { radius: 170, baseSpeed: 0.005, items: skills.filter((s) => s.size === "md") },
  { radius: 225, baseSpeed: 0.003, items: skills.filter((s) => s.size === "sm") },
];

interface Placement {
  skill: Skill;
  radius: number;
  speed: number;
  startAngle: number;
}

function buildPlacements(): Placement[] {
  const out: Placement[] = [];
  orbitDefs.forEach(({ radius, baseSpeed, items }) => {
    const orbitOffset = seeded(`orbit-${radius}`) * Math.PI * 2;
    items.forEach((skill, i) => {
      const angle = orbitOffset + (Math.PI * 2 / items.length) * i;
      const speedVar = 0.8 + seeded(skill.name + "spd") * 0.4;
      out.push({ skill, radius, speed: baseSpeed * speedVar, startAngle: angle });
    });
  });
  return out;
}

export function OrbitalSystem() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);
  const placements = useMemo(buildPlacements, []);
  const anglesRef = useRef<number[]>(placements.map((p) => p.startAngle));
  const rafRef = useRef<number>(0);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  const containerSize = 520;
  const center = containerSize / 2;

  useEffect(() => {
    // Initialize positions
    setPositions(
      placements.map((p) => ({
        x: center + Math.cos(p.startAngle) * p.radius,
        y: center + Math.sin(p.startAngle) * p.radius,
      }))
    );

    let lastTime = performance.now();

    function tick(now: number) {
      const dt = now - lastTime;
      lastTime = now;

      const newPositions = placements.map((p, i) => {
        // Don't animate selected skill
        if (selected?.name === p.skill.name) {
          return { x: center + Math.cos(anglesRef.current[i]) * p.radius, y: center + Math.sin(anglesRef.current[i]) * p.radius };
        }
        anglesRef.current[i] += p.speed * (dt / 16);
        return {
          x: center + Math.cos(anglesRef.current[i]) * p.radius,
          y: center + Math.sin(anglesRef.current[i]) * p.radius,
        };
      });

      setPositions(newPositions);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [placements, selected, center]);

  function handleClick(skill: Skill) {
    setSelected(selected?.name === skill.name ? null : skill);
  }

  return (
    <div>
      <div className="relative mx-auto" style={{ width: containerSize, height: containerSize }}>
        {/* Orbit rings */}
        {orbitDefs.map(({ radius }) => (
          <div
            key={radius}
            className="absolute rounded-full border border-card-border/15"
            style={{ width: radius * 2, height: radius * 2, left: center - radius, top: center - radius }}
          />
        ))}

        {/* Glow */}
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{ width: 160, height: 160, left: center - 80, top: center - 80, background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
        />

        {/* Center photo */}
        <div
          className="absolute z-10 rounded-full bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-[2.5px] shadow-lg shadow-accent-violet/30"
          style={{ width: 112, height: 112, left: center - 56, top: center - 56 }}
        >
          <div className="h-full w-full overflow-hidden rounded-full bg-bg">
            <img src="/images/tom.jpg" alt="Tom Hubert" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Orbiting skills */}
        {placements.map(({ skill }, i) => {
          const size = sizeMap[skill.size];
          const isSelected = selected?.name === skill.name;
          const pos = positions[i];
          if (!pos) return null;

          return (
            <motion.button
              key={skill.name}
              onClick={() => handleClick(skill)}
              className="absolute flex items-center justify-center rounded-full border backdrop-blur-sm"
              style={{
                width: size,
                height: size,
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                backgroundColor: isSelected ? skill.color + "25" : skill.color + "12",
                borderColor: isSelected ? skill.color + "60" : skill.color + "30",
                boxShadow: isSelected ? `0 0 24px ${skill.color}40` : "none",
                willChange: "left, top",
              }}
              animate={{ scale: isSelected ? 1.4 : 1, zIndex: isSelected ? 20 : 1 }}
              whileHover={{ scale: isSelected ? 1.4 : 1.15 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span style={{ color: skill.color, fontSize: skill.size === "sm" ? 14 : 16 }}>
                  {skill.icon.length <= 2 ? <span className="font-bold">{skill.icon}</span> : skill.icon}
                </span>
                <span className="font-medium leading-none" style={{ color: skill.color, fontSize: skill.size === "sm" ? 8 : 9 }}>
                  {skill.name}
                </span>
              </div>
            </motion.button>
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
    </div>
  );
}
