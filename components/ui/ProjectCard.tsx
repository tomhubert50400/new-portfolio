"use client";

import { useState, useCallback } from "react";
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

function getScreenshotUrl(baseUrl: string, path: string) {
  const fullUrl = path === "/" ? baseUrl : `${baseUrl.replace(/\/$/, "")}${path}`;
  return `https://api.microlink.io/?url=${encodeURIComponent(fullUrl)}&screenshot=true&meta=false&embed=screenshot.url&type=png&viewport.width=1280&viewport.height=800`;
}

export function ProjectCard({ project }: Props) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const [activePage, setActivePage] = useState(0);

  const pages = project.pages || [{ label: "Home", path: "/" }];
  const currentPage = pages[activePage];
  const currentFullUrl = currentPage.path === "/"
    ? project.liveUrl!
    : `${project.liveUrl!.replace(/\/$/, "")}${currentPage.path}`;

  return (
    <motion.div
      layout
      className="rounded-card border border-card-border bg-card overflow-hidden transition-colors hover:border-accent-cyan/30"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
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

      {/* Expanded */}
      <AnimatePresence>
        {expanded && project.liveUrl && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-card-border px-5 pb-5 pt-4">
              {/* Page tabs */}
              {pages.length > 1 && (
                <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
                  {pages.map((page, i) => (
                    <button
                      key={page.path}
                      onClick={(e) => { e.stopPropagation(); setActivePage(i); }}
                      className={`shrink-0 rounded-pill px-3 py-1.5 text-xs font-medium transition-colors ${
                        i === activePage
                          ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30"
                          : "bg-surface text-text-muted border border-card-border hover:text-text-secondary"
                      }`}
                    >
                      {page.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Browser chrome + screenshot */}
              <div className="overflow-hidden rounded-lg border border-card-border">
                {/* Browser bar */}
                <div className="flex items-center gap-2 border-b border-card-border bg-bg px-3 py-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="ml-2 flex-1 rounded-md bg-surface px-3 py-1 text-xs text-text-muted truncate">
                    {currentFullUrl}
                  </div>
                </div>

                {/* Screenshot with transition */}
                <a
                  href={currentFullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ScreenshotImage
                    key={`${project.slug}-${activePage}`}
                    url={getScreenshotUrl(project.liveUrl!, currentPage.path)}
                    alt={`${project.name} — ${currentPage.label}`}
                    emoji={emojiMap[project.slug] || "📦"}
                    projectName={project.name}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-bg/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-pill bg-text-primary px-5 py-2.5 text-sm font-medium text-bg">
                      Visit Site ↗
                    </span>
                  </div>
                </a>
              </div>

              {/* Links */}
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

function ScreenshotImage({
  url,
  alt,
  emoji,
  projectName,
}: {
  url: string;
  alt: string;
  emoji: string;
  projectName: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  return (
    <>
      {/* Loading */}
      {!loaded && !error && (
        <div className="flex h-[400px] items-center justify-center bg-surface">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-card-border border-t-accent-cyan" />
            <span className="text-xs text-text-muted">Loading preview...</span>
          </div>
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div className="flex h-[300px] items-center justify-center bg-surface">
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <span className="text-3xl">{emoji}</span>
            <span className="text-sm">Click to visit {projectName}</span>
          </div>
        </div>
      )}

      {/* Image */}
      <img
        src={url}
        alt={alt}
        className={`w-full object-cover object-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0 h-0"}`}
        style={loaded ? { maxHeight: 500 } : undefined}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
}
