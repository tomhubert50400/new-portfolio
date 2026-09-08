export interface Project {
  slug: string;
  name: string;
  descriptionKey: string;
  tags: string[];
  image?: string;
  thumbnailImage?: string;
  liveUrl?: string;
  githubUrl?: string;
  pages?: { label: string; path: string }[];
}

export interface Experience {
  company: string;
  companyKey?: string;
  roleKey: string;
  duration: string;
  durationKey?: string;
  years: string;
  yearsKey?: string;
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
