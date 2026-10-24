import { useRef } from "react";
import { aboutStats } from "@/data/profile";
import KanjiLabel from "@/components/site/visual/KanjiLabel";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION, REDUCED } from "@/lib/gsap";

/* Section kanji sit inline after the mono label (lead's call: matches Contact), horizontal, shared baseline */
const KANJI_INLINE = "ml-4 [writing-mode:horizontal-tb]";

const STATS = aboutStats.map((s) => ({ ...s, decimals: s.decimals ?? 0, suffix: s.suffix ?? "" }));

const About = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        let split: SplitText | null = null;
        let cancelled = false;

        // Meta label + stat hairlines
        gsap.from(".about-label", {
          autoAlpha: 0,
          y: 12,
          duration: 1,
          scrollTrigger: { trigger: ".about-label", start: "top 85%", once: true },
        });
        gsap.from(".about-hair", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".about-stats", start: "top 85%", once: true },
        });
        gsap.from(".about-stat-label", {
          autoAlpha: 0,
          y: 10,
          duration: 1,
          stagger: 0.12,
          delay: 0.2,
          scrollTrigger: { trigger: ".about-stats", start: "top 85%", once: true },
        });

        // Counters
        gsap.utils.toArray<HTMLElement>(".about-num").forEach((el, i) => {
          const s = STATS[i];
          const obj = { v: 0 };
          const render = () => (el.textContent = obj.v.toFixed(s.decimals));
          render();
          gsap.to(obj, {
            v: s.value,
            duration: 1.8,
            ease: "power3.out",
            delay: i * 0.12,
            snap: { v: s.decimals ? 0.01 : 1 },
            onUpdate: render,
            scrollTrigger: { trigger: ".about-stats", start: "top 85%", once: true },
          });
        });

        // Statement: words scrub 0.15 → 1
        document.fonts.ready.then(() => {
          if (cancelled || !root.current) return;
          const el = root.current.querySelector<HTMLElement>(".about-statement");
          if (!el) return;
          split = SplitText.create(el, { type: "words" });
          gsap.fromTo(
            split.words,
            { opacity: 0.15 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: {
                trigger: el,
                start: "top 80%",
                end: "bottom 45%",
                scrub: 0.6,
              },
            },
          );
          ScrollTrigger.refresh();
        });

        return () => {
          cancelled = true;
          split?.revert();
        };
      });

      mm.add(REDUCED, () => {
        gsap.utils.toArray<HTMLElement>(".about-num").forEach((el, i) => {
          el.textContent = STATS[i].value.toFixed(STATS[i].decimals);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative pb-24 pt-24 md:pb-20 md:pt-28">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-8">
          {/* Label + kanji (KANJI_INLINE) */}
          <div className="about-label md:col-span-3 md:pt-4">
            <div className="flex items-baseline">
              <p className="meta">(01) About</p>
              <KanjiLabel glyphs="序" delay={0.15} className={KANJI_INLINE} />
            </div>
          </div>

          <div className="md:col-span-9">
            <p
              className="about-statement serif text-ice"
              style={{
                fontSize: "clamp(1.8rem, 3.6vw, 3.4rem)",
                lineHeight: 1.15,
                maxWidth: "24ch",
              }}
            >
              I build the platforms other engineers build on, and I care about the people using them. Six
              years at <span className="whitespace-nowrap">D. E. Shaw</span> taking big architecture
              ideas from proposal to <em>production.</em>
            </p>

            <p className="mt-10 max-w-[38ch] text-[15px] leading-relaxed text-mist md:mt-14 md:text-base">
              I work across TypeScript, React, Node.js and Python, with a growing focus on distributed
              systems and LLM agents. Along the way I’ve led firm-wide migrations, made slow systems 60×
              to 138× faster, and helped engineers on my team get promoted.
            </p>
          </div>
        </div>

        <div className="about-stats mt-24 grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-8 md:mt-36 md:grid-cols-12">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={"relative pt-6 md:col-span-3 md:pt-8"}
            >
              <span aria-hidden className="about-hair absolute inset-x-0 top-0 h-px bg-hair" />
              <p
                className="serif flex items-baseline text-ice"
                style={{ fontSize: "clamp(2.6rem, 5vw, 5rem)", lineHeight: 1 }}
              >
                <span className="about-num tabular-nums">{s.value.toFixed(s.decimals)}</span>
                {s.suffix && <span className="ml-1 italic text-azure">{s.suffix}</span>}
              </p>
              <p className="about-stat-label meta mt-4">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
