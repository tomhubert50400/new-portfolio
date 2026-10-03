"use client";

import { useState, useEffect } from "react";

export function useTypingEffect(text: string, speed: number = 30, startDelay: number = 0) {
  const [progress, setProgress] = useState({ text, count: 0, done: false });

  useEffect(() => {
    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const delayTimer = setTimeout(() => {
      setProgress({ text, count: 0, done: text.length === 0 });
      interval = setInterval(() => {
        index = Math.min(index + 1, text.length);
        setProgress({ text, count: index, done: index === text.length });
        if (index === text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayTimer);
      if (interval !== undefined) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return {
    displayed: progress.text === text ? text.slice(0, progress.count) : "",
    isDone: progress.text === text && progress.done,
  };
}
