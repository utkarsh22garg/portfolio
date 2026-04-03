import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechnicalMastery from "@/components/TechnicalMastery";
import Journey from "@/components/Journey";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Publications from "@/components/Publications";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TechnicalMastery />
      <Journey />
      <About />
      <Experience />
      <Publications />
      <Projects />
      <Footer />
    </div>
  );
};

export default Index;
