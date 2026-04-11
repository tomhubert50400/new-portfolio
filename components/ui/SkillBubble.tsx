"use client";

import { motion } from "framer-motion";
import { Skill } from "@/lib/types";

type Props = { skill: Skill; isSelected: boolean; onClick: () => void; style?: React.CSSProperties };

const sizeMap = { sm: 44, md: 52, lg: 60 };

export function SkillBubble({ skill, isSelected, onClick, style }: Props) {
  const size = sizeMap[skill.size];

  return (
    <motion.button
      onClick={onClick}
      className="absolute flex items-center justify-center rounded-full border text-center"
      style={{
        width: size, height: size,
        backgroundColor: skill.color + "15",
        borderColor: isSelected ? skill.color + "60" : skill.color + "30",
        boxShadow: isSelected ? `0 0 20px ${skill.color}30` : "none",
        ...style,
      }}
      animate={{ scale: isSelected ? 1.4 : 1, zIndex: isSelected ? 20 : 1 }}
      whileHover={{ scale: isSelected ? 1.4 : 1.15 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="flex flex-col items-center">
        <span className="text-sm leading-none" style={{ color: skill.color }}>
          {skill.icon.length <= 2 ? <span className="text-xs font-bold">{skill.icon}</span> : skill.icon}
        </span>
        <span className="mt-0.5 text-[7px] leading-none" style={{ color: skill.color }}>{skill.name}</span>
      </div>
    </motion.button>
  );
}
