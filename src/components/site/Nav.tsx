import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, scrollTo, MOTION, REDUCED } from "@/lib/gsap";
import resume from "@/assets/resume.pdf";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Impact", href: "#impact" },
  { label: "Path", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const fmt = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

const Clock = () => {
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="meta tabular-nums" aria-label={`Local time in Hyderabad ${t}`}>
      HYD <span className="text-mist">{t}</span>
    </span>
  );
};

const Nav = () => {
  const barRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const openRef = useRef(false);
  openRef.current = open;

  // Scroll behaviour: hide on down / show on up; blurred background past 40px
  useGSAP(
    () => {
      const bar = barRef.current!;
      const bg = bgRef.current!;
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        gsap.from(bar, { yPercent: -100, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.9 });
      });

      let scrolled = false;
      let hidden = false;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          const s = y > 40;
          if (s !== scrolled) {
            scrolled = s;
            gsap.to(bg, { autoAlpha: s ? 1 : 0, duration: 0.5, ease: "power2.out" });
          }
          const shouldHide = !openRef.current && y > 160 && self.direction === 1;
          if (shouldHide !== hidden) {
            hidden = shouldHide;
            gsap.to(bar, { yPercent: shouldHide ? -110 : 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
          }
        },
      });
      // Active section → tiny shu dot under the matching link. Below-fold sections are code-split,
      // so observe them as they mount; IO flips state only on enter/leave (no per-frame reads).
      const seen = new Set<Element>();
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            const href = `#${e.target.id}`;
            setActive((cur) => (e.isIntersecting ? href : cur === href ? null : cur));
          }),
        { rootMargin: "-50% 0px -50% 0px" },
      );
      const scan = () => {
        LINKS.forEach((l) => {
          const el = document.querySelector(l.href);
          if (el && !seen.has(el)) {
            seen.add(el);
            io.observe(el);
          }
        });
        if (seen.size === LINKS.length) mo.disconnect();
      };
      const mo = new MutationObserver(scan);
      mo.observe(document.body, { childList: true, subtree: true });
      scan();

      return () => {
        st.kill();
        io.disconnect();
        mo.disconnect();
      };
    },
    { scope: barRef },
  );

  // Mobile overlay
  const { contextSafe } = useGSAP({ scope: overlayRef });
  const toggle = contextSafe((next: boolean) => {
    const el = overlayRef.current!;
    const items = el.querySelectorAll(".ov-item");
    const reduced = window.matchMedia(REDUCED).matches;
    setOpen(next);
    gsap.killTweensOf([el, items]);
    if (next) {
      gsap.set(barRef.current, { yPercent: 0 });
      gsap.set(el, { display: "flex" });
      if (reduced) {
        gsap.set(el, { autoAlpha: 1 });
        gsap.set(items, { yPercent: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(
        items,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.07, delay: 0.1 },
      );
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        duration: reduced ? 0 : 0.4,
        ease: "power2.in",
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && open && toggle(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, toggle]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (openRef.current) toggle(false);
    scrollTo(href);
  };

  return (
    <>
      <header ref={barRef} className="fixed inset-x-0 top-0 z-50">
        <div
          ref={bgRef}
          aria-hidden
          className="invisible absolute inset-0 border-b border-hair opacity-0"
          style={{
            background: "rgba(6,8,15,0.6)",
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
          }}
        />
        <nav className="container-x relative flex h-16 items-center justify-between md:h-[72px]">
          <a
            href="#top"
            onClick={go("#top")}
            className="font-sans text-[15px] font-medium tracking-[-0.01em] text-ice"
          >
            Utkarsh Garg
          </a>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <li key={l.href} className="relative">
                <a
                  href={l.href}
                  onClick={go(l.href)}
                  aria-current={active === l.href ? "location" : undefined}
                  className="link-u pb-0.5 text-[13px] text-mist transition-colors duration-300 hover:text-ice aria-[current=location]:text-ice"
                >
                  {l.label}
                </a>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-2 left-1/2 h-[3px] w-[3px] rounded-full transition-[opacity,transform] duration-500"
                  style={{
                    background: "var(--shu)",
                    opacity: active === l.href ? 1 : 0,
                    transform: `translateX(-50%) scale(${active === l.href ? 1 : 0.4})`,
                  }}
                />
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-6 md:flex">
            <Clock />
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-hair px-4 py-1.5 text-[13px] text-ice transition-colors duration-300 hover:border-[rgba(143,178,255,0.5)] hover:bg-[rgba(238,243,255,0.04)]"
            >
              Résumé
              <span className="text-azure transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px">
                ↗
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => toggle(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="meta relative z-10 -mr-2 px-2 py-2 text-ice md:hidden"
            style={{ color: "var(--ice)" }}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <div
        ref={overlayRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-0 z-40 hidden flex-col bg-ink md:hidden"
        style={{ visibility: "hidden" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(122,160,255,0.28), rgba(31,75,255,0.08) 50%, transparent 75%)",
          }}
        />
        <div aria-hidden className="grain-layer pointer-events-none absolute inset-0" />
        <div className="container-x relative flex flex-1 flex-col justify-between pb-10 pt-28">
          <ul className="flex flex-col gap-2">
            {LINKS.map((l, i) => (
              <li key={l.href} className="overflow-hidden border-b border-hair pb-3">
                <a
                  href={l.href}
                  onClick={go(l.href)}
                  className="ov-item flex items-baseline justify-between font-serif text-[clamp(2.75rem,13vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-ice"
                >
                  <span>{i === LINKS.length - 1 ? <em>{l.label}</em> : l.label}</span>
                  <span className="meta">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between overflow-hidden">
            <div className="ov-item">
              <Clock />
            </div>
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="ov-item inline-flex items-center gap-1.5 rounded-full border border-hair px-4 py-2 text-[13px] text-ice"
            >
              Résumé <span className="text-azure">↗</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
