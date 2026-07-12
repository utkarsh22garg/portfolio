import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import DecodeText from "@/components/motion/DecodeText";
import { delay as introDelay } from "@/lib/intro";
import NeuralRain from "@/components/NeuralRain";
import FourierMonogram from "@/components/FourierMonogram";

const EASE = [0.16, 1, 0.3, 1] as const;

const SCRAMBLE = "AKXZVRG0147#<>/";
const ACCENT = "#67e8f9";
const REPEL_RADIUS = 150;
const REPEL_STRENGTH = 26;

/**
 * One headline character: rises out of the line's clip mask on load, leans
 * away from the cursor with a spring (proximity repulsion), and decodes
 * through random glyphs when hovered.
 */
const RepelChar = ({ ch, delay }: { ch: string; delay: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });
  const [display, setDisplay] = useState(ch);
  const [lockedWidth, setLockedWidth] = useState<number>();
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - e.clientX;
      const dy = r.top + r.height / 2 - e.clientY;
      const d = Math.hypot(dx, dy);
      if (d < REPEL_RADIUS && d > 0) {
        const f = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH;
        x.set((dx / d) * f);
        y.set((dy / d) * f);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const scramble = () => {
    const el = ref.current;
    if (!el || lockedWidth !== undefined) return;
    setLockedWidth(el.offsetWidth);
    let ticks = 0;
    timerRef.current = setInterval(() => {
      ticks += 1;
      if (ticks > 7) {
        clearInterval(timerRef.current);
        setDisplay(ch);
        setLockedWidth(undefined);
      } else {
        setDisplay(SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0]);
      }
    }, 42);
  };

  return (
    <motion.span
      className="inline-block will-change-transform"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      <motion.span
        ref={ref}
        className="inline-block text-center"
        style={{
          x: sx,
          y: sy,
          width: lockedWidth,
          color: lockedWidth !== undefined ? ACCENT : undefined,
        }}
        onPointerEnter={scramble}
      >
        {display}
      </motion.span>
    </motion.span>
  );
};

/** One headline line: characters rise out of a clip mask, then stay reactive. */
const KineticLine = ({ word, delayBase }: { word: string; delayBase: number }) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className="block">{word}</span>;
  }

  return (
    <span className="block overflow-hidden pb-[0.05em] -mb-[0.05em]">
      {word.split("").map((ch, i) => (
        <RepelChar key={i} ch={ch} delay={delayBase + i * 0.045} />
      ))}
    </span>
  );
};

const Hero = () => {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative overflow-hidden min-h-screen flex flex-col justify-end px-6 md:px-12 pb-24 pt-48 bg-black"
    >
      <NeuralRain />
      <FourierMonogram />
      <motion.div
        className="relative z-10"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="mb-12">
          <DecodeText
            text="TECH LEAD & FULL STACK DEVELOPER"
            delay={introDelay(0.3)}
            duration={1.2}
            className="text-meta text-neutral-500 mb-6"
          />
          <h1 className="text-huge uppercase text-white" data-cursor>
            <KineticLine word="UTKARSH" delayBase={introDelay(0.3)} />
            <KineticLine word="GARG" delayBase={introDelay(0.65)} />
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-400 max-w-4xl"
              initial={{ opacity: 0, y: reduce ? 0 : 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: introDelay(1), ease: EASE }}
            >
              CRAFTING END-TO-END DIGITAL SYSTEMS THROUGH FULL-STACK EXPERTISE, MINIMALIST EXECUTION, AND RIGOROUS TECHNICAL LEADERSHIP.
            </motion.h2>
          </div>
          <motion.div
            className="md:col-span-4 flex flex-col items-start md:items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: introDelay(1.4) }}
          >
            <span className="text-6xl mb-4 text-white inline-block animate-[scroll-bounce_2s_ease-in-out_infinite]">↘&#xFE0E;</span>
            <DecodeText
              text="SCROLL TO DISCOVER"
              delay={introDelay(1.5)}
              duration={0.9}
              className="text-meta text-neutral-500 md:text-right"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
