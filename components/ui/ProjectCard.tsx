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
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const screenshotUrl = project.liveUrl && project.liveUrl !== "#"
    ? `https://api.microlink.io/?url=${encodeURIComponent(project.liveUrl)}&screenshot=true&meta=false&embed=screenshot.url&type=png&viewport.width=1280&viewport.height=800`
    : null;

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
        {expanded && screenshotUrl && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-card-border px-5 pb-5 pt-4">
              {/* Browser chrome + screenshot */}
              <div className="overflow-hidden rounded-lg border border-card-border">
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

                {/* Screenshot */}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block cursor-pointer group"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Loading skeleton */}
                  {!imgLoaded && !imgError && (
                    <div className="flex h-[400px] items-center justify-center bg-surface">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-card-border border-t-accent-cyan" />
                        <span className="text-xs text-text-muted">Loading preview...</span>
                      </div>
                    </div>
                  )}

                  {/* Error fallback */}
                  {imgError && (
                    <div className="flex h-[300px] items-center justify-center bg-surface">
                      <div className="flex flex-col items-center gap-2 text-text-muted">
                        <span className="text-3xl">{emojiMap[project.slug] || "📦"}</span>
                        <span className="text-sm">Click to visit {project.name}</span>
                      </div>
                    </div>
                  )}

                  {/* Actual screenshot */}
                  <img
                    src={screenshotUrl}
                    alt={`Preview of ${project.name}`}
                    className={`w-full object-cover object-top transition-opacity ${imgLoaded ? "opacity-100" : "opacity-0 h-0"}`}
                    style={imgLoaded ? { maxHeight: 500 } : undefined}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-bg/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-pill bg-text-primary px-5 py-2.5 text-sm font-medium text-bg">
                      Visit Site ↗
                    </span>
                  </div>
                </a>
              </div>

              {/* Link below */}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-pill border border-card-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent-cyan/50 hover:text-text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Site <span>↗</span>
                </a>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-pill border border-card-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent-violet/50 hover:text-text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
