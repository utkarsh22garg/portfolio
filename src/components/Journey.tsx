import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import config from "@/data/config.json";
import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";

const base = import.meta.env.BASE_URL;
const journeyImages = [
  `${base}images/journey/tech-lead.jpg`,
  `${base}images/journey/placement-coordinator.jpg`,
  `${base}images/journey/summer-intern.jpg`,
];

/** Image drifts vertically inside its frame as it crosses the viewport. */
const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className="h-64 overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        style={reduce ? undefined : { y }}
        className="w-full h-[120%] -mt-[10%] object-cover grayscale hover:grayscale-0 transition-[filter] duration-700"
      />
    </div>
  );
};

const Journey = () => {
  return (
    <section id="journey" className="pt-40 pb-20 px-12 bg-black">
      <div className="mb-32">
        <Reveal>
          <p className="text-meta text-neutral-500 mb-4">02 — JOURNEY</p>
        </Reveal>
        <KineticHeading lines={["JOURNEY."]} className="text-huge uppercase text-white" />
      </div>

      <div className="space-y-64">
        {config.experience.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Faded index number */}
            <div className="md:col-span-2">
              <Reveal y={64}>
                <span className="text-6xl md:text-8xl font-display text-white/20 block">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Reveal>
            </div>

            {/* Main content */}
            <div className="md:col-span-7">
              <Reveal delay={0.1}>
                <div className="mb-8">
                  <p className="text-meta text-neutral-500 mb-2">{exp.duration.toUpperCase()}</p>
                  <h2 className="text-5xl md:text-7xl font-display text-white uppercase leading-none mb-4">
                    {exp.position}
                  </h2>
                  <h3 className="text-2xl font-light text-neutral-400 tracking-tight">{exp.company}</h3>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="max-w-2xl space-y-4">
                  <p className="text-neutral-300 leading-snug font-normal">{exp.description}</p>
                  <ul className="space-y-4 border-l border-white/10 pl-6 py-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm text-neutral-400 leading-relaxed">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Grayscale image with scroll parallax */}
            <div className="md:col-span-3 pt-4">
              <Reveal delay={0.15}>
                <ParallaxImage src={journeyImages[index]} alt={exp.position} />
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Journey;
