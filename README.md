# 🌌 Zihad Hossain — Hyper-Animated Awwwards-Tier Portfolio

> Production-ready, hyper-animated creative developer portfolio built with **Next.js 16 (App Router, Turbopack, React 19)**, **Tailwind CSS v4**, **Matter.js Zero-Gravity Physics**, **Web Audio API Synth Arcade**, **Google Gemini 3.8 AI Assistant ("Ask ZORRO")**, **next-intl Multilingual Engine**, and **Supabase Backend Architecture**.

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js 16.4 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS v4, Custom Cyberpunk Neon Design Tokens, Glassmorphism Backdrop Blur
- **Physics & Motion:**
  - **Matter.js 2D Rigid Body Physics Engine** (`world.gravity.y = 0` Zero-Gravity mode with draggable, colliding tech badges)
  - **CSS Full-Screen Section Snap** (`snap-y snap-mandatory 100vh / 100dvh`) for both 16:9 PC and 9:19 Mobile
  - **Interactive 3D Isometric Developer Desk** with mouse-following dynamic perspective tilt
- **Multilingual Support:**
  - 🇺🇸 **English** (`en`)
  - 🇧🇩 **Bengali [বাংলা]** (`bn`)
  - 🇸🇦 **Arabic [العربية]** (`ar` with native `dir="rtl"`)
  - 🇫🇷 **French [Français]** (`fr`)
- **Arcade Zone:**
  - 🐍 **Retro Cyber Snake 2D** (Canvas 60FPS loop, food spawn, high score tracking)
  - 🏃 **Neon Cyber Runner** (Dino-style jump runner, laser obstacles)
  - 🔊 **Web Audio API DSP Synthesizer** (Custom 8-bit blips, chirps, jumps, and gameover sounds)
- **AI Core:**
  - 🤖 **"Ask ZORRO" AI Profile Assistant** powered by **Google Gemini API** (`gemini-3.8-flash` via `@google/genai`)
  - Real-time portfolio context injection (biography, skills, education, certifications, availability)
  - Strict anti-hallucination guardrails and multilingual compliance
- **Backend & Database:**
  - **Supabase PostgreSQL** schema with Row Level Security (RLS) policies
  - Public read access for portfolio data; authenticated CRUD for Admin CMS
  - Public storage bucket `portfolio-assets`
  - Fallback local store engine if Supabase environment variables are pending

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Populate your keys (or leave blank to run in full local demo mode):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Database Setup

Execute the provided SQL schema in your Supabase SQL Editor:
👉 File path: [`supabase/schema.sql`](file:///c:/Users/User/OneDrive/Desktop/zihad_portfolio/supabase/schema.sql)

This script creates:
1. `public.projects` — Title, description, tags, URLs, screenshot previews
2. `public.skills` — Languages, frameworks, proficiency metrics (0–100%)
3. `public.education` — Academic journey, degrees, institutions, distinctions
4. `public.certificates` — Verified credentials, badges, verification links
5. `public.meetings` — Booking appointments, client scope, budget estimates
6. Row Level Security (RLS) policies allowing public reads and secured admin CRUD
7. Seed data pre-populated for Zihad Hossain

---

## 🎮 Core Sections Walkthrough

| # | Section | Key Features |
|---|---|---|
| **1** | **Hero & Zero-G** | 3D Isometric Developer Desk with mouse tilt, kinetic typography, and **Matter.js Zero-Gravity Mode** toggle. |
| **2** | **Skills & Journey** | Neon-accented tech stack cards with glowing progress bars, and dynamic academic journey timeline. |
| **3** | **Projects & Certs** | Holographic project showcase with **"Code Inspector / X-Ray Mode"** DOM scanner, and interactive Certificate inspection modal. |
| **4** | **Retro Arcade** | Playable **Retro Snake 2D** and **Neon Cyber Runner** with Web Audio 8-bit sound effects and high score tracking. |
| **5** | **Book a Meeting** | Interactive calendar date & time slot picker, real-time scope/budget estimator, and **confetti celebration**. |
| **AI**| **Ask ZORRO** | Floating holographic AI assistant connected to `/api/zorro` with Gemini 3.8 Flash. |
| **CMS**| **Admin Dashboard** | Secure `/admin` route with CRUD forms for projects, skills, certs, and lead pipelines (Passcode: `zorro2026`). |

---

## 🛡️ Admin Access
Visit [http://localhost:3000/admin](http://localhost:3000/admin)
- **Passcode:** `zorro2026` (or `admin`)
