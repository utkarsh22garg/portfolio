# Redesign Spec — "Blue Grain Editorial"

Art direction lifted from onepromptdesign.com prompts **Blue Grain Editorial**, **Floating Orb Exchange**
and **Vertical Blue Grain**:

> "A minimal blue visual system built around soft grain, translucent forms, icy-white elements, and
> spacious editorial compositions." — "soft powdery grain, airbrushed / stippled texture, translucent
> shading, soft dreamy glow, premium surreal editorial look. Avoid clutter, too many decorative
> sparkles, glossy 3D glass look." — "deep crushed black shadows at the bottom into a bright glowing
> icy blue at the top. Heavy analog film grain, matte finish."

## Principles
1. **One idea per screen.** Huge whitespace. Max ~3 elements competing at once.
2. **Light, not decoration.** The only "visual" is light: a grained cobalt glow and a luminous icy orb.
   No rain, no ASCII, no marquees, no custom cursor, no splash.
3. **Typography does the work.** Serif display (italic accents) + quiet grotesk + tiny mono meta.
4. **Motion is calm.** GSAP, `power3.out`/`expo.out`, 0.9–1.4s, small y offsets (≤ 40px). Scrub where it
   aids reading. Always honour `prefers-reduced-motion` via `gsap.matchMedia()`.

## Tokens (defined in `src/index.css` as CSS vars + Tailwind theme)
| token | value | use |
|---|---|---|
| `--ink` | `#06080f` | page background |
| `--ink-2` | `#0b0f1c` | raised surfaces |
| `--cobalt` | `#1f4bff` | the one accent / CTA section bg |
| `--azure` | `#8fb2ff` | glow, hover accents |
| `--ice` | `#eef3ff` | primary text, orb |
| `--mist` | `rgba(238,243,255,0.56)` | body copy |
| `--fog` | `rgba(238,243,255,0.32)` | meta / labels |
| `--hair` | `rgba(238,243,255,0.10)` | hairlines (1px) |

Tailwind classes available: `bg-ink`, `bg-ink-2`, `bg-cobalt`, `text-ice`, `text-azure`, `text-mist`, `text-fog`, `border-hair`.

Fonts (Google): **Instrument Serif** (`font-serif`, display, use italic for one accent word),
**Inter Tight** (`font-sans`, body/UI, weights 300–600), **JetBrains Mono** (`font-mono`, meta).

Utility classes: `.display` (serif, clamp size, tight leading), `.meta` (mono 11px, uppercase, tracking .14em, `--fog`),
`.grain` (adds film-grain overlay via ::after), `.container-x` (max-w 1440, px clamp(20px,4vw,56px)).

## Layout / sections (in order) — files in `src/components/site/`
1. `Nav.tsx` — fixed, transparent → blurred ink on scroll. Left: "Utkarsh Garg". Centre: Work · About · Writing · Contact (small).
   Right: live Hyderabad time (mono) + "Résumé ↗" pill. Hides on scroll down, shows on scroll up (GSAP).
2. `Hero.tsx` — 100svh. `<GrainGlow/>` backdrop (vertical blue grain: icy-blue glow top-centre fading into ink).
   `<Orb/>` luminous stippled icy orb, ~34vmin, floats slowly, parallaxes toward the pointer, drifts down/scales on scroll.
   Headline: "Utkarsh Garg" `.display` huge; line 2 sub: "Tech lead & full‑stack engineer — building calm, fast
   interfaces at D. E. Shaw." Bottom row meta: `Hyderabad, IN` · `5+ yrs` · `Scroll`. Intro: SplitText chars rise from mask.
3. `About.tsx` — statement paragraph (from config summary, rewritten shorter) in large serif, words scrub from 15% → 100% opacity.
   Below: 3 stats in a row with hairline top borders: `5+ years`, `12× faster analytics`, `9.16 CGPA`. Counters animate.
4. `Experience.tsx` — label "Experience". Rows: `years | role (serif) | company | ↗`. Hover: row brightens, azure hairline grows.
   Click expands achievements (GSAP height). Hairlines draw in on scroll.
5. `Work.tsx` — "Selected work & writing". Two large cards side-by-side (stack on mobile): Chat Encrypter (project) and
   IEEE paper (publication). Each card has a generated grain-gradient visual (CSS radial gradients + grain), tiny meta, title, link.
   Card visual parallaxes inside its frame on scroll; hover scales visual 1.04.
6. `Stack.tsx` — 3 columns (Languages / Libraries / Tools), plain lists, mono label headers. Stagger in.
7. `Recognition.tsx` — 4 rows: year | title | description. Minimal.
8. `Contact.tsx` — full-bleed **cobalt** section with grain, icy orb centred, huge serif "Let's build something *calm*." email as
   big underlined link (magnetic), socials row, résumé link. Footer line: © year, "Designed & built by Utkarsh", back-to-top.

Shared: `src/components/site/visual/GrainGlow.tsx`, `Orb.tsx`; `src/lib/gsap.ts` (registers ScrollTrigger, SplitText, useGSAP;
syncs Lenis with gsap.ticker).

## Content source
`src/data/config.json` (do not change data). Résumé: `import resume from "@/assets/resume.pdf"`.

## Don'ts
No borders thicker than 1px. No drop shadows. No emojis. No rounded corners > 999px pills / 2px cards.
No more than one accent colour. No text below 11px. Keep contrast AA for body copy.
