import { useEffect } from "react";
import "lenis/dist/lenis.css";
import { destroyLenis, initLenis } from "@/lib/smooth-scroll";

const SmoothScroll = () => {
  useEffect(() => {
    initLenis();
    return destroyLenis;
  }, []);

  return null;
};

export default SmoothScroll;
