import { useId, useMemo, useRef, type CSSProperties } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Ensō (円相) — a single open sumi ring.
 *
 * Built as a *filled* tapered brush body (not a uniform stroke): heavy press at the start,
 * a long belly, and a tail that thins and splits into dry-brush strands (kasure). Edges are
 * roughened with two displacement passes and the ink is eroded with a pigment-grain mask.
 * The draw-on is a fat centre-line stroke inside a <mask> animated via stroke-dashoffset,
 * so the brush body itself is never distorted by the reveal.
 *
 * Gap (~15°) sits at the top-right. The ring is drawn clockwise.
 */

const VB = 200;
const C = VB / 2;
const R = 82; // centre-line radius
const MAX_W = 8; // max brush width (viewBox units)
const GAP = 15; // degrees
const GAP_CENTER = -58; // degrees (0 = 3 o'clock, clockwise positive) → top-right
const START = GAP_CENTER + GAP / 2; // brush lands just clockwise of the gap
const SWEEP = 360 - GAP;
const SAMPLES = 180;

const rad = (d: number) => (d * Math.PI) / 180;
const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/** Width profile, 0..1 → fraction of MAX_W. Press, belly, long thinning tail. */
function widthAt(t: number) {
  const press = 0.58 + 0.42 * smooth(0, 0.05, t); // the brush lands, then presses
  const belly = 1 + 0.12 * Math.exp(-(((t - 0.06) / 0.05) ** 2)) - 0.14 * smooth(0.08, 0.2, t) + 0.08 * Math.exp(-(((t - 0.3) / 0.12) ** 2));
  const thin = 1 - 0.84 * smooth(0.24, 0.9, t); // steep taper: tail ≤ ~0.15 of max
  const lift = 1 - smooth(0.86, 1, t) ** 1.4; // brush leaves the paper
  const wobble = 1 + 0.06 * Math.sin(t * 23.1) + 0.04 * Math.sin(t * 57.7 + 1.3);
  return Math.max(0, press * belly * thin * lift * wobble);
}

/** Centre-line radius: slightly irregular, tail drifts outward as the wrist releases. */
function radiusAt(t: number) {
  return R + 1.1 * Math.sin(t * Math.PI * 2 * 1.5 + 0.6) + 0.6 * Math.sin(t * 17.3) + 2.6 * smooth(0.72, 1, t);
}

function point(t: number, offset: number) {
  const a = rad(START + SWEEP * t);
  const r = radiusAt(t) + offset;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

const f = (n: number) => n.toFixed(2);

function buildBrush(scale = 1) {
  const outer: string[] = [];
  const inner: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const w = widthAt(t) * MAX_W * scale;
    // ink pools slightly to the outside of the curve on the press
    const bias = 0.6 * (1 - smooth(0, 0.3, t));
    const [ox, oy] = point(t, w * (0.5 + bias * 0.15));
    const [ix, iy] = point(t, -w * (0.5 - bias * 0.15));
    outer.push(`${f(ox)} ${f(oy)}`);
    inner.push(`${f(ix)} ${f(iy)}`);
  }
  // rounded head: the brush lands with a soft blob that bulges back against the stroke direction
  const a0 = rad(START);
  const w0 = widthAt(0) * MAX_W * scale;
  const [hx, hy] = point(0, w0 * 0.08);
  const back = [Math.sin(a0), -Math.cos(a0)];
  const head = `M${outer[0]} C${f(hx + back[0] * w0 * 0.9 + Math.cos(a0) * w0 * 0.6)} ${f(hy + back[1] * w0 * 0.9 + Math.sin(a0) * w0 * 0.6)} ${f(hx + back[0] * w0 * 0.9 - Math.cos(a0) * w0 * 0.6)} ${f(hy + back[1] * w0 * 0.9 - Math.sin(a0) * w0 * 0.6)} ${inner[0]}`;
  const body = `L${inner.slice(1).join(" L")} L${outer.slice().reverse().join(" L")} Z`;
  return `${head} ${body}`;
}

/** Thin bristle trails that outlive the body near the tail (kasure). */
function buildBristles() {
  const strands = [{ off: 1.1, from: 0.76, to: 0.99 }];
  return strands.map(({ off, from, to }) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = from + ((to - from) * i) / 40;
      const [x, y] = point(t, off * (0.6 + 0.4 * widthAt(t)));
      pts.push(`${f(x)} ${f(y)}`);
    }
    return `M${pts.join(" L")}`;
  });
}

/** Dry streaks cut *out of* the body along the tail. */
function buildStreaks() {
  // only along the thinning tail — the wide belly stays solid, luminous ink
  const streaks = [
    { off: 1.5, from: 0.44, to: 0.8, w: 0.4 },
    { off: -1.3, from: 0.52, to: 0.84, w: 0.35 },
  ];
  return streaks.map(({ off, from, to, w }) => {
    const pts: string[] = [];
    for (let i = 0; i <= 48; i++) {
      const t = from + ((to - from) * i) / 48;
      const [x, y] = point(t, off * widthAt(t) * 0.9);
      pts.push(`${f(x)} ${f(y)}`);
    }
    return { d: `M${pts.join(" L")}`, w };
  });
}

/** Centre line for the reveal mask (same direction as the brush). */
function buildSpine() {
  const pts: string[] = [];
  // starts a little before t=0 so the rounded head isn't clipped by the butt cap
  // and ends just past t=1 so the softened mask edge doesn't nibble the tail
  for (let i = 0; i <= 124; i++) {
    const [x, y] = point(-0.025 + (i / 124) * 1.035, 0);
    pts.push(`${f(x)} ${f(y)}`);
  }
  return `M${pts.join(" L")}`;
}

export type EnsoProps = {
  /** CSS size (width = height). Number = px. Default "100%" (fills its box). */
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  /** Body ink opacity (spec 0.18–0.28). The wet core along the spine runs ~1.8× brighter. */
  opacity?: number;
  /** Ink colour. Default icy white. */
  color?: string;
  /** "mount" draws on mount, "scroll" when scrolled into view, "none" renders fully drawn. */
  play?: "mount" | "scroll" | "none";
  /** Seconds before drawing starts. */
  delay?: number;
  /** Draw duration in seconds (spec: 1.6–2). */
  duration?: number;
  /** Displacement strength for the dry-brush edge (spec: 2–4). */
  roughness?: number;
};

const Enso = ({
  size = "100%",
  className,
  style,
  opacity = 0.28,
  color = "#dfe8ff",
  play = "mount",
  delay = 0,
  duration = 1.8,
  roughness = 3,
}: EnsoProps) => {
  const root = useRef<SVGSVGElement>(null);
  const spine = useRef<SVGPathElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { filter: `enso-f-${uid}`, reveal: `enso-r-${uid}`, dry: `enso-d-${uid}`, soft: `enso-s-${uid}`, core: `enso-c-${uid}` };

  const geo = useMemo(
    () => ({ brush: buildBrush(), core: buildBrush(0.5), bristles: buildBristles(), streaks: buildStreaks(), spine: buildSpine() }),
    [],
  );

  useGSAP(
    () => {
      if (play === "none" || !spine.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        // Rendered drawn by default (no-JS / reduced motion); fromTo hides it before first paint.
        gsap.fromTo(
          spine.current,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            autoRound: false, // pathLength=1 → sub-pixel values; CSSPlugin would otherwise round 1px→0px
            duration,
            delay,
            ease: "power2.inOut",
            scrollTrigger: play === "scroll" ? { trigger: root.current, start: "top 85%", once: true } : undefined,
          },
        );
      });
    },
    { scope: root },
  );

  const dim = typeof size === "number" ? `${size}px` : size;

  return (
    <svg
      ref={root}
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${VB} ${VB}`}
      className={cn("pointer-events-none block overflow-visible", className)}
      style={{ width: dim, height: dim, color, mixBlendMode: "screen", ...style }}
    >
      <defs>
        <filter id={ids.filter} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          {/* broad wobble — the hand is not a compass */}
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="3" result="low" />
          <feDisplacementMap in="SourceGraphic" in2="low" scale={roughness * 0.9} xChannelSelector="R" yChannelSelector="G" result="wob" />
          {/* fibrous edge — dry bristles catching paper tooth */}
          <feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="2" seed="11" result="high" />
          <feDisplacementMap in="wob" in2="high" scale={roughness * 0.35} xChannelSelector="R" yChannelSelector="B" result="edge" />
          {/* pigment grain — erode alpha a touch so it reads as ink, not vector */}
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="5" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.6 1.32" result="grainA" />
          <feComposite in="edge" in2="grainA" operator="in" result="inked" />
          {/* faint bleed into the paper */}
          <feGaussianBlur in="edge" stdDeviation="1.1" result="bleed" />
          <feComponentTransfer in="bleed" result="bleedA">
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          {/* soft luminous halo — the ring glows like moonlight rather than sitting as grey paint */}
          <feGaussianBlur in="edge" stdDeviation="4" result="halo" />
          <feComponentTransfer in="halo" result="haloA">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="haloA" />
            <feMergeNode in="bleedA" />
            <feMergeNode in="inked" />
          </feMerge>
        </filter>

        {/* softens the wipe's leading edge so it reads as wet ink arriving, not a slice */}
        <filter id={ids.soft} filterUnits="userSpaceOnUse" x="-20" y="-20" width={VB + 40} height={VB + 40}>
          <feGaussianBlur stdDeviation="2.4" />
        </filter>

        <filter id={ids.core} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        <mask id={ids.reveal} maskUnits="userSpaceOnUse" x="-20" y="-20" width={VB + 40} height={VB + 40}>
          <path
            ref={spine}
            d={geo.spine}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={MAX_W * 2 + 14}
            strokeLinecap="butt"
            strokeDasharray="1 1"
            strokeDashoffset={0}
            filter={`url(#${ids.soft})`}
          />
        </mask>

        <mask id={ids.dry} maskUnits="userSpaceOnUse" x="-20" y="-20" width={VB + 40} height={VB + 40}>
          <rect x="-20" y="-20" width={VB + 40} height={VB + 40} fill="#fff" />
          {geo.streaks.map((s, i) => (
            <path
              key={i}
              d={s.d}
              fill="none"
              stroke="#000"
              strokeWidth={s.w}
              strokeLinecap="round"
              strokeDasharray={i % 2 ? "18 5 30 3 44 6" : "26 4 12 7 52 3"}
            />
          ))}
        </mask>
      </defs>

      <g mask={`url(#${ids.reveal})`}>
        <g filter={`url(#${ids.filter})`} fill="currentColor">
          <g mask={`url(#${ids.dry})`}>
            <path d={geo.brush} fillOpacity={opacity} />
          </g>
          {geo.bristles.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.5}
              strokeLinecap="round"
              opacity={Math.min(1, opacity * 1.6)}
              strokeDasharray={i === 0 ? "46 3 22 4 80" : undefined}
            />
          ))}
        </g>
        {/* wet core: denser, blurred pigment along the spine gives tonal depth — glows instead of a flat band */}
        <path d={geo.core} fill="currentColor" fillOpacity={Math.min(1, opacity * 1.2)} filter={`url(#${ids.core})`} />
      </g>
    </svg>
  );
};

export default Enso;
