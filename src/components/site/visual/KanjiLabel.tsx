import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Vertical kanji meta for section labels. Always aria-hidden — the English label next to it
 * stays the accessible name. Approved glyphs only (see docs/JAPAN-SPEC.md):
 * 序 About · 業 Impact · 道 Path · 作品 Work · 道具 Stack · 誉 Recognition · 縁 Contact · 間 (hero).
 */
export type KanjiGlyphs = "序" | "業" | "道" | "作品" | "道具" | "誉" | "縁" | "間";

export type KanjiLabelProps = {
  glyphs: KanjiGlyphs;
  className?: string;
  /** Fade/rise in when scrolled into view (default true). */
  reveal?: boolean;
  delay?: number;
};

const KanjiLabel = ({ glyphs, className, reveal = true, delay = 0 }: KanjiLabelProps) => {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!reveal) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        // animates from 0 to the stylesheet's .kanji-v opacity
        gsap.from(el.current, {
          autoAlpha: 0,
          y: 14,
          duration: 1.4,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el.current, start: "top 90%", once: true },
        });
      });
    },
    { scope: el },
  );

  return (
    <span ref={el} aria-hidden lang="ja" className={cn("kanji-v inline-block", className)}>
      {glyphs}
    </span>
  );
};

export default KanjiLabel;
