import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import type { ReactNode } from "react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface MarqueeProps {
  children: ReactNode;
  /** Percent of one copy traversed per second. */
  baseVelocity?: number;
}

/**
 * Infinite text band. Scroll velocity accelerates it and flips its direction.
 * Static under reduced motion.
 */
const Marquee = ({ children, baseVelocity = 2.5 }: MarqueeProps) => {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-4, 0, 4], {
    clamp: false,
  });
  // band leans into scroll velocity — classic kinetic-type skew
  const skewX = useTransform(smoothVelocity, [-1200, 1200], [3, -3]);
  const directionRef = useRef(1);

  // Four copies are rendered, so one copy = 25% of the track.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) directionRef.current = -1;
    else if (vf > 0) directionRef.current = 1;
    moveBy += directionRef.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() - moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className="inline-flex w-max" style={reduce ? { x } : { x, skewX }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex shrink-0 items-baseline" aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
