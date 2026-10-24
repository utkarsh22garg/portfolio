import { useRef } from "react";
import { gsap, SplitText, useGSAP, scrollTo, MOTION, REDUCED } from "@/lib/gsap";
import GrainGlow from "@/components/site/visual/GrainGlow";
import Orb from "@/components/site/visual/Orb";
import Enso from "@/components/site/visual/Enso";
import Hanko from "@/components/site/visual/Hanko";
import Sakura from "@/components/site/visual/Sakura";
import KanjiLabel from "@/components/site/visual/KanjiLabel";
import { headline } from "@/data/profile";

/* Authored intro beats (seconds from mount). The Ensō and Hanko own their draw/stamp tweens,
   so they take these as delays; everything else sits on the hero timeline below. */
const BEAT = { orb: 0.1, title: 0.2, enso: 0.6, seal: 2.1, petals: 2.3 } as const;
const TITLE_SIZE = "clamp(4rem, 13.2vw, 13.5rem)";

const Hero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root);
        const h1 = q(".hero-title")[0] as HTMLElement;

        // Hide headline until fonts are in and it's split (JS-only, so no-JS still shows it).
        gsap.set(h1, { autoAlpha: 0 });

        // ——— Intro ———
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(q(".hero-glow"), { opacity: 0, duration: 2.4, ease: "power2.out" }, 0)
          .from(
            q(".hero-orb"),
            { scale: 0.6, opacity: 0, filter: "blur(24px)", duration: 2.2, clearProps: "filter" },
            BEAT.orb,
          )
          .from(q(".hero-fade"), { y: 24, opacity: 0, duration: 1.3, stagger: 0.08 }, 0.6)
          // petals drift in only once the ring is closed and the seal has landed
          .from(q(".hero-petals"), { autoAlpha: 0, duration: 2.6, ease: "power1.inOut" }, BEAT.petals);

        let split: SplitText | undefined;
        let alive = true;
        document.fonts.ready.then(() => {
          if (!alive) return;
          split = SplitText.create(h1, { type: "lines,words,chars", mask: "lines", linesClass: "hero-line" });
          // give descenders (the italic "g") room inside the masks
          gsap.set(split.masks, { paddingBottom: "0.16em", marginBottom: "-0.16em", paddingRight: "0.08em" });
          gsap.set(h1, { autoAlpha: 1 });
          gsap.from(split.chars, {
            yPercent: 115,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.035,
            delay: Math.max(0, BEAT.title - tl.time()),
            // line masks would clip the italic "g" descender at rest; un-clip once risen.
            // (Unclipping rather than reverting avoids a few-px reflow snap of the kerned text.)
            onComplete: () => {
              if (split) gsap.set(split.masks, { overflow: "visible" });
            },
          });
        });

        // ——— Ambient: breathing glow + floating orb ———
        gsap.to(q(".glow-a"), {
          scale: 1.08,
          opacity: 0.78,
          duration: 6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 30%",
        });
        gsap.to(q(".hero-float"), { y: -18, duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // ——— Rotating focus words ———
        const words = q(".hero-focus");
        gsap.set(words, { y: 0, yPercent: (i) => (i ? 120 : 0), opacity: 1 });
        const cycle = gsap.timeline({ repeat: -1, delay: 2.4 });
        words.forEach((w, i) => {
          const next = words[(i + 1) % words.length];
          cycle
            .to(w, { yPercent: -120, duration: 0.9, ease: "expo.inOut" }, "+=2.2")
            .fromTo(next, { yPercent: 120 }, { yPercent: 0, duration: 0.9, ease: "expo.inOut", immediateRender: false }, "<");
        });

        // ——— Pointer parallax (fine pointers only) ———
        let onMove: ((e: PointerEvent) => void) | undefined;
        if (window.matchMedia("(pointer: fine)").matches) {
          const pointer = q(".hero-pointer")[0];
          const xTo = gsap.quickTo(pointer, "x", { duration: 1.6, ease: "power3.out" });
          const yTo = gsap.quickTo(pointer, "y", { duration: 1.6, ease: "power3.out" });
          const glowX = gsap.quickTo(q(".hero-glow"), "x", { duration: 2.4, ease: "power3.out" });
          // the brush ring is "on the paper": it follows the moon at ~35% for a quiet sense of depth
          const ensoX = gsap.quickTo(q(".hero-enso-pointer"), "x", { duration: 2.2, ease: "power3.out" });
          const ensoY = gsap.quickTo(q(".hero-enso-pointer"), "y", { duration: 2.2, ease: "power3.out" });
          onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            xTo(nx * 56);
            yTo(ny * 40);
            glowX(nx * -24);
            ensoX(nx * 20);
            ensoY(ny * 14);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
        }

        // ——— Scroll: orb sinks & shrinks, headline drifts up & fades ———
        const scrollTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
        });
        scrollTl
          .to(q(".hero-sink"), { yPercent: 55, scale: 0.72 }, 0)
          .to(q(".hero-content"), { y: -90, opacity: 0 }, 0)
          .to(q(".hero-petals"), { y: -60 }, 0)
          .to(q(".hero-glow-scroll"), { opacity: 0.35 }, 0);

        return () => {
          alive = false;
          split?.revert();
          if (onMove) window.removeEventListener("pointermove", onMove);
        };
      });

      mm.add(REDUCED, () => {
        gsap.set(root.current!.querySelectorAll(".hero-title, .hero-fade"), { clearProps: "opacity,visibility,transform" });
        gsap.set(root.current!.querySelectorAll(".hero-focus"), { opacity: (i: number) => (i ? 0 : 1) });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-ink"
      style={{ height: "100svh" }}
    >
      <div className="hero-glow-scroll absolute inset-0 -z-10">
        <div className="hero-glow absolute inset-0">
          <GrainGlow />
        </div>
      </div>

      {/* Orb (the moon) inside its Ensō — layered wrappers keep scroll / float / pointer / intro
          transforms independent. Both sit inside .hero-sink + .hero-float so scroll and float move
          them as one; only the pointer layer differs (orb 100%, ring ~35%). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-[5] left-[56%] top-[14%] w-[56vmin] -translate-x-1/2 md:left-[80%] md:top-[30%] md:w-[34vmin]"
      >
        <div className="hero-sink will-change-transform">
          <div className="hero-float relative">
            <div className="absolute left-1/2 top-1/2 w-[170%] -translate-x-1/2 -translate-y-1/2 md:w-[175%]">
              <div className="hero-enso-pointer">
                <Enso play="mount" delay={BEAT.enso} duration={1.8} />
              </div>
            </div>
            <div className="hero-pointer">
              <Orb className="hero-orb w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-petals pointer-events-none absolute inset-0 -z-[4]">
        <Sakura count={8} seed={11} wind={1} />
      </div>

      <div className="hero-content container-x relative flex flex-1 flex-col justify-end pb-8 pt-28 md:pb-10">
        <p className="hero-fade meta mb-6 flex items-baseline md:mb-10">
          Portfolio <span className="mx-2 text-[rgba(238,243,255,0.2)]">/</span> ’26
          <KanjiLabel glyphs="間" reveal={false} className="ml-4 [writing-mode:horizontal-tb]" />
        </p>

        {/* Seal sits outside the h1 so SplitText never touches its SVG text */}
        <div className="flex items-end" style={{ fontSize: TITLE_SIZE }}>
          <h1 className="hero-title display text-ice" style={{ fontSize: "1em" }}>
            Utkarsh <em className="text-azure" style={{ color: "#cfdcff" }}>Garg</em>
          </h1>
          <span className="hero-seal -mb-[0.07em] ml-[0.06em] flex leading-[0]">
            <Hanko size="clamp(26px, 2.5vw, 36px)" rotate={-3} stamp="mount" delay={BEAT.seal} />
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-10 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-[38ch] text-[17px] font-light leading-[1.55] text-mist md:text-[19px]">
            Tech lead at <span className="text-ice">D.&nbsp;E.&nbsp;Shaw</span>, building the web platform, data engines and AI
            tools that engineers across the firm use every day.
          </p>
          <div className="hero-fade md:text-right">
            <p className="meta mb-3">Currently working on</p>
            <p
              className="serif relative block h-[1.25em] overflow-hidden pb-[0.1em] text-ice md:min-w-[9.5em]"
              style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.25rem)", lineHeight: 1.1 }}
              aria-label={headline.focus.join(", ")}
            >
              {headline.focus.map((f, i) => (
                <span
                  key={f}
                  aria-hidden
                  className="hero-focus absolute inset-x-0 top-0 block italic md:text-right"
                  style={{ opacity: i ? 0 : 1 }}
                >
                  {f}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="hero-fade mt-14 grid grid-cols-3 items-center border-t border-hair pt-5 md:mt-20">
          <span className="meta">Hyderabad, IN</span>
          <span className="meta whitespace-nowrap text-center">
            {headline.years}+ yrs<span className="hidden sm:inline"> · Tech Lead</span>
          </span>
          <button
            type="button"
            onClick={() => scrollTo("#about")}
            className="meta group ml-auto inline-flex items-center gap-3 transition-colors duration-300 hover:text-ice"
          >
            Scroll
            <span className="relative block h-5 w-px overflow-hidden bg-hair">
              <span
                className="absolute inset-x-0 top-0 h-1/2 bg-ice"
                style={{ animation: "heroScrollCue 2.2s cubic-bezier(0.65,0,0.35,1) infinite" }}
              />
            </span>
          </button>
        </div>
      </div>

      <style>{`@keyframes heroScrollCue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}`}</style>
    </section>
  );
};

export default Hero;
