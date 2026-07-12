import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const GLYPHS = "01#<>/*+=";
const TICK_MS = 40;

interface DecodeTextProps {
  text: string;
  /** Seconds before decoding starts. */
  delay?: number;
  /** Seconds to fully resolve. */
  duration?: number;
  className?: string;
}

/**
 * Terminal decode: the line renders as random glyphs that resolve into the
 * real text left-to-right. Meant for monospace type (no layout shift).
 * Plain fade under reduced motion.
 */
const DecodeText = ({ text, delay = 0, duration = 1.1, className }: DecodeTextProps) => {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? text : " ");

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let start = 0;
    let lastTick = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 1000 - delay;
      if (t >= duration) {
        setDisplay(text);
        return;
      }
      if (t >= 0 && now - lastTick >= TICK_MS) {
        lastTick = now;
        const resolved = Math.floor((t / duration) * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          if (i < resolved || text[i] === " ") out += text[i];
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setDisplay(out);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration, reduce]);

  if (reduce) {
    return (
      <motion.p
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay }}
      >
        {text}
      </motion.p>
    );
  }

  return (
    <p className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </p>
  );
};

export default DecodeText;
