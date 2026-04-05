import { useEffect, useState } from "react";
import resume from "@/assets/resume.pdf";
import config from "@/data/config.json";

const SECTIONS = [
  { id: "home",         label: "HOME" },
  { id: "stack",        label: "STACK" },
  { id: "journey",      label: "JOURNEY" },
  { id: "publications", label: "PUBLICATIONS" },
  { id: "portfolio",    label: "PORTFOLIO" },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
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
      >
        UTKARSH GARG
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
