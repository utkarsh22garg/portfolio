import { useEffect, useRef, useState } from "react";
import resume from "@/assets/resume.pdf";
import config from "@/data/config.json";

const SECTIONS = [
  { id: "home",         label: "HOME" },
  { id: "stack",        label: "STACK" },
  { id: "journey",      label: "JOURNEY" },
  { id: "publications", label: "PUBLICATIONS" },
  { id: "portfolio",    label: "PORTFOLIO" },
];

// "UTKARSH GARG" — U (0) and G (8) are the keepers
const LOGO_CHARS = "UTKARSH GARG".split("");
const U_INDEX = 0;
const G_INDEX = 8;

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  // How far G needs to slide left to sit right after U
  const [gOffset, setGOffset] = useState(0);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // Measure U and G positions so G can translateX to sit right after U
  useEffect(() => {
    const measure = () => {
      const uSpan = charRefs.current[U_INDEX];
      const gSpan = charRefs.current[G_INDEX];
      if (uSpan && gSpan) {
        const uRect = uSpan.getBoundingClientRect();
        const gRect = gSpan.getBoundingClientRect();
        // G needs to move left by this amount to be flush after U
        setGOffset(uRect.right - gRect.left);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setCollapsed(window.scrollY > 60);

      let current = "";
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 80) {
          current = section.id;
        }
      }
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-12 py-8">
      <button
        onClick={() => scrollToSection("home")}
        className="text-xl font-black tracking-tighter text-white cursor-pointer hover:opacity-70 transition-opacity"
        style={{ display: "flex", alignItems: "center" }}
      >
        {LOGO_CHARS.map((char, i) => {
          const isU = i === U_INDEX;
          const isG = i === G_INDEX;
          const isKeeper = isU || isG;

          return (
            <span
              key={i}
              ref={(el) => { charRefs.current[i] = el; }}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                willChange: "opacity, transform",
                opacity: !isKeeper && collapsed ? 0 : 1,
                transform: isG && collapsed
                  ? `translateX(${gOffset}px)`
                  : "translateX(0px)",
                transition:
                  "opacity 400ms ease, transform 450ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {char}
            </span>
          );
        })}
      </button>

      <div className="hidden md:flex gap-12">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={
              "text-[11px] font-bold tracking-tighter cursor-pointer transition-colors duration-300 uppercase " +
              (activeSection === section.id
                ? "text-white border-b border-white pb-1"
                : "text-neutral-500 hover:text-white")
            }
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <a
          href={`mailto:${config.personal.email}`}
          className="text-[11px] font-bold tracking-tighter text-white hover:opacity-70 transition-opacity uppercase"
        >
          CONTACT
        </a>
        <a
          href={resume}
          download={`${config.personal.name}_Resume.pdf`}
          className="text-[11px] font-bold tracking-tighter text-black bg-white px-4 py-2 hover:opacity-70 transition-opacity uppercase"
        >
          RESUME
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
