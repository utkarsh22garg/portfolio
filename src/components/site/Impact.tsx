import { useRef, useState } from "react";
import KanjiLabel from "@/components/site/visual/KanjiLabel";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION, REDUCED } from "@/lib/gsap";
import { initiatives, type Stat } from "@/data/profile";
import ImpactArt from "@/components/site/visual/ImpactArt";

/* Section kanji sit inline after the mono label (lead's call: matches Contact), horizontal, shared baseline */
const KANJI_INLINE = "ml-4 [writing-mode:horizontal-tb]";

const fmt = (s: Stat, v: number) => v.toFixed(s.decimals ?? 0);

/**
 * "Four things I own" — a sticky, cross-fading visual on the left (desktop)
 * narrates the scroll while each initiative chapter plays out on the right.
 */
const Impact = () => {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, (ctx) => {
        // Heading
        document.fonts.ready.then(() =>
          ctx.add(() => {
            const h = root.current?.querySelector(".imp-heading");
            if (!h) return;
            const split = SplitText.create(h, { type: "lines,words", mask: "lines" });
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: h, start: "top 85%", once: true },
              // line masks clip descenders at rest — un-clip once revealed (no reflow, unlike revert)
              onComplete: () => gsap.set(split.masks, { overflow: "visible" }),
            });
          }),
        );
        gsap.from(q(".imp-label, .imp-intro"), {
          autoAlpha: 0,
          y: 14,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });

        // Chapters
        q(".imp-ch").forEach((ch, i) => {
          const st = { trigger: ch, start: "top 78%", once: true };
          gsap.from(ch.querySelectorAll(".imp-in"), { autoAlpha: 0, y: 28, duration: 1.1, stagger: 0.07, scrollTrigger: st });
          gsap.from(ch.querySelectorAll(".imp-li"), {
            autoAlpha: 0,
            x: -14,
            duration: 0.9,
            stagger: 0.06,
            scrollTrigger: { trigger: ch.querySelector(".imp-list"), start: "top 85%", once: true },
          });
          gsap.from(ch.querySelector(".imp-hair"), { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.out", scrollTrigger: st });

          // Big metric counter
          const num = ch.querySelector<HTMLElement>(".imp-num");
          const s = initiatives[i].metric;
          if (num) {
            const o = { v: 0 };
            num.textContent = fmt(s, 0);
            gsap.to(o, {
              v: s.value,
              duration: 2,
              ease: "power3.out",
              onUpdate: () => (num.textContent = fmt(s, o.v)),
              scrollTrigger: { trigger: num, start: "top 88%", once: true },
            });
          }

          // Which chapter drives the sticky visual
          ScrollTrigger.create({
            trigger: ch,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });

        // Progress rail fills across the whole section
        gsap.fromTo(
          q(".imp-rail-fill"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q(".imp-chapters")[0], start: "top 55%", end: "bottom 55%", scrub: 0.4 },
          },
        );

        // ——— Ambient life inside each visual ———
        gsap.to(q(".ia-orbit"), { rotation: 360, svgOrigin: "200 200", duration: 60, ease: "none", repeat: -1 });
        gsap.to(q(".ia-counter"), { rotation: -360, transformOrigin: "50% 50%", duration: 60, ease: "none", repeat: -1 });
        gsap.to(q(".ia-core"), { scale: 1.06, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(q(".ia-spoke"), { strokeDashoffset: -24, duration: 1.6, ease: "none", repeat: -1 });

        gsap.to(q(".ia-edge"), { strokeDashoffset: -32, duration: 1.4, ease: "none", repeat: -1 });
        gsap.to(q(".ia-node"), {
          opacity: 0.45,
          duration: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.25, repeat: -1, yoyo: true },
        });

        gsap.to(q(".ia-bar"), {
          scaleY: () => gsap.utils.random(0.35, 1),
          duration: 0.9,
          ease: "sine.inOut",
          repeat: -1,
          repeatRefresh: true,
          stagger: { each: 0.03, from: "random" },
        });
        gsap.fromTo(q(".ia-scan"), { left: "8%" }, { left: "92%", duration: 4, ease: "none", repeat: -1 });
        gsap.to(q(".ia-live"), { opacity: 0.35, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut" });

        const layers = q(".ia-layer");
        const ver = q(".ia-ver");
        const stackTl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
        stackTl
          .set(layers, { opacity: 0 })
          .to(layers, {
            opacity: 1,
            duration: 0.25,
            stagger: 0.14,
            ease: "power2.out",
            onUpdate() {
              const n = Math.round(13 + this.progress() * 13);
              ver.forEach((v) => (v.textContent = String(n)));
            },
          });
      });

      mm.add(REDUCED, () => {
        q(".imp-num").forEach((el, i) => (el.textContent = fmt(initiatives[i].metric, initiatives[i].metric.value)));
        q(".ia-ver").forEach((el) => (el.textContent = "26"));
        q(".imp-ch").forEach((ch, i) =>
          ScrollTrigger.create({ trigger: ch, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setActive(i) }),
        );
      });
    },
    { scope: root },
  );

  // Cross-fade the sticky visual when the active chapter changes
  useGSAP(
    () => {
      const reduced = window.matchMedia(REDUCED).matches;
      gsap.utils.toArray<HTMLElement>(".imp-art", root.current).forEach((el, i) => {
        const on = i === active;
        gsap.to(el, {
          autoAlpha: on ? 1 : 0,
          scale: on ? 1 : 1.06,
          filter: on ? "blur(0px)" : "blur(12px)",
          duration: reduced ? 0 : 1.1,
          ease: "expo.out",
          overwrite: "auto",
        });
      });
      gsap.utils.toArray<HTMLElement>(".imp-dot", root.current).forEach((el, i) => {
        gsap.to(el, { opacity: i === active ? 1 : 0.3, duration: reduced ? 0 : 0.5 });
      });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section ref={root} id="impact" className="relative py-24 md:py-28">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8">
          {/* Label + kanji (KANJI_INLINE) */}
          <div className="imp-label md:col-span-3 md:pt-6">
            <div className="flex items-baseline">
              <p className="meta">(02) Impact</p>
              <KanjiLabel glyphs="業" delay={0.15} className={KANJI_INLINE} />
            </div>
          </div>
          <div className="md:col-span-9">
            <h2
              className="imp-heading serif text-ice"
              style={{ fontSize: "clamp(2.75rem, 6.4vw, 6rem)", lineHeight: 0.98, letterSpacing: "-0.02em" }}
            >
              Four things <em>I own</em>
            </h2>
            <p className="imp-intro mt-8 max-w-[46ch] text-[15px] leading-relaxed text-mist md:text-base">
              I run four platform projects at the same time for D.&nbsp;E.&nbsp;Shaw’s engineering org. Each one
              starts with a real problem, needs a sound architecture, and is measured by how many people rely on it.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:mt-24 md:grid-cols-12 md:gap-x-8">
          {/* Sticky visual (desktop) */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-[14vh]">
              <div className="relative aspect-square w-full overflow-hidden rounded-[2px] bg-ink-2">
                {initiatives.map((it, i) => (
                  <div key={it.key} className="imp-art absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                    <ImpactArt kind={it.key} />
                  </div>
                ))}
                <div className="meta absolute left-5 top-5 z-10 flex gap-3 !text-ice/80">
                  <span className="tabular-nums">{String(active + 1).padStart(2, "0")}</span>
                  <span className="text-ice/40">/ 04</span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-4">
                {initiatives.map((it, i) => (
                  <span key={it.key} className="imp-dot meta flex items-center gap-2 !text-ice" style={{ opacity: i ? 0.3 : 1 }}>
                    <span className="h-1 w-1 rounded-full bg-azure" />
                    {it.short}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="imp-chapters relative md:col-span-6 md:col-start-7">
            <span aria-hidden className="absolute -left-8 top-0 hidden h-full w-px bg-hair md:block">
              <span className="imp-rail-fill absolute inset-0 origin-top bg-azure/70" />
            </span>

            {initiatives.map((it, i) => (
              <article key={it.key} className="imp-ch relative pb-24 last:pb-0 md:min-h-[72vh] md:pb-20 md:last:min-h-0">
                <span aria-hidden className="imp-hair absolute inset-x-0 top-0 h-px bg-hair" />

                {/* Inline visual on mobile */}
                <div className="imp-in relative mt-8 aspect-[4/3] overflow-hidden rounded-[2px] bg-ink-2 md:hidden">
                  <ImpactArt kind={it.key} />
                </div>

                <p className="imp-in meta mt-8 flex gap-3">
                  <span className="text-azure">0{i + 1}</span> {it.kicker}
                </p>
                <h3
                  className="imp-in serif mt-5 text-ice"
                  style={{ fontSize: "clamp(2.1rem, 3.6vw, 3.4rem)", lineHeight: 1.02, letterSpacing: "-0.015em" }}
                >
                  {it.title[0]} <em className="text-[#cfdcff]">{it.title[1]}</em>
                </h3>
                <p className="imp-in mt-6 max-w-[52ch] text-[15px] leading-relaxed text-mist md:text-base">{it.summary}</p>

                {/* Metric block */}
                <div className="imp-in mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-hair pt-8 sm:grid-cols-[1.4fr_1fr_1fr]">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="serif flex items-baseline text-ice" style={{ fontSize: "clamp(3.4rem, 5.6vw, 5.5rem)", lineHeight: 0.9 }}>
                      <span className="imp-num tabular-nums">{fmt(it.metric, it.metric.value)}</span>
                      <span className="ml-1 italic text-azure">{it.metric.suffix}</span>
                    </p>
                    <p className="mt-3 max-w-[30ch] text-[13px] leading-snug text-fog">{it.metric.label}</p>
                  </div>
                  {it.secondary.map((s) => (
                    <div key={s.label} className="sm:pt-3">
                      <p className="serif text-ice" style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.1rem)", lineHeight: 1 }}>
                        {s.value}
                      </p>
                      <p className="mt-2 text-[13px] leading-snug text-fog">{s.label}</p>
                    </div>
                  ))}
                </div>

                <ul className="imp-list mt-10 space-y-3.5">
                  {it.highlights.map((h) => (
                    <li key={h} className="imp-li flex gap-4 text-[14.5px] leading-relaxed text-mist md:text-[15px]">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-azure/70" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <ul className="imp-in mt-8 flex flex-wrap gap-2">
                  {it.tags.map((t) => (
                    <li key={t} className="rounded-full border border-hair px-3 py-1 font-mono text-[11px] tracking-[0.06em] text-mist">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
