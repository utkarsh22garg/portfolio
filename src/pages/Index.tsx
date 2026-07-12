import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import TechnicalMastery from "@/components/TechnicalMastery";
import MarqueeBand from "@/components/MarqueeBand";
import Journey from "@/components/Journey";
import Publications from "@/components/Publications";
import SelectedWorks from "@/components/SelectedWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import EasterEggs from "@/components/EasterEggs";
import Splash from "@/components/Splash";

const Index = () => {
  return (
    <div className="bg-black min-h-screen">
      <Splash />
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <EasterEggs />
      <Navigation />
      {/* content sits above the footer so it can curtain-reveal it at page end */}
      <div className="relative z-10 bg-black">
        <Hero />
        <StatsStrip />
        <TechnicalMastery />
        <MarqueeBand />
        <Journey />
        <Publications />
        <SelectedWorks />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
