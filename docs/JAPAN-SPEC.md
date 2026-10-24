# Addendum — "Ma" (間): a subtle Japanese layer on Blue Grain Editorial

Extends `REDESIGN-SPEC.md`. **Keep the existing system** (ink / cobalt / ice, grain, Instrument Serif,
Inter Tight, JetBrains Mono, the orb, the calm GSAP motion). This is a layer of a few marks, not a reskin.
The site already reads as *ma* (negative space) — we add marks to the silence, never clutter.

References (onepromptdesign.com): *Kyoto Pagoda in Cherry Blossom Engraving* ("delicate linework…
leaving generous clear sky"), *Lantern Vigil on the Salt Plain* ("thin ink outlines, rough pigment grain…
emphasize silence and broad open space"), *Portal of the Blue Moon* ("chalk-white rounded arch around a
textured blue moon, dry-brush edges, centered and ceremonial"), plus the existing Blue Grain set.

## Motif budget (hard limit — exactly these five, nothing else)
1. **Ensō (円相)** — one open sumi brush ring drawn around the hero orb (orb = moon inside the ensō).
   SVG path, gap ~15° at top-right, textured via `feTurbulence` + `feDisplacementMap` (scale 2–4) and a
   tapered tail. Icy white 18–28% opacity. Draws once on load (~1.6–2s, `power2.inOut`), never loops.
   A small ensō may reappear once more max (e.g. Contact), not elsewhere.
2. **Kanji meta** — each section label gets a small glyph run set **inline after the label** (`ml-4`, horizontal,
   same baseline — decided in review round 1 for grid consistency; vertical gutter placement was off-grid).
   Shippori Mincho 500, 12–14px, ~45% opacity, `aria-hidden`; the English label stays the accessible name. Approved glyphs ONLY (meanings verified):
   - About → **序** (jo — preface / introduction)
   - Impact → **業** (gyō — work, deeds)
   - Path / Experience → **道** (michi — path, way)
   - Work → **作品** (sakuhin — works)
   - Stack → **道具** (dōgu — tools)
   - Recognition → **誉** (homare — honour)
   - Contact → **縁** (en — bond, connection)
   Optional hero meta line: **間** (ma). No other Japanese text anywhere.
3. **Hanko seal** — a small square vermilion seal with a reversed "UG" monogram (Latin letters; no
   invented kanji name). Rough edges via turbulence filter, slight rotation (−2°…−4°). Appears at most twice:
   next to the hero name / signature, and in the footer signature. Stamps in (scale 1.15→1, opacity) once.
4. **Sakura petals** — 6–10 petals per scene, **hero and Contact only**. 10–16px notched-teardrop SVG,
   blush-ice `--sakura` at 35–55% opacity, slow diagonal fall 14–22s, sine sway ±20px, 3D tumble.
   transform/opacity only, pause when offscreen (ScrollTrigger/IntersectionObserver), **off entirely** under
   reduced motion. Gentle pointer drift allowed. Never a page-wide overlay.
5. **Torii / temple line art** — one thin icy line drawing (1px stroke, ~20% opacity) used once: above the Contact
   headline, framing the orb as a moon inside the gate. Draw-on with stroke-dashoffset when
   scrolled into view. Never filled, never red.
   Plus optionally: a washi-fibre texture layer at ≤4% opacity on the cobalt Contact panel only.

Forbidden: waves (Hokusai), koi, rising sun, red fills, brush-script Latin fonts, lanterns, fans, kimono
patterns, emoji, Japanese text beyond the list above, page-wide petals.

## Colour ruling (overrides "one accent colour")
- `--shu: #D9452B` (shu-iro vermilion) — **only** for the hanko seal (and at most one ≤2px detail, e.g. the
  active-nav dot). It's a stamp, not a theme colour. Cobalt stays the one UI accent.
- `--sakura: #E8D9E4` — a neutral blush-ice for petals only, never text or UI.

## Fonts
Shippori Mincho 500 for kanji, **subset** with the Google Fonts `text=` param, e.g.
`family=Shippori+Mincho:wght@500&text=序業道作品具誉縁間&display=swap` (URL-encode). Never load a full JP font.

## Engineering rules
- Shared pieces live in `src/components/site/visual/`: `Enso.tsx`, `Hanko.tsx`, `Sakura.tsx`, `Torii.tsx`,
  `KanjiLabel.tsx`. Use `@/lib/gsap` exports; wrap animations in `gsap.matchMedia()` with `MOTION`/`REDUCED`.
- GPU-only animation (transform/opacity). Petals: pause offscreen, ≤10 nodes, no per-frame layout reads.
- Keep the Nav char-collapse animation exactly as is (opacity + translateX with getBoundingClientRect).
- No horizontal scroll at 375px. AA contrast for body copy. `pnpm build` and `npx tsc --noEmit -p tsconfig.app.json` clean.
- Content comes from `src/data/profile.ts` (verified against the Aug 2026 résumé) — do not change facts.
