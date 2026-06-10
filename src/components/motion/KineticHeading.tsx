import { motion, useReducedMotion } from "motion/react";

interface KineticHeadingProps {
  lines: string[];
  className?: string;
  delay?: number;
}

/**
 * Big editorial headline: each line rises out of a clip mask on scroll-in.
 * The viewport observer sits on the (un-translated) heading element — the
 * clipped lines themselves never intersect the viewport while hidden.
 */
const KineticHeading = ({ lines, className, delay = 0 }: KineticHeadingProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.h3
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            variants={{
              hidden: reduce ? { opacity: 0 } : { y: "110%" },
              visible: reduce ? { opacity: 1 } : { y: 0 },
            }}
            transition={{ duration: 0.9, delay: delay + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h3>
  );
};

export default KineticHeading;
