# "UG Decode" Splash Screen — Design

**Date:** 2026-07-12
**Status:** Approved

## Goal

Add a splash screen that plays once per browser session: a giant `UG` monogram
decodes through scramble glyphs on a black overlay, then rises out as the hero
cascade begins — one continuous entrance (~1.5s total) in the site's existing
terminal/decode motion language.

This replaces the abandoned curtain-panel approach (spec deleted in `61fd1af`).
The direction chosen instead extends the portfolio's own identity — the
`DecodeText` glyph scramble, the cyan `#67e8f9` interaction accent, and the
hero letters' clip-mask rise — rather than importing a Framer-style trope.

## Decisions

- **Direction:** terminal boot / decode, not curtain panels or a percentage
  preloader.
- **Duration:** brief (~1.5s), no boot-log theatrics.
- **Frequency:** once per browser session (`sessionStorage`), skipped on
  reload and back-navigation.
- **Composition:** `UG` monogram (matches the favicon) center-screen with a
  tiny tracked-out label above it — the style guide's signature high-low
  pairing. Full-name decode was rejected because the hero repeats the name
  seconds later.
- **Exit:** monogram and label rise out through a clip mask (translateY
  −110%), mirroring the hero letters' entrance; overlay fades and unmounts.
- **Nav:** stays static; the overlay simply covers it until it clears.

## Components

### 1. `src/lib/intro.ts` (new)

Single source of truth for the entrance timeline:

- Reads the `sessionStorage` flag `ug-intro-seen` once at module load,
  wrapped in try/catch (private browsing / storage disabled → treat as
  "not seen" and play the splash; fail open, never a broken page).
- Exports `introPlaying: boolean`; sets the flag when the splash will play.
- Exports `HANDOFF ≈ 1.0s` — the moment the splash is visually clear enough
  for hero type to start rising (splash elements are still exiting, which is
  what makes it a handoff rather than a sequence).
- Exports `delay(offset: number): number` — returns `HANDOFF + offset` when
  the splash plays this load, plain `offset` when skipped.

### 2. `src/components/Splash.tsx` (new)

- Fixed full-screen overlay, `z-[9999]`, `pointer-events-none`, `bg-black`
  (matches the hero section's actual background so the fade is invisible).
- **Label:** `UTKARSH GARG — PORTFOLIO / 2026` above the monogram, rendered
  with the existing `DecodeText` component (`text-meta` styling,
  neutral-500).
- **Monogram:** giant `UG` in display type; a small two-char decoder
  (interval-driven, like the hero's `scramble()`) cycles each char through
  the shared `SCRAMBLE` glyph set every ~45ms, colored `#67e8f9` while
  unresolved, snapping to white when locked (`U` ~0.55s, `G` ~0.75s).
- **Timeline:** decode 0–0.8s → beat → rise-out 0.9–1.4s (clip-mask
  translateY −110%, ease `[0.16, 1, 0.3, 1]`) → overlay opacity fade →
  unmount entirely (state flip on exit completion; nothing lingers in the
  DOM).
- Renders `null` when skipped (already seen this session, or
  `prefers-reduced-motion` via the existing `useReducedMotion` pattern).

### 3. `src/components/Hero.tsx` (edit)

Wrap the five hard-coded entrance delays in `delay(...)` from `intro.ts`,
keeping current values as offsets:

- Meta line (`DecodeText`): `delay(0.3)`
- Name lines (`KineticLine`): `delay(0.3)` / `delay(0.65)`
- Subheadline: `delay(1)`
- Scroll-arrow block: `delay(1.4)` / `delay(1.5)`

No other hero changes; ease and staggers unchanged.

### 4. `src/pages/Index.tsx` (edit)

Render `<Splash />` as the first child.

## Behavior matrix

| Scenario | Splash | Hero cascade |
|---|---|---|
| First visit in session | Plays (~1.5s) | Starts at handoff (~1.0s) |
| Reload / back-nav same session | Skipped | Immediate, pixel-for-pixel as today |
| New tab / new session | Plays | Starts at handoff |
| `prefers-reduced-motion` | Skipped | Existing reduced-motion path (no transforms) |
| `sessionStorage` blocked | Plays (fail open) | Starts at handoff |

## Constraints

- GPU-only animation: `transform` and `opacity` only — no layout, filter, or
  paint-heavy properties.
- No new dependencies; motion/react is already in use.
- Mobile: identical behavior.

## Testing

Manual verification via dev server:

- First load: splash plays, hero cascade starts at handoff.
- Reload: no splash, immediate cascade identical to current behavior.
- Reduced-motion emulation: no splash, no transforms.
- Mobile viewport: identical behavior.
- Confirm the overlay is removed from the DOM after ~1.6s.
