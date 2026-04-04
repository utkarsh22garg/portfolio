import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechnicalMastery from "@/components/TechnicalMastery";
import Journey from "@/components/Journey";
import Publications from "@/components/Publications";
import SelectedWorks from "@/components/SelectedWorks";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TechnicalMastery />
      <Journey />
      <Publications />
      <SelectedWorks />
      <About />
      <Experience />
      <Projects />
      <Footer />
    </div>
  );
};

export default Index;
