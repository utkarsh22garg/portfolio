import { Button } from "@/components/ui/button";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink,
  Code2,
  Database,
  Server,
  Layers,
  Zap,
  GitBranch,
  Terminal,
  Cpu
} from "lucide-react";
import { 
  SiReact, 
  SiNodedotjs, 
  SiTypescript, 
  SiPython, 
  SiJavascript,
  SiRedux,
  SiGit,
  SiLangchain,
  SiLinux
} from "react-icons/si";
import config from "@/data/config.json";
import { FlipText } from "./magicui/flip-text";
import { OrbitingCircles } from "./magicui/orbiting-circles";

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
                <div className="flex justify-start">
                  <FlipText className="text-5xl md:text-6xl font-bold text-foreground mt-2">
                    {config.personal.name}
                  </FlipText>
                </div>
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

          {/* Right content - Orbiting circles with tech stack icons */}
          <div className="relative flex justify-center items-center h-96">
            {/* Central element */}
            <div className="relative z-20 w-30 h-30 rounded-full border-2 border-primary bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-primary">5+</span>
              <span className="text-xs text-muted-foreground text-center">Years<br />Experience</span>
            </div>
            
            {/* Outer orbit - Main technologies */}
            <OrbitingCircles
              className="size-12 border-2 border-primary/20 bg-background/80 backdrop-blur-sm shadow-lg"
              duration={20}
              delay={0}
              radius={100}
              pathColor="stroke-primary/20"
            >
              <div className="flex items-center justify-center w-full h-full text-primary hover:text-primary/80 transition-colors">
                <Code2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-center w-full h-full text-blue-500 hover:text-blue-400 transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-center w-full h-full text-green-500 hover:text-green-400 transition-colors">
                <Server className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-center w-full h-full text-yellow-500 hover:text-yellow-400 transition-colors">
                <Database className="w-6 h-6" />
              </div>
            </OrbitingCircles>

            {/* Inner orbit - Supporting technologies */}
            <OrbitingCircles
              className="size-10 border-2 border-primary/20 bg-background/60 backdrop-blur-sm shadow-md"
              duration={15}
              delay={10}
              radius={150}
              reverse
              pathColor="stroke-primary/20"
            >
              <div className="flex items-center justify-center w-full h-full text-orange-500 hover:text-orange-400 transition-colors">
                <GitBranch className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center w-full h-full text-purple-500 hover:text-purple-400 transition-colors">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center w-full h-full text-red-500 hover:text-red-400 transition-colors">
                <Zap className="w-5 h-5" />
              </div>
            </OrbitingCircles>

            {/* Outer slow orbit - Additional skills */}
            <OrbitingCircles
              className="size-8 border border-primary/20 bg-background/40 backdrop-blur-sm shadow-sm"
              duration={30}
              delay={5}
              radius={190}
              pathColor="stroke-primary/20"
            >
              <div className="flex items-center justify-center w-full h-full text-cyan-500 hover:text-cyan-400 transition-colors">
                <SiLinux className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-center w-full h-full text-green-400 hover:text-green-300 transition-colors">
                <SiLangchain className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-center w-full h-full text-orange-400 hover:text-orange-300 transition-colors">
                <SiGit className="w-4 h-4" />
              </div>
            </OrbitingCircles>

            {/* Floating skill badges */}
            <div className="absolute top-0 left-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <div className="bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-xs font-medium border border-blue-600/20 flex items-center gap-1">
                <SiTypescript className="w-3 h-3" />
                TypeScript
              </div>
            </div>
            
            <div className="absolute top-8 right-0 animate-pulse" style={{ animationDelay: '1s' }}>
              <div className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 flex items-center gap-1">
                <SiReact className="w-3 h-3" />
                React
              </div>
            </div>
            
            <div className="absolute bottom-0 left-8 animate-pulse" style={{ animationDelay: '1.5s' }}>
              <div className="bg-green-600/10 text-green-600 px-3 py-1 rounded-full text-xs font-medium border border-green-600/20 flex items-center gap-1">
                <SiNodedotjs className="w-3 h-3" />
                Node.js
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 animate-pulse" style={{ animationDelay: '2s' }}>
              <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/20 flex items-center gap-1">
                <SiPython className="w-3 h-3" />
                Python
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;