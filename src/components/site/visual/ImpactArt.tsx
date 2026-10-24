import type { Initiative } from "@/data/profile";

/**
 * One generative visual per initiative. Each is pure SVG/CSS in the blue-grain
 * language and exposes `.ia-*` hooks that Impact.tsx animates with GSAP.
 */

const Backdrop = ({ a, b }: { a: string; b: string }) => (
  <div
    className="absolute inset-0"
    style={{
      background: `radial-gradient(70% 55% at 50% 38%, ${a} 0%, transparent 72%), linear-gradient(180deg, ${b} 0%, #070b1e 100%)`,
    }}
  />
);

/* GenAI — an agent orb orchestrating orbiting tools (MCP, RAG, IDE, eval…) */
const AgentArt = () => {
  const tools = ["MCP", "RAG", "IDE", "Eval", "Docs", "Chat"];
  return (
    <div className="absolute inset-0">
      <Backdrop a="rgba(110,150,255,0.55)" b="#10215f" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" fill="none">
        {[70, 120, 165].map((r, i) => (
          <circle key={r} cx="200" cy="200" r={r} stroke="#eef3ff" strokeOpacity={0.16 - i * 0.03} strokeDasharray="2 6" />
        ))}
        <g className="ia-orbit">
          {tools.map((t, i) => {
            const a = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 ? 165 : 120;
            const x = 200 + Math.cos(a) * r;
            const y = 200 + Math.sin(a) * r;
            return (
              <g key={t}>
                <line className="ia-spoke" x1="200" y1="200" x2={x} y2={y} stroke="#eef3ff" strokeOpacity="0.28" strokeDasharray="1 5" />
                <g className="ia-counter">
                  <circle cx={x} cy={y} r="19" fill="#0b1440" stroke="#8fb2ff" strokeOpacity="0.6" />
                  <text x={x} y={y + 3.5} textAnchor="middle" fill="#eef3ff" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em">
                    {t}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="ia-core absolute left-1/2 top-1/2 aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-[-70%] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(200,218,255,0.4), transparent)" }} />
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{ background: "radial-gradient(circle at 36% 30%, #fff 0%, #eef3ff 24%, #c4d5ff 55%, #8aa6f2 85%, #6a86e0 100%)" }}
        >
          <div className="grain-layer grain-strong absolute inset-0" />
        </div>
      </div>
    </div>
  );
};

/* BI — a topologically-sorted compute DAG with data packets flowing through */
const DagArt = () => {
  const nodes = [
    { id: "src", x: 60, y: 200, l: "data" },
    { id: "f", x: 140, y: 120, l: "filter" },
    { id: "a", x: 140, y: 280, l: "agg" },
    { id: "e", x: 230, y: 200, l: "eval" },
    { id: "t", x: 300, y: 120, l: "xform" },
    { id: "s", x: 340, y: 260, l: "sort" },
  ];
  const edges = [
    ["src", "f"], ["src", "a"], ["f", "e"], ["a", "e"], ["e", "t"], ["e", "s"], ["t", "s"],
  ];
  const at = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <div className="absolute inset-0">
      <Backdrop a="rgba(90,130,255,0.5)" b="#0c1a54" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" fill="none">
        {/* faint grid of rows — 25M rows */}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i} x1="0" x2="400" y1={22 * i + 4} y2={22 * i + 4} stroke="#eef3ff" strokeOpacity="0.04" />
        ))}
        {edges.map(([a, b]) => {
          const p = at(a), q = at(b);
          const mx = (p.x + q.x) / 2;
          return (
            <path
              key={a + b}
              className="ia-edge"
              d={`M${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`}
              stroke="#8fb2ff"
              strokeOpacity="0.55"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id} className="ia-node">
            <rect x={n.x - 26} y={n.y - 12} width="52" height="24" rx="2" fill="#0a1238" stroke="#eef3ff" strokeOpacity="0.45" />
            <text x={n.x} y={n.y + 3.5} textAnchor="middle" fill="#eef3ff" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">
              {n.l}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

/* Logging — a live histogram of log volume, scanning like a monitor */
const StreamArt = () => (
  <div className="absolute inset-0">
    <Backdrop a="rgba(100,140,255,0.45)" b="#0b1748" />
    <div className="absolute inset-x-[8%] bottom-[16%] top-[22%] flex items-end gap-[3px]">
      {Array.from({ length: 36 }, (_, i) => {
        const h = 22 + Math.abs(Math.sin(i * 0.55) * 52 + Math.cos(i * 1.7) * 20);
        return (
          <span
            key={i}
            className="ia-bar block flex-1 origin-bottom rounded-[1px]"
            style={{ height: `${Math.min(h, 96)}%`, background: "linear-gradient(to top, rgba(143,178,255,0.15), rgba(238,243,255,0.85))" }}
          />
        );
      })}
    </div>
    <span className="ia-scan absolute bottom-[16%] top-[22%] left-[8%] w-px bg-ice/80 shadow-[0_0_14px_2px_rgba(238,243,255,0.5)]" />
    <div className="absolute inset-x-[8%] top-[10%] flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ice/60">
      <span>trace · metrics · cwv</span>
      <span className="ia-live flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-azure" /> live
      </span>
    </div>
    <span className="absolute inset-x-[8%] bottom-[16%] h-px bg-ice/25" />
  </div>
);

/* Shared UI library — a stack of releases, v13 → v26 */
const StackArt = () => (
  <div className="absolute inset-0">
    <Backdrop a="rgba(120,155,255,0.5)" b="#0e1d5c" />
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "900px" }}>
      <div className="relative h-[46%] w-[52%]" style={{ transform: "rotateX(58deg) rotateZ(-38deg)", transformStyle: "preserve-3d" }}>
        {Array.from({ length: 14 }, (_, i) => (
          <div
            key={i}
            className="ia-layer absolute inset-0 rounded-[3px] border"
            style={{
              transform: `translateZ(${i * 9}px)`,
              borderColor: `rgba(238,243,255,${0.12 + i * 0.03})`,
              background: i === 13 ? "linear-gradient(135deg, rgba(238,243,255,0.9), rgba(196,213,255,0.7))" : `rgba(20,40,130,${0.25 + i * 0.02})`,
            }}
          />
        ))}
      </div>
    </div>
    <div className="absolute bottom-[10%] left-[8%] font-mono text-[10px] uppercase tracking-[0.14em] text-ice/60">
      v<span className="ia-ver tabular-nums">13</span>
    </div>
  </div>
);

const ART: Record<Initiative["key"], () => JSX.Element> = {
  genai: AgentArt,
  bi: DagArt,
  logs: StreamArt,
  ui: StackArt,
};

const ImpactArt = ({ kind }: { kind: Initiative["key"] }) => {
  const Art = ART[kind];
  return (
    <>
      <Art />
      <div className="grain-layer grain-strong pointer-events-none absolute inset-0" />
    </>
  );
};

export default ImpactArt;
