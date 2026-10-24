import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION } from "@/lib/gsap";
import { recognition as awards } from "@/data/profile";
import KanjiLabel from "@/components/site/visual/KanjiLabel";

/** Section kanji: inline after the label, horizontal, on the label baseline. */
const KANJI_INLINE = "ml-4 whitespace-nowrap [writing-mode:horizontal-tb]";


const Recognition = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        document.fonts.ready.then(() =>
          ctx.add(() => {
            const h = ref.current?.querySelector(".rec-heading");
            if (!h) return;
            const split = SplitText.create(h, { type: "lines,words", mask: "lines" });
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.08,
              onComplete: () => split.revert(),
              scrollTrigger: { trigger: h, start: "top 85%", once: true },
            });
          }),
        );

        gsap.from(".rec-label", {
          opacity: 0,
          y: 12,
          scrollTrigger: { trigger: ".rec-label", start: "top 90%" },
        });

        gsap.from(".rec-line", {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".rec-list", start: "top 85%" },
        });
        gsap.from(".rec-row > *", {
          opacity: 0,
          y: 24,
          duration: 1.1,
          stagger: 0.06,
          scrollTrigger: { trigger: ".rec-list", start: "top 85%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="recognition" className="relative py-24 md:pb-20 md:pt-20">
      <div className="container-x">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12">
<div className="md:col-span-3 md:pt-6">
            <div className="flex items-baseline">
              <p className="rec-label meta">(06) Recognition</p>
              <KanjiLabel glyphs="誉" className={KANJI_INLINE} />
            </div>
          </div>
          <h2 className="rec-heading serif text-[clamp(2.5rem,6vw,6rem)] leading-[0.98] md:col-span-9">
            A few quiet <em>milestones</em>
          </h2>
        </div>

        <ul className="rec-list">
          {awards.map((a) => (
            <li key={a.title} className="relative">
              <span aria-hidden className="rec-line absolute inset-x-0 top-0 h-px bg-hair" />
              <div className="rec-row grid gap-3 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <p className="meta md:col-span-3 md:pt-1">{a.date}</p>
                <h3 className="text-[19px] font-medium leading-snug tracking-[-0.01em] text-ice md:col-span-4 md:text-[22px]">
                  {a.title}
                </h3>
                <p className="max-w-xl text-[15px] leading-relaxed text-mist md:col-span-5">{a.description}</p>
              </div>
            </li>
          ))}
          <li aria-hidden className="relative">
            <span className="rec-line absolute inset-x-0 top-0 h-px bg-hair" />
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Recognition;
