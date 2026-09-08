<p align="center">
  <img src="app/icon.svg" alt="Zerqua portfolio icon" width="96" />
</p>

<h1 align="center">Tom Hubert — Developer Portfolio</h1>

<p align="center">
  A multilingual, interactive portfolio built with Next.js, React, TypeScript, and Three.js.
</p>

<p align="center">
  <a href="https://zerqua.com"><strong>View the live portfolio</strong></a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-3D-000000?logo=three.js&logoColor=white" />
</p>

## Overview

This repository contains the source of [zerqua.com](https://zerqua.com), the portfolio of Tom Hubert, a React and Next.js developer focused on frontend and full-stack product development.

The experience combines a localized content system, an animated project gallery, motion-driven sections, and a functional contact form in a responsive single-page layout.

## Features

- English, French, and Korean locales with localized routes
- Professional experience, technical skills, and selected project sections
- Interactive project cards with image galleries and video support
- Framer Motion page and component animations
- Three.js particle background rendered with React Three Fiber
- Responsive navigation and custom desktop cursor interactions
- Contact form with validation, reCAPTCHA verification, and email delivery
- Localized metadata and locale-aware routing
- Standalone Next.js production output for self-hosted deployment

## Featured projects

The portfolio currently presents:

- **KuSoDu** — a native SwiftUI Sudoku app published on the App Store
- **Cafes in Seoul** — a React Native application for discovering cafés in Seoul
- **Draft Predictions** — a real-time League of Legends draft prediction platform
- **Bouldrr** — an AI-assisted climbing route application
- Additional product and frontend experiments

Project content is maintained in [`data/projects.ts`](data/projects.ts), while localized interface copy lives under [`messages/`](messages/).

## Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Motion | Framer Motion |
| 3D | Three.js, React Three Fiber, React Three Drei |
| Internationalization | next-intl |
| Forms | React Hook Form, Zod |
| Contact delivery | Nodemailer and Google reCAPTCHA |
| Deployment | Next.js standalone output behind a reverse proxy |

## Project structure

```text
app/
├── [locale]/       # Localized portfolio route
└── api/contact/    # Contact form endpoint

components/
├── layout/         # Navigation and page structure
├── sections/       # Hero, about, projects, experience, skills, contact
├── three/          # Three.js scene and particle effects
└── ui/             # Reusable interface components

data/               # Structured experience, project, and skill content
messages/           # English, French, and Korean translations
public/              # Images, videos, and static assets
```

## Getting started

### Prerequisites

- Node.js 20.9 or later
- npm

### Installation

```bash
git clone https://github.com/tomhubert50400/new-portfolio.git
cd new-portfolio
npm ci
```

### Environment variables

Create `.env.local` when you need the contact form:

```dotenv
GMAIL_USER=
GMAIL_APP_PASSWORD=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

The presentation pages can be developed without these values, but contact submissions require valid Gmail and reCAPTCHA credentials. Never commit `.env.local`.

### Development

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Localized pages are available at `/en`, `/fr`, and `/kr`.

## Production build

```bash
npm run build
npm run start
```

The Next.js configuration produces a standalone server bundle suitable for a self-hosted Node.js deployment.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build and run TypeScript validation |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Localization

Translations are stored as one JSON file per locale:

```text
messages/en.json
messages/fr.json
messages/kr.json
```

When adding or renaming a translation key, update all three files so every route keeps the same content structure.

## Deployment notes

The production site is self-hosted from the standalone Next.js output. A typical deployment needs:

1. A production build created with the public reCAPTCHA key available at build time
2. Runtime environment variables for the contact endpoint
3. The `public` and `.next/static` directories copied alongside the standalone server
4. A process manager and reverse proxy configured for the Node.js port

No credentials are stored in this repository.

## License

This repository does not currently include an open-source license. All rights are reserved by the author.
