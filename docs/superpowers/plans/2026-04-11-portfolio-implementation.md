# Portfolio Tom Hubert — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark-themed, animated fullstack developer portfolio for Tom Hubert with i18n (FR/EN/KR), interactive orbital tech stack, terminal hero, and rich Framer Motion animations.

**Architecture:** Next.js App Router with `[locale]` route segment for i18n via next-intl. Static data files (no CMS). Components split into layout/, sections/, ui/, and three/. Framer Motion for all animations, Three.js/R3F for hero particle background.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Three.js / React Three Fiber, next-intl, Geist font

---

## File Map

```
new-portfolio/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          — Locale-aware layout, loads translations, wraps with providers
│   │   └── page.tsx            — Main page, composes all sections in order
│   ├── layout.tsx              — Root layout: html, body, fonts, CustomCursor
│   ├── globals.css             — Tailwind directives + custom CSS vars + custom cursor styles
│   └── api/
│       └── contact/
│           └── route.ts        — Contact form API endpoint (sends email or logs)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          — Sticky navbar with blur, nav links, CTA, language switcher, mobile menu
│   │   └── Footer.tsx          — Copyright, social links, language switcher
│   ├── sections/
│   │   ├── Hero.tsx            — Two-column hero: text left, terminal right, particle bg
│   │   ├── About.tsx           — Photo + bio + stats row
│   │   ├── Experience.tsx      — 2x2 grid of expandable experience cards
│   │   ├── Projects.tsx        — Stacked full-width project cards
│   │   ├── TechStack.tsx       — Orbital system wrapper + mobile grid fallback
│   │   └── Contact.tsx         — CTA title + contact form + social links
│   ├── ui/
│   │   ├── Terminal.tsx        — Animated terminal with typing effect
│   │   ├── OrbitalSystem.tsx   — Orbital layout: photo center, orbiting bubbles, detail panel
│   │   ├── SkillBubble.tsx     — Single orbiting skill bubble with hover/click
│   │   ├── ProjectCard.tsx     — Full-width horizontal project card
│   │   ├── ExperienceCard.tsx  — Expandable experience card
│   │   ├── ContactForm.tsx     — Name/email/message form with submit
│   │   ├── CustomCursor.tsx    — Custom cursor follower
│   │   ├── LanguageSwitcher.tsx— FR/EN/KR language toggle
│   │   ├── ScrollReveal.tsx    — Reusable scroll-reveal wrapper (Framer Motion whileInView)
│   │   └── SectionHeader.tsx   — Reusable section title + subtitle
│   └── three/
│       └── ParticleField.tsx   — Three.js particle system for hero background
├── data/
│   ├── projects.ts             — Project data array
│   ├── experiences.ts          — Experience data array
│   └── skills.ts               — Skill data array (name, icon, color, size, subSkills)
├── hooks/
│   └── useTypingEffect.ts      — Hook for character-by-character text reveal
├── lib/
│   ├── types.ts                — Shared TypeScript interfaces (Project, Experience, Skill)
│   └── utils.ts                — cn() classname utility
├── messages/
│   ├── en.json                 — English translations
│   ├── fr.json                 — French translations
│   └── kr.json                 — Korean translations
├── i18n/
│   ├── request.ts              — next-intl getRequestConfig
│   └── routing.ts              — Locale routing config (locales, defaultLocale)
├── public/
│   └── images/
│       └── tom-placeholder.jpg — Placeholder avatar (gradient square)
├── middleware.ts                — next-intl middleware for locale routing
├── tailwind.config.ts          — Custom colors, fonts, animations
├── next.config.ts              — next-intl plugin, image config
├── package.json
└── .gitignore
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `app/globals.css`, `app/layout.tsx`, `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd C:/Users/t/Desktop/Projects/new-portfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=no --import-alias "@/*" --use-npm
```

Select defaults when prompted. This creates the base Next.js project with Tailwind and App Router.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion next-intl @react-three/fiber @react-three/drei three clsx
npm install -D @types/three
```

- [ ] **Step 3: Install Geist font**

```bash
npm install geist
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with dependencies"
```

---

## Task 2: Design Tokens + Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `lib/utils.ts`

- [ ] **Step 1: Configure Tailwind with design tokens**

Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#141418",
        surface: "#1c1c22",
        card: "#22222a",
        "card-border": "#2e2e38",
        "text-primary": "#e8e8ed",
        "text-secondary": "#9d9dab",
        "text-muted": "#6b6b7b",
        accent: {
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          pink: "#ec4899",
          yellow: "#fbbf24",
          green: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        card: "12px",
        pill: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Set up global CSS**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-text-primary antialiased;
  }

  ::selection {
    @apply bg-accent-violet/30 text-white;
  }
}

@layer utilities {
  .gradient-text {
    @apply bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-pink bg-clip-text text-transparent;
  }
}
```

- [ ] **Step 3: Create utils**

Create `lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css lib/utils.ts
git commit -m "style: configure design tokens, global styles, and cn utility"
```

---

## Task 3: TypeScript Types + Data Files

**Files:**
- Create: `lib/types.ts`
- Create: `data/projects.ts`
- Create: `data/experiences.ts`
- Create: `data/skills.ts`

- [ ] **Step 1: Define shared types**

Create `lib/types.ts`:

```ts
export interface Project {
  slug: string;
  name: string;
  descriptionKey: string;
  tags: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
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
```

- [ ] **Step 2: Create projects data**

Create `data/projects.ts`:

```ts
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
```

- [ ] **Step 3: Create experiences data**

Create `data/experiences.ts`:

```ts
import { Experience } from "@/lib/types";

export const experiences: Experience[] = [
  {
    company: "Freelance",
    roleKey: "experience.freelance.role",
    duration: "2 years",
    years: "2022 — 2024",
    descriptionKey: "experience.freelance.description",
    tags: ["Next.js", "Supabase", "Vercel"],
    expandedDetailsKey: "experience.freelance.details",
    color: "#06b6d4",
  },
  {
    company: "Simform",
    roleKey: "experience.simform.role",
    duration: "2 years",
    years: "2020 — 2022",
    descriptionKey: "experience.simform.description",
    tags: ["React", "TypeScript"],
    expandedDetailsKey: "experience.simform.details",
    color: "#8b5cf6",
  },
  {
    company: "Gifi",
    roleKey: "experience.gifi.role",
    duration: "1 year",
    years: "2019 — 2020",
    descriptionKey: "experience.gifi.description",
    tags: ["JavaScript", "CSS"],
    expandedDetailsKey: "experience.gifi.details",
    color: "#ec4899",
  },
  {
    company: "MobSuccess",
    roleKey: "experience.mobsuccess.role",
    duration: "1 year",
    years: "2018 — 2019",
    descriptionKey: "experience.mobsuccess.description",
    tags: ["JavaScript", "React"],
    expandedDetailsKey: "experience.mobsuccess.details",
    color: "#fbbf24",
  },
];
```

- [ ] **Step 4: Create skills data**

Create `data/skills.ts`:

```ts
import { Skill } from "@/lib/types";

export const skills: Skill[] = [
  {
    name: "React",
    icon: "⚛️",
    color: "#61dafb",
    size: "lg",
    yearsOfExperience: 5,
    descriptionKey: "skills.react.description",
    subSkills: ["Hooks", "Context", "Zustand", "Server Components"],
  },
  {
    name: "Next.js",
    icon: "N.",
    color: "#ffffff",
    size: "lg",
    yearsOfExperience: 4,
    descriptionKey: "skills.nextjs.description",
    subSkills: ["App Router", "SSR", "SSG", "API Routes"],
  },
  {
    name: "TypeScript",
    icon: "TS",
    color: "#3178c6",
    size: "lg",
    yearsOfExperience: 4,
    descriptionKey: "skills.typescript.description",
    subSkills: ["Generics", "Type Guards", "Utility Types"],
  },
  {
    name: "Supabase",
    icon: "⚡",
    color: "#3ecf8e",
    size: "lg",
    yearsOfExperience: 3,
    descriptionKey: "skills.supabase.description",
    subSkills: ["Auth", "Realtime", "Storage", "Edge Functions"],
  },
  {
    name: "Tailwind CSS",
    icon: "🌊",
    color: "#06b6d4",
    size: "md",
    yearsOfExperience: 3,
    descriptionKey: "skills.tailwind.description",
    subSkills: ["Responsive", "Animations", "Custom Config"],
  },
  {
    name: "JavaScript",
    icon: "JS",
    color: "#fbbf24",
    size: "md",
    yearsOfExperience: 6,
    descriptionKey: "skills.javascript.description",
    subSkills: ["ES6+", "Async/Await", "DOM", "Node.js"],
  },
  {
    name: "PostgreSQL",
    icon: "🐘",
    color: "#336791",
    size: "md",
    yearsOfExperience: 3,
    descriptionKey: "skills.postgresql.description",
    subSkills: ["Queries", "Migrations", "RLS", "Functions"],
  },
  {
    name: "Vercel",
    icon: "▲",
    color: "#ffffff",
    size: "md",
    yearsOfExperience: 3,
    descriptionKey: "skills.vercel.description",
    subSkills: ["Deployments", "Edge", "Analytics"],
  },
  {
    name: "Git",
    icon: "🐙",
    color: "#f05032",
    size: "sm",
    yearsOfExperience: 6,
    descriptionKey: "skills.git.description",
    subSkills: ["Branching", "CI/CD", "Code Review"],
  },
  {
    name: "Docker",
    icon: "🐳",
    color: "#1d63ed",
    size: "sm",
    yearsOfExperience: 2,
    descriptionKey: "skills.docker.description",
    subSkills: ["Compose", "Images", "Volumes"],
  },
  {
    name: "REST API",
    icon: "🔌",
    color: "#8b5cf6",
    size: "sm",
    yearsOfExperience: 5,
    descriptionKey: "skills.restapi.description",
    subSkills: ["Design", "Auth", "Rate Limiting"],
  },
  {
    name: "Auth",
    icon: "🔑",
    color: "#ec4899",
    size: "sm",
    yearsOfExperience: 4,
    descriptionKey: "skills.auth.description",
    subSkills: ["JWT", "OAuth", "Session", "RBAC"],
  },
];
```

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts data/
git commit -m "feat: add type definitions and static data files"
```

---

## Task 4: i18n Setup (next-intl)

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `messages/en.json`
- Create: `messages/fr.json`
- Create: `messages/kr.json`
- Create: `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create routing config**

Create `i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "kr"],
  defaultLocale: "en",
});
```

- [ ] **Step 2: Create request config**

Create `i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "fr" | "kr")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create English translations**

Create `messages/en.json`:

```json
{
  "nav": {
    "work": "Work",
    "about": "About",
    "experience": "Experience",
    "techStack": "Tech Stack",
    "letsTalk": "Let's Talk"
  },
  "hero": {
    "badge": "Available for new opportunities",
    "title1": "Building",
    "titleHighlight": "full-stack",
    "title2": "experiences.",
    "subtitle": "Fullstack developer with 6 years of experience building performant web applications with modern architectures.",
    "viewProjects": "View Projects"
  },
  "about": {
    "title": "About Me",
    "bio": "Fullstack developer based in Seoul with 6 years of experience. I build performant web apps with modern stacks — from design to deployment.",
    "stats": {
      "years": "Years exp.",
      "projects": "Projects",
      "languages": "Languages"
    }
  },
  "experience": {
    "title": "Experience",
    "freelance": {
      "role": "Freelance Developer",
      "description": "Full-stack web applications, SaaS platforms, and e-commerce solutions for diverse clients.",
      "details": "Built end-to-end applications including Cafes in Seoul and Bouldrr. Handled everything from design to deployment using Next.js, Supabase, and Vercel."
    },
    "simform": {
      "role": "Frontend Developer",
      "description": "Enterprise dashboards and design systems for international clients.",
      "details": "Developed complex React applications with TypeScript, implementing responsive design systems and data-heavy dashboards."
    },
    "gifi": {
      "role": "Web Developer",
      "description": "E-commerce platform and internal tools for France's leading DIY retailer.",
      "details": "Worked on the e-commerce frontend and inventory management tools, improving user experience and page performance."
    },
    "mobsuccess": {
      "role": "Web Developer",
      "description": "Mobile marketing analytics platform with real-time data visualization.",
      "details": "Built analytics dashboards and reporting tools for mobile marketing campaigns, working with real-time data streams."
    }
  },
  "projects": {
    "title": "Selected Work",
    "subtitle": "Personal projects & experiments",
    "cafesInSeoul": {
      "description": "Full-stack cafe discovery app for Seoul with maps, reviews, ratings, and mobile support."
    },
    "bouldrr": {
      "description": "Boulder climbing tracker with session stats, progression charts, videos, and social features."
    },
    "draftPredictions": {
      "description": "Sports draft prediction platform with live data feeds and interactive visualizations."
    },
    "woeve": {
      "description": "Product design agency website with bilingual support and interactive navigation."
    }
  },
  "techStack": {
    "title": "Tech Stack",
    "subtitle": "Click a skill to explore"
  },
  "skills": {
    "react": { "description": "Component architecture, hooks, context, state management. Built complex UIs with real-time updates and data visualizations." },
    "nextjs": { "description": "App Router, SSR, SSG, API routes. Full-stack applications with optimized performance and SEO." },
    "typescript": { "description": "Strong typing, generics, utility types. Type-safe applications with better DX and fewer runtime errors." },
    "supabase": { "description": "Auth, real-time subscriptions, storage, edge functions. Complete backend-as-a-service for rapid development." },
    "tailwind": { "description": "Utility-first CSS, responsive design, custom configurations. Rapid UI development with consistent design systems." },
    "javascript": { "description": "ES6+, async patterns, DOM manipulation, Node.js. 6 years of experience across frontend and backend." },
    "postgresql": { "description": "Complex queries, migrations, row-level security, stored functions. Relational data modeling for production apps." },
    "vercel": { "description": "Deployments, edge functions, analytics. Seamless CI/CD with preview deployments and production hosting." },
    "git": { "description": "Branching strategies, CI/CD pipelines, code review workflows. Clean commit history and collaborative development." },
    "docker": { "description": "Containerized development environments, compose configurations, production images." },
    "restapi": { "description": "API design, authentication, rate limiting, documentation. RESTful services for web and mobile clients." },
    "auth": { "description": "JWT, OAuth, session management, role-based access control. Secure authentication flows for production apps." }
  },
  "contact": {
    "title": "Have an idea?",
    "titleHighlight": "Let's build it together.",
    "form": {
      "name": "Name",
      "email": "Email",
      "message": "Message",
      "send": "Send Message"
    }
  },
  "footer": {
    "copyright": "© 2026 Tom Hubert. All rights reserved."
  }
}
```

- [ ] **Step 4: Create French translations**

Create `messages/fr.json`:

```json
{
  "nav": {
    "work": "Projets",
    "about": "À propos",
    "experience": "Expérience",
    "techStack": "Compétences",
    "letsTalk": "Contact"
  },
  "hero": {
    "badge": "Disponible pour de nouvelles opportunités",
    "title1": "Créer des",
    "titleHighlight": "expériences",
    "title2": "full-stack.",
    "subtitle": "Développeur fullstack avec 6 ans d'expérience dans la création d'applications web performantes avec des architectures modernes.",
    "viewProjects": "Voir les projets"
  },
  "about": {
    "title": "À propos",
    "bio": "Développeur fullstack basé à Séoul avec 6 ans d'expérience. Je construis des applications web performantes avec des stacks modernes — du design au déploiement.",
    "stats": {
      "years": "Ans d'exp.",
      "projects": "Projets",
      "languages": "Langues"
    }
  },
  "experience": {
    "title": "Expérience",
    "freelance": {
      "role": "Développeur Freelance",
      "description": "Applications web full-stack, plateformes SaaS et solutions e-commerce pour des clients variés.",
      "details": "Création d'applications complètes incluant Cafes in Seoul et Bouldrr. Gestion de A à Z : design, développement et déploiement avec Next.js, Supabase et Vercel."
    },
    "simform": {
      "role": "Développeur Frontend",
      "description": "Dashboards entreprise et design systems pour des clients internationaux.",
      "details": "Développement d'applications React complexes avec TypeScript, design systems responsifs et dashboards data-heavy."
    },
    "gifi": {
      "role": "Développeur Web",
      "description": "Plateforme e-commerce et outils internes pour le leader français du bricolage.",
      "details": "Travail sur le frontend e-commerce et les outils de gestion d'inventaire, amélioration de l'UX et des performances."
    },
    "mobsuccess": {
      "role": "Développeur Web",
      "description": "Plateforme d'analytics marketing mobile avec visualisation de données en temps réel.",
      "details": "Création de dashboards analytics et outils de reporting pour les campagnes marketing mobile."
    }
  },
  "projects": {
    "title": "Projets",
    "subtitle": "Projets personnels et expérimentations",
    "cafesInSeoul": {
      "description": "Application full-stack de découverte de cafés à Séoul avec cartes, avis, notes et support mobile."
    },
    "bouldrr": {
      "description": "Tracker d'escalade avec stats de session, graphiques de progression, vidéos et fonctionnalités sociales."
    },
    "draftPredictions": {
      "description": "Plateforme de prédiction de drafts sportifs avec données en temps réel et visualisations interactives."
    },
    "woeve": {
      "description": "Site web d'agence de design produit avec support bilingue et navigation interactive."
    }
  },
  "techStack": {
    "title": "Compétences",
    "subtitle": "Cliquez sur une compétence pour explorer"
  },
  "skills": {
    "react": { "description": "Architecture composants, hooks, context, gestion d'état. UIs complexes avec mises à jour en temps réel." },
    "nextjs": { "description": "App Router, SSR, SSG, routes API. Applications full-stack optimisées en performance et SEO." },
    "typescript": { "description": "Typage fort, génériques, utility types. Applications type-safe avec meilleure DX." },
    "supabase": { "description": "Auth, temps réel, stockage, edge functions. Backend complet pour un développement rapide." },
    "tailwind": { "description": "CSS utility-first, responsive design, configurations custom. Développement UI rapide et cohérent." },
    "javascript": { "description": "ES6+, patterns async, manipulation DOM, Node.js. 6 ans d'expérience frontend et backend." },
    "postgresql": { "description": "Requêtes complexes, migrations, RLS, fonctions stockées. Modélisation de données relationnelles." },
    "vercel": { "description": "Déploiements, edge functions, analytics. CI/CD avec preview deployments et hosting production." },
    "git": { "description": "Stratégies de branching, pipelines CI/CD, workflows de code review." },
    "docker": { "description": "Environnements de développement containerisés, configurations compose, images de production." },
    "restapi": { "description": "Design d'API, authentification, rate limiting, documentation. Services RESTful web et mobile." },
    "auth": { "description": "JWT, OAuth, gestion de sessions, contrôle d'accès par rôle. Flux d'authentification sécurisés." }
  },
  "contact": {
    "title": "Une idée ?",
    "titleHighlight": "Construisons-la ensemble.",
    "form": {
      "name": "Nom",
      "email": "Email",
      "message": "Message",
      "send": "Envoyer"
    }
  },
  "footer": {
    "copyright": "© 2026 Tom Hubert. Tous droits réservés."
  }
}
```

- [ ] **Step 5: Create Korean translations**

Create `messages/kr.json`:

```json
{
  "nav": {
    "work": "프로젝트",
    "about": "소개",
    "experience": "경력",
    "techStack": "기술 스택",
    "letsTalk": "연락하기"
  },
  "hero": {
    "badge": "새로운 기회를 찾고 있습니다",
    "title1": "풀스택",
    "titleHighlight": "경험을",
    "title2": "만듭니다.",
    "subtitle": "6년 경력의 풀스택 개발자로서 현대적인 아키텍처를 활용하여 고성능 웹 애플리케이션을 개발합니다.",
    "viewProjects": "프로젝트 보기"
  },
  "about": {
    "title": "소개",
    "bio": "서울에 기반을 둔 6년 경력의 풀스택 개발자입니다. 최신 기술 스택으로 디자인부터 배포까지 고성능 웹 앱을 구축합니다.",
    "stats": {
      "years": "년 경력",
      "projects": "프로젝트",
      "languages": "언어"
    }
  },
  "experience": {
    "title": "경력",
    "freelance": {
      "role": "프리랜서 개발자",
      "description": "다양한 클라이언트를 위한 풀스택 웹 애플리케이션, SaaS 플랫폼 및 이커머스 솔루션.",
      "details": "Cafes in Seoul과 Bouldrr를 포함한 엔드투엔드 애플리케이션 구축. Next.js, Supabase, Vercel을 사용하여 설계부터 배포까지 담당."
    },
    "simform": {
      "role": "프론트엔드 개발자",
      "description": "국제 클라이언트를 위한 엔터프라이즈 대시보드 및 디자인 시스템.",
      "details": "TypeScript를 활용한 복잡한 React 애플리케이션 개발, 반응형 디자인 시스템 및 데이터 집약적 대시보드 구현."
    },
    "gifi": {
      "role": "웹 개발자",
      "description": "프랑스 대표 DIY 유통업체의 이커머스 플랫폼 및 내부 도구.",
      "details": "이커머스 프론트엔드 및 재고 관리 도구 작업, 사용자 경험과 페이지 성능 개선."
    },
    "mobsuccess": {
      "role": "웹 개발자",
      "description": "실시간 데이터 시각화를 갖춘 모바일 마케팅 분석 플랫폼.",
      "details": "모바일 마케팅 캠페인을 위한 분석 대시보드 및 리포팅 도구 구축."
    }
  },
  "projects": {
    "title": "프로젝트",
    "subtitle": "개인 프로젝트 및 실험",
    "cafesInSeoul": {
      "description": "지도, 리뷰, 평점 및 모바일 지원을 갖춘 서울 카페 탐색 풀스택 앱."
    },
    "bouldrr": {
      "description": "세션 통계, 진행 차트, 비디오 및 소셜 기능을 갖춘 볼더링 클라이밍 트래커."
    },
    "draftPredictions": {
      "description": "실시간 데이터 피드와 인터랙티브 시각화를 갖춘 스포츠 드래프트 예측 플랫폼."
    },
    "woeve": {
      "description": "이중 언어 지원과 인터랙티브 네비게이션을 갖춘 제품 디자인 에이전시 웹사이트."
    }
  },
  "techStack": {
    "title": "기술 스택",
    "subtitle": "기술을 클릭하여 자세히 보기"
  },
  "skills": {
    "react": { "description": "컴포넌트 아키텍처, 훅, 컨텍스트, 상태 관리. 실시간 업데이트와 데이터 시각화를 포함한 복잡한 UI 구축." },
    "nextjs": { "description": "App Router, SSR, SSG, API 라우트. 성능과 SEO가 최적화된 풀스택 애플리케이션." },
    "typescript": { "description": "강력한 타이핑, 제네릭, 유틸리티 타입. 더 나은 DX와 적은 런타임 오류를 위한 타입 안전한 애플리케이션." },
    "supabase": { "description": "인증, 실시간 구독, 스토리지, 엣지 함수. 빠른 개발을 위한 완전한 백엔드 서비스." },
    "tailwind": { "description": "유틸리티 기반 CSS, 반응형 디자인, 커스텀 설정. 일관된 디자인 시스템으로 빠른 UI 개발." },
    "javascript": { "description": "ES6+, 비동기 패턴, DOM 조작, Node.js. 프론트엔드와 백엔드에서 6년의 경험." },
    "postgresql": { "description": "복잡한 쿼리, 마이그레이션, 행 수준 보안, 저장 함수. 프로덕션 앱을 위한 관계형 데이터 모델링." },
    "vercel": { "description": "배포, 엣지 함수, 분석. 프리뷰 배포와 프로덕션 호스팅을 포함한 원활한 CI/CD." },
    "git": { "description": "브랜칭 전략, CI/CD 파이프라인, 코드 리뷰 워크플로우." },
    "docker": { "description": "컨테이너화된 개발 환경, compose 설정, 프로덕션 이미지." },
    "restapi": { "description": "API 설계, 인증, 속도 제한, 문서화. 웹 및 모바일 클라이언트를 위한 RESTful 서비스." },
    "auth": { "description": "JWT, OAuth, 세션 관리, 역할 기반 접근 제어. 프로덕션 앱을 위한 보안 인증 흐름." }
  },
  "contact": {
    "title": "아이디어가 있으신가요?",
    "titleHighlight": "함께 만들어 봅시다.",
    "form": {
      "name": "이름",
      "email": "이메일",
      "message": "메시지",
      "send": "메시지 보내기"
    }
  },
  "footer": {
    "copyright": "© 2026 Tom Hubert. All rights reserved."
  }
}
```

- [ ] **Step 6: Create middleware**

Create `middleware.ts` at project root:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 7: Update next.config.ts**

Replace `next.config.ts`:

```ts
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 8: Commit**

```bash
git add i18n/ messages/ middleware.ts next.config.ts
git commit -m "feat: set up next-intl i18n with FR/EN/KR translations"
```

---

## Task 5: Root Layout + Locale Layout

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`

- [ ] **Step 1: Update root layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tom Hubert — Fullstack Developer",
  description:
    "Fullstack developer with 6 years of experience building performant web applications with modern architectures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create locale layout**

Create `app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "fr" | "kr")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <main className="min-h-screen">{children}</main>
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 3: Create placeholder page**

Create `app/[locale]/page.tsx`:

```tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("hero");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold gradient-text">{t("title1")} {t("titleHighlight")}</h1>
    </div>
  );
}
```

- [ ] **Step 4: Verify the app runs**

```bash
npm run dev
```

Open `http://localhost:3000` — should see the gradient text. Open `http://localhost:3000/fr` — should see French text. Kill the dev server after verification.

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat: set up root and locale layouts with next-intl provider"
```

---

## Task 6: Reusable UI Components (ScrollReveal + SectionHeader)

**Files:**
- Create: `components/ui/ScrollReveal.tsx`
- Create: `components/ui/SectionHeader.tsx`

- [ ] **Step 1: Create ScrollReveal wrapper**

Create `components/ui/ScrollReveal.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create SectionHeader**

Create `components/ui/SectionHeader.tsx`:

```tsx
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  title: string;
  subtitle?: string;
  centered?: boolean;
};

export function SectionHeader({ title, subtitle, centered = false }: Props) {
  return (
    <ScrollReveal
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
      )}
    </ScrollReveal>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/ScrollReveal.tsx components/ui/SectionHeader.tsx
git commit -m "feat: add ScrollReveal and SectionHeader reusable components"
```

---

## Task 7: Navbar

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/ui/LanguageSwitcher.tsx`

- [ ] **Step 1: Create LanguageSwitcher**

Create `components/ui/LanguageSwitcher.tsx`:

```tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const locales = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "kr", label: "KR" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex gap-1">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            locale === code
              ? "bg-accent-cyan/20 text-accent-cyan"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create Navbar**

Create `components/layout/Navbar.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const navLinks = ["work", "about", "experience", "techStack"] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  function scrollTo(id: string) {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-card-border/50 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="#"
          className="text-xl font-extrabold text-text-primary"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          TH<span className="text-accent-cyan">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((key) => (
            <button
              key={key}
              onClick={() => scrollTo(key === "work" ? "projects" : key)}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {t(key)}
            </button>
          ))}
          <LanguageSwitcher />
          <button
            onClick={() => scrollTo("contact")}
            className="rounded-pill bg-text-primary px-4 py-2 text-sm font-medium text-bg transition-transform hover:scale-105"
          >
            {t("letsTalk")}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-text-primary"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-0.5 w-6 bg-text-primary"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-text-primary"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-card-border/50 bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((key) => (
                <button
                  key={key}
                  onClick={() => scrollTo(key === "work" ? "projects" : key)}
                  className="text-left text-lg text-text-secondary transition-colors hover:text-text-primary"
                >
                  {t(key)}
                </button>
              ))}
              <LanguageSwitcher />
              <button
                onClick={() => scrollTo("contact")}
                className="mt-2 rounded-pill bg-text-primary px-4 py-3 text-center font-medium text-bg"
              >
                {t("letsTalk")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

- [ ] **Step 3: Add Navbar to locale layout**

Update `app/[locale]/layout.tsx` — add import and render Navbar above `{children}`:

```tsx
import { Navbar } from "@/components/layout/Navbar";
```

Inside the `<NextIntlClientProvider>`, before `<main>`:

```tsx
<Navbar />
<main className="min-h-screen pt-20">{children}</main>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Check sticky navbar appears, links scroll (targets don't exist yet — that's fine), language switcher changes URL, mobile menu works on narrow viewport.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Navbar.tsx components/ui/LanguageSwitcher.tsx app/[locale]/layout.tsx
git commit -m "feat: add sticky Navbar with mobile menu and language switcher"
```

---

## Task 8: Hero Section + Terminal

**Files:**
- Create: `hooks/useTypingEffect.ts`
- Create: `components/ui/Terminal.tsx`
- Create: `components/sections/Hero.tsx`

- [ ] **Step 1: Create useTypingEffect hook**

Create `hooks/useTypingEffect.ts`:

```ts
"use client";

import { useState, useEffect, useRef } from "react";

export function useTypingEffect(text: string, speed: number = 30, startDelay: number = 0) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setIsDone(false);
    indexRef.current = 0;

    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayed(text.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          setIsDone(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed, isDone };
}
```

- [ ] **Step 2: Create Terminal component**

Create `components/ui/Terminal.tsx`:

```tsx
"use client";

import { useTypingEffect } from "@/hooks/useTypingEffect";

const command = "cat profile.json";

const jsonContent = `{
  "name": "Tom Hubert",
  "role": "Fullstack Developer",
  "experience": "6 years",
  "location": "Seoul 🇰🇷",
  "skills": ["React", "Next.js", "Supabase",
             "TypeScript", "Tailwind"],
  "passion": "Building interactive UIs"
}`;

export function Terminal() {
  const { displayed: cmdText, isDone: cmdDone } = useTypingEffect(command, 50);
  const { displayed: jsonText, isDone: jsonDone } = useTypingEffect(
    jsonContent,
    15,
    command.length * 50 + 500
  );

  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-surface font-mono text-sm shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-card-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-text-muted">developer@portfolio:~</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 leading-relaxed">
        <div className="flex gap-2">
          <span className="text-accent-green">❯</span>
          <span className="text-text-primary">{cmdText}</span>
          {!cmdDone && <span className="animate-pulse text-text-primary">▊</span>}
        </div>

        {cmdDone && (
          <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">
            <code>
              {jsonText.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {colorize(line)}
                </span>
              ))}
            </code>
          </pre>
        )}

        {jsonDone && (
          <div className="mt-2 flex gap-2">
            <span className="text-accent-green">❯</span>
            <span className="animate-pulse text-text-primary">▊</span>
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
      part.startsWith('"') ? (
        <span key={i} className="text-accent-yellow">{part}</span>
      ) : (
        <span key={i} className="text-text-secondary">{part}</span>
      )
    );
  }
  return <span className="text-text-secondary">{line}</span>;
}
```

- [ ] **Step 3: Create Hero section**

Create `components/sections/Hero.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Terminal } from "@/components/ui/Terminal";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:gap-16">
        {/* Left text */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-green/20 bg-accent-green/10 px-4 py-1.5 text-xs text-accent-green">
              <span className="h-2 w-2 rounded-full bg-accent-green" />
              {t("badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl"
          >
            {t("title1")}
            <br />
            <span className="gradient-text">{t("titleHighlight")}</span>
            <br />
            {t("title2")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-md text-text-secondary"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex items-center gap-4"
          >
            <button
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-pill border border-card-border bg-card px-6 py-3 text-sm font-medium text-text-primary transition-all hover:scale-105 hover:border-accent-cyan/50"
            >
              {t("viewProjects")} ↓
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border text-text-muted transition-colors hover:border-text-secondary hover:text-text-primary"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border text-text-muted transition-colors hover:border-text-secondary hover:text-text-primary"
            >
              <LinkedInIcon />
            </a>
          </motion.div>
        </div>

        {/* Right terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-lg flex-1"
        >
          <Terminal />
        </motion.div>
      </div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
```

- [ ] **Step 4: Add Hero to page**

Replace `app/[locale]/page.tsx`:

```tsx
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Check hero renders with gradient text, terminal typing effect works, badge shows, social icons show, responsive on mobile (terminal stacks below text).

- [ ] **Step 6: Commit**

```bash
git add hooks/useTypingEffect.ts components/ui/Terminal.tsx components/sections/Hero.tsx app/[locale]/page.tsx
git commit -m "feat: add Hero section with animated terminal and typing effect"
```

---

## Task 9: About Section

**Files:**
- Create: `components/sections/About.tsx`

- [ ] **Step 1: Create About section**

Create `components/sections/About.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const stats = [
  { value: "6", labelKey: "stats.years", color: "text-accent-cyan" },
  { value: "10+", labelKey: "stats.projects", color: "text-accent-violet" },
  { value: "3", labelKey: "stats.languages", color: "text-accent-pink" },
];

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t("title")} />

        <div className="flex flex-col items-center gap-10 md:flex-row">
          {/* Photo placeholder */}
          <ScrollReveal className="flex-shrink-0">
            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-bg text-3xl font-extrabold text-text-primary">
                TH
              </div>
            </div>
          </ScrollReveal>

          {/* Bio + stats */}
          <div className="flex-1">
            <ScrollReveal>
              <p className="max-w-lg text-text-secondary leading-relaxed">
                {t("bio")}
              </p>
            </ScrollReveal>

            <StaggerContainer className="mt-8 flex gap-10">
              {stats.map((stat) => (
                <StaggerItem key={stat.labelKey}>
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-text-muted">
                    {t(stat.labelKey)}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page**

In `app/[locale]/page.tsx`, add import and render after Hero:

```tsx
import { About } from "@/components/sections/About";
```

```tsx
<Hero />
<About />
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/About.tsx app/[locale]/page.tsx
git commit -m "feat: add About section with bio and stats"
```

---

## Task 10: Experience Section

**Files:**
- Create: `components/ui/ExperienceCard.tsx`
- Create: `components/sections/Experience.tsx`

- [ ] **Step 1: Create ExperienceCard**

Create `components/ui/ExperienceCard.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Experience } from "@/lib/types";

type Props = {
  experience: Experience;
};

export function ExperienceCard({ experience }: Props) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer rounded-card border border-card-border bg-card p-5 transition-colors hover:border-opacity-60"
      style={{ borderColor: expanded ? experience.color + "40" : undefined }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {experience.company}
          </h3>
          <p className="mt-0.5 text-sm" style={{ color: experience.color }}>
            {t(experience.roleKey)}
          </p>
        </div>
        <span className="text-xs text-text-muted">{experience.duration}</span>
      </div>

      <p className="mt-3 text-sm text-text-secondary">
        {t(experience.descriptionKey)}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {experience.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md px-2 py-0.5 text-xs text-text-secondary"
            style={{ backgroundColor: experience.color + "15" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {expanded && experience.expandedDetailsKey && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-4 border-t border-card-border pt-4 text-sm text-text-secondary">
              {t(experience.expandedDetailsKey)}
            </p>
            <p className="mt-2 text-xs text-text-muted">
              {experience.years}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create Experience section**

Create `components/sections/Experience.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { experiences } from "@/data/experiences";

export function Experience() {
  const t = useTranslations("experience");

  return (
    <section id="experience" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t("title")} />

        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {experiences.map((exp) => (
            <StaggerItem key={exp.company}>
              <ExperienceCard experience={exp} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to page**

In `app/[locale]/page.tsx`, add import and render:

```tsx
import { Experience } from "@/components/sections/Experience";
```

```tsx
<About />
<Experience />
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/ExperienceCard.tsx components/sections/Experience.tsx app/[locale]/page.tsx
git commit -m "feat: add Experience section with expandable cards"
```

---

## Task 11: Projects Section

**Files:**
- Create: `components/ui/ProjectCard.tsx`
- Create: `components/sections/Projects.tsx`

- [ ] **Step 1: Create ProjectCard**

Create `components/ui/ProjectCard.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Project } from "@/lib/types";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  const t = useTranslations();

  return (
    <motion.a
      href={project.liveUrl || project.githubUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4 rounded-card border border-card-border bg-card p-5 transition-colors hover:border-accent-cyan/30 sm:flex-row sm:items-center"
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Preview */}
      <div className="flex h-20 w-full flex-shrink-0 items-center justify-center rounded-lg bg-surface text-2xl sm:h-[72px] sm:w-[120px]">
        {project.slug === "cafes-in-seoul" && "☕"}
        {project.slug === "bouldrr" && "🧗"}
        {project.slug === "draft-predictions" && "🏈"}
        {project.slug === "woeve" && "✦"}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-text-primary">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          {t(project.descriptionKey)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-accent-cyan/10 px-2 py-0.5 text-xs text-accent-cyan"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="hidden text-text-muted transition-all group-hover:translate-x-1 group-hover:text-text-primary sm:block">
        →
      </div>
    </motion.a>
  );
}
```

- [ ] **Step 2: Create Projects section**

Create `components/sections/Projects.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

export function Projects() {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <StaggerContainer className="flex flex-col gap-4">
          {projects.map((project) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to page**

In `app/[locale]/page.tsx`, add import and render after Experience:

```tsx
import { Projects } from "@/components/sections/Projects";
```

```tsx
<Experience />
<Projects />
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/ProjectCard.tsx components/sections/Projects.tsx app/[locale]/page.tsx
git commit -m "feat: add Projects section with stacked horizontal cards"
```

---

## Task 12: Tech Stack — Orbital System

**Files:**
- Create: `components/ui/SkillBubble.tsx`
- Create: `components/ui/OrbitalSystem.tsx`
- Create: `components/sections/TechStack.tsx`

- [ ] **Step 1: Create SkillBubble**

Create `components/ui/SkillBubble.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Skill } from "@/lib/types";

type Props = {
  skill: Skill;
  isSelected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
};

const sizeMap = { sm: 44, md: 52, lg: 60 };

export function SkillBubble({ skill, isSelected, onClick, style }: Props) {
  const size = sizeMap[skill.size];

  return (
    <motion.button
      onClick={onClick}
      className="absolute flex items-center justify-center rounded-full border text-center"
      style={{
        width: size,
        height: size,
        backgroundColor: skill.color + "15",
        borderColor: isSelected ? skill.color + "60" : skill.color + "30",
        boxShadow: isSelected ? `0 0 20px ${skill.color}30` : "none",
        ...style,
      }}
      animate={{
        scale: isSelected ? 1.4 : 1,
        zIndex: isSelected ? 20 : 1,
      }}
      whileHover={{ scale: isSelected ? 1.4 : 1.15 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="flex flex-col items-center">
        <span className="text-sm leading-none" style={{ color: skill.color }}>
          {skill.icon.length <= 2 ? (
            <span className="text-xs font-bold">{skill.icon}</span>
          ) : (
            skill.icon
          )}
        </span>
        <span
          className="mt-0.5 text-[7px] leading-none"
          style={{ color: skill.color }}
        >
          {skill.name}
        </span>
      </div>
    </motion.button>
  );
}
```

- [ ] **Step 2: Create OrbitalSystem**

Create `components/ui/OrbitalSystem.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SkillBubble } from "./SkillBubble";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

// Positions for each bubble around the center (percentages)
const positions = [
  { top: "22%", left: "70%" },   // React
  { top: "5%", left: "42%" },    // Next.js
  { top: "12%", left: "14%" },   // TypeScript
  { top: "50%", left: "2%" },    // Supabase
  { top: "75%", left: "15%" },   // Tailwind
  { top: "82%", left: "42%" },   // JavaScript
  { top: "75%", left: "70%" },   // PostgreSQL
  { top: "50%", left: "88%" },   // Vercel
  { top: "30%", left: "92%" },   // Git
  { top: "62%", left: "92%" },   // Docker
  { top: "38%", left: "5%" },    // REST API
  { top: "88%", left: "60%" },   // Auth
];

export function OrbitalSystem() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);

  function handleClick(skill: Skill) {
    setSelected(selected?.name === skill.name ? null : skill);
  }

  return (
    <div>
      {/* Orbital area */}
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        {/* Orbit rings */}
        {[200, 300, 400].map((size) => (
          <div
            key={size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-card-border/30"
            style={{ width: size, height: size }}
          />
        ))}

        {/* Center photo */}
        <div className="absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-pink p-0.5 shadow-lg shadow-accent-cyan/20">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-bg text-xl font-extrabold text-text-primary">
            TH
          </div>
        </div>

        {/* Bubbles */}
        {skills.map((skill, i) => (
          <SkillBubble
            key={skill.name}
            skill={skill}
            isSelected={selected?.name === skill.name}
            onClick={() => handleClick(skill)}
            style={positions[i] ? { top: positions[i].top, left: positions[i].left } : undefined}
          />
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-8 max-w-md rounded-card border border-card-border bg-card p-5 text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{selected.icon}</span>
              <span
                className="text-lg font-bold"
                style={{ color: selected.color }}
              >
                {selected.name}
              </span>
              <span className="rounded-md bg-surface px-2 py-0.5 text-xs text-text-muted">
                {selected.yearsOfExperience} years
              </span>
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              {t(selected.descriptionKey)}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {selected.subSkills.map((sub) => (
                <span
                  key={sub}
                  className="rounded-md px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: selected.color + "15",
                    color: selected.color,
                  }}
                >
                  {sub}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Create TechStack section with mobile fallback**

Create `components/sections/TechStack.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { OrbitalSystem } from "@/components/ui/OrbitalSystem";
import { skills } from "@/data/skills";
import { Skill } from "@/lib/types";

export function TechStack() {
  const t = useTranslations("techStack");

  return (
    <section id="techStack" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} centered />

        {/* Desktop: Orbital */}
        <ScrollReveal className="hidden md:block">
          <OrbitalSystem />
        </ScrollReveal>

        {/* Mobile: Grid fallback */}
        <div className="md:hidden">
          <MobileSkillGrid />
        </div>
      </div>
    </section>
  );
}

function MobileSkillGrid() {
  const t = useTranslations();
  const [selected, setSelected] = useState<Skill | null>(null);

  return (
    <div>
      <StaggerContainer className="grid grid-cols-3 gap-3">
        {skills.map((skill) => (
          <StaggerItem key={skill.name}>
            <button
              onClick={() =>
                setSelected(selected?.name === skill.name ? null : skill)
              }
              className="flex w-full flex-col items-center gap-1 rounded-card border p-4 text-center transition-colors"
              style={{
                borderColor:
                  selected?.name === skill.name
                    ? skill.color + "60"
                    : "#2e2e38",
                backgroundColor:
                  selected?.name === skill.name
                    ? skill.color + "10"
                    : "#22222a",
              }}
            >
              <span className="text-lg">{skill.icon}</span>
              <span className="text-xs text-text-secondary">{skill.name}</span>
            </button>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 rounded-card border border-card-border bg-card p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{selected.icon}</span>
              <span className="font-bold" style={{ color: selected.color }}>
                {selected.name}
              </span>
              <span className="text-xs text-text-muted">
                {selected.yearsOfExperience}y
              </span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              {t(selected.descriptionKey)}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {selected.subSkills.map((sub) => (
                <span
                  key={sub}
                  className="rounded-md px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: selected.color + "15",
                    color: selected.color,
                  }}
                >
                  {sub}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Add to page**

In `app/[locale]/page.tsx`, add:

```tsx
import { TechStack } from "@/components/sections/TechStack";
```

```tsx
<Projects />
<TechStack />
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/SkillBubble.tsx components/ui/OrbitalSystem.tsx components/sections/TechStack.tsx app/[locale]/page.tsx
git commit -m "feat: add Tech Stack section with orbital system and mobile grid fallback"
```

---

## Task 13: Contact Section + Form

**Files:**
- Create: `components/ui/ContactForm.tsx`
- Create: `components/sections/Contact.tsx`
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Create ContactForm**

Create `components/ui/ContactForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4">
      <input
        name="name"
        type="text"
        required
        placeholder={t("name")}
        className="rounded-card border border-card-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none"
      />
      <input
        name="email"
        type="email"
        required
        placeholder={t("email")}
        className="rounded-card border border-card-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder={t("message")}
        className="resize-none rounded-card border border-card-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-pill bg-text-primary px-6 py-3 text-sm font-medium text-bg transition-all hover:scale-105 disabled:opacity-50"
      >
        {status === "sending" ? "..." : status === "sent" ? "✓" : t("send")}
      </button>
      {status === "error" && (
        <p className="text-center text-xs text-red-400">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Create Contact section**

Create `components/sections/Contact.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactForm } from "@/components/ui/ContactForm";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section
      id="contact"
      className="relative px-6 py-20"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.03) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-text-primary md:text-5xl">
            {t("title")}
            <br />
            <span className="gradient-text">{t("titleHighlight")}</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-10">
            <ContactForm />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex justify-center gap-4">
            {[
              { href: "https://github.com", label: "GitHub" },
              { href: "https://linkedin.com", label: "LinkedIn" },
              { href: "https://twitter.com", label: "X" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-card-border px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent-cyan/50 hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create contact API route**

Create `app/api/contact/route.ts`:

```ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // For now, log the contact. Replace with email service (Resend, etc.) later.
  console.log("Contact form submission:", { name, email, message });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Add to page**

In `app/[locale]/page.tsx`, add:

```tsx
import { Contact } from "@/components/sections/Contact";
```

```tsx
<TechStack />
<Contact />
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/ContactForm.tsx components/sections/Contact.tsx app/api/contact/route.ts app/[locale]/page.tsx
git commit -m "feat: add Contact section with form and API route"
```

---

## Task 14: Footer

**Files:**
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Create Footer**

Create `components/layout/Footer.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-card-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-text-muted">{t("copyright")}</p>

        <div className="flex items-center gap-6">
          <div className="flex gap-3">
            {["GitHub", "LinkedIn", "X"].map((name) => (
              <a
                key={name}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                {name}
              </a>
            ))}
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Add to locale layout**

In `app/[locale]/layout.tsx`, add import and render after `</main>`:

```tsx
import { Footer } from "@/components/layout/Footer";
```

```tsx
<main className="min-h-screen pt-20">{children}</main>
<Footer />
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/Footer.tsx app/[locale]/layout.tsx
git commit -m "feat: add Footer with social links and language switcher"
```

---

## Task 15: Custom Cursor

**Files:**
- Create: `components/ui/CustomCursor.tsx`

- [ ] **Step 1: Create CustomCursor**

Create `components/ui/CustomCursor.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on devices with a pointer
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    setVisible(true);

    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, [data-cursor-hover]")) {
        setHovering(true);
      }
    }

    function onOut() {
      setHovering(false);
    }

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
        animate={{
          x: pos.x,
          y: pos.y,
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8 }}
      />
      <style jsx global>{`
        * { cursor: none !important; }
      `}</style>
    </>
  );
}
```

- [ ] **Step 2: Add to root layout**

In `app/layout.tsx`, add import and render inside `<body>`:

```tsx
import { CustomCursor } from "@/components/ui/CustomCursor";
```

```tsx
<body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
  <CustomCursor />
  {children}
</body>
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/CustomCursor.tsx app/layout.tsx
git commit -m "feat: add custom cursor with hover scale effect"
```

---

## Task 16: Three.js Particle Field (Hero Background)

**Files:**
- Create: `components/three/ParticleField.tsx`
- Modify: `components/sections/Hero.tsx`

- [ ] **Step 1: Create ParticleField**

Create `components/three/ParticleField.tsx`:

```tsx
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#06b6d4"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export function ParticleField() {
  return (
    <div className="absolute inset-0 -z-10 opacity-50">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Add ParticleField to Hero**

In `components/sections/Hero.tsx`, add a dynamic import at the top (to avoid SSR issues with Three.js):

```tsx
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);
```

Add `<ParticleField />` as the first child inside the `<section>`:

```tsx
<section className="relative overflow-hidden px-6 py-20 md:py-32">
  <ParticleField />
  <div className="mx-auto flex max-w-6xl ...">
```

- [ ] **Step 3: Commit**

```bash
git add components/three/ParticleField.tsx components/sections/Hero.tsx
git commit -m "feat: add Three.js particle field background to Hero"
```

---

## Task 17: Final Page Assembly + Build Verification

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Ensure all sections are imported in order**

Verify `app/[locale]/page.tsx` has all sections:

```tsx
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <TechStack />
      <Contact />
    </>
  );
}
```

- [ ] **Step 2: Run dev server and verify all sections**

```bash
npm run dev
```

Walk through the page and verify:
1. Navbar sticky with blur, links scroll to sections, language switcher works
2. Hero: gradient text, terminal typing effect, particle background, badge
3. About: photo placeholder, bio, stats
4. Experience: 2x2 grid, cards expand on click
5. Projects: stacked cards with hover slide
6. Tech Stack: orbital system desktop, grid on mobile
7. Contact: form submits, social links
8. Footer: copyright, social links, language switcher
9. Test `/fr` and `/kr` routes for translations
10. Custom cursor follows mouse, scales on interactive elements

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Fix any build errors before proceeding.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors and finalize page assembly"
```

---

## Summary

| Task | Component | Files |
|------|-----------|-------|
| 1 | Project Scaffolding | package.json, next.config.ts, tsconfig.json |
| 2 | Design Tokens | tailwind.config.ts, globals.css, lib/utils.ts |
| 3 | Types + Data | lib/types.ts, data/*.ts |
| 4 | i18n | i18n/*.ts, messages/*.json, middleware.ts |
| 5 | Layouts | app/layout.tsx, app/[locale]/*.tsx |
| 6 | Reusable UI | ScrollReveal, SectionHeader |
| 7 | Navbar | Navbar.tsx, LanguageSwitcher.tsx |
| 8 | Hero + Terminal | Hero.tsx, Terminal.tsx, useTypingEffect.ts |
| 9 | About | About.tsx |
| 10 | Experience | Experience.tsx, ExperienceCard.tsx |
| 11 | Projects | Projects.tsx, ProjectCard.tsx |
| 12 | Tech Stack | TechStack.tsx, OrbitalSystem.tsx, SkillBubble.tsx |
| 13 | Contact | Contact.tsx, ContactForm.tsx, API route |
| 14 | Footer | Footer.tsx |
| 15 | Custom Cursor | CustomCursor.tsx |
| 16 | Three.js Particles | ParticleField.tsx |
| 17 | Final Assembly | page.tsx verification + build |
