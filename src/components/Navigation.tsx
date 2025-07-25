import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import config from "@/data/config.json";

const Navigation = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = `${config.personal.name}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">
          {config.personal.name.split(' ')[0]}.
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('home')}
            className="text-foreground hover:text-primary transition-colors border-b-2 border-primary"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('experience')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Projects
          </button>
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
    </nav>
  );
};

export default Navigation;