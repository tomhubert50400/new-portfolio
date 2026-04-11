"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Project } from "@/lib/types";

type Props = { project: Project };

const emojiMap: Record<string, string> = {
  "cafes-in-seoul": "☕",
  "bouldrr": "🧗",
  "draft-predictions": "🏈",
  "woeve": "✦",
};

export function ProjectCard({ project }: Props) {
  const t = useTranslations();

  return (
    <motion.a
      href={project.liveUrl || project.githubUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4 rounded-card border border-card-border bg-card p-5 transition-colors hover:border-accent-cyan/30 sm:flex-row sm:items-center"
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex h-20 w-full flex-shrink-0 items-center justify-center rounded-lg bg-surface text-2xl sm:h-[72px] sm:w-[120px]">
        {emojiMap[project.slug] || "📦"}
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-text-primary">{project.name}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t(project.descriptionKey)}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-accent-cyan/10 px-2 py-0.5 text-xs text-accent-cyan">{tag}</span>
          ))}
        </div>
      </div>
      <div className="hidden text-text-muted transition-all group-hover:translate-x-1 group-hover:text-text-primary sm:block">→</div>
    </motion.a>
  );
}
