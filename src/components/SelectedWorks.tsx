import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import config from "@/data/config.json";
import DrawLine from "@/components/motion/DrawLine";
import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const base = import.meta.env.BASE_URL;
const projectImages: Record<string, string> = {
  "Chat Encrypter": `${base}images/chat-encrypter.svg`,
};

type Project = (typeof config.projects)[number];

const PAD = (n: number) => String(n + 1).padStart(2, "0");
const YEAR = (date: string) => date.match(/\d{4}/)?.[0] ?? date;

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

/** Cursor-tracking thumbnail preview for hovered rows that carry an image. */
const HoverPreview = ({ src, visible }: { src?: string; visible: boolean }) => {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  const lastSrc = useRef<string | undefined>(undefined);
  if (src) lastSrc.current = src;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX + 24);
      y.set(e.clientY + 24);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!lastSrc.current) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 w-72 aspect-[16/10] overflow-hidden pointer-events-none"
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <img src={lastSrc.current} alt="" className="w-full h-full object-cover grayscale" />
    </motion.div>
  );
};

interface ProjectRowProps {
  project: Project;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  reduce: boolean | null;
}

const ProjectRow = ({ project, index, isOpen, onToggle, onHoverStart, onHoverEnd, reduce }: ProjectRowProps) => {
  const image = projectImages[project.name];
  const triggerId = `project-trigger-${index}`;
  const panelId = `project-panel-${index}`;
  const techPreview = project.technologies.slice(0, 2).join(" · ");
  const year = YEAR(project.date);

  return (
    <div onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="group relative w-full text-left cursor-pointer py-8 md:py-10"
      >
        {/* Mobile: stacked meta line + name */}
        <div className="md:hidden">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <span className="text-meta text-neutral-500">
              {PAD(index)} · {techPreview} · {year}
            </span>
            <span
              className={`text-2xl text-neutral-500 shrink-0 transition-transform duration-300 ${
                isOpen ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </div>
          <div className="text-4xl font-display uppercase text-white">{project.name}</div>
        </div>

        {/* Desktop: single baseline-aligned row */}
        <div className="hidden md:flex items-baseline gap-8">
          <span className="text-meta text-neutral-600 w-12 shrink-0">{PAD(index)}</span>
          <span className="text-6xl font-display uppercase text-white transition-transform duration-300 group-hover:translate-x-2">
            {project.name}
          </span>
          <span className="ml-auto flex items-baseline gap-8 shrink-0">
            <span className="text-meta text-neutral-500 transition-colors duration-300 group-hover:text-neutral-300">
              {techPreview}
            </span>
            <span className="text-meta text-neutral-500 tabular-nums transition-colors duration-300 group-hover:text-neutral-300">
              {year}
            </span>
            <span
              className={`text-2xl text-neutral-500 transition-transform duration-300 ${
                isOpen ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-12 gap-8 pb-12">
              <div className="md:col-span-6">
                <p className="text-base md:text-lg text-neutral-300 leading-relaxed">
                  {project.description}
                </p>
                {project.features.length > 0 && (
                  <ul className="space-y-2 mt-6">
                    {project.features.map((feature) => (
                      <li key={feature} className="text-sm text-neutral-400">
                        <span className="text-neutral-600 mr-3">+</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="md:col-span-3">
                <p className="text-meta text-neutral-600 mb-3">STACK</p>
                <div className="inline-flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 border border-white/10 text-meta text-neutral-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3">
                <p className="text-meta text-neutral-600 mb-3">SOURCE</p>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-meta text-white underline decoration-[0.5px] underline-offset-4 transition-colors hover:text-neutral-300"
                >
                  VIEW SOURCE ↗
                </a>
              </div>

              {image && (
                <div className="md:col-span-12 mt-4">
                  <div className="group overflow-hidden aspect-[16/10] md:max-w-xl">
                    <CurtainImage src={image} alt={project.name} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SelectedWorks = () => {
  const projects = config.projects;
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pointerFine, setPointerFine] = useState(false);

  useEffect(() => {
    setPointerFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const hoverProject =
    hoverIndex !== null && hoverIndex !== openIndex ? projects[hoverIndex] : undefined;
  const hoverSrc = hoverProject ? projectImages[hoverProject.name] : undefined;
  const showPreview = !reduce && pointerFine;

  return (
    <section id="portfolio" className="px-6 md:px-12 py-40 bg-[#0e0e0e]">
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

      {/* Project index */}
      {projects.length > 0 && (
        <div className="mb-24">
          {projects.map((project, index) => (
            <Reveal key={project.name} delay={index * 0.08}>
              <DrawLine className="bg-white/5" delay={index * 0.08} />
              <ProjectRow
                project={project}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                onHoverStart={() => setHoverIndex(index)}
                onHoverEnd={() => setHoverIndex((h) => (h === index ? null : h))}
                reduce={reduce}
              />
            </Reveal>
          ))}
        </div>
      )}

      {showPreview && <HoverPreview src={hoverSrc} visible={!!hoverSrc} />}

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
