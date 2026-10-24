import { useEffect } from "react";
import { startSmoothScroll, stopSmoothScroll } from "@/lib/gsap";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Impact from "@/components/site/Impact";
import Experience from "@/components/site/Experience";
import Work from "@/components/site/Work";
import Stack from "@/components/site/Stack";
import Recognition from "@/components/site/Recognition";
import Contact from "@/components/site/Contact";

const Index = () => {
  useEffect(() => {
    startSmoothScroll();
    return stopSmoothScroll;
  }, []);

  return (
    <div className="page-grain relative min-h-screen bg-ink text-ice">
      <Nav />
      <main>
        <Hero />
        <About />
        <Impact />
        <Experience />
        <Work />
        <Stack />
        <Recognition />
      </main>
      <Contact />
    </div>
  );
};

export default Index;
