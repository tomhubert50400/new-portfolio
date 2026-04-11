"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Experience } from "@/lib/types";

type Props = { experience: Experience };

export function ExperienceCard({ experience }: Props) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="flex h-full cursor-pointer flex-col rounded-card border border-card-border bg-card p-5 transition-colors hover:border-opacity-60"
      style={{ borderColor: expanded ? experience.color + "40" : undefined }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{experience.company}</h3>
          <p className="mt-0.5 text-sm" style={{ color: experience.color }}>{t(experience.roleKey)}</p>
        </div>
        <span className="text-xs text-text-muted">{experience.duration}</span>
      </div>
      <p className="mt-3 text-sm text-text-secondary">{t(experience.descriptionKey)}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {experience.tags.map((tag) => (
          <span key={tag} className="rounded-md px-2 py-0.5 text-xs text-text-secondary" style={{ backgroundColor: experience.color + "15" }}>{tag}</span>
        ))}
      </div>
      <AnimatePresence>
        {expanded && experience.expandedDetailsKey && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="mt-4 border-t border-card-border pt-4 text-sm text-text-secondary">{t(experience.expandedDetailsKey)}</p>
            <p className="mt-2 text-xs text-text-muted">{experience.years}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
