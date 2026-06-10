# Image & Animation Asset Guide

Companion to `docs/DESIGN.md` (Editorial Brutalism) and the 2026-06-10 motion
redesign. Every visual slot on the site, what goes in it, how it's treated,
and the exact prompt to regenerate it.

---

## 1. Ground rules (read before generating anything)

The design system does most of the work for you:

- **Everything renders grayscale.** Journey and project images get a CSS
  `grayscale` filter (color returns only on hover). You can generate in
  B&W *or* color — but generating monochrome from the start gives you
  control over the tonal contrast instead of letting the filter flatten it.
- **Sharp corners, full-bleed.** Images are clipped by their frames
  (`overflow-hidden`), never rounded, never bordered.
- **Images are texture, not content.** Typography carries the page. A good
  image here is quiet, abstract, and high-contrast — it should read as
  "atmosphere" at a glance, not demand attention.
- **No text inside images.** The site's type is the type.
- **Parallax crop margin.** Journey images render at 120% frame height and
  drift ±8% on scroll — keep the subject centered; the top/bottom 15% may
  never be visible.

**Shared style suffix** — append to every photography prompt below:

> black and white editorial photography, very high contrast, deep blacks,
> subtle film grain like Kodak Tri-X 400, cinematic side lighting, shallow
> depth of field, minimalist composition, generous negative space,
> no text, no watermark, no logos

Midjourney flags: `--ar <ratio> --style raw --no text, watermark, color`
Flux/others: put the aspect ratio in the generation settings and add
"monochrome only, no color" to the prompt.

---

## 2. Where to generate

| Tool | Best for | Cost | Notes |
|---|---|---|---|
| **Midjourney (v7)** | The 4 photographic slots — best editorial B&W aesthetic by far | ~$10/mo | Use `--style raw` to kill the default gloss |
| **Flux 1.1 Pro** (via fal.ai or Replicate) | Same slots, pay-per-image batching | ~$0.04/img | Great realism; easy to script 8 variants and pick |
| **Ideogram 3** | Only if you ever want type *inside* an image (OG card) | free tier | Best text rendering; you likely won't need it (see §5) |
| **Recraft V3** | Vector/brand assets (icons, logo refinement) | free tier | Not needed today |
| **Unsplash / Pexels** (real photos) | Honestly competitive for these slots | free | Editorial B&W documentary photos often beat AI; search terms given per slot. The CSS grayscales them anyway |

Recommendation: **Midjourney for the four photo slots** if you have a
subscription, otherwise **Unsplash first** (free, authentic, license-clean)
and **Flux** for anything you can't find. Don't AI-generate your own face —
see §6.

After generating: export **JPG, quality ~75, max 1600px on the long edge,
target < 250 KB** (current files are 300–500 KB — worth re-compressing even
if you keep them). Quick tool: [squoosh.app](https://squoosh.app) or
`npx sharp-cli -i in.jpg -o out.jpg resize 1600 --quality 75`.

---

## 3. The image slots

### 3.1 Journey — Tech Lead, D. E. Shaw (current role)

- **File:** `public/images/journey/tech-lead.jpg`
- **Used by:** `src/components/Journey.tsx` (`journeyImages[0]`, rendered by `ParallaxImage`)
- **Frame:** 256px tall, ~25% page width (`md:col-span-3`), portrait-ish crop
- **Treatment:** grayscale → color on hover; ±8% vertical parallax on scroll
- **Export:** 1200×1500 (4:5)
- **Concept:** dark fintech infrastructure — the web-infra team at a quant firm

**Prompt:**
> rows of glowing trading monitors in a dark financial technology office at
> night, cascading data dashboards reflected in window glass, one empty
> aeron chair, viewed from a low angle down the desk row, + *style suffix*,
> `--ar 4:5`

Unsplash fallback search: `trading floor monitors dark`, `data center corridor`

### 3.2 Journey — Placement Coordinator, NIT Allahabad

- **File:** `public/images/journey/placement-coordinator.jpg`
- **Used by:** `src/components/Journey.tsx` (`journeyImages[1]`)
- **Frame/treatment/export:** same as 3.1
- **Concept:** the institution — empty stage before the crowd of 400

**Prompt:**
> vast empty university auditorium with tiered seating, a single podium lit
> by one shaft of light from a high window, dust visible in the light beam,
> symmetrical one-point perspective from the stage, + *style suffix*,
> `--ar 4:5`

Unsplash fallback: `empty auditorium`, `lecture hall dramatic light`

### 3.3 Journey — Summer Intern, Visa

- **File:** `public/images/journey/summer-intern.jpg`
- **Used by:** `src/components/Journey.tsx` (`journeyImages[2]`)
- **Frame/treatment/export:** same as 3.1
- **Concept:** payments infrastructure at macro scale

**Prompt:**
> extreme macro photograph of a payment card's chip and circuit traces,
> metallic contacts catching a single hard light source, surrounding card
> surface falling into pure black, + *style suffix*, `--ar 4:5`

Unsplash fallback: `circuit board macro`, `chip macro black`

### 3.4 Selected Works — Chat Encrypter

- **File:** `public/images/chat-encrypter.jpg`
- **Used by:** `src/components/SelectedWorks.tsx` (`projectImages` map)
- **Frame:** full-width hero card, **21:9** ultra-wide (first project gets 21/9, later ones 16/10)
- **Treatment:** grayscale → color on hover, scales to 1.03 on hover
- **Export:** 2100×900 (21:9)
- **Concept:** end-to-end encryption made physical

**Prompt:**
> a wall of cascading encrypted ciphertext glowing on a dark terminal
> screen, photographed at an oblique angle so the characters blur into
> bokeh toward the edges, one sharp band of focus in the center, CRT
> phosphor glow, + *style suffix*, `--ar 21:9`

Unsplash fallback: `terminal code dark screen`, `matrix code`

### 3.5 Future project cards (when you add projects to `config.json`)

- **File:** `public/images/<project-slug>.jpg`
- **Wire-up:** add one line to the `projectImages` map in
  `src/components/SelectedWorks.tsx`:
  ```ts
  "Project Name": `${base}images/project-slug.jpg`,
  ```
  Projects without an entry automatically get the monochrome gradient
  placeholder — so images are optional per project.
- **Export:** 1600×1000 (16:10) for non-first cards
- **Concept:** abstract monoliths — keep all project images in one family

**Prompt (template):**
> abstract monolithic [concrete slab / black glass cube / folded steel
> plane] floating in a pure black void, chiaroscuro lighting from one side,
> faint mist at its base, + *style suffix*, `--ar 16:10`

Swap the bracketed object per project so the set feels related but distinct.

---

## 4. Non-image visuals (already procedural — do not replace with images)

| Visual | Where | How it's made |
|---|---|---|
| Hero background mesh | `MeshBackground.tsx` | Live Delaunay triangulation on `<canvas>`, mouse-reactive. An image/video here would kill the interactivity and cost more bytes than the code |
| Project placeholders | `SelectedWorks.tsx` | CSS linear gradients |
| Grid overlay, color leak, cursor, marquee | easter eggs / motion layer | Pure CSS + transforms |

---

## 5. The one asset worth adding: OG / social card

The site has **no `og:image`** — links pasted into LinkedIn/Twitter/Slack
render as bare text. This is the highest-impact missing image.

- **File:** `public/og-image.jpg`, **1200×630**, < 300 KB
- **Don't generate this one.** The brand *is* the typography — screenshot
  the real hero (Anton "UTKARSH GARG" on black with the mesh) at 1200×630
  and you have a perfect, honest card. Any AI version would be off-brand.
- **How:** open the site, dev tools → device toolbar → 1200×630 →
  `Cmd+Shift+P` → "Capture screenshot". (Or ask Claude to script it with
  Playwright like the redesign verification did.)
- **Wire-up** (in `index.html` `<head>`):
  ```html
  <meta property="og:title" content="Utkarsh Garg — Tech Lead & Full-Stack Developer" />
  <meta property="og:description" content="Full-stack systems, web infrastructure, and rigorous technical leadership." />
  <meta property="og:image" content="https://<your-domain>/og-image.jpg" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  ```

---

## 6. Portrait / profile image

`src/assets/profile-image.png` (788 KB) and `ug_logo.png` (1.4 MB) are
**currently unused** — they're imported nowhere. Options:

- **Delete them** (they're in git history if ever needed), or
- If you want a portrait on the site someday: do **not** AI-generate your
  face. Use a real photo and match the system: convert to B&W, crush the
  blacks (Levels: lift black point to ~15), add 2–3% grain. Free:
  [photopea.com](https://photopea.com) → Image → Adjustments → Black & White
  → Levels.

---

## 7. Sprite animations — do you need them?

**No.** Honest assessment:

- Sprite sheets exist for **frame-by-frame raster animation** (game
  characters, pixel art, complex hand-drawn motion). Nothing on this site
  is frame-based.
- Your motion layer is **procedural and GPU-composited** — transforms,
  opacity, canvas. It's resolution-independent, themeable (the color-leak
  egg recolors everything via CSS), weighs ~0 KB, and respects
  `prefers-reduced-motion`. Sprites would be heavier, blurry on retina, and
  un-themeable.
- Aesthetically, pixel/sprite motion fights Editorial Brutalism's
  "flat is luxury" rule.

**If you ever need canned vector motion** (an animated icon, a morphing
illustration): use **Rive** (rive.app, free editor, tiny runtime) or
**Lottie** — not sprites.

**The one playful exception (optional):** an 8-bit sprite would be
*thematically* right in exactly one place — the Konami code toast, since the
code itself is a game reference. A tiny pixel coin/heart popping beside
"YOU BROKE THE MONOCHROME." in chartreuse would be a wink, not a style
break, because it lives inside an easter egg. If you want it:

- **Tool:** [Piskel](https://www.piskelapp.com) (free, browser) or Aseprite
  ($20) — draw 8 frames at 16×16, export as sprite sheet, animate with CSS
  `steps(8)`.
- **AI prompt (for reference frames, e.g. in Recraft/Flux):**
  > 16x16 pixel art sprite of a spinning coin, 8 animation frames laid out
  > in a horizontal strip, 1-bit style: pure chartreuse (#CCFF00) on
  > transparent background, hard pixels, no anti-aliasing
- Keep it ≤ 1 KB PNG. Anything more elaborate than this one wink: skip.

---

## 8. Checklist when adding any image

1. Generate at the slot's aspect ratio (don't crop later — compose for it).
2. Convert/confirm B&W with strong blacks (the CSS filter is a floor, not a look).
3. Resize to the export size in §3, JPG q75, < 250 KB.
4. Drop into `public/images/...` and reference via `import.meta.env.BASE_URL`
   (see `journeyImages` / `projectImages`) — required for GitHub Pages paths.
5. `pnpm dev` → check the grayscale → hover-color → parallax behavior.
6. Add meaningful `alt` text.
