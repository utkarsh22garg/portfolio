import { motion, useReducedMotion } from "motion/react";
import config from "@/data/config.json";
import DrawLine from "@/components/motion/DrawLine";
import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const base = import.meta.env.BASE_URL;
const projectImages: Record<string, string> = {
  "Chat Encrypter": `${base}images/chat-encrypter.svg`,
};

const placeholderGradients = [
  "linear-gradient(135deg, #2a2a2a, #0e0e0e)",
  "linear-gradient(165deg, #1f1f1f, #131313)",
  "linear-gradient(120deg, #353535, #1b1b1b)",
  "linear-gradient(150deg, #2a2a2a, #131313)",
];

/**
 * Curtain reveal built from transforms only: the wrapper slides up from the
 * container's bottom edge while the image counter-translates, so the artwork
 * appears unveiled in place (the parent already clips via overflow-hidden).
 */
const CurtainImage = ({ src, alt }: { src: string; alt: string }) => {
  const reduce = useReducedMotion();

  const img = (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
    />
  );

  if (reduce) {
    return (
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        {img}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="h-full w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div
        className="h-full w-full"
        variants={{ hidden: { y: "102%" }, visible: { y: "0%" } }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <motion.div
          className="h-full w-full"
          variants={{ hidden: { y: "-102%", scale: 1.15 }, visible: { y: "0%", scale: 1 } }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {img}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const SelectedWorks = () => {
  const projects = config.projects;

  return (
    <section id="portfolio" className="px-12 py-40 bg-[#0e0e0e]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-8">
        <div>
          <Reveal>
            <p className="text-meta text-neutral-500 mb-4">04 — PORTFOLIO</p>
          </Reveal>
          <KineticHeading
            lines={["SELECTED", "WORKS"]}
            className="text-8xl font-display leading-none text-white uppercase"
          />
        </div>
        <Reveal delay={0.2} className="max-w-md">
          <p className="text-neutral-400 leading-relaxed">
            A curation of projects where engineering meets precision. Focused on
            full-stack scalability and technical excellence.
          </p>
        </Reveal>
      </div>

      {/* Projects bento grid */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          {projects.map((project, index) => (
            <Reveal
              key={project.name}
              delay={index * 0.1}
              className={
                index === 0 ? "md:col-span-12" : index % 2 === 1 ? "md:col-span-8" : "md:col-span-4"
              }
            >
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer block"
              >
                <div
                  className="overflow-hidden mb-6 relative"
                  style={{
                    aspectRatio: index === 0 ? "21/9" : "16/10",
                    background: placeholderGradients[index % placeholderGradients.length],
                  }}
                >
                  {projectImages[project.name] && (
                    <CurtainImage src={projectImages[project.name]} alt={project.name} />
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-meta text-neutral-500 mb-1">
                      {project.technologies.join(" / ")}
                    </p>
                    <h4 className="text-3xl font-bold text-white">{project.name}</h4>
                    <p className="text-sm text-neutral-400 mt-2 max-w-xl">{project.description}</p>
                  </div>
                  <span className="text-3xl text-white group-hover:translate-x-2 transition-transform inline-block ml-4 shrink-0">
                    →
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      )}

      {/* Awards */}
      <div className="mt-24">
        <Reveal>
          <p className="text-meta text-neutral-500 mb-12">RECOGNITION</p>
        </Reveal>
        <div className="space-y-0">
          {config.awards.map((award, i) => (
            <Reveal key={award.title} delay={i * 0.08} y={32}>
              <DrawLine className="bg-white/5" delay={i * 0.08} />
              <div className="group flex flex-col md:flex-row justify-between items-baseline gap-4 py-8 cursor-default">
                <h4 className="text-2xl font-bold text-white transition-transform duration-300 group-hover:translate-x-2">
                  {award.title}
                </h4>
                <div className="flex items-baseline gap-8 md:max-w-xl">
                  <p className="text-sm text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300">{award.description}</p>
                  <span className="text-meta text-neutral-500 shrink-0">{award.date}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWorks;
