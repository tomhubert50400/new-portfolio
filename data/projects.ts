import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "kusodu",
    name: "Kusodu",
    descriptionKey: "projects.kusodu.description",
    tags: ["Swift", "iOS", "Game Logic", "App Store"],
    image: "/images/projects/kusodu.png",
    thumbnailImage: "/images/projects/kusodu-logo.webp",
    liveUrl: "https://apps.apple.com/us/app/kusodu-adfree-premium-sudoku/id6768517977",
    pages: [
      { label: "App Store", path: "/" },
    ],
  },
  {
    slug: "cafes-in-seoul",
    name: "Cafes in Seoul",
    descriptionKey: "projects.cafesInSeoul.description",
    tags: ["Next.js", "Supabase", "Kakao Maps", "Capacitor"],
    image: "/images/projects/cafes-seoul.png",
    liveUrl: "https://cafesinseoul.com/",
    githubUrl: "https://github.com/tomhubert50400",
    pages: [
      { label: "Home", path: "/" },
      { label: "Browse Cafes", path: "/cafes" },
    ],
  },
  {
    slug: "bouldrr",
    name: "Bouldrr",
    descriptionKey: "projects.bouldrr.description",
    tags: ["Next.js", "Supabase", "Zustand", "Recharts"],
    image: "/images/projects/bouldrr.png",
    liveUrl: "https://bouldrr.com/",
    githubUrl: "https://github.com/tomhubert50400",
    pages: [
      { label: "Home", path: "/" },
      { label: "Search", path: "/en/search" },
    ],
  },
  {
    slug: "draft-predictions",
    name: "Draft Predictions",
    descriptionKey: "projects.draftPredictions.description",
    tags: ["React", "API", "Data Visualization"],
    image: "/images/projects/draft-predictions.png",
    liveUrl: "https://draft.zerqua.com/",
    githubUrl: "https://github.com/tomhubert50400",
    pages: [
      { label: "Home", path: "/" },
    ],
  },
  {
    slug: "woeve",
    name: "Woeve",
    descriptionKey: "projects.woeve.description",
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
    image: "/images/projects/woeve.png",
    liveUrl: "https://woeve.eu/",
    githubUrl: "https://github.com/tomhubert50400",
    pages: [
      { label: "Home", path: "/" },
      { label: "Studio", path: "/#whatwedo" },
      { label: "Projects", path: "/#projets" },
    ],
  },
];
