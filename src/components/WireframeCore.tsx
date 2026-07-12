import { useEffect, useRef } from "react";

/**
 * WireframeCore — slowly rotating icosahedron drawn in hairlines, with a cyan
 * "packet" that routes along its edges (ping ring on arrival) and a live
 * rotation readout. Cursor proximity tilts the solid and speeds the spin.
 * Renders a single static frame under reduced motion.
 */

const SIZE = 300;
const ACCENT = "103, 232, 249"; // #67e8f9

// icosahedron: 12 vertices from the golden ratio, 30 edges of equal length
const PHI = (1 + Math.sqrt(5)) / 2;
const VERTS: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
].map(([x, y, z]) => {
  const n = Math.hypot(x, y, z);
  return [x / n, y / n, z / n];
});

const EDGES: [number, number][] = [];
{
  const edgeLen = 2 / Math.hypot(1, PHI, 0); // normalized edge length
  for (let i = 0; i < VERTS.length; i++) {
    for (let j = i + 1; j < VERTS.length; j++) {
      const d = Math.hypot(
        VERTS[i][0] - VERTS[j][0],
        VERTS[i][1] - VERTS[j][1],
        VERTS[i][2] - VERTS[j][2]
      );
      if (Math.abs(d - edgeLen) < 0.01) EDGES.push([i, j]);
    }
  }
}

const NEIGHBORS: number[][] = VERTS.map((_, v) =>
  EDGES.filter(([a, b]) => a === v || b === v).map(([a, b]) => (a === v ? b : a))
);

const WireframeCore = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const C = SIZE / 2;
    const RADIUS = SIZE * 0.34;
    const FOCAL = 3.2;

    let ry = 0.6;
    let rx = 0.35;
    let tiltX = 0;
    let tiltY = 0;
    let spinBoost = 0;
    let last = performance.now();

    // packet routing state
    let from = 0;
    let to = NEIGHBORS[0][0];
    let hop = 0; // 0→1 along current edge
    const rings: { v: number; age: number }[] = [];

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const project = (v: [number, number, number]) => {
      const [x0, y0, z0] = v;
      // rotate around Y then X
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const cx = Math.cos(rx + tiltX), sx = Math.sin(rx + tiltX);
      const x1 = x0 * cy + z0 * sy;
      const z1 = -x0 * sy + z0 * cy;
      const y2 = y0 * cx - z1 * sx;
      const z2 = y0 * sx + z1 * cx;
      const p = FOCAL / (FOCAL + z2);
      return { x: C + (x1 + tiltY * 0.08) * RADIUS * p, y: C + y2 * RADIUS * p, z: z2 };
    };

    const drawFrame = (dt: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      const pts = VERTS.map(project);

      // edges, opacity by depth (nearer = brighter)
      for (const [a, b] of EDGES) {
        const depth = (pts[a].z + pts[b].z) / 2; // roughly -1..1
        const alpha = 0.06 + 0.2 * (1 - (depth + 1) / 2);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pts[a].x, pts[a].y);
        ctx.lineTo(pts[b].x, pts[b].y);
        ctx.stroke();
      }

      // vertices
      for (const p of pts) {
        const alpha = 0.25 + 0.4 * (1 - (p.z + 1) / 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (reduce) return;

      // packet along its edge
      const pa = pts[from];
      const pb = pts[to];
      const px = pa.x + (pb.x - pa.x) * hop;
      const py = pa.y + (pb.y - pa.y) * hop;
      ctx.fillStyle = `rgba(${ACCENT},0.95)`;
      ctx.beginPath();
      ctx.arc(px, py, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // arrival ping rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.age += dt;
        if (ring.age > 0.9) {
          rings.splice(i, 1);
          continue;
        }
        const p = pts[ring.v];
        const r = 4 + ring.age * 26;
        ctx.strokeStyle = `rgba(${ACCENT},${0.5 * (1 - ring.age / 0.9)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    if (reduce) {
      drawFrame(0);
      return () => window.removeEventListener("pointermove", onMove);
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // cursor influence: tilt toward pointer, spin faster when near
      const rect = canvas.getBoundingClientRect();
      const dx = mouse.x - (rect.left + rect.width / 2);
      const dy = mouse.y - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const near = Math.max(0, 1 - dist / 420);
      tiltX += ((dy / 420) * 0.5 - tiltX) * 3 * dt;
      tiltY += ((dx / 420) * 0.5 - tiltY) * 3 * dt;
      spinBoost += (near * 0.9 - spinBoost) * 2 * dt;
      ry += (0.25 + spinBoost) * dt;

      // advance packet
      hop += dt * (1.1 + spinBoost);
      if (hop >= 1) {
        rings.push({ v: to, age: 0 });
        const next = NEIGHBORS[to][(Math.random() * NEIGHBORS[to].length) | 0];
        from = to;
        to = next;
        hop = 0;
      }

      drawFrame(dt);

      if (readoutRef.current) {
        const deg = (((ry * 180) / Math.PI) % 360).toFixed(1).padStart(5, "0");
        readoutRef.current.textContent = `CORE.SYS — θ ${deg}° · V12/E30`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !rafRef.current) {
          last = performance.now();
          rafRef.current = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="absolute top-36 right-12 z-[5] hidden lg:flex flex-col items-end gap-3 pointer-events-none"
    >
      <canvas ref={canvasRef} style={{ width: SIZE, height: SIZE }} />
      <span ref={readoutRef} className="text-meta text-neutral-600 tabular-nums">
        CORE.SYS — θ 000.0° · V12/E30
      </span>
    </div>
  );
};

export default WireframeCore;
