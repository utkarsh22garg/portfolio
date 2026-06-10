import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface LogLine {
  id: number;
  ts: string;
  level: "DEBUG" | "INFO" | "WARN";
  msg: string;
}

const SECTIONS = ["home", "stack", "journey", "publications", "portfolio"];
const MAX_LINES = 14;

const timestamp = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 8) + "." + String(d.getMilliseconds()).padStart(3, "0");
};

/**
 * Homage to the Logger micro-service: tails a live structured log of the
 * visitor's own session — section enters, scroll depth, clicks, heartbeats.
 */
const LogStream = () => {
  const [lines, setLines] = useState<LogLine[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const push = (level: LogLine["level"], msg: string) => {
      setLines((prev) =>
        [...prev, { id: idRef.current++, ts: timestamp(), level, msg }].slice(-MAX_LINES)
      );
    };

    push("INFO", "logger-service v2.1 connected · sink=browser · batch=off");
    push("DEBUG", "session_start user=anonymous ua=" + navigator.userAgent.split(" ").pop());

    // Scroll depth, throttled
    let lastScrollLog = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      if (now - lastScrollLog < 900) return;
      lastScrollLog = now;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const depth = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      const velocity = Math.round(Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT) * 1000);
      lastY = window.scrollY;
      lastT = now;
      if (velocity > 4000) {
        push("WARN", `scroll_velocity high v=${velocity}px/s — slow down, enjoy the type`);
      } else {
        push("INFO", `scroll depth=${depth}% v=${velocity}px/s`);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Section enters
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            push("INFO", `section_enter id=${entry.target.id}`);
          }
        }
      },
      { threshold: 0.4 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    // Clicks
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName.toLowerCase() ?? "?";
      const text = target?.textContent?.trim().slice(0, 18) || "—";
      push("INFO", `click target=<${tag}> "${text}"`);
    };
    window.addEventListener("click", onClick, { passive: true });

    // Heartbeat
    const heartbeat = setInterval(() => {
      push("DEBUG", `heartbeat ok latency=${6 + Math.floor(Math.random() * 22)}ms`);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      io.disconnect();
      clearInterval(heartbeat);
    };
  }, []);

  const levelColor = (level: LogLine["level"]) =>
    level === "WARN" ? "text-[#CCFF00]"
    : level === "INFO" ? "text-neutral-200"
    : "text-neutral-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-[85] w-[360px] max-w-[calc(100vw-4rem)] pointer-events-none bg-black/85 backdrop-blur-md border border-white/10 p-4 font-mono text-[10px] leading-relaxed"
      aria-hidden
    >
      <div className="text-neutral-500 uppercase tracking-[0.2em] mb-2 flex justify-between">
        <span>tail -f session.log</span>
        <span className="text-[#CCFF00]">● live</span>
      </div>
      {lines.map((line) => (
        <div key={line.id} className="whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="text-neutral-600">{line.ts}</span>{" "}
          <span className={levelColor(line.level)}>{line.level.padEnd(5)}</span>{" "}
          <span className="text-neutral-400">{line.msg}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default LogStream;
