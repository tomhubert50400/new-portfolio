# Portfolio Tom Hubert — Design Spec

## Overview

Personal portfolio for Tom Hubert, fullstack developer based in Seoul with 6 years of experience. Dark theme, bold animations, inspired by modern dev portfolio aesthetics with a terminal-style hero, interactive orbital tech stack, and rich Framer Motion animations.

## Tech Stack

- **Framework:** Next.js App Router (latest)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D:** Three.js / React Three Fiber (hero background)
- **i18n:** next-intl — French, English, Korean
- **Deployment:** Vercel
- **Content:** Static JSON/TS data files (no CMS)

## Sections

### 1. Navbar

- Logo: "TH." with accent color on the dot
- Navigation links: Work, About, Experience, Tech Stack
- CTA button: "Let's Talk" (scrolls to contact)
- Language switcher: FR / EN / KR flags or abbreviations
- Sticky on scroll with blur backdrop
- Mobile: hamburger menu with slide-in panel

### 2. Hero

- **Layout:** Two columns — text left, terminal right
- **Left side:**
  - Green badge: "Available for new opportunities"
  - Large title with gradient text (cyan → violet → pink): "Building **full-stack** experiences."
  - Subtitle: "Fullstack developer with 6 years of experience building performant web applications with modern architectures."
  - CTA buttons: "View Projects ↓" (scroll) + social icon links (GitHub, LinkedIn)
- **Right side:**
  - Animated terminal window with macOS-style dots (red, yellow, green)
  - Typing effect that types out a `cat profile.json` command, then reveals JSON:
    ```json
    {
      "name": "Tom Hubert",
      "role": "Fullstack Developer",
      "experience": "6 years",
      "location": "Seoul",
      "skills": ["React", "Next.js", "Supabase", "TypeScript", "Tailwind"],
      "passion": "Building interactive UIs"
    }
    ```
  - Blinking cursor at the end
- **Background:** Three.js particle field or animated mesh, subtle, behind the content
- **Animations:** Staggered fade-in for text elements, typing effect for terminal, parallax on scroll

### 3. About

- Photo or avatar of Tom on the left (placeholder until real photo provided)
- Short bio text on the right
- Stats row: "6 Years exp." / "10+ Projects" / "3 Languages" — each with accent color number and gray label
- Scroll-reveal animation (fade up + stagger)

### 4. Experience

- Section title: "Experience"
- **Layout:** 2x2 grid of cards
- **Cards:**
  1. **Freelance Developer** — 2 years, Independent. Tags: Next.js, Supabase, Vercel. Description of work scope.
  2. **Simform** — 2 years, Frontend Developer. Tags: React, TypeScript. Description of work scope.
  3. **Gifi** — 1 year, Web Developer. Description of work scope.
  4. **MobSuccess** — 1 year, Web Developer. Description of work scope.
- **Card behavior:**
  - Dark card with subtle border (#1a1a1a)
  - Company name, role, duration, short description
  - Tech tags with category-colored backgrounds
  - Hover: slight scale + glow border
  - Click/tap: card expands to reveal more details (responsibilities, achievements)
- **Animations:** Staggered scroll reveal, hover scale

### 5. Projects (Selected Work)

- Section title: "Selected Work" with subtitle
- **Layout:** Stacked full-width horizontal cards
- **Each card:**
  - Preview image/screenshot on the left (placeholder rectangles initially)
  - Project name, short description, tech tags in the center
  - Arrow icon on the right (link to live site or detail page)
- **Projects:**
  1. **Cafes in Seoul** — Full-stack cafe discovery app with maps, reviews, and mobile support. Tags: Next.js, Supabase, Kakao Maps, Capacitor
  2. **Bouldrr** — Boulder climbing tracker with stats, videos, social features. Tags: Next.js, Supabase, Zustand, Recharts
  3. **Draft Predictions** — Sports draft prediction platform with live data. Tags: React, API, Data Visualization
  4. **Woeve** — Product agency website with bilingual support. Tags: HTML, CSS, JavaScript, Vercel
- **Card behavior:**
  - Hover: slide-in effect, subtle background change, arrow animates right
  - Click: navigates to project detail page or external link
- **Animations:** Slide-in from left on scroll, stagger delay between cards

### 6. Tech Stack — Orbital Interactive

- Section title: "Tech Stack" with subtitle "Click a skill to explore"
- **Layout:** Centered orbital system
- **Center:** Tom's photo (circular, with gradient border glow)
- **Orbiting bubbles:** Tech skill bubbles floating around the photo
  - Each bubble is a circle with icon + label
  - Size proportional to experience level (React = large, Docker = small)
  - Gentle orbital animation (CSS or Framer Motion keyframes)
  - Faint orbit ring lines visible behind
- **Technologies to include:**
  - Large: React, Next.js, TypeScript, Supabase
  - Medium: Tailwind CSS, JavaScript, PostgreSQL, Vercel
  - Small: Git, Docker, REST API, Auth
- **Interaction:**
  - Hover: bubble pulses and illuminates
  - Click: selected bubble scales up (~2x), other bubbles are pushed away with spring physics. A detail panel slides in below showing:
    - Icon + name + years of experience
    - Short description of skills in that technology
    - Sub-skill tags (e.g., React → Hooks, Context, Zustand, Server Components)
  - Click again or click another bubble to switch
- **Mobile fallback:** Static grid layout with tap-to-expand cards (same detail content)
- **Animations:** Continuous orbital float, spring physics on expand/collapse, smooth panel slide-in

### 7. Contact / CTA

- **CTA:** Large gradient text: "Have an idea? Let's build it together."
- **Form:** Compact contact form below the CTA
  - Fields: Name, Email, Message
  - Submit button with hover effect
  - Form submission: either mailto link or a simple API route (to be decided during implementation)
- **Social links:** GitHub, LinkedIn, Twitter/X — icon buttons with hover glow
- **Background:** Subtle gradient (dark → slightly lighter blue/purple at bottom)
- **Animations:** Fade-in on scroll

### 8. Footer

- Copyright: "© 2026 Tom Hubert. All rights reserved."
- Social links row (same as contact section)
- Language switcher (FR / EN / KR)
- Minimal, single row layout

## Global Design Tokens

- **Background:** #141418 (dark but not black, slight blue undertone)
- **Surface:** #1c1c22 (elevated surfaces, navbar)
- **Card background:** #22222a (cards, panels)
- **Card border:** #2e2e38 (visible but subtle)
- **Text primary:** #e8e8ed (off-white, easier on the eyes)
- **Text secondary:** #9d9dab (readable secondary)
- **Text muted:** #6b6b7b (labels, hints)
- **Accent cyan:** #06b6d4
- **Accent violet:** #8b5cf6
- **Accent pink:** #ec4899
- **Accent yellow:** #fbbf24
- **Accent green:** #22c55e
- **Gradient:** linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)
- **Font:** Inter or Geist Sans (system font stack fallback)
- **Border radius cards:** 10-12px
- **Border radius buttons:** 20px (pill)

## Animations Strategy

All animations via Framer Motion unless noted:

- **Scroll reveal:** `fadeUp` variant (opacity 0→1, y 20→0), staggerChildren 0.1s, triggered by `whileInView`
- **Terminal typing:** Custom hook with interval-based character reveal
- **Page transitions:** `AnimatePresence` with fade + slight slide
- **Parallax:** `useScroll` + `useTransform` on hero background
- **Custom cursor:** Global cursor follower with scale effect on interactive elements
- **Hover effects:** `whileHover` scale(1.02-1.05), border glow via box-shadow transition
- **Orbital bubbles:** CSS `@keyframes` for continuous orbit, Framer Motion `layout` animation for expand/collapse with spring physics
- **Three.js hero:** Particle system or noise-based mesh, low opacity, responsive to mouse position

## i18n Structure

Using next-intl with App Router:

- Route structure: `/[locale]/...` (e.g., `/fr`, `/en`, `/kr`)
- Default locale: `en`
- Translation files: `messages/en.json`, `messages/fr.json`, `messages/kr.json`
- All static text is translated. Project descriptions and experience details included in translation files.

## Responsive Breakpoints

- Mobile: < 768px — single column, hamburger nav, orbital → grid fallback, terminal hidden or below
- Tablet: 768px - 1024px — two column where appropriate, reduced animations
- Desktop: > 1024px — full layout as designed

## File Structure

```
new-portfolio/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx      # Optional project detail pages
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── TechStack.tsx
│   │   └── Contact.tsx
│   ├── ui/
│   │   ├── Terminal.tsx
│   │   ├── OrbitalSystem.tsx
│   │   ├── SkillBubble.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ExperienceCard.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CustomCursor.tsx
│   │   └── LanguageSwitcher.tsx
│   └── three/
│       └── ParticleField.tsx
├── data/
│   ├── projects.ts
│   ├── experiences.ts
│   └── skills.ts
├── messages/
│   ├── en.json
│   ├── fr.json
│   └── kr.json
├── hooks/
│   ├── useTypingEffect.ts
│   └── useScrollReveal.ts
├── lib/
│   └── utils.ts
├── public/
│   └── images/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Data Models

### Project

```ts
interface Project {
  slug: string;
  name: string;
  description: string; // i18n key
  tags: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}
```

### Experience

```ts
interface Experience {
  company: string;
  role: string; // i18n key
  duration: string;
  description: string; // i18n key
  tags: string[];
  expandedDetails?: string; // i18n key
}
```

### Skill

```ts
interface Skill {
  name: string;
  icon: string;
  color: string;
  size: "sm" | "md" | "lg";
  yearsOfExperience: number;
  description: string; // i18n key
  subSkills: string[];
}
```

## Out of Scope

- Blog / articles section
- CMS integration
- Analytics (can be added post-launch)
- Project detail pages with full case studies (v2)
- Dark/light mode toggle (dark only)
