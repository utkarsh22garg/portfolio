# Hero Mesh Background — Design Spec

**Date:** 2026-04-04
**Status:** Approved

---

## Overview

Add a subtle animated Delaunay triangulation mesh to the Hero section's right side using D3.js. The mesh provides depth and visual interest without competing with the typographic content. Mouse movement over the hero illuminates nearby triangles.

---

## Architecture

### New Component: `MeshBackground`

A standalone React component (`src/components/MeshBackground.tsx`) that owns a `<canvas>` element and all animation logic. It accepts no props — all configuration (node count, colors, timing) is internal constants.

### Integration into `Hero`

`Hero.tsx` wraps its content in a `position: relative` container and renders `<MeshBackground />` as the first child (behind everything). The existing content div gets `position: relative; z-index: 1`.

---

## Placement & Masking

- Canvas: `position: absolute`, `top: 0`, `right: 0`, `width: 60%`, `height: 100%`, `z-index: 0`, `pointer-events: none`
- A CSS `mask-image` linear gradient is applied to the canvas: `linear-gradient(to right, transparent 0%, black 30%)` — fades the left edge of the mesh to transparent so it never overlaps the name/text
- `overflow: hidden` on the Hero section clips any canvas overflow

---

## Mesh Generation

- **Node count:** 55 nodes, randomly distributed across the canvas bounds on mount
- **Library:** `d3-delaunay` (from the `d3` package, tree-shaken import: `import { Delaunay } from "d3-delaunay"`)
- **Recomputation:** `Delaunay.from(points)` called every frame after node positions update — fast enough at this node count
- **Triangle rendering:**
  - Stroke only, no fill
  - Base stroke: `rgba(255, 255, 255, 0.06)` — barely perceptible on black
  - Stroke width: `0.5px`

---

## Animation Loop

- Each node has `{ x, y, vx, vy }` — velocity initialized to random values in range `[-0.15, 0.15]` px/frame
- Every `requestAnimationFrame`: positions updated by velocity, soft boundary bounce (velocity negated with 10px inset padding)
- Loop managed by `useRef` for the animation frame ID — cancelled on component unmount
- **Performance:** `IntersectionObserver` on the Hero section pauses the loop when fully out of viewport, resumes when visible

---

## Hover Highlight

- `mousemove` listener attached to the Hero `<section>` element (not the canvas — it has `pointer-events: none`)
- Mouse position stored in a `useRef` (not state — avoids re-renders)
- Each frame, for every triangle: compute centroid `(cx, cy)`, calculate distance to mouse `d`
- Highlight radius: `150px`
- Stroke opacity: `lerp(0.06, 0.35, max(0, 1 - d/150))` — full brightness at cursor, fades to base at 150px edge
- On `mouseleave`: mouse position set to `null`; highlighted triangles fade back to base opacity over ~500ms via a `glowDecay` multiplier that decrements each frame (`glowDecay -= 0.02` per frame until 0)

---

## Dependencies

- `d3-delaunay` is included in the `d3` package. Add: `npm install d3-delaunay`
- No Three.js, no additional peer dependencies

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/MeshBackground.tsx` | New component |
| `src/components/Hero.tsx` | Add `relative`/`overflow-hidden`, render `<MeshBackground />` |
| `package.json` | Add `d3-delaunay` dependency |

---

## Non-Goals

- No mobile-specific behavior (mesh renders on all screen sizes, just narrower)
- No theme/color customization props — hardcoded monochrome to match design system
- No touch event handling for the hover highlight
