# Hero Mesh Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated Delaunay triangulation mesh to the Hero section's right side that subtly highlights near the mouse cursor.

**Architecture:** A standalone `MeshBackground` React component renders a `<canvas>` positioned absolute on the right 60% of the Hero section. All node drift, Delaunay recomputation, and hover highlight logic lives in a single `useEffect` animation loop. Hero is updated to be `position: relative` and render `<MeshBackground />` as its first child.

**Tech Stack:** React 18, TypeScript, d3-delaunay, Canvas 2D API, requestAnimationFrame, IntersectionObserver, ResizeObserver

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/MeshBackground.tsx` | Create | Canvas, nodes, animation loop, triangulation, hover highlight |
| `src/components/Hero.tsx` | Modify | Add `relative`/`overflow-hidden`, render `<MeshBackground />` |
| `package.json` | Modify | Add `d3-delaunay` dependency |

---

### Task 1: Install d3-delaunay

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
cd /Users/utkarshgarg/Projects/portfolio && npm install d3-delaunay
```

Expected output: `added 1 package` (or similar — `d3-delaunay` has no runtime dependencies)

- [ ] **Step 2: Verify the import resolves**

```bash
node -e "const { Delaunay } = require('d3-delaunay'); console.log(typeof Delaunay)"
```

Expected: `function`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add d3-delaunay dependency for hero mesh"
```

---

### Task 2: Create MeshBackground — canvas scaffold + node animation loop

**Files:**
- Create: `src/components/MeshBackground.tsx`

- [ ] **Step 1: Create the component with canvas, node init, and drift loop**

Create `src/components/MeshBackground.tsx` with the following content:

```tsx
import { useEffect, useRef } from "react";

const NODE_COUNT = 55;
const PADDING = 10;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const MeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);
  const glowDecayRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initNodes = (w: number, h: number) => {
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: PADDING + Math.random() * (w - PADDING * 2),
        y: PADDING + Math.random() * (h - PADDING * 2),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initNodes(canvas.width, canvas.height);
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (isVisibleRef.current) {
        ctx.clearRect(0, 0, w, h);

        for (const node of nodesRef.current) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < PADDING || node.x > w - PADDING) node.vx *= -1;
          if (node.y < PADDING || node.y > h - PADDING) node.vy *= -1;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    // Mouse tracking — attach to canvas's parent (Hero section)
    const section = canvas.parentElement as HTMLElement;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      lastMouseRef.current = mouseRef.current;
      glowDecayRef.current = 1;
    };
    const onMouseLeave = () => { mouseRef.current = null; };
    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "60%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
      }}
    />
  );
};

export default MeshBackground;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/utkarshgarg/Projects/portfolio && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/MeshBackground.tsx
git commit -m "feat: scaffold MeshBackground with canvas, node drift, and mouse tracking"
```

---

### Task 3: Add Delaunay triangulation rendering

**Files:**
- Modify: `src/components/MeshBackground.tsx` (the `draw` function inside `useEffect`)

- [ ] **Step 1: Add the Delaunay import at the top of the file**

Add to line 1 of `src/components/MeshBackground.tsx`:

```tsx
import { Delaunay } from "d3-delaunay";
```

- [ ] **Step 2: Replace the `draw` function body with triangulation + rendering**

Replace the entire `draw` function (currently just updates node positions) with:

```tsx
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (isVisibleRef.current) {
        ctx.clearRect(0, 0, w, h);

        // Update node positions
        for (const node of nodesRef.current) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < PADDING || node.x > w - PADDING) node.vx *= -1;
          if (node.y < PADDING || node.y > h - PADDING) node.vy *= -1;
        }

        // Compute Delaunay triangulation
        const coords = new Float64Array(nodesRef.current.flatMap(n => [n.x, n.y]));
        const delaunay = new Delaunay(coords);
        const { triangles } = delaunay;

        // Update glow decay when mouse is absent
        if (!mouseRef.current && glowDecayRef.current > 0) {
          glowDecayRef.current = Math.max(0, glowDecayRef.current - 0.02);
        }

        const mouse = mouseRef.current;
        const lastMouse = lastMouseRef.current;
        const decay = glowDecayRef.current;

        // Draw each triangle
        ctx.lineWidth = 0.5;
        for (let i = 0; i < triangles.length; i += 3) {
          const ai = triangles[i] * 2;
          const bi = triangles[i + 1] * 2;
          const ci = triangles[i + 2] * 2;

          const ax = coords[ai],     ay = coords[ai + 1];
          const bx = coords[bi],     by = coords[bi + 1];
          const cx = coords[ci],     cy = coords[ci + 1];
          const centX = (ax + bx + cx) / 3;
          const centY = (ay + by + cy) / 3;

          let opacity = 0.06;

          if (mouse) {
            const d = Math.hypot(centX - mouse.x, centY - mouse.y);
            const t = Math.max(0, 1 - d / 150);
            opacity = 0.06 + 0.29 * t; // lerp(0.06, 0.35, t)
          } else if (lastMouse && decay > 0) {
            const d = Math.hypot(centX - lastMouse.x, centY - lastMouse.y);
            const t = Math.max(0, 1 - d / 150);
            opacity = 0.06 + 0.29 * t * decay; // fade out using decay multiplier
          }

          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.lineTo(cx, cy);
          ctx.closePath();
          ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/utkarshgarg/Projects/portfolio && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/MeshBackground.tsx
git commit -m "feat: add Delaunay triangulation rendering with hover highlight and glow decay"
```

---

### Task 4: Integrate MeshBackground into Hero

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Update Hero.tsx**

Replace the entire content of `src/components/Hero.tsx` with:

```tsx
import MeshBackground from "@/components/MeshBackground";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex flex-col justify-end px-12 pb-24 pt-48 bg-black">
      <MeshBackground />
      <div className="relative z-10">
        <div className="mb-12">
          <p className="text-meta text-neutral-500 mb-6">
            TECH LEAD &amp; FULL STACK DEVELOPER
          </p>
          <h1 className="text-huge font-black uppercase text-white">
            UTKARSH<br />GARG
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-neutral-400 max-w-4xl">
              CRAFTING END-TO-END DIGITAL SYSTEMS THROUGH FULL-STACK EXPERTISE, MINIMALIST EXECUTION, AND RIGOROUS TECHNICAL LEADERSHIP.
            </h2>
          </div>
          <div className="md:col-span-4 flex flex-col items-start md:items-end">
            <span className="text-6xl mb-4 text-white">↘</span>
            <p className="text-meta text-neutral-500 md:text-right">SCROLL TO DISCOVER</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/utkarshgarg/Projects/portfolio && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 3: Start dev server and visually verify**

```bash
cd /Users/utkarshgarg/Projects/portfolio && npm run dev
```

Open `http://localhost:8080` (or whatever port Vite reports). Check:
- Mesh is visible on the right side of the hero
- Mesh fades out toward the left edge (gradient mask working)
- Triangles drift slowly
- Hovering over hero illuminates nearby triangles
- Moving mouse away causes triangles to fade back to base opacity
- Text is fully readable and unobstructed

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: integrate MeshBackground into Hero section"
```
