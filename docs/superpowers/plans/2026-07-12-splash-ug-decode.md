# "UG Decode" Splash Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Once-per-session splash overlay where a giant `UG` monogram decodes through scramble glyphs, then rises out as the existing hero cascade begins (~1.5s total).

**Architecture:** A tiny timeline module (`src/lib/intro.ts`) decides at module load whether the splash plays this session and exposes a `delay(offset)` helper; the `Splash` overlay component and the hero both consume it, so the entrance reads as one choreographed motion. The splash unmounts completely after its exit.

**Tech Stack:** React 18, TypeScript, motion/react (already installed), Tailwind v4, Vite. Package manager is **pnpm**.

**Spec:** `docs/superpowers/specs/2026-07-12-splash-ug-decode-design.md`

## Global Constraints

- No new dependencies.
- GPU-only animation: `transform` and `opacity` only.
- Splash frequency: once per browser session via `sessionStorage` key `ug-intro-seen`; fail open (storage error ⇒ play).
- Skip entirely under `prefers-reduced-motion`.
- `HANDOFF = 1.0` seconds; hero delays keep their current values as offsets so reload behavior is pixel-for-pixel unchanged.
- Accent while decoding: `#67e8f9`; resolved chars white. Overlay bg: black (matches hero section's `bg-black`).
- Label copy, verbatim: `UTKARSH GARG — PORTFOLIO / 2026`
- **No test framework exists in this repo** (spec mandates manual verification). Each task verifies with `pnpm lint`, `pnpm build`, and dev-server checks in a browser instead of automated test cycles.

---

### Task 1: Intro timeline module

**Files:**
- Create: `src/lib/intro.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (used by Tasks 2 and 3):
  - `introPlaying: boolean` — true iff the splash plays this page load.
  - `HANDOFF: number` — `1.0` (seconds).
  - `delay(offset: number): number` — `HANDOFF + offset` when `introPlaying`, else `offset`.

- [ ] **Step 1: Write the module**

Create `src/lib/intro.ts` with exactly:

```ts
/**
 * Single source of truth for the entrance timeline: whether the session
 * splash plays this load, and how hero delays shift to meet it.
 */

const KEY = "ug-intro-seen";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const alreadySeen = (() => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    // Storage unavailable (private browsing etc.) — fail open, play the splash.
    return false;
  }
})();

/** True iff the splash overlay plays this page load. */
export const introPlaying = !alreadySeen && !prefersReducedMotion;

if (introPlaying) {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Worst case the splash replays next load; never a broken page.
  }
}

/** Seconds after load when the splash is clear enough for hero type to rise. */
export const HANDOFF = 1.0;

/** Hero entrance delays are offsets from curtain-clear when the splash plays. */
export const delay = (offset: number): number =>
  introPlaying ? HANDOFF + offset : offset;
```

- [ ] **Step 2: Verify it compiles and lints**

Run: `pnpm lint && pnpm build`
Expected: lint passes with no new warnings; build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/intro.ts
git commit -m "feat: intro timeline module for splash handoff"
```

---

### Task 2: Splash overlay component, wired into the page

**Files:**
- Create: `src/components/Splash.tsx`
- Modify: `src/pages/Index.tsx` (imports at top; `<Splash />` as first child of the root div, currently line 18)

**Interfaces:**
- Consumes: `introPlaying` from `src/lib/intro` (Task 1); existing `DecodeText` from `src/components/motion/DecodeText`.
- Produces: default export `Splash: () => JSX.Element | null`. No props.

**Timeline implemented here:** monogram decode 0–0.75s (`U` locks at 0.55s, `G` at 0.75s) → label + monogram rise out −110% from 0.9s to 1.4s → overlay opacity fades 1.0s→1.4s (invisible fade, black-on-black, timed to `HANDOFF`) → component unmounts.

- [ ] **Step 1: Write the component**

Create `src/components/Splash.tsx` with exactly:

```tsx
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import DecodeText from "@/components/motion/DecodeText";
import { introPlaying } from "@/lib/intro";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCRAMBLE = "AKXZVRG0147#<>/";
const ACCENT = "#67e8f9";
const MONOGRAM = ["U", "G"] as const;
/** Seconds at which each monogram char locks to its real glyph. */
const LOCK_AT = [0.55, 0.75] as const;
const TICK_MS = 45;
/** Seconds when the label and monogram rise out through their clip masks. */
const EXIT_AT = 0.9;

interface Slot {
  ch: string;
  done: boolean;
}

/**
 * Session splash: the UG monogram decodes through scramble glyphs (cyan while
 * unresolved), then rises out through a clip mask as the hero cascade begins.
 * Renders nothing when the intro is skipped (already seen this session, or
 * reduced motion — both decided in lib/intro). Unmounts entirely once the
 * overlay fade completes.
 */
const Splash = () => {
  const [gone, setGone] = useState(!introPlaying);
  const [slots, setSlots] = useState<Slot[]>(() =>
    MONOGRAM.map(() => ({ ch: "", done: false })),
  );

  useEffect(() => {
    if (!introPlaying) return;
    const start = performance.now();
    const id = setInterval(() => {
      const t = (performance.now() - start) / 1000;
      setSlots(
        MONOGRAM.map((ch, i) =>
          t >= LOCK_AT[i]
            ? { ch, done: true }
            : {
                ch: SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0],
                done: false,
              },
        ),
      );
      if (t >= LOCK_AT[LOCK_AT.length - 1]) clearInterval(id);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none bg-black flex flex-col items-center justify-center gap-8"
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.0, duration: 0.4 }}
      onAnimationComplete={() => setGone(true)}
    >
      <span className="block overflow-hidden">
        <motion.span
          className="block"
          initial={{ y: 0 }}
          animate={{ y: "-110%" }}
          transition={{ delay: EXIT_AT, duration: 0.5, ease: EASE }}
        >
          <DecodeText
            text="UTKARSH GARG — PORTFOLIO / 2026"
            delay={0.05}
            duration={0.6}
            className="text-meta text-neutral-500"
          />
        </motion.span>
      </span>
      <span className="block overflow-hidden pb-[0.05em] -mb-[0.05em]">
        <motion.span
          className="block text-huge uppercase"
          initial={{ y: 0 }}
          animate={{ y: "-110%" }}
          transition={{ delay: EXIT_AT, duration: 0.5, ease: EASE }}
        >
          {slots.map((slot, i) => (
            <span
              key={i}
              className="inline-block w-[0.75em] text-center"
              style={{ color: slot.done ? "#ffffff" : ACCENT }}
            >
              {slot.ch}
            </span>
          ))}
        </motion.span>
      </span>
    </motion.div>
  );
};

export default Splash;
```

Notes for the implementer:
- `SCRAMBLE` and `EASE` intentionally duplicate the constants in `Hero.tsx` — they are the site's shared motion vocabulary; do not import from `Hero`.
- The fixed `w-[0.75em]` per char prevents width jitter while glyphs cycle (Anton is not monospace).
- The overlay fade starts at 1.0s (= `HANDOFF`), not after the rise-out finishes: the hero begins rising at 1.0s behind the overlay, and because both backgrounds are pure black the crossfade is invisible — that simultaneity is the handoff.

- [ ] **Step 2: Wire into the page**

In `src/pages/Index.tsx`, add the import after the existing component imports (after line 14, `import EasterEggs ...`):

```tsx
import Splash from "@/components/Splash";
```

and render it as the first child of the root div:

```tsx
  return (
    <div className="bg-black min-h-screen">
      <Splash />
      <SmoothScroll />
```

- [ ] **Step 3: Verify it compiles and lints**

Run: `pnpm lint && pnpm build`
Expected: lint passes with no new warnings; build succeeds.

- [ ] **Step 4: Manual browser verification**

Run: `pnpm dev`, open the printed localhost URL in a browser.
- Open a fresh tab (or clear `sessionStorage` in devtools and reload): black overlay appears, tiny mono label decodes above a giant Anton `UG` whose chars flicker cyan then snap white (`U` first), then both rise out and the page is revealed.
- Reload: no splash at all.
- In devtools → Elements: after ~1.6s the overlay div is **gone from the DOM** (not `opacity: 0`).
- Devtools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", clear `sessionStorage`, reload: no splash.

Expected: all four behaviors as described. (Hero still starts on its old timing — the handoff lands in Task 3.)

- [ ] **Step 5: Commit**

```bash
git add src/components/Splash.tsx src/pages/Index.tsx
git commit -m "feat: UG decode session splash overlay"
```

---

### Task 3: Hero handoff

**Files:**
- Modify: `src/components/Hero.tsx` (imports at top; five delay literals at currently lines 142, 147–148, 158, 167, 173)

**Interfaces:**
- Consumes: `delay` from `src/lib/intro` (Task 1) — import it **aliased as `introDelay`**, because `Hero.tsx` already uses `delay` as a prop/variable name (`RepelChar`'s prop, `KineticLine`'s stagger math) and shadowing it invites mistakes.
- Produces: no interface changes; `Hero`'s public shape is untouched.

- [ ] **Step 1: Rewire the five entrance delays**

In `src/components/Hero.tsx`, add to the imports:

```tsx
import { delay as introDelay } from "@/lib/intro";
```

Then make exactly these five value changes (offsets identical to today's literals):

1. Meta line `DecodeText` (line 142): `delay={0.3}` → `delay={introDelay(0.3)}`
2. `<KineticLine word="UTKARSH" delayBase={0.3} />` (line 147) → `delayBase={introDelay(0.3)}`
3. `<KineticLine word="GARG" delayBase={0.65} />` (line 148) → `delayBase={introDelay(0.65)}`
4. Subheadline transition (line 158): `transition={{ duration: 1, delay: 1, ease: EASE }}` → `transition={{ duration: 1, delay: introDelay(1), ease: EASE }}`
5. Scroll-arrow block (line 167): `transition={{ duration: 0.8, delay: 1.4 }}` → `transition={{ duration: 0.8, delay: introDelay(1.4) }}`, and its `DecodeText` (line 173): `delay={1.5}` → `delay={introDelay(1.5)}`

No other changes — per-letter stagger (`i * 0.045`), durations, and eases stay as they are.

- [ ] **Step 2: Verify it compiles and lints**

Run: `pnpm lint && pnpm build`
Expected: lint passes with no new warnings; build succeeds.

- [ ] **Step 3: Manual verification of the full behavior matrix**

With `pnpm dev` running:
- Fresh session (clear `sessionStorage`, reload): splash plays; hero name letters begin rising at ~1.0s while the splash monogram is still exiting — one continuous motion, no dead gap and no double-start.
- Reload: no splash; hero cascade starts immediately with today's exact timing.
- Reduced-motion emulation + cleared `sessionStorage`: no splash; hero elements appear without transforms (existing behavior).
- Mobile viewport (devtools device toolbar, e.g. iPhone): splash plays and hands off identically.

Expected: all four rows of the spec's behavior matrix hold.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: hand hero cascade off from splash via intro timeline"
```
