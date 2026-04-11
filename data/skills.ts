import { Skill } from "@/lib/types";

export const skills: Skill[] = [
  { name: "React", icon: "⚛️", color: "#61dafb", size: "lg", yearsOfExperience: 5, descriptionKey: "skills.react.description", subSkills: ["Hooks", "Context", "Zustand", "Server Components"] },
  { name: "Next.js", icon: "N.", color: "#ffffff", size: "lg", yearsOfExperience: 4, descriptionKey: "skills.nextjs.description", subSkills: ["App Router", "SSR", "SSG", "API Routes"] },
  { name: "TypeScript", icon: "TS", color: "#3178c6", size: "lg", yearsOfExperience: 4, descriptionKey: "skills.typescript.description", subSkills: ["Generics", "Type Guards", "Utility Types"] },
  { name: "Supabase", icon: "⚡", color: "#3ecf8e", size: "lg", yearsOfExperience: 3, descriptionKey: "skills.supabase.description", subSkills: ["Auth", "Realtime", "Storage", "Edge Functions"] },
  { name: "Tailwind CSS", icon: "🌊", color: "#06b6d4", size: "md", yearsOfExperience: 3, descriptionKey: "skills.tailwind.description", subSkills: ["Responsive", "Animations", "Custom Config"] },
  { name: "JavaScript", icon: "JS", color: "#fbbf24", size: "md", yearsOfExperience: 6, descriptionKey: "skills.javascript.description", subSkills: ["ES6+", "Async/Await", "DOM", "Node.js"] },
  { name: "PostgreSQL", icon: "🐘", color: "#336791", size: "md", yearsOfExperience: 3, descriptionKey: "skills.postgresql.description", subSkills: ["Queries", "Migrations", "RLS", "Functions"] },
  { name: "Vercel", icon: "▲", color: "#ffffff", size: "md", yearsOfExperience: 3, descriptionKey: "skills.vercel.description", subSkills: ["Deployments", "Edge", "Analytics"] },
  { name: "Git", icon: "🐙", color: "#f05032", size: "sm", yearsOfExperience: 6, descriptionKey: "skills.git.description", subSkills: ["Branching", "CI/CD", "Code Review"] },
  { name: "Docker", icon: "🐳", color: "#1d63ed", size: "sm", yearsOfExperience: 2, descriptionKey: "skills.docker.description", subSkills: ["Compose", "Images", "Volumes"] },
  { name: "REST API", icon: "🔌", color: "#8b5cf6", size: "sm", yearsOfExperience: 5, descriptionKey: "skills.restapi.description", subSkills: ["Design", "Auth", "Rate Limiting"] },
  { name: "Auth", icon: "🔑", color: "#ec4899", size: "sm", yearsOfExperience: 4, descriptionKey: "skills.auth.description", subSkills: ["JWT", "OAuth", "Session", "RBAC"] },
];
