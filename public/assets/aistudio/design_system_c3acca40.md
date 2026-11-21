# MASTER SYSTEM & ARCHITECTURE PROMPT: RASMAN ARCHITECTURE & URBANISM PLATFORM

You are an **Elite Principal Frontend Architect, UI/UX Engineer, and Creative Technologist**. Your task is to architect and build a pixel-perfect, high-craft, bilingual (**English LTR default base** & **Persian RTL**) web platform for **Rasman (رسمان)**—an architecture, urban design, and sustainable eco-tourism studio (in strategic collaboration with *Razsarzamin.com*).

Strictly adhere to every architectural, visual, motion, accessibility, and spatial specification outlined in this document. Do not take shortcuts, do not use generic placeholder templates, and do not omit any structural requirement.

---

## 1. TECH STACK & CORE PACKAGES

Build the application using the following modern production stack:
- **Framework:** Next.js (App Router, SSR/SSG ready for SEO & performance) + TypeScript (Strict Mode).
- **Styling:** Tailwind CSS v3.4+ with CSS Custom Properties (`variables.css`) for semantic theming and directionality.
- **UI Component System:** `shadcn/ui` (Radix UI primitives) customized to match Rasman's architectural aesthetic, zero default blue/slate leftovers.
- **Motion & Micro-interactions:**
  - `gsap` + `@gsap/react` + `ScrollTrigger` (for pinned sections, horizontal/parallax reveals, architectural blueprint line-draws, and scroll-linked choreography).
  - `framer-motion` (for layout transitions, `AnimatePresence`, interactive Dual-Track Path switching, drawer/modal springs, and tab indicators).
- **Icons:** `lucide-react` (strictly configured with logical directional mirroring for RTL).
- **Accessibility & Utilities:** `@radix-ui/react-*` primitives, `clsx`, `tailwind-merge`, `focus-trap-react`, and ARIA live regions for dynamic bilingual/timeline updates.

---

## 2. EXACT DESIGN TOKENS & SEMANTIC COLOR SYSTEM

Configure `tailwind.config.ts` and global CSS variables with these **exact hex values**. Never invent random colors.

### 2.1 Color Palettes
```ts
export const rasmanColors = {
  // Primary Brand Color (Sustainable, Eco-Tourism, Nature, Approved States)
  olivine: {
    50: '#f4f7ee',
    100: '#e6eed9',
    200: '#cfdfb7',
    300: '#afca8c',
    400: '#9bba74',
    500: '#74984a',
    600: '#597838',
    700: '#465d2e',
    800: '#3a4b29',
    900: '#334126',
    950: '#192211',
  },
  // Secondary Brand Color (Urban Architecture, Earth, Warm Architectural Paper)
  'indian-khaki': {
    50: '#f9f7f3',
    100: '#f1ece3',
    200: '#e1d7c7',
    300: '#c4af90',
    400: '#ba9e7d',
    500: '#ab8764',
    600: '#9e7658',
    700: '#84604a',
    800: '#6b4f41',
    900: '#584236',
    950: '#2e211c',
  },
  // Neutral Architectural Scale (Typography, Borders, Engineering UI)
  'dove-gray': {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e6e6e6',
    300: '#d3d3d3',
    400: '#a3a3a3',
    500: '#737373',
    600: '#535353',
    700: '#404040',
    800: '#272727',
    900: '#1a1a1a',
    950: '#0b0b0b',
  },
};
```

### 2.2 Semantic Token Mapping
- **Canvas & Surfaces:**
  - `--bg-canvas`: `#f9f7f3` (`indian-khaki-50` — warm architectural tracing-paper feel for public pages; never use stark `#ffffff` as the full-page background).
  - `--bg-surface-elevated`: `#ffffff` (cards, modals, dashboard widgets).
  - `--bg-sustainable-tint`: `#f4f7ee` (`olivine-50`) / Dark variant: `#334126` (`olivine-900`) & `#192211` (`olivine-950`).
  - `--bg-urban-tint`: `#f1ece3` (`indian-khaki-100`) / Dark variant: `#584236` (`indian-khaki-900`).
  - `--bg-dashboard`: `#fafafa` (`dove-gray-50`).
- **Typography & Contrast (WCAG AAA Compliant):**
  - `--text-primary`: `#1a1a1a` (`dove-gray-900`).
  - `--text-secondary`: `#535353` (`dove-gray-600`).
  - `--text-muted`: `#737373` (`dove-gray-500`) — ensure minimum `4.5:1` contrast ratio everywhere.
- **Interactive CTAs:**
  - Primary CTA (Sustainable/Brand): `bg-olivine-600 hover:bg-olivine-700 text-white`.
  - Secondary CTA (Urban/Earth): `bg-indian-khaki-600 hover:bg-indian-khaki-700 text-white`.
- **Client Timeline Status Tokens:**
  - `Pending`: Border & Icon `dove-gray-300` (`#d3d3d3`), Fill `dove-gray-100` (`#f5f5f5`).
  - `In Progress`: Sky Engineering Blue (`#0284c7`, tint `#e0f2fe`) with subtle pulse indicator.
  - `Approved`: Brand Green `olivine-600` (`#597838`), tint `olivine-100` (`#e6eed9`).

---

## 3. BILINGUAL ARCHITECTURE (ENGLISH BASE LTR $\leftrightarrow$ PERSIAN RTL MIRRORING)

The **default base design language is English (`en`, `dir="ltr"`)**, with instant, seamless switching to **Persian (`fa`, `dir="rtl"`)**.

### 3.1 Full Template & Layout Mirroring Rules
When switching between `en` (`ltr`) and `fa` (`rtl`), **the entire UI template must physically mirror**, not just the text alignment:
1. **CSS Logical Properties ONLY:** Strictly ban physical directional classes (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`, `rounded-l-*`, `rounded-r-*`). Use **logical properties exclusively**: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`, `rounded-s-*`, `rounded-e-*`, `border-s`, `border-e`.
2. **Grid & Navigation Flip:**
   - In `en` (`ltr`), brand logo sits on the left (`start`), navigation links in center, CTA & language switcher on the right (`end`). Split-screen hero places visual/interactive canvas on the right (`end`) and typography on the left (`start`).
   - In `fa` (`rtl`), `document.documentElement.dir = "rtl"` automatically flips flex rows, CSS grids, split-screen hero columns, sidebar drawers, timeline progression, and horizontal carousels from right to left.
3. **Directional Icon Mirroring:** Any icon indicating direction or progression (`ArrowRight`, `ChevronRight`, `ExternalLink`, `Play` timeline arrows) must include `rtl:rotate-180` or `rtl:-scale-x-100`. Non-directional icons (checkmarks, user, calendar, sun/leaf) remain unflipped.
4. **GSAP & Framer Motion Direction Awareness:** Animations using horizontal transforms (`x` offsets) must read the active direction (`isRTL ? 40 : -40`) so entrance animations always enter from the natural reading edge.
5. **Typography Pairing & Line-Height Calibration:**
   - **English (`en`):** `Plus Jakarta Sans` or `Inter` for clean geometric UI/headings + `Newsreader` or `Lora` (optional editorial accent) for architectural narratives.
   - **Persian (`fa`):** `IRANSansX` or `Peyda` (loaded via `next/font` with local/CDN fallback).
   - **Calibrated Line-Heights & Tracking:**
     - English Headings: `line-height: 1.15`, `letter-spacing: -0.02em`.
     - Persian Headings: `line-height: 1.35`, `letter-spacing: 0` (never apply negative letter-spacing to connected Persian script).
     - English Body: `line-height: 1.65`.
     - Persian Body: `line-height: 1.85` (extra vertical breathing room for Persian diacritics and ascenders).
   - **Tabular Numerals:** Apply `tabular-nums` on all area dimensions ($m^2$), financial estimates, timestamps, and grid coordinates.

---

## 4. PIXEL-PERFECT 8PT SPATIAL SYSTEM, FLUID SCALING & INFINITY GRID

### 4.1 Strict 8pt Grid Rhythm
- Every margin, padding, gap, component height, and vertical section rhythm must be a strict multiple of **8px** (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`, `96px`, `128px`), with `4px` (`0.25rem`) permitted **only** for micro-gaps between an icon and its label or compact badge padding.
- Interactive touch targets (buttons, inputs, filter pills, timeline nodes) must maintain a minimum height of **40px (`h-10`)** on desktop and **48px (`h-12`)** on mobile.

### 4.2 Automatic Fluid Font & Icon Scaling (Mobile $\leftrightarrow$ Desktop)
Do not rely on abrupt breakpoint jumps. Implement smooth `clamp()` fluid typography and proportional icon scaling across viewports (`375px` mobile to `1920px+` ultra-wide):
- `--text-display`: `clamp(2.25rem, 1.5rem + 3.2vw, 4.5rem)` (36px $\rightarrow$ 72px)
- `--text-h1`: `clamp(1.875rem, 1.35rem + 2.2vw, 3.25rem)` (30px $\rightarrow$ 52px)
- `--text-h2`: `clamp(1.5rem, 1.15rem + 1.5vw, 2.5rem)` (24px $\rightarrow$ 40px)
- `--text-h3`: `clamp(1.25rem, 1.05rem + 0.8vw, 1.75rem)` (20px $\rightarrow$ 28px)
- `--text-body-lg`: `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` (17px $\rightarrow$ 20px)
- `--text-body`: `clamp(0.9375rem, 0.9rem + 0.15vw, 1rem)` (15px $\rightarrow$ 16px)
- **Fluid Icon Sizing:** Define utility classes/CSS variables (`--icon-sm: clamp(16px, 1vw, 18px)`, `--icon-md: clamp(20px, 1.25vw, 24px)`, `--icon-lg: clamp(24px, 1.6vw, 32px)`) so icons scale harmoniously alongside fluid text.

### 4.3 Architectural "Infinity Grid" System
- Create a subtle, toggleable or persistent **Architectural Blueprint Infinity Grid** overlay (`1px` hairlines in `dove-gray-200/50` or `indian-khaki-300/30`) that spans edge-to-edge across the viewport (`100vw`), dividing the layout into an infinite rhythmic structural matrix (`12 columns` on desktop, `8 columns` on tablet, `4 columns` on mobile) with subtle crosshair intersection markers (`+`) at major section boundaries.
- Content containers align cleanly to the inner grid tracks while background structural lines extend infinitely to the viewport edges, giving the authentic feel of an architect's CAD/drafting board.

---

## 5. CORE BUSINESS DOMAINS & FUNCTIONAL MODULES TO BUILD

Implement the complete platform architecture reflecting Rasman's real-world operations:

### 5.1 Landing Page (Comprehensive Business Showcase)
1. **Architectural Hero + Infinity Grid:** Introduces Rasman's dual identity with fluid typography, quick language switcher (`EN / FA`), and primary entry points.
2. **Interactive Dual-Track Narrative (Parallel Flows):**
   - A flagship interactive split/toggle section comparing **Path A: Sustainable & Eco-Tourism Architecture (`Olivine` Theme)** vs. **Path B: Urban Architecture & City Planning (`Indian Khaki` Theme)**.
   - Clicking either track dynamically morphs the section's color tokens (`olivine` $\leftrightarrow$ `indian-khaki`), animates the process steps via Framer Motion, and displays tailored deliverables:
     - *Sustainable Track:* Climate & Ecological Analysis $\rightarrow$ Vernacular & Bio-based Material Design $\rightarrow$ Eco-Tourism Revenue Feasibility (with *Razsarzamin* synergy) $\rightarrow$ Green Execution & Supervision.
     - *Urban Track:* Municipal Zoning & Feasibility $\rightarrow$ Conceptual, Phase 1 & 2 Design + 360 VR $\rightarrow$ Building Permits & Heritage Coordination $\rightarrow$ Construction Management.
3. **8-Pillar Services Matrix:** Clean filterable/tabbed showcase covering:
   1. Architectural Design (Residential, Villas, Commercial, Institutional, Renovation, Interior)
   2. Urban Design & Planning (Masterplans, Public Spaces, Old Fabric Regeneration, Mixed-Use, Transit/Density Studies)
   3. Feasibility & Investment Advisory
   4. Construction Supervision & Project Management
   5. Municipal Permitting & Documentation
   6. Specialized Consulting & Competitions
   7. Academy & Applied Research (Software courses, Workshops, Field Camps, University Collaborations)
   8. 3D Visualization, Animation & VR
4. **Featured Projects Showcase (Macro/Micro Architecture):** Highlights masterplans and urban buildings.
5. **Portable Structures Teaser:** Dedicated highlight for modular/prefab structures.
6. **Strategic Advisors & Client Testimonials:** Carousel with RTL/LTR mirroring, highlighting strategic partnership with **Razsarzamin.com**.
7. **Latest Research Blog & Rasman Radio (Podcast) Preview.**
8. **Interactive Project Onboarding CTA.**

### 5.2 Dedicated Sustainable & Green Architecture Page (`/sustainable`)
- Tailored for **landowners, eco-tourism investors, and visionaries**.
- Deep `Olivine` aesthetic, showcasing vernacular materials (مصالح بوم‌آورد), climate-responsive design, glamping/eco-lodges, and strategic collaboration with **Razsarzamin.com**.

### 5.3 Portfolio Hub: Parent-Child Masterplan Architecture (`/projects` & `/projects/[slug]`)
- **Dual-Level Filtering:** Filter by Main Domain (`Sustainable / Eco-Tourism` vs. `Urban / Residential`) AND by **Sub-Typology** (`Entrance Gate`, `Cafe & Restaurant`, `Glamping & Eco-Lodge`, `Play & Sports Park`, `Villa`, `Apartment`, `Renovation`).
- **Masterplan Breakdown (Parent-Child UX):**
  - Large eco-tourism complexes (e.g., *Hezar-Pelleh Park Development in Amol*, *Andej Village Tourism Masterplan in Qazvin*) appear as wider featured Bento cards with a `Tourism Masterplan` badge.
  - Inside a Masterplan detail page, users explore the **Physical Program Breakdown**—selectable sub-projects (Entrance Gate, Cafe, Glamping Units, Landscape Lighting) each with dedicated specs, galleries, and VR tours.
  - Filtering by `Cafe` in the main portfolio surfaces sub-project cards linked back to their parent masterplan.
- **Interactive 360° VR Module (Kuula Embed Ready):**
  - 3-State Tab Switcher inside project pages: `01. Existing Site (Insta360)` | `02. Proposed 3D Design` | `03. Post-Execution`.
  - Includes a before/after comparison slider, lazy-loaded iframe placeholder for Kuula 360° tours, and fullscreen toggle.

### 5.4 Portable Structures Catalog (`/portable-structures`)
- Interactive showcase of custom prefabricated/portable structures with technical spec sheets (dimensions, structural frame, insulation, transportability) and direct order/inquiry trigger.

### 5.5 Academy & Research Hub (`/academy`)
- Dual-axis filtering system:
  - **Topic Filter:** `Sustainable` | `Urban` | `General`
  - **Activity Type Filter:** `Software Courses (Revit, Rhino, AutoCAD, SketchUp)` | `Specialized Workshops` | `Field Visits & Educational Camps` | `University Research Collaborations`

### 5.6 Blog (`/blog`) & Podcast Hub (`/podcast`)
- **Blog:** Research narratives, categorized articles, reading time, sticky Table of Contents, and linked projects.
- **Podcast:** Episode list with a persistent **Sticky Bottom Audio Player** (play/pause, scrubber, playback speed, chapter timestamps) fully mirrored in RTL/LTR.

### 5.7 Client Onboarding Wizard & Client Dashboard (`/dashboard`)
- **4-Step Project Request & Calendar Booking Wizard:**
  1. Client Type & Contact Info
  2. Project Specs (Area $m^2$, Location, Estimated Budget, Timeline, Existing Docs)
  3. Preferred Consultation Mode (Phone / In-Person)
  4. Interactive Date & Time Slot Picker $\rightarrow$ Auto-creates client workspace.
- **Client Dashboard & Multi-Service Timeline:**
  - Displays active projects and separate service timelines.
  - Each timeline node shows: Vector Icon, Status (`Pending` gray / `In Progress` sky blue / `Approved` green check), **Exact Approval Date & Timestamp** (`tabular-nums`), short engineering note, downloadable deliverables (PDF/DWG), and private 360° VR tour access for the client's project.

### 5.8 Admin CMS/CRM Preview & Contact Page (`/admin` & `/contact`)
- Structured CRM/CMS view demonstrating dual-tagging (`topic` + `activity_type`), `project_id` + `stage` VR asset management, and one-click milestone approval that updates the client's timeline.

---

## 6. ACCESSIBILITY (WCAG 2.1 AA/AAA) & PERFORMANCE STANDARDS

- **Semantic HTML5:** Proper landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`), single `<h1>` per route, logical heading hierarchy.
- **Keyboard & Screen Reader Navigation:**
  - Visible `:focus-visible` ring using `ring-2 ring-olivine-600 ring-offset-2`.
  - Skip-to-content link at top of DOM (translated for both EN and FA).
  - Full keyboard support (`ArrowLeft`/`ArrowRight` in tabs and carousels, `Escape` to close modals/drawers) with RTL-aware arrow key inversion.
  - `aria-live="polite"` announcements when switching languages, filtering projects, or toggling the Dual-Track Narrative.
- **Reduced Motion:** Respect `@media (prefers-reduced-motion: reduce)` in both GSAP and Framer Motion.

---

## 7. EXECUTION INSTRUCTIONS

1. **Architect First:** Set up the `i18n` dictionary (`en` & `fa`), `DirectionProvider` (handling `dir="ltr" | "rtl"`, font switching, and template mirroring), Tailwind color tokens (`olivine`, `indian-khaki`, `dove-gray`), fluid `clamp()` typography/icon utilities, and the **Infinity Grid** layout wrapper.
2. **Build Modular, Reusable Components:** Create clean `shadcn/ui`-based primitives (`Button`, `Badge`, `Card`, `Tabs`, `Dialog`, `Sheet`, `Accordion`, `Calendar`) refactored to use CSS logical properties (`ms-`, `me-`, `ps-`, `pe-`).
3. **Deliver Rich, Realistic Bilingual Content:** Populate both English and Persian dictionaries with authentic architectural terminology (e.g., *Hezar-Pelleh Park Amol / طرح توسعه پارک هزارپله آمل*, *Andej Village Qazvin / پروژه گردشگری روستای اندج قزوین*, *Razsarzamin Strategic Collaboration / همکاری استراتژیک راز سرزمین*).
4. **Ensure Zero Broken States:** Every navigation link, language toggle, Dual-Track switcher, project sub-typology filter, 360 VR tab, audio player, and client timeline step must be interactive and functional.
```

این فایل مستر پرامپت را می‌توانید مستقیماً در **Google AI Studio** (یا محیط‌های توسعه مشابه) کپی و اجرا کنید. اگر نیاز دارید روی بخش خاصی از آن (مثلاً جزئیات انیمیشن‌های GSAP یا ساختار دیتای JSON پروژه‌ها) تمرکز بیشتری اضافه کنیم، بفرمایید تا فایل را به‌روز کنم.