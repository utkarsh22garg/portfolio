import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ExternalLink, Heart } from "lucide-react";
import config from "@/data/config.json";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Left column */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {config.personal.name}
            </h3>
            <p className="text-muted-foreground mb-4">
              {config.personal.title}
            </p>
            <p className="text-sm text-muted-foreground">
              Building scalable solutions and leading technical teams with {" "}
              <span className="text-primary">5+ years</span> of experience.
            </p>
          </div>

          {/* Middle column */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Experience
              </button>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Projects
              </button>
            </div>
          </div>

          {/* Right column */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(config.personal.social.github, '_blank')}
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(config.personal.social.linkedin, '_blank')}
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(config.personal.social.medium, '_blank')}
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(`mailto:${config.personal.email}`, '_blank')}
                className="text-muted-foreground hover:text-primary"
              >
                <Mail className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{config.personal.email}</p>
              <p>{config.personal.phone}</p>
              <p>{config.personal.location}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {currentYear} {config.personal.name}. Made with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-current" />{" "}
            and React
          </p>
          <div className="text-sm text-muted-foreground">
            <span>Built with React • TypeScript • Tailwind CSS • shadcn/ui</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;