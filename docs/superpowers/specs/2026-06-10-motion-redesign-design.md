# Design Spec: Editorial Brutalism, Set in Motion

**Date:** 2026-06-10
**Status:** Approved (autonomous session — user granted full creative freedom)

## Goal

Evolve the existing Editorial Brutalism design system from a static poster into a
cinematic, scroll-choreographed experience. Apply 2026 portfolio trends — kinetic
typography, scroll storytelling, velocity-reactive motion, custom cursors, and
hidden easter eggs — without abandoning the monochrome monolith identity.

## What stays

- The monochrome palette, no-line rule, extreme scale disparity, sharp corners.
- Section structure: Hero → Stack → Journey → Publications → Works → CTA → Footer.
- The Delaunay mesh hero background and the UTKARSH GARG → UG nav collapse.
- All content sourced from `src/data/config.json`.

## What changes

### 1. Typography (identity upgrade)

Inter is generic; the system deserves characterful type.

- **Display:** `Anton` — ultra-condensed poster grotesque. Used for `.text-huge`
  and section headlines. Single weight, built for uppercase monoliths.
- **Body:** `Archivo` — neo-grotesque with editorial warmth, variable weights.
- **Meta/labels:** `IBM Plex Mono` — monospace metadata is the 2026 editorial
  signature; replaces tracked-out Inter for `.text-meta`, tags, and indices.

Loaded via Google Fonts `<link>` in `index.html` with `display=swap`.

### 2. Motion foundation

- **Smooth scrolling:** `lenis` (new dep) for inertial scroll. Nav anchors use
  `lenis.scrollTo`. Disabled under `prefers-reduced-motion`.
- **Motion primitives** (`src/components/motion/`), built on the installed
  `motion` (motion/react) library:
  - `Reveal` — viewport-entry wrapper: rise + fade (and optional clip), staggered children.
  - `KineticHeading` — per-line clip-mask rise for big headlines.
  - `Counter` — count-up number when scrolled into view.
  - `Magnetic` — cursor-attraction wrapper for buttons/links (desktop only).
  - `Marquee` — infinite text band whose speed/direction reacts to scroll velocity.
- **ScrollProgress** — 2px white hairline fixed at the top, scaleX = scroll progress.
- **CustomCursor** — desktop-only dot + trailing ring with `mix-blend-difference`;
  ring expands over interactive elements. Hidden on touch/reduced-motion.
- All motion respects `useReducedMotion()`.

### 3. Section choreography

- **Hero:** name reveals per-line through clip masks on load; meta line types in;
  hero content parallaxes up and fades as you scroll past ("cinematic exit").
  Individual headline letters subtly shove away from the cursor on hover (egg-adjacent).
- **Stats strip** (new, after Hero): 5+ years / 12× data throughput / 9.16 CGPA /
  317 global rank — Counter-driven, in IBM Plex Mono.
- **Marquee band** (new, between Stack and Journey): outline/solid alternating
  "FULL-STACK · TYPESCRIPT · REACT · NODE · PYTHON" text, velocity-reactive.
- **Stack:** columns stagger-reveal; rows get index-line hover sweep.
- **Journey:** entries reveal on scroll; images parallax within their frames and
  de-grayscale on hover; the big index numbers slide in.
- **Publications/Works:** headline kinetic reveal, cards rise with stagger,
  award rows cascade.
- **CTA:** "LET'S BUILD" letters wave on hover; buttons are Magnetic.
- **Footer:** live IST clock (`ASIA/KOLKATA`), back-to-top.

### 4. Easter eggs

1. **Console signature** — ASCII "UG" + recruiting note in the dev console.
2. **Konami code** (↑↑↓↓←→←→BA) — "COLOR LEAK": the strictly-monochrome site
   briefly floods its accents with acid chartreuse (#CCFF00), with a mono toast
   "YOU BROKE THE MONOCHROME." Press again to restore.
3. **`G` key** — toggles a designer baseline/column grid overlay, like the
   design tools the site was built with.
4. **Logo affection** — clicking the UG logo 5 times rapidly makes it do a
   360° spin and flashes "OK, THAT'S ENOUGH." in the nav.

### 5. Performance & accessibility

- Animations are transform/opacity only (GPU-composited), honoring the
  established logo-animation precedent.
- IntersectionObserver-driven reveals (via motion's `whileInView`) — nothing
  animates off-screen.
- `prefers-reduced-motion`: lenis off, reveals become simple fades, cursor and
  marquee static.
- Body copy contrast keeps ≥ 4.5:1 per the existing accessibility note.

## Non-goals

- No content changes, no new pages, no light theme, no 3D/WebGL beyond the
  existing mesh (keeps bundle lean on GitHub Pages).
