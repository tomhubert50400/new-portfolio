"use client";

import { useState } from "react";
import { useTypingEffect } from "@/hooks/useTypingEffect";

const command = "cat profile.json";
const jsonContent = `{
  "name": "Tom Hubert",
  "role": "Fullstack Developer",
  "experience": "6 years",
  "location": "Seoul \u{1F1F0}\u{1F1F7}",
  "skills": ["React", "Next.js", "Supabase",
             "TypeScript", "Tailwind"],
  "passion": "Building interactive UIs"
}`;

export function Terminal() {
  const { displayed: cmdText, isDone: cmdDone } = useTypingEffect(command, 50);
  const { displayed: jsonText, isDone: jsonDone } = useTypingEffect(jsonContent, 15, command.length * 50 + 500);

  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-surface font-mono text-sm shadow-2xl">
      <div className="flex items-center gap-2 border-b border-card-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
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
