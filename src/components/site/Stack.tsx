import { useRef } from "react";
import { toolkit } from "@/data/profile";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import KanjiLabel from "@/components/site/visual/KanjiLabel";

/** Section kanji: inline after the label, horizontal, on the label baseline. */
const KANJI_INLINE = "ml-4 whitespace-nowrap [writing-mode:horizontal-tb]";


/** Toolkit as editorial rows: a mono group label, then a flowing line of tools. */
const Stack = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from(".stack-label", {
          autoAlpha: 0,
          y: 12,
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
        gsap.utils.toArray<HTMLElement>(".stack-row").forEach((row) => {
          const st = { trigger: row, start: "top 88%", once: true };
          gsap.from(row.querySelector(".stack-hair"), {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: st,
          });
          gsap.from(row.querySelectorAll(".stack-in"), {
            autoAlpha: 0,
            y: 16,
            duration: 0.9,
            stagger: 0.03,
            delay: 0.1,
            scrollTrigger: st,
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stack" className="relative py-24 md:pb-20 md:pt-24">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8">
<div className="md:col-span-3 md:pt-[5px]">
            <div className="flex items-baseline">
              <p className="stack-label meta">(05) Toolkit</p>
              <KanjiLabel glyphs="道具" className={KANJI_INLINE} />
            </div>
          </div>
          <p className="stack-label max-w-[44ch] text-[15px] leading-relaxed text-mist md:col-span-9 md:text-base">
            My stack covers the whole request path: the React UI, the Node and Python services behind it, the data
            engine underneath, and the agents and telemetry built on top.
          </p>
        </div>

        <ul className="mt-16 md:mt-24">
          {toolkit.map((g, i) => (
            <li key={g.group} className="stack-row group relative grid grid-cols-1 gap-y-4 py-7 md:grid-cols-12 md:gap-x-8 md:py-9">
              <span aria-hidden className="stack-hair absolute inset-x-0 top-0 h-px bg-hair" />
              <p className="stack-in meta flex gap-3 md:col-span-3 md:pt-2">
                <span className="tabular-nums text-ice/40">0{i + 1}</span>
                <span className="transition-colors duration-500 group-hover:text-ice">{g.group}</span>
              </p>
              <p className="flex flex-wrap gap-x-5 gap-y-1 md:col-span-9 md:gap-x-7 md:gap-y-2" style={{ fontSize: "clamp(1.25rem, 2vw, 1.85rem)", lineHeight: 1.35 }}>
                {g.items.map((t) => (
                  <span key={t} className="stack-in inline-block whitespace-nowrap">
                    <span className="serif cursor-default text-ice/55 transition-colors duration-300 hover:text-ice">{t}</span>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
        <span aria-hidden className="block h-px w-full bg-hair" />
      </div>
    </section>
  );
};

export default Stack;
