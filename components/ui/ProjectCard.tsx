"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
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
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-card border border-card-border bg-card overflow-hidden transition-colors hover:border-accent-cyan/30"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header - always visible, clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full flex-col gap-4 p-5 text-left sm:flex-row sm:items-center"
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
        <div className="hidden sm:block">
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-muted text-lg"
          >
            →
          </motion.span>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && project.liveUrl && project.liveUrl !== "#" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-card-border px-5 pb-5 pt-4">
              {/* Iframe container */}
              <div className="overflow-hidden rounded-lg border border-card-border bg-surface">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 border-b border-card-border bg-bg px-3 py-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="ml-2 flex-1 rounded-md bg-surface px-3 py-1 text-xs text-text-muted truncate">
                    {project.liveUrl}
                  </div>
                </div>
                {/* Iframe */}
                <iframe
                  src={project.liveUrl}
                  title={project.name}
                  className="h-[400px] w-full"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  loading="lazy"
                />
              </div>

              {/* Link below */}
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-pill border border-card-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent-cyan/50 hover:text-text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Site
                <span>↗</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
