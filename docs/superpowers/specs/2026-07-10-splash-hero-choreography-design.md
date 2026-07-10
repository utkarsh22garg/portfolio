# Splash-Driven Hero Choreography — Design

**Date:** 2026-07-10
**Status:** Approved

## Goal

Make the hero's load-in feel seamless: a staggered curtain splash hands off directly
into the existing hero cascade (name letters, meta line, subheadline, scroll arrow),
so the entrance reads as one continuous motion instead of elements popping in on
independent timers.

Reference: a Framer-style "Creative Studio Showcase" page whose splash uses 10
staggered panels (5 columns x 2 rows) sliding away vertically.

## Decisions

- **Approach:** staggered curtain panels (reference-style), not a wordmark
  shared-element handoff or a single wipe.
- **Frequency:** once per browser session (`sessionStorage`), not every load.
- **Panel color:** white panels over the black page — an inversion of the reference.
- **Nav:** stays static (no entrance animation); it is simply revealed when panels clear.

## Components

### 1. `src/components/Splash.tsx` (new)

- Fixed full-screen overlay, `z-[9999]`, `pointer-events-none`.
- 10 white panels: 5 columns x 2 rows (top row + bottom row, each panel 20% wide,
  50% tall).
- On mount: top-row panels translate up 100%, bottom-row panels translate down 100%.
- Stagger: 50ms per column, left to right. Duration ~1s per panel.
- Ease: `cubic-bezier(0.96, -0.02, 0.38, 1.01)` (curtain ease from the reference).
- Implemented with motion/react variants (matches codebase conventions).
- Unmounts entirely (state flip on the last panel's completion) — nothing lingers
  in the DOM.
- Renders `null` when the splash is skipped (already seen this session, or
  reduced motion).

### 2. `src/lib/intro.ts` (new)

Single source of truth for the entrance timeline:

- Reads the `sessionStorage` flag `ug-intro-seen` once at module load; exports
  `introPlaying: boolean` and sets the flag when the splash will play.
- Exports `HANDOFF` — the moment the curtain is visually clear enough for hero
  type to start rising (~0.9s; panels are still exiting, which is what makes it
  a handoff rather than a sequence).
- Exports `delay(offset: number): number` — returns `HANDOFF + offset` when the
  splash plays this load, or just `offset` when skipped. Hero elements express
  their delays as offsets from curtain-clear.

### 3. `src/components/Hero.tsx` (edit)

Replace hard-coded delays with `delay(...)` offsets:

- Name letters (`KineticLine`): base offset `0` — begin rising at handoff. Their
  vertical rise mirrors the panels' vertical exit (shared motion language).
  Per-letter stagger (0.045s) unchanged.
- Meta line ("TECH LEAD ..."): offset `+0.15s`.
- Subheadline: offset `+0.45s`.
- Scroll arrow block: offset `+0.7s`.
- Ease unchanged: `[0.16, 1, 0.3, 1]`.

### 4. `src/pages/Index.tsx` (edit)

Render `<Splash />` as the first child (above `SmoothScroll` etc.).

## Behavior matrix

| Scenario | Splash | Hero cascade |
|---|---|---|
| First visit in session | Plays (~1.3s total) | Starts at handoff (~0.9s) |
| Reload / back-nav same session | Skipped | Starts immediately, same relative offsets |
| New tab / new session | Plays | Starts at handoff |
| `prefers-reduced-motion` | Skipped | Elements appear without transforms (existing `useReducedMotion` pattern) |

## Constraints

- GPU-only animation: panels animate `transform` (translateY) only — no layout,
  filter, or paint-heavy properties.
- No new dependencies; motion/react is already in use.
- Mobile: identical behavior; transforms are cheap.

## Error handling

- `sessionStorage` access wrapped in try/catch (private browsing / storage
  disabled): on failure, treat as "not seen" and play the splash — worst case is
  the splash plays more often, never a broken page.

## Testing

- Manual verification via dev server: first load (splash + handoff), reload
  (no splash, immediate cascade), reduced-motion emulation (no splash, no
  transforms), mobile viewport.
- Confirm the splash unmounts (element gone from DOM after ~1.5s).
