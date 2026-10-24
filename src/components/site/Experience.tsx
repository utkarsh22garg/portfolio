import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION } from "@/lib/gsap";
import { career, leadership } from "@/data/profile";
import KanjiLabel from "@/components/site/visual/KanjiLabel";

/** Section kanji: inline after the label, horizontal, on the label baseline. */
const KANJI_INLINE = "ml-4 whitespace-nowrap [writing-mode:horizontal-tb]";

/**
 * Career path as a vertical timeline. A spine draws itself with scroll and each
 * node lights up as it passes; leadership numbers follow as a quiet band.
 */
const Experience = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, (ctx) => {
        document.fonts.ready.then(() =>
          ctx.add(() => {
            q(".exp-heading").forEach((h) => {
              const split = SplitText.create(h, { type: "lines,words", mask: "lines" });
              gsap.from(split.lines, {
                yPercent: 110,
                duration: 1.2,
                ease: "expo.out",
                stagger: 0.08,
                // line masks clip descenders at tight leading — restore the plain text once settled
                onComplete: () => split.revert(),
                scrollTrigger: { trigger: h, start: "top 85%", once: true },
              });
            });
          }),
        );

        gsap.from(q(".exp-label"), {
          autoAlpha: 0,
          y: 12,
          stagger: 0.2,
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });

        // Spine draws with scroll like a single ink stroke: a fine line with a wet, glowing tip
        const spine = q(".exp-spine")[0] as HTMLElement;
        const st = { trigger: q(".exp-list")[0], start: "top 78%", end: "bottom 70%", scrub: 0.6 };
        gsap.fromTo(q(".exp-spine-fill"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(
          q(".exp-spine-tip"),
          { y: 0, autoAlpha: 0 },
          {
            y: () => spine.offsetHeight,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { ...st, invalidateOnRefresh: true },
          },
        );

        q(".exp-item").forEach((item) => {
          const dot = item.querySelector(".exp-dot");
          const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 88%", once: true } });
          tl.from(dot, { scale: 0, duration: 0.8, ease: "back.out(3)" })
            .from(item.querySelectorAll(".exp-in"), { autoAlpha: 0, y: 22, duration: 1, stagger: 0.07 }, 0.05);
        });

        // Leadership band
        const lead = q(".lead")[0];
        gsap.from(q(".lead-hair"), {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: lead, start: "top 80%", once: true },
        });
        gsap.from(q(".lead-in"), {
          autoAlpha: 0,
          y: 20,
          duration: 1,
          stagger: 0.06,
          scrollTrigger: { trigger: lead, start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="relative py-24 md:py-28">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-3 md:pt-6">
            <div className="flex items-baseline">
              <p className="exp-label meta">(03) Path</p>
              <KanjiLabel glyphs="道" className={KANJI_INLINE} />
            </div>
          </div>
          <h2
            className="exp-heading serif text-ice md:col-span-9"
            style={{ fontSize: "clamp(2.75rem, 6.4vw, 6rem)", lineHeight: 0.98, letterSpacing: "-0.02em" }}
          >
            How I <em>got here</em>
          </h2>
        </div>

        <ol className="exp-list relative mt-20 md:mt-28 md:grid md:grid-cols-12 md:gap-x-8">
          {/* spine */}
          <span aria-hidden className="exp-spine absolute bottom-2 left-[5px] top-2 w-px bg-hair md:left-[calc(25%+2px)]">
            {/* ink: dense where the brush lands, thinning as it travels */}
            <span
              className="exp-spine-fill absolute inset-0 origin-top"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(238,243,255,0.85) 0%, rgba(143,178,255,0.7) 18%, rgba(143,178,255,0.45) 70%, rgba(143,178,255,0.12) 100%)",
              }}
            />
            <span className="exp-spine-tip invisible absolute left-1/2 top-0 block h-[18px] w-[3px] -translate-x-1/2 -translate-y-full rounded-full bg-gradient-to-b from-transparent via-ice/70 to-ice shadow-[0_0_10px_2px_rgba(143,178,255,0.45)]" />
          </span>

          {career.map((m) => (
            <li
              key={m.role + m.when}
              className="exp-item relative grid grid-cols-1 gap-y-2 pb-14 pl-10 md:col-span-12 md:grid-cols-12 md:gap-x-8 md:pb-16 md:pl-0"
            >
              <span
                aria-hidden
                className="exp-dot absolute left-0 top-[0.55em] block h-[11px] w-[11px] rounded-full border border-azure bg-ink md:left-[calc(25%-3px)]"
              >
                {m.current && (
                  <span className="absolute inset-[2px] rounded-full bg-azure shadow-[0_0_12px_3px_rgba(143,178,255,0.6)]" />
                )}
              </span>

              <p className="exp-in meta md:col-span-3 md:pt-[0.7em]">
                {m.when}
                {m.current && <span className="ml-3 text-azure">● Now</span>}
              </p>
              <div className="md:col-span-8 md:col-start-5">
                <h3
                  className={`exp-in serif ${m.current ? "text-ice" : "text-ice/85"}`}
                  style={{ fontSize: m.current ? "clamp(2.2rem, 3.6vw, 3.4rem)" : "clamp(1.7rem, 2.5vw, 2.3rem)", lineHeight: 1.05 }}
                >
                  {m.role}
                </h3>
                <p className="exp-in mt-2 text-[15px] text-ice/70">{m.org}</p>
                <p className="exp-in mt-3 max-w-[56ch] text-[15px] leading-relaxed text-mist">{m.note}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Leadership */}
        <div className="lead mt-24 grid grid-cols-1 gap-y-10 md:mt-36 md:grid-cols-12 md:gap-x-8">
          <p className="exp-label meta md:col-span-3 md:pt-4">Leadership &amp; hiring</p>
          <div className="md:col-span-9">
            <h3
              className="exp-heading serif max-w-[22ch] text-ice"
              style={{ fontSize: "clamp(1.9rem, 3.4vw, 3.1rem)", lineHeight: 1.1 }}
            >
              I spend as much time on <em>people</em> as on systems.
            </h3>

            <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
              {leadership.stats.map((s) => (
                <div key={s.label} className="relative pt-5">
                  <span aria-hidden className="lead-hair absolute inset-x-0 top-0 h-px bg-hair" />
                  <p className="lead-in serif text-ice" style={{ fontSize: "clamp(2.2rem, 3.6vw, 3.4rem)", lineHeight: 1 }}>
                    {s.value}
                  </p>
                  <p className="lead-in mt-3 text-[13px] leading-snug text-fog">{s.label}</p>
                </div>
              ))}
            </div>

            <ul className="mt-12 grid gap-4 md:grid-cols-3 md:gap-8">
              {leadership.points.map((p) => (
                <li key={p} className="lead-in text-[14.5px] leading-relaxed text-mist">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
