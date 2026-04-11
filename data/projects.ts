import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "cafes-in-seoul",
    name: "Cafes in Seoul",
    descriptionKey: "projects.cafesInSeoul.description",
    tags: ["Next.js", "Supabase", "Kakao Maps", "Capacitor"],
    image: "/images/projects/cafes-seoul.png",
    liveUrl: "https://cafesinseoul.com/",
    githubUrl: "https://github.com/tomhubert50400",
  },
  {
    slug: "bouldrr",
    name: "Bouldrr",
    descriptionKey: "projects.bouldrr.description",
    tags: ["Next.js", "Supabase", "Zustand", "Recharts"],
    image: "/images/projects/bouldrr.png",
    liveUrl: "https://bouldrr.com/",
    githubUrl: "https://github.com/tomhubert50400",
  },
  {
    slug: "draft-predictions",
    name: "Draft Predictions",
    descriptionKey: "projects.draftPredictions.description",
    tags: ["React", "API", "Data Visualization"],
    image: "/images/projects/draft-predictions.png",
    liveUrl: "https://draft.zerqua.com/",
    githubUrl: "https://github.com/tomhubert50400",
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
