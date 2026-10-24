import { useId, useRef, type CSSProperties } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Hanko (判子) — a small square vermilion seal with a reversed "UG": the letters and an inner
 * frame are *cut out* of the shu ink, so the page shows through them. Edges are chewed by a
 * displacement filter and the ink is speckled where it didn't fully transfer.
 */

const PAPER = "#f4ebe0";

/** Frame, "UG" and base rule — used as cut-out (mask, black) or as paper-coloured fill. */
const Engraving = ({ ink }: { ink: string }) => (
  <>
    {/* engraved inner frame */}
    <rect x="4.2" y="4.2" width="39.6" height="39.6" rx="1.2" fill="none" stroke={ink} strokeWidth="1.1" />
    <text
      x="24"
      y="31.6"
      textAnchor="middle"
      fill={ink}
      fontFamily="'Instrument Serif', ui-serif, Georgia, serif"
      fontSize="23"
      letterSpacing="-0.6"
      style={{ fontKerning: "normal" }}
    >
      UG
    </text>
    {/* hairline under the letters, like a carved base rule */}
    <rect x="13" y="35.6" width="22" height="0.9" fill={ink} />
  </>
);

export type HankoProps = {
  /** Size: px number (24–48 recommended) or any CSS length, e.g. "clamp(26px,3vw,36px)". */
  size?: number | string;
  /**
   * "cut" (default): letters + frame are cut out of the ink, so the background shows through —
   * best on ink. "paper": letters + frame are filled warm paper (#f4ebe0), seal fully opaque —
   * use on cobalt or busy backgrounds.
   */
  variant?: "cut" | "paper";
  className?: string;
  style?: CSSProperties;
  /** Degrees. Spec: −2…−4. */
  rotate?: number;
  /** "mount" stamps on mount, "scroll" when scrolled into view, "none" static. */
  stamp?: "mount" | "scroll" | "none";
  delay?: number;
  /** When true (default) the seal is aria-hidden. Set false to expose it as an image "UG seal". */
  decorative?: boolean;
};

const Hanko = ({
  size = 36,
  variant = "cut",
  className,
  style,
  rotate = -3,
  stamp = "mount",
  delay = 0,
  decorative = true,
}: HankoProps) => {
  const root = useRef<HTMLSpanElement>(null);
  const seal = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { cut: `hanko-c-${uid}`, rough: `hanko-r-${uid}` };

  useGSAP(
    () => {
      if (stamp === "none") return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.fromTo(
          seal.current,
          { scale: 1.15, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.55,
            delay,
            ease: "power4.out",
            scrollTrigger: stamp === "scroll" ? { trigger: root.current, start: "top 90%", once: true } : undefined,
          },
        );
      });
    },
    { scope: root },
  );

  const dim = typeof size === "number" ? `${size}px` : size;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "UG seal" };

  return (
    <span
      ref={root}
      {...a11y}
      className={cn("relative inline-block shrink-0 align-middle", className)}
      style={{ width: dim, height: dim, transform: `rotate(${rotate}deg)`, ...style }}
    >
      <svg ref={seal} viewBox="0 0 48 48" focusable="false" className="block h-full w-full overflow-visible">
        <defs>
          <filter id={ids.rough} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            {/* chewed paper-press edge */}
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="9" result="n1" />
            <feDisplacementMap in="SourceGraphic" in2="n1" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="d" />
            {/* ink that didn't transfer: sparse speckles + a lighter worn patch */}
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="4" result="n2" />
            <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -11 7.9" result="speck" />
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed="21" result="n3" />
            <feColorMatrix in="n3" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 1.48" result="wear" />
            <feComposite in="speck" in2="wear" operator="arithmetic" k1="1" result="tooth" />
            <feComposite in="d" in2="tooth" operator="in" />
          </filter>
          {variant === "cut" && (
            <mask id={ids.cut} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
              <rect x="0" y="0" width="48" height="48" fill="#fff" />
              <Engraving ink="#000" />
            </mask>
          )}
        </defs>
        <g filter={`url(#${ids.rough})`}>
          <rect
            x="1"
            y="1"
            width="46"
            height="46"
            rx="2.6"
            fill="var(--shu)"
            mask={variant === "cut" ? `url(#${ids.cut})` : undefined}
          />
          {variant === "paper" && <Engraving ink={PAPER} />}
        </g>
      </svg>
    </span>
  );
};

export default Hanko;
