import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP, MOTION, scrollTo } from "@/lib/gsap";
import GrainGlow from "@/components/site/visual/GrainGlow";
import Orb from "@/components/site/visual/Orb";
import Torii from "@/components/site/visual/Torii";
import Sakura from "@/components/site/visual/Sakura";
import Hanko from "@/components/site/visual/Hanko";
import KanjiLabel from "@/components/site/visual/KanjiLabel";
import config from "@/data/config.json";
import resume from "@/assets/resume.pdf";

const { email, social, location } = config.personal;

const links = [
  { label: "LinkedIn", href: social.linkedin },
  { label: "GitHub", href: social.github },
  { label: "Medium", href: social.medium },
  { label: "Résumé", href: resume },
];

const Contact = () => {
  // the gate draws quicker on small screens, where the panel is reached sooner
  const [drawDuration] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? 1 : undefined,
  );
  const ref = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, (ctx) => {
        document.fonts.ready.then(() =>
          ctx.add(() => {
            const h = ref.current?.querySelector(".contact-heading");
            if (!h) return;
            const split = SplitText.create(h, { type: "lines,words", mask: "lines" });
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.4,
              ease: "expo.out",
              stagger: 0.1,
              onComplete: () => split.revert(),
              scrollTrigger: { trigger: h, start: "top 85%", once: true },
            });
          }),
        );

        gsap.from(".contact-fade", {
          opacity: 0,
          y: 20,
          duration: 1.1,
          stagger: 0.08,
          scrollTrigger: { trigger: ".contact-email", start: "top 92%" },
        });

        // hanko stamps in once the panel has settled (the footer sits too low for its own trigger)
        gsap.fromTo(
          ".contact-hanko",
          { scale: 1.15, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.55,
            delay: 0.4,
            ease: "power4.out",
            scrollTrigger: { trigger: ".contact-email", start: "top 80%", once: true },
          },
        );

        // moon: rises into the gate as the panel scrolls in, then breathes gently
        gsap.to(".contact-orb-float", { yPercent: -5, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.fromTo(
          ".contact-orb",
          { yPercent: 45, autoAlpha: 0.4 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 15%", scrub: true },
          },
        );

        // magnetic email (pointer devices only)
        const el = emailRef.current;
        if (!el || !window.matchMedia("(hover: hover)").matches) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" });
        const move = contextSafe!((e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
        });
        const leave = contextSafe!(() => {
          xTo(0);
          yTo(0);
        });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="contact" className="relative isolate overflow-hidden bg-cobalt text-ice">
      <GrainGlow tone="cobalt" />
      <div aria-hidden className="washi absolute inset-0" />
      <Sakura count={7} seed={23} wind={-1} tone="cobalt" />

      <div className="container-x relative flex min-h-[100svh] flex-col">
        <div className="flex flex-1 flex-col items-center justify-center pb-6 pt-[clamp(8px,2vh,24px)] text-center md:pb-10">
          {/*
            portal: the orb is a moon seen through the torii — it sits fully inside the opening
            (under the nuki, between the pillars) and the gate's lines are painted above it.
            Opening centre in the 800×176 viewBox: x 400, y ≈126 (71.8%); clear span ≈99×83 units.
          */}
          <div
            aria-hidden
            className="pointer-events-none relative -mt-[16vw] mb-4 w-[min(358vw,1333px)] max-w-none shrink-0 md:mb-6 md:mt-0 md:w-[clamp(720px,86vw,1250px)]"
          >
            <div className="absolute left-1/2 top-[71.8%] w-[8.8%] -translate-x-1/2 -translate-y-1/2">
              <div className="contact-orb">
                <div className="contact-orb-float">
                  <Orb className="w-full" />
                </div>
              </div>
            </div>
            <Torii
              opacity={0.2}
              duration={drawDuration}
              className="relative z-[1]"
              style={{
                maskImage: "linear-gradient(to right, transparent 6%, #000 30%, #000 70%, transparent 94%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 6%, #000 30%, #000 70%, transparent 94%)",
              }}
            />
          </div>

          <div className="contact-fade relative mb-6 md:mb-8">
            <p className="meta !text-ice/70">(07) Contact</p>
            <KanjiLabel glyphs="縁" className="absolute left-full top-1/2 ml-4 -translate-y-1/2" />
          </div>
          <div className="relative w-full">
            <h2 className="contact-heading serif relative mx-auto max-w-[14ch] text-[clamp(3.25rem,14vw,4.5rem)] md:text-[clamp(4.25rem,7.2vw,7.5rem)] leading-[0.94] tracking-[-0.025em]">
              Let’s build something <em>calm</em>.
            </h2>
          </div>

          <a
            ref={emailRef}
            href={`mailto:${email}`}
            className="contact-email group mt-8 inline-block py-3 md:mt-12"
          >
            <span className="contact-fade relative block font-sans text-[clamp(1.25rem,3.4vw,2.75rem)] font-light tracking-[-0.02em]">
              {email}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-px origin-left bg-ice/40"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-ice transition-transform duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100"
              />
            </span>
          </a>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:mt-10 md:gap-x-12">
            {links.map((l) => (
              <li key={l.label} className="contact-fade">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-u pb-1 text-[15px] text-ice/80 transition-colors duration-500 hover:text-ice"
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="relative flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-ice/20" />
          <p className="meta flex items-center gap-3 !text-ice/70">
            <span className="contact-hanko inline-block">
              <Hanko size={28} variant="paper" stamp="none" rotate={-3} />
            </span>
            <span>© {new Date().getFullYear()} Utkarsh Garg</span>
          </p>
          <p className="meta !text-ice/70">{location}</p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="meta link-u self-start !text-ice/90 hover:!text-ice sm:self-auto"
          >
            Back to top ↑
          </button>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
