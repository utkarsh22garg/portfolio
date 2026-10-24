import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
gsap.defaults({ ease: "power3.out", duration: 1 });

let lenis: Lenis | null = null;

/** Starts Lenis and drives it from gsap.ticker so ScrollTrigger stays in sync. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return lenis;
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
function tick(time: number) {
  lenis?.raf(time * 1000);
}
export function stopSmoothScroll() {
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
}
export function scrollTo(target: string | number) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) lenis.scrollTo(el as HTMLElement | number, { duration: 1.4 });
  else if (typeof el === "number") window.scrollTo({ top: el, behavior: "smooth" });
  else el.scrollIntoView({ behavior: "smooth" });
}

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const MOTION = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
