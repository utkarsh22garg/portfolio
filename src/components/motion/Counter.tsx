import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

interface CounterProps {
  value: number;
  decimals?: number;
  className?: string;
}

/** Counts up from 0 when scrolled into view. Static under reduced motion. */
const Counter = ({ value, decimals = 0, className }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1800, bounce: 0 });

  useEffect(() => {
    if (inView && !reduce) mv.set(value);
  }, [inView, reduce, value, mv]);

  useEffect(() => {
    if (reduce) return;
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = v.toFixed(decimals);
    });
  }, [spring, decimals, reduce]);

  return (
    <span ref={ref} className={className}>
      {reduce ? value.toFixed(decimals) : (0).toFixed(decimals)}
    </span>
  );
};

export default Counter;
