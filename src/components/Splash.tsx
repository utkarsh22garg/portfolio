import { useEffect, useState } from "react";
import { motion } from "motion/react";
import DecodeText from "@/components/motion/DecodeText";
import { introPlaying } from "@/lib/intro";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCRAMBLE = "AKXZVRG0147#<>/";
const ACCENT = "#67e8f9";
const MONOGRAM = ["U", "G"] as const;
/** Seconds at which each monogram char locks to its real glyph. */
const LOCK_AT = [0.55, 0.75] as const;
const TICK_MS = 45;
/** Seconds when the label and monogram rise out through their clip masks. */
const EXIT_AT = 0.9;

interface Slot {
  ch: string;
  done: boolean;
}

/**
 * Session splash: the UG monogram decodes through scramble glyphs (cyan while
 * unresolved), then rises out through a clip mask as the hero cascade begins.
 * Renders nothing when the intro is skipped (already seen this session, or
 * reduced motion — both decided in lib/intro). Unmounts entirely once the
 * overlay fade completes.
 */
const Splash = () => {
  const [gone, setGone] = useState(!introPlaying);
  const [slots, setSlots] = useState<Slot[]>(() =>
    MONOGRAM.map(() => ({ ch: "", done: false })),
  );

  useEffect(() => {
    if (!introPlaying) return;
    const start = performance.now();
    const id = setInterval(() => {
      const t = (performance.now() - start) / 1000;
      setSlots(
        MONOGRAM.map((ch, i) =>
          t >= LOCK_AT[i]
            ? { ch, done: true }
            : {
                ch: SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0],
                done: false,
              },
        ),
      );
      if (t >= LOCK_AT[LOCK_AT.length - 1]) clearInterval(id);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none bg-black flex flex-col items-center justify-center gap-8"
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.0, duration: 0.4 }}
      onAnimationComplete={() => setGone(true)}
    >
      <span className="block overflow-hidden">
        <motion.span
          className="block"
          initial={{ y: 0 }}
          animate={{ y: "-110%" }}
          transition={{ delay: EXIT_AT, duration: 0.5, ease: EASE }}
        >
          <DecodeText
            text="UTKARSH GARG — PORTFOLIO / 2026"
            delay={0.05}
            duration={0.6}
            className="text-meta text-neutral-500"
          />
        </motion.span>
      </span>
      <span className="block overflow-hidden pb-[0.05em] -mb-[0.05em]">
        <motion.span
          className="block text-huge uppercase"
          initial={{ y: 0 }}
          animate={{ y: "-110%" }}
          transition={{ delay: EXIT_AT, duration: 0.5, ease: EASE }}
        >
          {slots.map((slot, i) => (
            <span
              key={i}
              className="inline-block w-[0.75em] text-center"
              style={{ color: slot.done ? "#ffffff" : ACCENT }}
            >
              {slot.ch}
            </span>
          ))}
        </motion.span>
      </span>
    </motion.div>
  );
};

export default Splash;
