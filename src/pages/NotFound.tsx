import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, SplitText, useGSAP, MOTION } from "@/lib/gsap";
import GrainGlow from "@/components/site/visual/GrainGlow";

const NotFound = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        gsap.from(".nf-fade", { opacity: 0, y: 14, duration: 1.2, stagger: 0.1, delay: 0.5 });
        document.fonts.ready.then(() =>
          ctx.add(() => {
            const h = ref.current?.querySelector(".nf-heading");
            if (!h) return;
            const split = SplitText.create(h, { type: "lines,words", mask: "lines" });
            gsap.from(split.lines, { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.1 });
          }),
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="page-grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-ice">
      <GrainGlow />
      <div className="container-x relative flex flex-1 flex-col items-center justify-center text-center">
        <p className="meta nf-fade mb-10">Error 404</p>
        <h1 className="nf-heading serif max-w-[12ch] text-[clamp(3.25rem,10vw,10rem)] leading-[0.94] tracking-[-0.025em]">
          404 — <em>lost</em> in the grain
        </h1>
        <p className="nf-fade mt-10 max-w-sm text-[15px] leading-relaxed text-mist">
          This page drifted out of focus. The rest of the work is still here.
        </p>
        <Link to="/" className="nf-fade link-u mt-12 pb-1 text-[15px] text-ice hover:text-azure">
          ← Back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
