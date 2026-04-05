import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechnicalMastery from "@/components/TechnicalMastery";
import Journey from "@/components/Journey";
import Publications from "@/components/Publications";
import SelectedWorks from "@/components/SelectedWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      <Hero />
      <TechnicalMastery />
      <Journey />
      <Publications />
      <SelectedWorks />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
