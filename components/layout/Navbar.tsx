"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const navLinks = ["work", "about", "experience", "techStack"] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  function scrollTo(id: string) {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-card-border/50 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-xl font-extrabold text-text-primary" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          TH<span className="text-accent-cyan">.</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((key) => (
            <button key={key} onClick={() => scrollTo(key === "work" ? "projects" : key)} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
              {t(key)}
            </button>
          ))}
          <LanguageSwitcher />
          <button onClick={() => scrollTo("contact")} className="rounded-pill bg-text-primary px-4 py-2 text-sm font-medium text-bg transition-transform hover:scale-105">
            {t("letsTalk")}
          </button>
        </div>

        <button className="flex flex-col gap-1.5 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <motion.span animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-6 bg-text-primary" />
          <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-6 bg-text-primary" />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-6 bg-text-primary" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-card-border/50 bg-bg/95 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((key) => (
                <button key={key} onClick={() => scrollTo(key === "work" ? "projects" : key)} className="text-left text-lg text-text-secondary transition-colors hover:text-text-primary">
                  {t(key)}
                </button>
              ))}
              <LanguageSwitcher />
              <button onClick={() => scrollTo("contact")} className="mt-2 rounded-pill bg-text-primary px-4 py-3 text-center font-medium text-bg">
                {t("letsTalk")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
