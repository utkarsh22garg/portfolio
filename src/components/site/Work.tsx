import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION, REDUCED } from "@/lib/gsap";
import config from "@/data/config.json";
import KanjiLabel from "@/components/site/visual/KanjiLabel";

/** Section kanji: inline after the label, horizontal, on the label baseline. */
const KANJI_INLINE = "ml-4 whitespace-nowrap [writing-mode:horizontal-tb]";


const EXPO = "cubic-bezier(0.19, 1, 0.22, 1)";

/* ——— Art: plaintext lines pass through a thin key plane and leave as scattered cipher dashes ——— */
const ENC_ROWS = Array.from({ length: 15 }, (_, i) => {
  // deterministic pseudo-random lengths so the "text" reads as ragged lines
  const r = (k: number) => {
    const x = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    y: 104 + i * 20,
    start: 44 + Math.round(r(1) * 70),
    dash: `${2 + Math.round(r(2) * 10)} ${4 + Math.round(r(3) * 9)} ${1 + Math.round(r(4) * 4)} ${5 + Math.round(r(5) * 8)}`,
    end: 300 + Math.round(r(6) * 60),
    op: 0.22 + r(7) * 0.22,
  };
});
/** rows the packets travel along (indices into ENC_ROWS) */
const PACKET_ROWS = [3, 8, 12];

const EncryptArt = () => (
  <div className="absolute inset-0">
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(70% 50% at 50% 46%, rgba(122,160,255,0.55) 0%, transparent 70%), radial-gradient(80% 60% at 85% 100%, #0f2a9e 0%, transparent 70%), linear-gradient(180deg, #2a55ff 0%, #1a3fd8 55%, #0b1d78 100%)",
      }}
    />
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500" preserveAspectRatio="none" fill="none">
      {ENC_ROWS.map((row) => (
        <g key={row.y} strokeLinecap="round" vectorEffect="non-scaling-stroke">
          {/* plaintext: a calm continuous line */}
          <path d={`M${row.start} ${row.y} H194`} stroke="#eef3ff" strokeOpacity={row.op + 0.12} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {/* ciphertext: the same line, broken up */}
          <path
            d={`M206 ${row.y} H${row.end}`}
            stroke="#eef3ff"
            strokeOpacity={row.op}
            strokeWidth="1"
            strokeDasharray={row.dash}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
      {/* the key plane */}
      <path d="M200 70 V430" stroke="#eef3ff" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M200 70 V430" stroke="#c8daff" strokeOpacity="0.18" strokeWidth="9" vectorEffect="non-scaling-stroke" style={{ filter: "blur(6px)" }} />
    </svg>
    {/* packets crossing the plane */}
    {PACKET_ROWS.map((ri) => (
      <span
        key={ri}
        className="art-packet absolute h-[5px] w-[5px] rounded-full"
        style={{
          left: "12%",
          top: `calc(${(ENC_ROWS[ri].y / 500) * 100}% - 2.5px)`,
          background: "#eef3ff",
          boxShadow: "0 0 10px 2px rgba(238,243,255,0.55)",
          opacity: 0,
        }}
      />
    ))}
  </div>
);

/* ——— Art: soft waveform / concentric rings on deep blue ——— */
const SignalArt = () => (
  <div className="absolute inset-0">
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(60% 45% at 50% 50%, rgba(122,160,255,0.55) 0%, rgba(40,72,200,0.35) 45%, transparent 75%), linear-gradient(180deg, #0c1a5c 0%, #0a1446 50%, #060b26 100%)",
      }}
    />
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 500"
      fill="none"
    >
      {[40, 72, 104, 136, 168, 200, 232].map((r, i) => (
        <circle
          key={r}
          className="art-ring"
          cx="200"
          cy="250"
          r={r}
          stroke="#eef3ff"
          strokeOpacity={0.34 - i * 0.04}
          strokeWidth="1"
        />
      ))}
      <path
        className="art-wave"
        d={(() => {
          let d = "M 0 250";
          for (let x = 0; x <= 400; x += 4) {
            const env = Math.exp(-Math.pow((x - 200) / 90, 2));
            const y = 250 + Math.sin(x / 7) * 46 * env * Math.cos(x / 23);
            d += ` L ${x} ${y.toFixed(2)}`;
          }
          return d;
        })()}
        stroke="#eef3ff"
        strokeOpacity="0.85"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
    <div
      className="absolute left-1/2 top-1/2 aspect-square w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background:
          "radial-gradient(closest-side, rgba(238,243,255,0.55), rgba(143,178,255,0.15) 60%, transparent)",
      }}
    />
  </div>
);

const project = config.projects[0];
const paper = config.publications[0];

const cards = [
  {
    year: project.date.split(" ").pop(),
    type: "Project",
    title: project.name,
    desc: "End-to-end encrypted chat & file transfer over Java sockets.",
    href: project.github,
    cta: "GitHub",
    Art: EncryptArt,
  },
  {
    year: paper.date.split(" ").pop(),
    type: "IEEE paper",
    title: "Emotions from speech signals",
    desc: "Predicting emotion from audio using MFCC, Mel & Chroma features.",
    href: paper.link,
    cta: "IEEE Xplore",
    Art: SignalArt,
  },
];

const Work = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        document.fonts.ready.then(() =>
          ctx.add(() => {
            const h = ref.current?.querySelector(".work-heading");
            if (!h) return;
            const split = SplitText.create(h, {
              type: "lines,words",
              mask: "lines",
            });
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.08,
              // line masks clip the descenders of "day job" — restore plain text once settled
              onComplete: () => split.revert(),
              scrollTrigger: { trigger: h, start: "top 85%" },
            });
          }),
        );

        gsap.from(".work-label", {
          opacity: 0,
          y: 12,
          duration: 1,
          scrollTrigger: { trigger: ".work-label", start: "top 90%" },
        });

        gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
          const frame = card.querySelector(".work-frame");
          const inner = card.querySelector(".work-inner");
          gsap.from(frame, {
            clipPath: "inset(12% 0% 0% 0%)",
            opacity: 0,
            y: 40,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          });
          gsap.from(card.querySelectorAll(".work-meta > *"), {
            opacity: 0,
            y: 16,
            duration: 1,
            stagger: 0.08,
            scrollTrigger: { trigger: frame, start: "bottom 92%" },
          });
          gsap.fromTo(
            inner,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // calm ambient life inside the art
        // packets travel along their row, crossing the key plane; GPU-only (x + opacity)
        gsap.utils.toArray<HTMLElement>(".art-packet").forEach((p, i) => {
          const frame = p.parentElement!;
          gsap
            .timeline({ repeat: -1, delay: i * 1.3, repeatDelay: 1.2 + i * 0.4 })
            .fromTo(
              p,
              { x: 0, opacity: 0 },
              { x: () => frame.offsetWidth * 0.76, duration: 3.4, ease: "sine.inOut" },
            )
            .to(p, { opacity: 0.9, duration: 0.5, ease: "none" }, 0)
            .to(p, { opacity: 0, duration: 0.6, ease: "none" }, 2.8);
        });
        gsap.fromTo(
          ".art-ring",
          { scale: 0.96, transformOrigin: "50% 50%" },
          {
            scale: 1.04,
            duration: 3.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.25, from: "start" },
          },
        );
      });
      mm.add(REDUCED, () => {
        gsap.set(".art-packet", { opacity: 0 });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="work" className="relative py-24 md:pb-16 md:pt-28">
      <div className="container-x">
        <div className="mb-20 grid gap-8 md:mb-28 md:grid-cols-12">
<div className="md:col-span-3 md:pt-6">
            <div className="flex items-baseline">
              <p className="work-label meta">(04) Side projects &amp; writing</p>
              <KanjiLabel glyphs="作品" className={KANJI_INLINE} />
            </div>
          </div>
          <h2 className="work-heading serif text-[clamp(3rem,8vw,8.5rem)] leading-[0.95] md:col-span-9">
            Outside the <em>day job</em>
          </h2>
        </div>

        <div className="grid gap-20 md:grid-cols-2 md:gap-6">
          {cards.map(({ year, type, title, desc, href, cta, Art }, i) => (
            <article
              key={title}
              className={`work-card group ${i === 1 ? "md:mt-20" : ""}`}
            >
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} — ${cta}`}
                className="work-frame relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-ink-2"
              >
                <div
                  className="absolute inset-0 group-hover:scale-[1.04]"
                  style={{ transition: `transform 1.2s ${EXPO}` }}
                >
                  <div className="work-inner absolute inset-x-0 -inset-y-[10%]">
                    <Art />
                    <div className="grain-layer grain-strong absolute inset-0" />
                  </div>
                </div>
                <span className="meta absolute left-5 top-5 !text-ice/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>

              <div className="work-meta mt-7 flex flex-col gap-3">
                <p className="meta">
                  {year} <span className="mx-2">·</span> {type}
                </p>
                <h3 className="serif text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02]">
                  {title}
                </h3>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-md text-[15px] leading-relaxed text-mist">
                    {desc}
                  </p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-u shrink-0 self-start pb-1 text-sm text-ice transition-colors duration-500 hover:text-azure sm:self-auto"
                  >
                    View ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
