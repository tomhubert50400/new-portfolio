"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTypingEffect } from "@/hooks/useTypingEffect";

const command = "cat profile.json";

function buildJson(t: (key: string) => string) {
  return `{
  "name": "Tom Hubert",
  "role": "${t("terminal.role")}",
  "experience": "${t("terminal.experience")}",
  "location": "${t("terminal.location")} 🇰🇷",
  "skills": ["React", "Next.js", "Supabase",
             "TypeScript", "Tailwind"],
  "passion": "${t("terminal.passion")}"
}`;
}

export function Terminal() {
  const t = useTranslations("hero");
  const jsonContent = buildJson(t);

  const { displayed: cmdText, isDone: cmdDone } = useTypingEffect(command, 50);
  const { displayed: jsonText, isDone: jsonDone } = useTypingEffect(jsonContent, 15, command.length * 50 + 500);
  const [dotsHovered, setDotsHovered] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-surface font-mono text-sm shadow-2xl">
      <div className="flex items-center gap-2 border-b border-card-border px-4 py-3">
        <div
          className="flex items-center gap-2"
          onMouseEnter={() => setDotsHovered(true)}
          onMouseLeave={() => setDotsHovered(false)}
        >
          <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f57]">
            {dotsHovered && (
              <svg width="8" height="8" viewBox="0 0 8 8">
                <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="#4a0002" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#febc2e]">
            {dotsHovered && (
              <svg width="8" height="8" viewBox="0 0 8 8">
                <path d="M1.5 4L6.5 4" stroke="#995700" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#28c840]">
            {dotsHovered && (
              <svg width="8" height="8" viewBox="0 0 10 10">
                <path d="M2 6.5L2 8L3.5 8" stroke="#006500" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 3.5L8 2L6.5 2" stroke="#006500" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 8L8 2" stroke="#006500" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </span>
        </div>
        <span className="ml-2 text-xs text-text-muted">developer@portfolio:~</span>
      </div>
      <div className="p-4 leading-relaxed">
        <div className="flex gap-2">
          <span className="text-accent-green">{"\u276F"}</span>
          <span className="text-text-primary">{cmdText}</span>
          {!cmdDone && <span className="animate-pulse text-text-primary">{"\u258A"}</span>}
        </div>
        {cmdDone && (
          <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">
            <code>
              {jsonText.split("\n").map((line, i) => (
                <span key={i} className="block">{colorize(line)}</span>
              ))}
            </code>
          </pre>
        )}
        {jsonDone && (
          <div className="mt-2 flex gap-2">
            <span className="text-accent-green">{"\u276F"}</span>
            <span className="animate-pulse text-text-primary">{"\u258A"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function colorize(line: string): React.ReactNode {
  if (line.includes('"') && line.includes(":")) {
    const parts = line.split(/(".*?")/g);
    return parts.map((part, i) => {
      if (i === 1) return <span key={i} className="text-accent-cyan">{part}</span>;
      if (i === 3) return <span key={i} className="text-accent-yellow">{part}</span>;
      if (part.match(/\d+/)) return <span key={i} className="text-accent-violet">{part}</span>;
      return <span key={i} className="text-text-secondary">{part}</span>;
    });
  }
  if (line.includes("[") || line.includes("]")) {
    const parts = line.split(/(".*?")/g);
    return parts.map((part, i) =>
      part.startsWith('"') ? <span key={i} className="text-accent-yellow">{part}</span> : <span key={i} className="text-text-secondary">{part}</span>
    );
  }
  return <span className="text-text-secondary">{line}</span>;
}
