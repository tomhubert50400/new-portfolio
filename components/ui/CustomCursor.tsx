"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;
    setVisible(true);

    function onMove(e: MouseEvent) { setPos({ x: e.clientX, y: e.clientY }); }
    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea")) setHovering(true);
    }
    function onOut() { setHovering(false); }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-primary mix-blend-difference"
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-text-primary/30 mix-blend-difference"
        animate={{ x: pos.x, y: pos.y, width: hovering ? 48 : 32, height: hovering ? 48 : 32 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8 }}
      />
    </>
  );
}
