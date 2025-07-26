import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import config from "@/data/config.json";
import ugLogo from "@/assets/ug_logo.png";
import resume from "@/assets/resume.pdf";
import { ScrollProgress } from "@/components/magicui/scroll-progress";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");

  // Scroll to section and set active
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      let current = "home";
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            current = section.id;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = resume;
    link.download = `${config.personal.name}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-xs border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">
          <img src={ugLogo} alt="UG Logo" className="h-10 w-auto" />
        </div>
        <div className="hidden md:flex items-center space-x-8">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={
                (activeSection === section.id
                  ? "text-foreground border-b-2 border-primary "
                  : "text-muted-foreground ") +
                "hover:text-primary transition-colors px-1.5 py-0.5"
              }
            >
              {section.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadResume}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            Resume
          </Button>
          <Button
            variant="default"
            onClick={() => window.open(`mailto:${config.personal.email}`, '_blank')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Contact Me
          </Button>
        </div>
      </div>
      <ScrollProgress className="top-[73px] from-primary via-primary to-accent" />
    </nav>
  );
};

export default Navigation;