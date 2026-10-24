import { useEffect, useId, useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MOTION, REDUCED } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Sakura — a handful of petals drifting diagonally through a scene (hero / Contact only).
 *
 * Each petal is four nested layers so every motion is an independent, GPU-only transform:
 *   .p-base   x column (re-randomised every loop)
 *   .p-fall   y top→bottom + diagonal x drift (linear, 14–22s, repeatRefresh)
 *   .p-sway   sine sway ±8–20px
 *   .p-tumble 3D flutter (rotationX/Y rock ≤60°, rotationZ drifts freely)
 * Timelines pause when the container is offscreen or the tab is hidden.
 * Renders nothing under prefers-reduced-motion.
 */

/** Rounded sakura petal: narrow claw at the base, broad round shoulders, a clear V-notch at the tip. */
const PETAL_PATH =
  "M10 19.4C6.6 17.6 2.2 13.4 2 8.6 1.9 5 4.2 2.2 7.2 2.1 8.4 2.1 9.3 2.9 9.6 3.7L10 5.6 10.4 3.7C10.7 2.9 11.6 2.1 12.8 2.1 15.8 2.2 18.1 5 18 8.6 17.8 13.4 13.4 17.6 10 19.4Z";

/** Deterministic PRNG so petal sizes are stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia(REDUCED).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export type SakuraProps = {
  /** Number of petals (6–10; clamped to 1–10). */
  count?: number;
  className?: string;
  /** Gentle drift toward the pointer (fine pointers only). */
  pointerDrift?: boolean;
  /** Seed for the petal layout, so two scenes don't look identical. */
  seed?: number;
  /** Wind direction: 1 drifts left→right, -1 right→left. */
  wind?: 1 | -1;
  /** "night" (default) for the dark hero; "cobalt" for the blue Contact panel — pinker and denser so it stays pink, not lilac. */
  tone?: "night" | "cobalt";
};

const TONES = {
  night: { stops: ["#f2a3c0", "#f8c4d7", "#ffe6ef"], vein: "#e48aab", glow: "#f6c7d8", opacity: [0.75, 0.85] },
  cobalt: { stops: ["#ff9fbf", "#ffc6da", "#ffe8f0"], vein: "#f08fb0", glow: "#ffc2d6", opacity: [0.72, 0.78] },
} as const;

const Sakura = ({ count = 8, className, pointerDrift = true, seed = 7, wind = 1, tone = "night" }: SakuraProps) => {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return <Petals count={count} className={className} pointerDrift={pointerDrift} seed={seed} wind={wind} tone={tone} />;
};

const Petals = ({ count = 8, className, pointerDrift, seed = 7, wind = 1, tone = "night" }: SakuraProps) => {
  const root = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradId = `sakura-g-${uid}`;
  const glowId = `sakura-f-${uid}`;
  const t = TONES[tone];
  const n = Math.max(1, Math.min(10, Math.round(count)));

  const petals = useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({ length: n }, () => ({
      size: 13 + rnd() * 4, // 13–17px
      opacity: t.opacity[0] + rnd() * (t.opacity[1] - t.opacity[0]),
      flip: rnd() > 0.5,
    }));
  }, [n, seed, t]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const rand = gsap.utils.random;

        // Size is read once here and on resize — never per frame.
        let W = el.clientWidth;
        let H = el.clientHeight;
        const ro = new ResizeObserver(() => {
          W = el.clientWidth;
          H = el.clientHeight;
        });
        ro.observe(el);

        const tweens: gsap.core.Tween[] = [];
        const bases = q(".p-base");
        const falls = q(".p-fall");
        const sways = q(".p-sway");
        const tumbles = q(".p-tumble");

        bases.forEach((base, i) => {
          // start columns biased upwind so the diagonal fall crosses the scene
          const column = () => (wind > 0 ? rand(-0.25, 0.85) : rand(0.15, 1.25)) * W;
          gsap.set(base, { x: column() });

          const drift = rand(0.18, 0.38);
          const fall = gsap.fromTo(
            falls[i],
            { y: -40, x: 0 },
            {
              y: () => H + 40,
              x: () => wind * drift * W,
              duration: rand(14, 22),
              ease: "none",
              repeat: -1,
              repeatRefresh: true,
              onRepeat: () => {
                gsap.set(base, { x: column() });
              },
            },
          );
          fall.progress(Math.random()); // scene starts populated
          tweens.push(fall);

          tweens.push(
            gsap.fromTo(
              sways[i],
              { x: -rand(8, 20) },
              { x: rand(8, 20), duration: rand(2.6, 4.6), ease: "sine.inOut", yoyo: true, repeat: -1, delay: -rand(0, 4) },
            ),
          );

          // tumble is a rocking flutter (≤60° off-axis) so the petal face stays readable; Z spins freely
          const rx = rand(32, 56);
          const ry = rand(28, 52);
          gsap.set(tumbles[i], { transformPerspective: 520, rotationZ: rand(0, 360) });
          tweens.push(
            gsap.fromTo(tumbles[i], { rotationX: -rx }, { rotationX: rx, duration: rand(2.4, 4.2), ease: "sine.inOut", yoyo: true, repeat: -1, delay: -rand(0, 4) }),
            gsap.fromTo(tumbles[i], { rotationY: ry }, { rotationY: -ry, duration: rand(3.2, 5.6), ease: "sine.inOut", yoyo: true, repeat: -1, delay: -rand(0, 5) }),
            gsap.to(tumbles[i], { rotationZ: `+=${wind * rand(60, 140)}`, duration: rand(6, 10), ease: "sine.inOut", yoyo: true, repeat: -1 }),
          );
        });

        // ——— pause offscreen / hidden ———
        let onScreen = true;
        const sync = () => {
          const run = onScreen && !document.hidden;
          tweens.forEach((t) => (run ? t.resume() : t.pause()));
        };
        const io = new IntersectionObserver(
          ([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
          },
          { rootMargin: "80px" },
        );
        io.observe(el);
        document.addEventListener("visibilitychange", sync);

        // ——— gentle pointer drift ———
        let onMove: ((e: PointerEvent) => void) | undefined;
        if (pointerDrift && window.matchMedia("(pointer: fine)").matches) {
          const layer = q(".p-drift")[0];
          const xTo = gsap.quickTo(layer, "x", { duration: 3, ease: "power2.out" });
          const yTo = gsap.quickTo(layer, "y", { duration: 3, ease: "power2.out" });
          onMove = (e: PointerEvent) => {
            if (!onScreen) return;
            xTo((e.clientX / window.innerWidth - 0.5) * 28);
            yTo((e.clientY / window.innerHeight - 0.5) * 14);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
        }

        return () => {
          ro.disconnect();
          io.disconnect();
          document.removeEventListener("visibilitychange", sync);
          if (onMove) window.removeEventListener("pointermove", onMove);
        };
      });
    },
    { scope: root, dependencies: [n, seed, wind, pointerDrift], revertOnUpdate: true },
  );

  return (
    <div ref={root} aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg width="0" height="0" className="absolute" focusable="false">
        <defs>
          <linearGradient id={gradId} x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0" stopColor={t.stops[0]} />
            <stop offset="0.5" stopColor={t.stops[1]} />
            <stop offset="1" stopColor={t.stops[2]} />
          </linearGradient>
          {/* soft blush glow (≈ drop-shadow 0 0 4px). Static SVG content: rasterised once into each
              petal's composited layer, so the per-frame transforms never re-run the filter. */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="0" stdDeviation="2.6" floodColor={t.glow} floodOpacity="0.35" />
          </filter>
        </defs>
      </svg>
      <div className="p-drift absolute inset-0 will-change-transform">
        {petals.map((p, i) => (
          <div key={i} className="p-base absolute left-0 top-0">
            <div className="p-fall will-change-transform">
              <div className="p-sway">
                <div className="p-tumble" style={{ width: p.size, height: p.size, opacity: p.opacity }}>
                  <svg viewBox="0 0 20 20" width={p.size} height={p.size} className="block overflow-visible" style={p.flip ? { transform: "scaleX(-1)" } : undefined}>
                    <g filter={`url(#${glowId})`}>
                      <path d={PETAL_PATH} fill={`url(#${gradId})`} />
                    </g>
                    <path d="M10 18.4 C9.8 14 9.9 9.8 10 6.4" fill="none" stroke={t.vein} strokeWidth="0.4" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sakura;
