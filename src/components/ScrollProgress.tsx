import { motion, useScroll, useSpring } from "motion/react";

/** Hairline scroll progress indicator pinned above the navigation. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      className="scroll-progress fixed top-0 left-0 right-0 h-[2px] bg-white origin-left z-[60]"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
