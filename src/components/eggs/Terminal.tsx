import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import config from "@/data/config.json";
import resume from "@/assets/resume.pdf";
import { scrollToId } from "@/lib/smooth-scroll";

interface TerminalProps {
  open: boolean;
  onClose: () => void;
  onToggle: (overlay: "grid" | "logs" | "perf") => void;
}

interface Line {
  text: string;
  kind: "in" | "out" | "ok" | "err";
}

const ROUTES = ["home", "stack", "journey", "publications", "portfolio"];
const PROMPT = "guest@utkarsh.dev:~$";

const HELP: string[] = [
  "available commands:",
  "  whoami            who is this guy",
  "  ls                list routes",
  "  cd <route>        navigate (try: cd journey)",
  "  cat <file>        read a file (skills.json, resume.pdf)",
  "  ping              check latency to the hyderabad edge",
  "  uptime            session uptime",
  "  echo <msg>        say it back",
  "  grid|logs|perf    toggle the hidden overlays",
  "  sudo <cmd>        run as root",
  "  clear             clear the buffer",
  "  exit              close the shell (or press Esc)",
];

const Terminal = ({ open, onClose, onToggle }: TerminalProps) => {
  const [lines, setLines] = useState<Line[]>([
    { text: "web-infra shell v1.0.0 — type `help`", kind: "out" },
  ]);
  const [value, setValue] = useState("");
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const print = (texts: string[], kind: Line["kind"] = "out") => {
    setLines((prev) =>
      [...prev, ...texts.map((text) => ({ text, kind }))].slice(-200)
    );
  };

  const run = (raw: string) => {
    const input = raw.trim();
    setLines((prev) => [...prev, { text: `${PROMPT} ${input}`, kind: "in" as const }].slice(-200));
    if (!input) return;

    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        print(HELP);
        break;
      case "whoami":
        print([`utkarsh — ${config.personal.title.toLowerCase()} · web infrastructure @ d. e. shaw & co.`]);
        break;
      case "ls":
        print([ROUTES.map((r) => r + "/").join("  ") + "  skills.json  resume.pdf"]);
        break;
      case "cd": {
        const target = arg.replace(/^[/~]+|\/+$/g, "") || "home";
        if (ROUTES.includes(target)) {
          scrollToId(target);
          print([`→ /${target}`], "ok");
        } else {
          print([`cd: no such route: ${arg} — try \`ls\``], "err");
        }
        break;
      }
      case "cat":
        if (arg === "skills.json") {
          print(JSON.stringify(config.skills, null, 2).split("\n"));
        } else if (arg === "resume.pdf") {
          print(["binary file — opening…"], "ok");
          window.open(resume, "_blank");
        } else {
          print([`cat: ${arg || "?"}: no such file`], "err");
        }
        break;
      case "ping":
        print([`PONG — ${8 + Math.floor(Math.random() * 34)}ms · edge=hyderabad · 0% packet loss`], "ok");
        break;
      case "uptime": {
        const s = Math.floor(performance.now() / 1000);
        const mm = String(Math.floor(s / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        print([`up ${mm}:${ss} · 1 user · 0 incidents · all systems operational`]);
        break;
      }
      case "echo":
        print([arg]);
        break;
      case "grid":
      case "logs":
      case "perf":
        onToggle(cmd.toLowerCase() as "grid" | "logs" | "perf");
        print([`toggled ${cmd.toLowerCase()}`], "ok");
        break;
      case "sudo":
        if (/^hire([ -]me)?$/i.test(arg)) {
          print(["ACCESS GRANTED.", "opening secure channel → " + config.personal.email], "ok");
          setTimeout(() => window.open(`mailto:${config.personal.email}`, "_blank"), 600);
        } else {
          print([`${arg || "guest"} is not in the sudoers file. This incident will be reported.`], "err");
        }
        break;
      case "konami":
        print(["nice try. enter it the proper way: ↑↑↓↓←→←→BA"], "err");
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        onClose();
        break;
      default:
        print([`command not found: ${cmd} — try \`help\``], "err");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    const history = historyRef.current;
    if (e.key === "Enter") {
      run(value);
      if (value.trim()) {
        historyRef.current = [...history, value].slice(-50);
      }
      historyIdxRef.current = -1;
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = historyIdxRef.current === -1
        ? history.length - 1
        : Math.max(0, historyIdxRef.current - 1);
      historyIdxRef.current = idx;
      setValue(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdxRef.current === -1) return;
      const idx = historyIdxRef.current + 1;
      if (idx >= history.length) {
        historyIdxRef.current = -1;
        setValue("");
      } else {
        historyIdxRef.current = idx;
        setValue(history[idx]);
      }
    }
  };

  const lineColor = (kind: Line["kind"]) =>
    kind === "in" ? "text-white"
    : kind === "ok" ? "text-[#CCFF00]"
    : kind === "err" ? "text-[#FFB4AB]"
    : "text-neutral-400";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[96] h-[40vh] bg-black/95 backdrop-blur-xl border-t border-white/15 font-mono text-xs flex flex-col"
        >
          <div className="flex justify-between items-center px-6 py-3 border-b border-white/10 text-neutral-500 shrink-0">
            <span className="tracking-[0.2em] uppercase">web-infra shell — utkarsh.dev</span>
            <button onClick={onClose} className="hover:text-white transition-colors uppercase tracking-[0.2em]">
              esc to close ✕
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
            {lines.map((line, i) => (
              <div key={i} className={`whitespace-pre-wrap leading-relaxed ${lineColor(line.kind)}`}>
                {line.text}
              </div>
            ))}
            <div className="flex gap-2 items-center text-white">
              <span className="text-[#CCFF00] shrink-0">{PROMPT}</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent outline-none border-none text-white caret-[#CCFF00]"
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                aria-label="terminal input"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terminal;
