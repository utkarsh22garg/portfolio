import { useEffect, useRef } from "react";

/**
 * FourierMonogram — a chain of rotating epicycles whose pen traces a
 * single-stroke "UG" monogram in cyan. Cursor proximity ramps the harmonic
 * count so the shape sharpens from a wobbly blob (far) to crisp "UG" (near).
 * Renders a single static frame under reduced motion.
 */

const SIZE = 300;
const ACCENT = "103, 232, 249"; // #67e8f9
const DESIGN = 100;
const N_SAMPLES = 360;
const K_MAX = 60;
const PERIOD = 8; // seconds per full trace
const TRAIL = 7; // seconds a trail point survives

type Pt = [number, number];
type Coeff = { freq: number; amp: number; phase: number };

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const cubicAt = (p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt => {
  const mt = 1 - t, a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
  return [a * p0[0] + b * c1[0] + c * c2[0] + d * p1[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p1[1]];
};

const quadAt = (p0: Pt, c: Pt, p1: Pt, t: number): Pt => {
  const mt = 1 - t, a = mt * mt, b = 2 * mt * t, c2 = t * t;
  return [a * p0[0] + b * c[0] + c2 * p1[0], a * p0[1] + b * c[1] + c2 * p1[1]];
};

const angAt = (cx: number, cy: number, r: number, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

const SUB = 200; // subdivisions per segment
const flatten = (f: (t: number) => Pt): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i <= SUB; i++) pts.push(f(i / SUB));
  return pts;
};

// "UG" monogram, 100x100 design space (y-down), single closed stroke
const U_LEFT_TOP: Pt = [12, 20];
const U_LEFT_BOTTOM: Pt = [12, 56];
const U_BOTTOM_C1: Pt = [12, 74];
const U_BOTTOM_C2: Pt = [40, 74];
const U_RIGHT_BOTTOM: Pt = [40, 56];
const U_RIGHT_TOP: Pt = [40, 20];
const BRIDGE_CTRL: Pt = [58, 6];
const G_CENTER: Pt = [70, 50];
const G_RADIUS = 21;
const G_START_DEG = -58;
const G_SWEEP_DEG = -287;
const G_CROSSBAR_END: Pt = [70, 55.4];
const FLOURISH_C1: Pt = [96, 92];
const FLOURISH_C2: Pt = [-18, 96];

const buildFlatPath = (): Pt[] => {
  const gStart = angAt(G_CENTER[0], G_CENTER[1], G_RADIUS, G_START_DEG);
  const gEndDeg = G_START_DEG + G_SWEEP_DEG;
  const gEnd = angAt(G_CENTER[0], G_CENTER[1], G_RADIUS, gEndDeg);
  const segments = [
    flatten((t) => lerp(U_LEFT_TOP, U_LEFT_BOTTOM, t)),
    flatten((t) => cubicAt(U_LEFT_BOTTOM, U_BOTTOM_C1, U_BOTTOM_C2, U_RIGHT_BOTTOM, t)),
    flatten((t) => lerp(U_RIGHT_BOTTOM, U_RIGHT_TOP, t)),
    flatten((t) => quadAt(U_RIGHT_TOP, BRIDGE_CTRL, gStart, t)),
    flatten((t) => angAt(G_CENTER[0], G_CENTER[1], G_RADIUS, G_START_DEG + G_SWEEP_DEG * t)),
    flatten((t) => lerp(gEnd, G_CROSSBAR_END, t)),
    flatten((t) => cubicAt(G_CROSSBAR_END, FLOURISH_C1, FLOURISH_C2, U_LEFT_TOP, t)),
  ];
  const flat: Pt[] = [];
  for (const seg of segments) {
    for (let i = 0; i < seg.length; i++) {
      if (flat.length && i === 0) continue; // shared joint with previous segment
      flat.push(seg[i]);
    }
  }
  return flat;
};

// resample a closed polyline to n points at uniform arc-length spacing
const resampleUniform = (pts: Pt[], n: number): Pt[] => {
  const cum = [0];
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    cum.push(len);
  }
  const out: Pt[] = [];
  for (let k = 0; k < n; k++) {
    const target = (len * k) / n;
    let lo = 0, hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const i1 = lo, i0 = Math.max(0, i1 - 1);
    const segLen = cum[i1] - cum[i0];
    const t = segLen > 0 ? (target - cum[i0]) / segLen : 0;
    out.push(lerp(pts[i0], pts[i1], t));
  }
  return out;
};

const PATH: Pt[] = resampleUniform(buildFlatPath(), N_SAMPLES);

// complex DFT of the sampled path, k in -K_MAX..K_MAX, sorted by amplitude desc
const COEFFS: Coeff[] = (() => {
  const n = PATH.length;
  const out: Coeff[] = [];
  for (let k = -K_MAX; k <= K_MAX; k++) {
    let re = 0, im = 0;
    for (let i = 0; i < n; i++) {
      const [x, y] = PATH[i];
      const theta = (-2 * Math.PI * k * i) / n;
      const cos = Math.cos(theta), sin = Math.sin(theta);
      re += x * cos - y * sin;
      im += x * sin + y * cos;
    }
    re /= n;
    im /= n;
    out.push({ freq: k, amp: Math.hypot(re, im), phase: Math.atan2(im, re) });
  }
  out.sort((a, b) => b.amp - a.amp);
  return out;
})();

const TOTAL_AMP_SQ = COEFFS.reduce((s, c) => s + c.amp * c.amp, 0);

const SCALE = (SIZE * 0.78) / DESIGN;
const OFFSET = (SIZE - SIZE * 0.78) / 2;
const toScreen = (p: Pt): Pt => [OFFSET + p[0] * SCALE, OFFSET + p[1] * SCALE];

const FourierMonogram = () => {
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

    const drawGhost = () => {
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      PATH.forEach((p, i) => {
        const [x, y] = toScreen(p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    };

    if (reduce) {
      ctx.clearRect(0, 0, SIZE, SIZE);
      drawGhost();
      ctx.strokeStyle = `rgba(${ACCENT},0.9)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      PATH.forEach((p, i) => {
        const [x, y] = toScreen(p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      if (readoutRef.current) readoutRef.current.textContent = "FOURIER.SYS — N=121 · ε 0.000";
      return;
    }

    let nf = 6;
    let time = 0;
    let last = performance.now();
    const trail: { x: number; y: number; age: number }[] = [];

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      drawGhost();

      const nfClamped = Math.min(nf, COEFFS.length - 1e-6);
      const nInt = Math.floor(nfClamped);
      const frac = nfClamped - nInt;

      let dx = 0, dy = 0; // chain position, design space
      let includedAmpSq = 0;

      for (let i = 0; i <= nInt && i < COEFFS.length; i++) {
        const c = COEFFS[i];
        const partial = i === nInt;
        const scale = partial ? frac : 1;
        const theta = 2 * Math.PI * c.freq * t + c.phase;
        const vx = c.amp * Math.cos(theta) * scale;
        const vy = c.amp * Math.sin(theta) * scale;

        if (i > 0) {
          const [cx, cy] = toScreen([dx, dy]);
          const screenR = c.amp * scale * SCALE;
          if (screenR >= 0.7) {
            ctx.strokeStyle = "rgba(255,255,255,0.10)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, screenR, 0, Math.PI * 2);
            ctx.stroke();
          }
          const [jx, jy] = toScreen([dx + vx, dy + vy]);
          ctx.strokeStyle = "rgba(255,255,255,0.18)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(jx, jy);
          ctx.stroke();
        }

        dx += vx;
        dy += vy;
        includedAmpSq += c.amp * c.amp * scale * scale;
      }
      const [tipX, tipY] = toScreen([dx, dy]);
      trail.push({ x: tipX, y: tipY, age: 0 });

      while (trail.length && trail[0].age > TRAIL) trail.shift(); // oldest points are at the front
      for (let i = 1; i < trail.length; i++) {
        const p0 = trail[i - 1], p1 = trail[i];
        ctx.strokeStyle = `rgba(${ACCENT},${(0.75 * (1 - p1.age / TRAIL)).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      ctx.fillStyle = `rgba(${ACCENT},0.95)`;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2.4, 0, Math.PI * 2);
      ctx.fill();

      const eps = Math.max(0, 1 - includedAmpSq / TOTAL_AMP_SQ);
      if (readoutRef.current) {
        const n = String(Math.round(nf)).padStart(3, "0");
        readoutRef.current.textContent = `FOURIER.SYS — N=${n} · ε ${eps.toFixed(3)}`;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      const t = (time % PERIOD) / PERIOD;

      const rect = canvas.getBoundingClientRect();
      const dx = mouse.x - (rect.left + rect.width / 2);
      const dy = mouse.y - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const near = Math.max(0, 1 - dist / 420);
      const target = 6 + near * (COEFFS.length - 6);
      nf += (target - nf) * 2.5 * dt;

      for (const p of trail) p.age += dt;

      drawFrame(t);

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
        FOURIER.SYS — N=006 · ε 0.000
      </span>
    </div>
  );
};

export default FourierMonogram;
