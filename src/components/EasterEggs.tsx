import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const CONSOLE_ART = `
██╗   ██╗ ██████╗
██║   ██║██╔════╝
██║   ██║██║  ███╗
██║   ██║██║   ██║
╚██████╔╝╚██████╔╝
 ╚═════╝  ╚═════╝
`;

/**
 * Hidden layer: console signature, Konami "color leak" mode,
 * and a designer grid overlay on the G key.
 */
const EasterEggs = () => {
  const [toast, setToast] = useState<string | null>(null);
  const [gridOn, setGridOn] = useState(false);
  const bufferRef = useRef<string[]>([]);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    console.log(
      `%c${CONSOLE_ART}`,
      "color: #CCFF00; font-family: monospace; font-size: 12px;"
    );
    console.log(
      "%cCurious one, aren't you? Let's build something — utkarsh22garg@gmail.com",
      "color: #fff; background: #131313; padding: 6px 10px; font-family: monospace;"
    );
    console.log(
      "%cP.S. try the Konami code. Or press G.",
      "color: #6B7280; font-family: monospace;"
    );
  }, []);

  useEffect(() => {
    const showToast = (msg: string) => {
      clearTimeout(toastTimerRef.current);
      setToast(msg);
      toastTimerRef.current = setTimeout(() => setToast(null), 3200);
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const buffer = [...bufferRef.current, key].slice(-KONAMI.length);
      bufferRef.current = buffer;

      if (buffer.length === KONAMI.length && KONAMI.every((k, i) => buffer[i] === k)) {
        const on = document.documentElement.classList.toggle("color-leak");
        showToast(on ? "YOU BROKE THE MONOCHROME." : "ORDER RESTORED.");
        bufferRef.current = [];
        return;
      }

      if (key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setGridOn((v) => {
          showToast(v ? "DESIGNER GRID — OFF" : "DESIGNER GRID — ON");
          return !v;
        });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <>
      {gridOn && (
        <div className="fixed inset-0 z-[80] pointer-events-none px-12">
          <div className="grid h-full grid-cols-4 md:grid-cols-12 gap-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={
                  "h-full border-x border-[#CCFF00]/15 bg-[#CCFF00]/[0.02] " +
                  (i >= 4 ? "hidden md:block" : "")
                }
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 left-8 z-[95] bg-white text-black px-6 py-4 text-meta font-bold"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEggs;
