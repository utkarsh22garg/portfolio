import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import MeshBackground from "@/components/MeshBackground";

const EASE = [0.16, 1, 0.3, 1] as const;

/** One headline line: letters rise out of a clip mask, and shove away from the cursor. */
const KineticLine = ({ word, delayBase }: { word: string; delayBase: number }) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className="block">{word}</span>;
  }

  return (
    <span className="block overflow-hidden pb-[0.05em] -mb-[0.05em]">
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: delayBase + i * 0.045, ease: EASE }}
          whileHover={{ y: -14, skewX: -8, transition: { duration: 0.25 } }}
        >
          {ch}
        </motion.span>
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
      className="relative overflow-hidden min-h-screen flex flex-col justify-end px-12 pb-24 pt-48 bg-black"
    >
      <MeshBackground />
      <motion.div
        className="relative z-10"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="mb-12">
          <motion.p
            className="text-meta text-neutral-500 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            TECH LEAD &amp; FULL STACK DEVELOPER
          </motion.p>
          <h1 className="text-huge uppercase text-white" data-cursor>
            <KineticLine word="UTKARSH" delayBase={0.3} />
            <KineticLine word="GARG" delayBase={0.65} />
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <motion.h2
              className="text-3xl md:text-5xl font-light tracking-tight text-neutral-400 max-w-4xl"
              initial={{ opacity: 0, y: reduce ? 0 : 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1, ease: EASE }}
            >
              CRAFTING END-TO-END DIGITAL SYSTEMS THROUGH FULL-STACK EXPERTISE, MINIMALIST EXECUTION, AND RIGOROUS TECHNICAL LEADERSHIP.
            </motion.h2>
          </div>
          <motion.div
            className="md:col-span-4 flex flex-col items-start md:items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <span className="text-6xl mb-4 text-white inline-block animate-[scroll-bounce_2s_ease-in-out_infinite]">↘&#xFE0E;</span>
            <p className="text-meta text-neutral-500 md:text-right">SCROLL TO DISCOVER</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
