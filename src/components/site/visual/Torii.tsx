import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Torii (鳥居) horizon — one thin engraved line drawing: a torii standing on a long horizon,
 * with a far-off pagoda roofline. 1px non-scaling strokes in currentColor, never filled.
 * Draws on once (DrawSVG) when scrolled into view.
 */

const GROUND = 168;

/** Torii outlined in single lines (outline engraving style). */
const TORII = {
  // pillars (hashira), slightly tapered — drawn bottom→top
  pillars: [
    "M341 168 L343.6 58.6", // left, outer
    "M349.2 168 L350.6 58.6", // left, inner
    "M450.8 168 L449.4 58.6", // right, inner
    "M459 168 L456.4 58.6", // right, outer
  ],
  // kamebara (base collars)
  bases: ["M338.6 168 V163.4 H351.6 V168", "M448.4 168 V163.4 H461.4 V168"],
  // nuki (tie beam) passing through the pillars
  nuki: ["M326 78.4 H474", "M326 84.6 H474", "M326 78.4 V84.6", "M474 78.4 V84.6"],
  // gakuzuka (centre strut)
  strut: ["M396.6 58.6 V78.4", "M403.4 58.6 V78.4"],
  // shimaki under the kasagi
  shimaki: ["M330 52.4 H470", "M330 58.6 H470"],
  // kasagi with upturned ends (sori)
  kasagi: [
    "M304 36.6 C334 46.4 370 47.6 400 47.6 C430 47.6 466 46.4 496 36.6",
    "M310.4 45.2 C338 52 372 52.6 400 52.6 C428 52.6 462 52 489.6 45.2",
    "M304 36.6 L310.4 45.2",
    "M496 36.6 L489.6 45.2",
  ],
};

/** Five-storey pagoda, small and far away. */
function pagoda(cx: number, base: number, s: number) {
  const tiers = 5;
  const paths: string[] = [];
  let y = base;
  let w = 22 * s;
  for (let i = 0; i < tiers; i++) {
    const body = 8 * s * (1 - i * 0.07);
    const bodyW = w * 0.56;
    // walls
    paths.push(`M${cx - bodyW / 2} ${y} V${y - body}`, `M${cx + bodyW / 2} ${y} V${y - body}`);
    y -= body;
    // roof: shallow underside with upturned tips, concave top sweeping up to the next storey
    const lift = 2.2 * s;
    const roofH = 4.4 * s;
    const top = w * 0.34;
    paths.push(
      `M${cx - w} ${y - lift} C${cx - w * 0.55} ${y + 0.8 * s} ${cx + w * 0.55} ${y + 0.8 * s} ${cx + w} ${y - lift}`,
      `M${cx - w} ${y - lift} Q${cx - w * 0.5} ${y - lift * 1.1} ${cx - top} ${y - roofH} H${cx + top} Q${cx + w * 0.5} ${y - lift * 1.1} ${cx + w} ${y - lift}`,
    );
    y -= roofH;
    w *= 0.84;
  }
  // sōrin (finial)
  paths.push(`M${cx} ${y} V${y - 22 * s}`);
  for (let k = 0; k < 5; k++) {
    const ry = y - 5 * s - k * 3 * s;
    paths.push(`M${cx - 2.2 * s} ${ry} H${cx + 2.2 * s}`);
  }
  return paths;
}

const PAGODA = pagoda(150, GROUND, 1);

/** distant hills — one soft broken line behind everything */
const RIDGE = [
  "M0 150 C40 146 70 138 104 140 C112 140.4 118 141.6 124 143",
  "M178 146 C210 144 236 132 270 134 C292 135 304 142 318 146",
  "M486 146 C512 140 540 128 572 130 C610 132 630 144 668 142 C706 140 742 130 780 134 C800 136 812 140 820 141",
];

const BASE_DURATION = 2.9;

export type ToriiProps = {
  className?: string;
  style?: CSSProperties;
  /** Stroke opacity. Spec: 0.08–0.14. */
  opacity?: number;
  /** Draw the far pagoda + hills. Default true. */
  scenery?: boolean;
  /** "scroll" draws when it enters view (default); "mount" draws immediately; "none" static. */
  play?: "scroll" | "mount" | "none";
  delay?: number;
  /** Total draw time in seconds (default 2.9). The whole sequence is rescaled to fit. */
  duration?: number;
};

const Torii = ({ className, style, opacity = 0.12, scenery = true, play = "scroll", delay = 0, duration = BASE_DURATION }: ToriiProps) => {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (play === "none") return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({
          delay,
          defaults: { ease: "power2.inOut" },
          scrollTrigger: play === "scroll" ? { trigger: root.current, start: "top 85%", once: true } : undefined,
        });
        gsap.set(q(".t-line"), { drawSVG: "0%" });
        // pillars hang from the beams: reveal from their top end downward
        gsap.set(q(".t-pillar"), { drawSVG: "100% 100%" });
        gsap.set(q(".t-horizon"), { drawSVG: "50% 50%" });

        // Beams first, so no mid-scroll frame ever shows bare posts; then pillars; then the land.
        tl.to(q(".t-kasagi"), { drawSVG: "100%", duration: 1.0, stagger: 0.05 }, 0)
          .to(q(".t-shimaki"), { drawSVG: "100%", duration: 0.8, stagger: 0.05 }, 0.2)
          .to(q(".t-nuki"), { drawSVG: "100%", duration: 0.8, stagger: 0.05 }, 0.35)
          .to(q(".t-strut"), { drawSVG: "100%", duration: 0.4 }, 0.7)
          .to(q(".t-pillar"), { drawSVG: "0% 100%", duration: 0.9, stagger: 0.06, ease: "power2.out" }, 0.8)
          .to(q(".t-base"), { drawSVG: "100%", duration: 0.4 }, 1.55)
          .to(q(".t-horizon"), { drawSVG: "0% 100%", duration: 1.4, ease: "power3.inOut" }, 1.4)
          .to(q(".t-ridge"), { drawSVG: "100%", duration: 1.3, stagger: 0.15 }, 1.6)
          .to(q(".t-pagoda"), { drawSVG: "100%", duration: 0.6, stagger: 0.03, ease: "power1.out" }, 1.75);
        // total ≈ 2.9s at timeScale 1; `duration` rescales the whole sequence
        tl.timeScale(BASE_DURATION / Math.max(0.3, duration));
      });
    },
    { scope: root, dependencies: [duration], revertOnUpdate: true },
  );

  const line = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg
      ref={root}
      aria-hidden
      focusable="false"
      viewBox="0 0 800 176"
      preserveAspectRatio="xMidYMax meet"
      className={cn("pointer-events-none block h-auto w-full text-ice", className)}
      style={{ opacity, ...style }}
    >
      {scenery && (
        <g opacity={0.55}>
          {RIDGE.map((d, i) => (
            <path key={`r${i}`} className="t-line t-ridge" d={d} {...line} />
          ))}
          {PAGODA.map((d, i) => (
            <path key={`p${i}`} className="t-line t-pagoda" d={d} {...line} />
          ))}
        </g>
      )}
      <path className="t-horizon" d={`M0 ${GROUND} H800`} {...line} />
      <g>
        {TORII.pillars.map((d, i) => <path key={`h${i}`} className="t-line t-pillar" d={d} {...line} />)}
        {TORII.bases.map((d, i) => <path key={`b${i}`} className="t-line t-base" d={d} {...line} />)}
        {TORII.nuki.map((d, i) => <path key={`n${i}`} className="t-line t-nuki" d={d} {...line} />)}
        {TORII.strut.map((d, i) => <path key={`s${i}`} className="t-line t-strut" d={d} {...line} />)}
        {TORII.shimaki.map((d, i) => <path key={`m${i}`} className="t-line t-shimaki" d={d} {...line} />)}
        {TORII.kasagi.map((d, i) => <path key={`k${i}`} className="t-line t-kasagi" d={d} {...line} />)}
      </g>
    </svg>
  );
};

export default Torii;
