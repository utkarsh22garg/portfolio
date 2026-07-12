import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import resume from "@/assets/resume.pdf";
import config from "@/data/config.json";
import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";

const HEADLINE = "LET'S BUILD";

const CTASection = () => {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.25"],
  });
  const headlineScale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);

  const handleContact = () => {
    window.open(`mailto:${config.personal.email}`, "_blank");
  };

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = resume;
    link.download = `${config.personal.name}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-40 md:py-64 text-center bg-black">
      <Reveal>
        <p className="text-meta text-neutral-500 mb-12">HAVE A PROJECT IN MIND?</p>
      </Reveal>
      <Reveal delay={0.1}>
        <motion.h2
          className="text-huge uppercase text-white mb-12 cursor-pointer will-change-transform"
          style={reduce ? undefined : { scale: headlineScale }}
          onClick={handleContact}
          initial="rest"
          whileHover={reduce ? undefined : "hover"}
          animate="rest"
          data-cursor
        >
          {HEADLINE.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block will-change-transform"
              variants={{
                rest: { y: 0 },
                hover: {
                  y: [0, -24, 0],
                  transition: { delay: i * 0.025, duration: 0.45, ease: "easeInOut" },
                },
              }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </motion.h2>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="flex flex-col md:flex-row justify-center gap-12 mt-24">
          <Magnetic>
            <button
              onClick={handleContact}
              className="px-12 py-6 bg-white text-black font-bold uppercase tracking-widest text-sm hover:invert transition-colors duration-300 cursor-pointer"
            >
              START A CONVERSATION
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={handleDownloadResume}
              className="px-12 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
            >
              DOWNLOAD RESUME
            </button>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
};

export default CTASection;
