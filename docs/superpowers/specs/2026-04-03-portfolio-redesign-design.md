# Portfolio Redesign — Design Spec
**Date:** 2026-04-03  
**Design System:** Editorial Brutalism (see `docs/DESIGN.md`)  
**Stitch References:** Home screen (`c0840dc5a55147d98da913a56393ce8b`), Experience screen (`98e1c4e6a18b4532bb24caea4f949ba7`)

---

## 1. Goal

Redesign the existing portfolio single-page app from its current dark-green card-based aesthetic to the "Monolith" Editorial Brutalism design system. The redesign matches two Stitch screens while preserving all real content from `src/data/config.json`.

---

## 2. Stack (unchanged)

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui (components inherit new tokens automatically)
- Content source: `src/data/config.json`

---

## 3. Approach: Build Alongside, Then Swap (Option C)

New section components are built in parallel. Existing components (`Navigation`, `Hero`, `Footer`) are rewritten in-place. `Index.tsx` is updated last to wire everything together. The old design remains intact until all new components are ready.

---

## 4. Page Structure (Single-Page App)

```
Nav (fixed)
└── Hero
└── TechnicalMastery   (01 — STACK)
└── Journey            (02 — JOURNEY)
└── Publications       (03 — PUBLICATIONS)
└── SelectedWorks      (04 — PORTFOLIO)
└── CTASection
└── Footer
```

Nav scroll-spy tracks: `home`, `stack`, `journey`, `publications`, `portfolio`

---

## 5. Global Theme (`src/index.css`)

### CSS Variable Replacements
Replace all existing color tokens with the Editorial Brutalism palette:

| Token | Value |
|---|---|
| `--background` | `#000000` |
| `--foreground` | `#ffffff` |
| `--primary` | `#ffffff` |
| `--on-primary` | `#1a1c1c` |
| `--surface` | `#131313` |
| `--surface-container-lowest` | `#0e0e0e` |
| `--surface-container-low` | `#1b1b1b` |
| `--surface-container` | `#1f1f1f` |
| `--surface-container-high` | `#2a2a2a` |
| `--surface-container-highest` | `#353535` |
| `--surface-bright` | `#393939` |
| `--on-surface` | `#e2e2e2` |
| `--on-surface-variant` | `#c6c6c6` |
| `--outline` | `#919191` |
| `--outline-variant` | `#474747` |
| `--muted-foreground` | `#6b7280` |

### Border Radius
All radius tokens set to `0px`. Exception: `border-radius-full` remains `9999px` for pill shapes only.

### Font
Add to `index.html`: Google Fonts import for Inter (weights 100, 300, 400, 500, 700, 900).  
Set `font-family: 'Inter', sans-serif` as base body font.

### Custom Utilities (add to `index.css`)
```css
.text-huge {
  font-size: clamp(4rem, 12vw, 16rem);
  line-height: 0.85;
  letter-spacing: -0.05em;
}
.text-meta {
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
  color: #6b7280;
  text-transform: uppercase;
}
```

### Remove
- `--hero-gradient`, `--accent-glow`, `--accent-blue`, `--dot-pattern`, `--text-large`
- All green/cyan color tokens
- `.bg-hero-gradient`, `.bg-dot-pattern` utilities

---

## 6. Component Designs

### 6.1 Navigation (`src/components/Navigation.tsx` — rewrite internals)

**Structure:**
- Fixed, `w-full z-50`, `bg-black/70 backdrop-blur-xl`, `border-b border-white/10`
- Padding: `px-12 py-8`
- Left: `UTKARSH GARG` text in `text-xl font-black tracking-tighter text-white` (replaces logo image)
- Center (hidden on mobile): nav links — HOME / STACK / JOURNEY / PUBLICATIONS / PORTFOLIO
  - Style: `text-[11px] font-bold uppercase tracking-tighter`
  - Active: `text-white border-b border-white pb-1`
  - Inactive: `text-neutral-500 hover:text-white transition-colors duration-300`
- Right: `CONTACT` text link (`text-[11px] font-bold uppercase tracking-tighter`) → `mailto:` link

**Remove:** Download Resume button, shadcn Button components, ScrollProgress bar, logo image import.  
**Keep:** Scrollspy logic (`useEffect` + `IntersectionObserver` pattern).  
**Section IDs to spy:** `home`, `stack`, `journey`, `publications`, `portfolio`

---

### 6.2 Hero (`src/components/Hero.tsx` — rewrite internals)

**Structure:**
- `min-h-screen flex flex-col justify-end px-12 pb-24 pt-48 bg-black`
- Top block (`mb-12`):
  - `.text-meta mb-6` — `TECH LEAD & FULL STACK DEVELOPER`
  - `.text-huge font-black uppercase` — `UTKARSH` / `GARG` (line break between)
- Bottom row (`grid grid-cols-12 gap-12 items-end`):
  - Left (col-span-8): subtitle `text-3xl md:text-5xl font-light tracking-tight text-neutral-400 max-w-4xl` — editorial rewrite of `config.personal.summary` opening (~120 chars)
  - Right (col-span-4): `↘` character in `text-6xl mb-4` + `.text-meta` — `SCROLL TO DISCOVER`, right-aligned

**Remove:** OrbitingCircles, FlipText, skill badges, decorative dot pattern divs, social icon buttons, CTA buttons.

---

### 6.3 TechnicalMastery (`src/components/TechnicalMastery.tsx` — new file)

**Section id:** `stack`  
**Background:** `bg-black` (default surface)  
**Padding:** `px-12 py-40`

**Header block (`mb-24`):**
- `.text-meta mb-8` — `01 — STACK`
- `text-7xl md:text-8xl font-black tracking-tighter leading-none` — `TECHNICAL` / `MASTERY`

**3-column grid** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12`):

| Column | Label | Skills from config |
|---|---|---|
| 01 / FRONTEND ARCHITECTURE | Languages & UI libs | JS, TS, HTML, CSS + ReactJS, Redux, MUI, Storybook |
| 02 / BACKEND SYSTEMS | Server & data | Node.js, Python, Python-Dask, React Testing Library, Mocha |
| 03 / INFRASTRUCTURE | Tools & ops | Git, Linux, JupyterLab, VS Code, SQL |

**Each column:**
- `border-t border-white/10 pt-10 group hover:border-white transition-colors duration-500`
- Column header: `text-xs font-black tracking-[0.3em] uppercase text-white/40 group-hover:text-white transition-colors`
- Each skill item:
  - Skill name: `text-2xl font-bold tracking-tight text-white`
  - Descriptor tag: `text-xs uppercase tracking-widest text-neutral-500 mt-1`

**No cards, no icons, no badges.**

---

### 6.4 Journey (`src/components/Journey.tsx` — new file)

**Section id:** `journey`  
**Background:** `bg-black`  
**Padding:** `pt-40 pb-20 px-12`

**Header block (`mb-32`):**
- `.text-meta mb-4` — `02 — JOURNEY`
- `.text-huge font-black uppercase text-white` — `JOURNEY.`

**Timeline** (`space-y-64`) — one entry per `config.experience` item:

**Each role** (`grid grid-cols-12 gap-8 items-start`):
- Col 1-2: `text-6xl md:text-8xl font-black text-white/20 block` — `01`, `02`, `03`
- Col 3-9:
  - Date: `.text-meta mb-2` — from `config.experience[n].duration`
  - Title: `text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none mb-4` — from `config.experience[n].position`
  - Company: `text-2xl font-light text-neutral-400 tracking-tight` — from `config.experience[n].company`
  - Summary: `text-on-surface leading-snug font-normal mt-8 max-w-2xl` — from `config.experience[n].description`
  - Bullets: `border-l border-white/10 pl-6 py-2 space-y-4` — from `config.experience[n].achievements` (first 3)
    - Each: `text-sm text-neutral-400 leading-relaxed`
- Col 10-12: Grayscale image placeholder — `bg-[#1f1f1f] h-64 overflow-hidden` with a subtle abstract gradient. No external image dependency.

---

### 6.5 Publications (`src/components/Publications.tsx` — rewrite internals)

**Section id:** `publications`  
**Background:** `bg-[#0e0e0e]` (surface-container-lowest — creates visual separation from Journey)  
**Padding:** `px-12 py-40`

**Header block (`mb-24`):**
- `.text-meta mb-8` — `03 — PUBLICATIONS`
- `text-7xl md:text-8xl font-black tracking-tighter leading-none` — `PUBLICATIONS`

**Each publication** (`space-y-24`) — from `config.publications`:
- Layout: `grid grid-cols-12 gap-8`
- Col 1-2: Index number `01` in `text-8xl font-black text-white/20`
- Col 3-12:
  - Journal + date: `.text-meta mb-4` — `IEEE — NOV 2020`
  - Title: `text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6`
  - Abstract excerpt: `text-sm text-neutral-400 leading-relaxed max-w-3xl mb-8` — first ~200 chars of `config.publications[n].description`
  - Link: `text-[11px] font-bold uppercase tracking-widest underline decoration-[0.5px] underline-offset-4 hover:text-neutral-300 transition-colors` — `→ READ PAPER` linking to `config.publications[n].link`

**No cards, no dividers.**

---

### 6.6 SelectedWorks (`src/components/SelectedWorks.tsx` — new file)

**Section id:** `portfolio`  
**Background:** `bg-[#0e0e0e]`  
**Padding:** `px-12 py-40`

**Header block (`mb-24`):**
- Flex row, justify-between, items-baseline
- Left:
  - `.text-meta mb-4` — `04 — PORTFOLIO`
  - `text-8xl font-black tracking-tighter` — `SELECTED` / `WORKS`
- Right (max-w-md): descriptor `text-on-surface-variant leading-relaxed` — `A curation of projects where engineering meets precision.`

**Bento grid** (`grid grid-cols-12 gap-12`) — from `config.projects`:
- Each project (col-span-8 for first, col-span-4 for subsequent):
  - Image placeholder: `aspect-[16/10] bg-[#2a2a2a] overflow-hidden mb-6 relative` with subtle gradient
  - Category tag: `.text-meta mb-1` — technologies joined
  - Project name: `text-3xl font-bold`
  - Description: `text-sm text-neutral-400 mt-2 max-w-xl`
  - Arrow: `→` character, `group-hover:translate-x-2 transition-transform`
- If only 1 project in config: render it full-width (col-span-12)

**Awards subsection** (`mt-24 space-y-8`) — from `config.awards`:
- Header: `text-meta mb-12` — `RECOGNITION`
- Each: flex row between `text-2xl font-bold` title + `.text-meta` year

---

### 6.7 CTASection (`src/components/CTASection.tsx` — new file)

**Background:** `bg-black`  
**Padding:** `px-12 py-64 text-center`

- `.text-meta mb-12` — `HAVE A PROJECT IN MIND?`
- `.text-huge font-black uppercase mb-12 hover:italic cursor-pointer transition-all` — `LET'S BUILD`
- Button row (`flex flex-col md:flex-row justify-center gap-12 mt-24`):
  - Primary: `px-12 py-6 bg-white text-black font-bold uppercase tracking-widest text-sm hover:invert transition-all` — `START A CONVERSATION` → `window.open('mailto:...')`
  - Secondary: `px-12 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all` — `DOWNLOAD RESUME` → triggers resume download

---

### 6.8 Footer (`src/components/Footer.tsx` — rewrite internals)

**Background:** `bg-black border-t border-white/5`  
**Padding:** `py-20 px-12`  
**Layout:** `flex flex-col md:flex-row justify-between items-start gap-8`

- Left column:
  - `UTKARSH GARG` — `text-lg font-bold uppercase tracking-tighter`
  - Tagline: `.text-meta text-neutral-600 max-w-[200px]` — `BUILDING SCALABLE DIGITAL SYSTEMS.`
- Right column (`flex flex-wrap gap-x-16 gap-y-8`):
  - SOCIALS group: LinkedIn, GitHub, Medium — each `.text-meta text-neutral-600 hover:text-white underline decoration-[0.5px] underline-offset-4 duration-500`
  - CONTACT group: email + location — `.text-meta`
- Bottom (`self-end`): `© 2025 UTKARSH GARG. ALL RIGHTS RESERVED.` — `.text-meta text-neutral-600`

**Remove:** shadcn Button, Heart icon, "Built with React" line, Quick Links column.

---

### 6.9 Index.tsx (update last)

```tsx
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechnicalMastery from "@/components/TechnicalMastery";
import Journey from "@/components/Journey";
import Publications from "@/components/Publications";
import SelectedWorks from "@/components/SelectedWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="bg-black min-h-screen">
    <Navigation />
    <Hero />
    <TechnicalMastery />
    <Journey />
    <Publications />
    <SelectedWorks />
    <CTASection />
    <Footer />
  </div>
);
```

**Remove imports:** About, Experience, Projects (old components — files can be deleted after).

---

## 7. Files to Create
- `src/components/TechnicalMastery.tsx`
- `src/components/Journey.tsx`
- `src/components/SelectedWorks.tsx`
- `src/components/CTASection.tsx`

## 8. Files to Rewrite (internals only)
- `src/index.css`
- `src/components/Navigation.tsx`
- `src/components/Hero.tsx`
- `src/components/Publications.tsx`
- `src/components/Footer.tsx`
- `src/pages/Index.tsx`
- `index.html` (add Inter font import)

## 9. Files to Delete (after Index.tsx is updated)
- `src/components/About.tsx`
- `src/components/Experience.tsx`
- `src/components/Projects.tsx`
- `src/components/magicui/orbiting-circles.tsx`
- `src/components/magicui/flip-text.tsx`
- `src/components/magicui/scroll-progress.tsx`

## 10. Files Unchanged
- `src/data/config.json` (content source, no changes)
- `src/assets/resume.pdf`
- All `src/components/ui/*` (shadcn components inherit new tokens)
- `vite.config.ts`, `tsconfig.json`, `package.json`

---

## 11. Design Rules Checklist (from DESIGN.md)
- [ ] No rounded corners on any section, card, or image container
- [ ] No 1px solid borders for section dividers — use whitespace and background shifts
- [ ] No icons as a crutch — typography communicates meaning
- [ ] No colored accents — strictly monochromatic
- [ ] Grayscale images only (CSS `filter: grayscale(1)`)
- [ ] Glassmorphism on nav (`bg-black/70 backdrop-blur-xl`)
- [ ] `.text-meta` immediately following display headlines (High-Low pairing)
- [ ] 160px+ vertical padding between sections
- [ ] `on-surface-variant` (#C6C6C6) maintains 4.5:1 contrast ratio on `surface` (#131313)
