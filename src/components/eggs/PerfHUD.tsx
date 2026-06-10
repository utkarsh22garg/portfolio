import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface ChromeMemory {
  usedJSHeapSize: number;
}

/** Profiler overlay: live FPS, frame time, DOM node count, JS heap, uptime. */
const PerfHUD = () => {
  const [fps, setFps] = useState(0);
  const [frameMs, setFrameMs] = useState(0);
  const [domNodes, setDomNodes] = useState(0);
  const [heap, setHeap] = useState<string | null>(null);
  const [uptime, setUptime] = useState("00:00");

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    let acc = 0;

    const loop = (t: number) => {
      acc += t - last;
      last = t;
      frames++;
      if (acc >= 500) {
        setFps(Math.round((frames * 1000) / acc));
        setFrameMs(Number((acc / frames).toFixed(1)));
        frames = 0;
        acc = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const interval = setInterval(() => {
      setDomNodes(document.getElementsByTagName("*").length);
      const memory = (performance as unknown as { memory?: ChromeMemory }).memory;
      if (memory) setHeap((memory.usedJSHeapSize / 1048576).toFixed(1) + " MB");
      const s = Math.floor(performance.now() / 1000);
      setUptime(
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
      );
    }, 1000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
  }, []);

  const rows: [string, string][] = [
    ["FPS", String(fps)],
    ["FRAME", `${frameMs}ms`],
    ["DOM", `${domNodes} nodes`],
    ...(heap ? ([["HEAP", heap]] as [string, string][]) : []),
    ["UPTIME", uptime],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-28 right-12 z-[85] pointer-events-none bg-black/85 backdrop-blur-md border border-white/10 p-4 font-mono text-[10px] leading-relaxed min-w-[160px]"
      aria-hidden
    >
      <div className="text-neutral-500 uppercase tracking-[0.2em] mb-2">profiler</div>
      {rows.map(([label, val]) => (
        <div key={label} className="flex justify-between gap-6">
          <span className="text-neutral-600">{label}</span>
          <span className={label === "FPS" && fps < 50 && fps > 0 ? "text-[#CCFF00]" : "text-neutral-200"}>
            {val}
          </span>
        </div>
      ))}
    </motion.div>
  );
};

export default PerfHUD;
