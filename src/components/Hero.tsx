import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import config from "@/data/config.json";
import profileImage from "@/assets/profile-image.png";

const Hero = () => {
  const handleLetsTalk = () => {
    window.open(`mailto:${config.personal.email}`, '_blank');
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-hero-gradient flex items-center justify-center">
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-20 h-20 bg-dot-pattern bg-repeat"></div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-dot-pattern bg-repeat"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-dot-pattern bg-repeat"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-dot-pattern bg-repeat"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Large background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h1 className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black text-text-large opacity-10 select-none leading-none">
                I AM A<br />
                DEVELOPER
              </h1>
            </div>

            <div className="relative z-20">
              <div className="mb-6">
                <span className="text-muted-foreground text-lg">Hello, I'm</span>
                <h2 className="text-5xl md:text-6xl font-bold text-foreground mt-2">
                  {config.personal.name}
                </h2>
                <p className="text-xl md:text-2xl text-primary font-semibold mt-2">
                  {config.personal.title}
                </p>
              </div>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed mb-8">
                {config.personal.summary.substring(0, 200)}...
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  size="lg"
                  onClick={handleLetsTalk}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                  Let's talk 👋
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View Projects
                </Button>
              </div>

              <div className="flex gap-4">
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
            </div>
          </div>

          {/* Right content - Profile image with floating badges */}
          <div className="relative flex justify-center">
            {/* Profile Image */}
            <div className="relative z-10">
              <img 
                src={profileImage} 
                alt={config.personal.name}
                className="w-80 h-auto object-contain"
              />
            </div>
            
            <div className="absolute inset-0 space-y-4">
              {/* Circular badge for experience */}
              <div className="absolute top-0 right-20 animate-pulse">
                <div className="w-32 h-32 rounded-full border-2 border-primary bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-primary">4.5+</span>
                  <span className="text-xs text-muted-foreground text-center">Years<br />Experience</span>
                </div>
              </div>

              {/* Floating tags */}
              <div className="absolute top-32 left-12 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg transform rotate-6 shadow-lg">
                  <span className="text-sm font-semibold">FULL-STACK</span>
                  <div className="text-xs">DEVELOPMENT</div>
                </div>
              </div>

              <div className="absolute top-64 right-8 animate-bounce" style={{ animationDelay: '1s' }}>
                <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg transform -rotate-3 shadow-lg">
                  <span className="text-sm font-semibold">TECH</span>
                  <div className="text-xs">LEADERSHIP</div>
                </div>
              </div>

              <div className="absolute bottom-20 left-8 animate-bounce" style={{ animationDelay: '1.5s' }}>
                <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg transform rotate-3 shadow-lg border border-primary">
                  <span className="text-sm font-semibold">PERFORMANCE</span>
                  <div className="text-xs">OPTIMIZATION</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;