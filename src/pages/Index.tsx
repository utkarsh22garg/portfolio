import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import Splash from "@/components/Splash";

// Everything below the fold ships in a separate chunk so the hero (the LCP
// element) isn't waiting on code it doesn't need.
const StatsStrip = lazy(() => import("@/components/StatsStrip"));
const TechnicalMastery = lazy(() => import("@/components/TechnicalMastery"));
const MarqueeBand = lazy(() => import("@/components/MarqueeBand"));
const Journey = lazy(() => import("@/components/Journey"));
const Publications = lazy(() => import("@/components/Publications"));
const SelectedWorks = lazy(() => import("@/components/SelectedWorks"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));
const EasterEggs = lazy(() => import("@/components/EasterEggs"));

const Index = () => {
  return (
    <div className="bg-black min-h-screen">
      <Splash />
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <Suspense fallback={null}>
        <EasterEggs />
      </Suspense>
      <Navigation />
      {/* content sits above the footer so it can curtain-reveal it at page end */}
      <div className="relative z-10 bg-black">
        <Hero />
        <Suspense fallback={null}>
          <StatsStrip />
          <TechnicalMastery />
          <MarqueeBand />
          <Journey />
          <Publications />
          <SelectedWorks />
          <CTASection />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
