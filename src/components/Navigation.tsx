import { useEffect, useRef, useState } from "react";
import resume from "@/assets/resume.pdf";
import config from "@/data/config.json";
import { scrollToId } from "@/lib/smooth-scroll";

const SECTIONS = [
  { id: "home",         label: "HOME" },
  { id: "stack",        label: "STACK" },
  { id: "journey",      label: "JOURNEY" },
  { id: "publications", label: "PUBLICATIONS" },
  { id: "portfolio",    label: "PORTFOLIO" },
];

// "UTKARSH GARG" — U (0) and G (8) are the keepers
const LOGO_CHARS = "UTKARSH GARG".split("");
const U_INDEX = 0;
const G_INDEX = 8;

const SCRAMBLE_GLYPHS = "AKXZVRG0147#<>/";
const ACCENT = "#67e8f9";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  // Below md the full wordmark can't share the bar with CONTACT/RESUME, so the
  // logo stays a static UG monogram (display:none, no animation) at all times.
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState(false);
  // How far G needs to slide left to sit right after U
  const [gOffset, setGOffset] = useState(0);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Decode scramble: per-char displayed glyph, active flag, and width lock
  const [display, setDisplay] = useState<string[]>(LOGO_CHARS);
  const [scrambling, setScrambling] = useState<boolean[]>(() => LOGO_CHARS.map(() => false));
  const [lockedWidths, setLockedWidths] = useState<(number | undefined)[]>(() =>
    LOGO_CHARS.map(() => undefined)
  );
  const scramblingRef = useRef<boolean[]>(LOGO_CHARS.map(() => false));
  const timersRef = useRef<number[]>([]);
  const reduceRef = useRef(false);
  // Logo affection easter egg
  const [spinning, setSpinning] = useState(false);
  const [annoyed, setAnnoyed] = useState(false);
  const clickTimesRef = useRef<number[]>([]);
  const annoyedTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleLogoClick = () => {
    scrollToId("home");
    const now = Date.now();
    clickTimesRef.current = [...clickTimesRef.current, now].filter((t) => now - t < 2500);
    if (clickTimesRef.current.length >= 5) {
      clickTimesRef.current = [];
      setSpinning(true);
      setAnnoyed(true);
      clearTimeout(annoyedTimerRef.current);
      annoyedTimerRef.current = setTimeout(() => setAnnoyed(false), 2800);
    }
  };

  useEffect(() => () => clearTimeout(annoyedTimerRef.current), []);

  /** One character flickers through glyphs (width-locked, accent tint), then settles. */
  const scrambleChar = (i: number) => {
    if (scramblingRef.current[i]) return;
    const el = charRefs.current[i];
    if (!el) return;
    scramblingRef.current[i] = true;
    const w = el.offsetWidth;
    setLockedWidths((p) => p.map((v, k) => (k === i ? w : v)));
    setScrambling((p) => p.map((v, k) => (k === i ? true : v)));
    let ticks = 0;
    const id = window.setInterval(() => {
      ticks += 1;
      if (ticks > 5) {
        clearInterval(id);
        scramblingRef.current[i] = false;
        setDisplay((p) => p.map((v, k) => (k === i ? LOGO_CHARS[i] : v)));
        setScrambling((p) => p.map((v, k) => (k === i ? false : v)));
        setLockedWidths((p) => p.map((v, k) => (k === i ? undefined : v)));
      } else {
        setDisplay((p) =>
          p.map((v, k) =>
            k === i ? SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0] : v
          )
        );
      }
    }, 40);
    timersRef.current.push(id);
  };

  /** Left-to-right decode sweep across the name; U and G stay anchored. */
  const scramblePass = () => {
    if (reduceRef.current) return;
    LOGO_CHARS.forEach((ch, i) => {
      if (i === U_INDEX || i === G_INDEX || ch === " ") return;
      const t = window.setTimeout(() => scrambleChar(i), i * 28);
      timersRef.current.push(t);
    });
  };

  // Boot decode + reduced-motion flag + timer cleanup
  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const boot = window.setTimeout(scramblePass, 600);
    timersRef.current.push(boot);
    const timers = timersRef.current;
    return () => timers.forEach((id) => clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure U and G positions so G can translateX to sit right after U
  useEffect(() => {
    const measure = () => {
      const uSpan = charRefs.current[U_INDEX];
      const gSpan = charRefs.current[G_INDEX];
      if (uSpan && gSpan) {
        const uRect = uSpan.getBoundingClientRect();
        const gRect = gSpan.getBoundingClientRect();
        // G needs to move left by this amount to be flush after U
        setGOffset(uRect.right - gRect.left);
      }
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setCollapsed(window.scrollY > 60);

      let current = "";
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 80) {
          current = section.id;
        }
      }
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6 py-5 md:px-12 md:py-8">
      <div className="flex items-center gap-6">
        <button
          onClick={handleLogoClick}
          onAnimationEnd={() => setSpinning(false)}
          onMouseEnter={() => {
            setHovered(true);
            scramblePass();
          }}
          onMouseLeave={() => setHovered(false)}
          aria-label="UTKARSH GARG — home"
          className="text-xl font-black tracking-tighter text-white cursor-pointer"
          style={{
            display: "flex",
            alignItems: "center",
            animation: spinning ? "logo-spin 0.7s ease" : undefined,
          }}
        >
          {LOGO_CHARS.map((char, i) => {
            const isU = i === U_INDEX;
            const isG = i === G_INDEX;
            const isKeeper = isU || isG;
            // hovering the collapsed monogram decrypts the full name back out
            const hidden = !isKeeper && collapsed && !hovered;

            // compact (mobile): non-keepers leave the layout entirely so the
            // button shrinks to "UG" and never crowds the CONTACT/RESUME cluster
            if (compact && !isKeeper) return null;

            return (
              <span
                key={i}
                ref={(el) => { charRefs.current[i] = el; }}
                aria-hidden
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  willChange: "opacity, transform",
                  opacity: hidden ? 0 : 1,
                  width: lockedWidths[i],
                  textAlign: lockedWidths[i] !== undefined ? "center" : undefined,
                  color: scrambling[i] ? ACCENT : undefined,
                  transform: !compact && isG && collapsed && !hovered
                    ? `translateX(${gOffset}px)`
                    : "translateX(0px)",
                  transition:
                    "opacity 400ms ease, transform 450ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                {display[i]}
              </span>
            );
          })}
        </button>
        <span
          className="text-meta text-neutral-500 hidden md:inline-block"
          style={{
            opacity: annoyed ? 1 : 0,
            transform: annoyed ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 300ms ease, transform 300ms ease",
          }}
          aria-hidden={!annoyed}
        >
          OK, THAT&apos;S ENOUGH.
        </span>
      </div>

      <div className="hidden lg:flex gap-8 xl:gap-12">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToId(section.id)}
            className={
              "text-[11px] font-bold tracking-tighter cursor-pointer transition-colors duration-300 uppercase " +
              (activeSection === section.id
                ? "text-white border-b border-white pb-1"
                : "text-neutral-500 hover:text-white")
            }
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <a
          href={`mailto:${config.personal.email}`}
          className="text-[11px] font-bold tracking-tighter text-white hover:opacity-70 transition-opacity uppercase"
        >
          CONTACT
        </a>
        <a
          href={resume}
          download={`${config.personal.name}_Resume.pdf`}
          className="text-[11px] font-bold tracking-tighter text-black bg-white px-4 py-2 hover:opacity-70 transition-opacity uppercase"
        >
          RESUME
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
