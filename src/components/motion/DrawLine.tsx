import { motion, useReducedMotion } from "motion/react";

interface DrawLineProps {
  className?: string;
  delay?: number;
}

/** Hairline rule that draws itself from the left when scrolled into view. */
const DrawLine = ({ className = "bg-white/10", delay = 0 }: DrawLineProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`h-px w-full origin-left ${className}`}
      initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
      whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
};

export default DrawLine;
