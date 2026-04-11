import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "cafes-in-seoul",
    name: "Cafes in Seoul",
    descriptionKey: "projects.cafesInSeoul.description",
    tags: ["Next.js", "Supabase", "Kakao Maps", "Capacitor"],
    image: "/images/projects/cafes-seoul.png",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    slug: "bouldrr",
    name: "Bouldrr",
    descriptionKey: "projects.bouldrr.description",
    tags: ["Next.js", "Supabase", "Zustand", "Recharts"],
    image: "/images/projects/bouldrr.png",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    slug: "draft-predictions",
    name: "Draft Predictions",
    descriptionKey: "projects.draftPredictions.description",
    tags: ["React", "API", "Data Visualization"],
    image: "/images/projects/draft-predictions.png",
  },
  {
    slug: "woeve",
    name: "Woeve",
    descriptionKey: "projects.woeve.description",
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
    image: "/images/projects/woeve.png",
    liveUrl: "#",
  },
];
