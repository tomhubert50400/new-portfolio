export interface Project {
  slug: string;
  name: string;
  descriptionKey: string;
  tags: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  pages?: { label: string; path: string }[];
}

export interface Experience {
  company: string;
  roleKey: string;
  duration: string;
  years: string;
  descriptionKey: string;
  tags: string[];
  expandedDetailsKey?: string;
  color: string;
}

export interface Skill {
  name: string;
  icon: string;
  color: string;
  size: "sm" | "md" | "lg";
  yearsOfExperience: number;
  descriptionKey: string;
  subSkills: string[];
}
