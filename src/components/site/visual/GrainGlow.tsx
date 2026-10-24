import { cn } from "@/lib/utils";

/**
 * "Vertical Blue Grain": an icy-azure glow bleeding down into crushed ink,
 * finished with matte analog film grain. Pure CSS + an inline SVG noise.
 */
const GrainGlow = ({ className, tone = "ink" }: { className?: string; tone?: "ink" | "cobalt" }) => (
  <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
    {tone === "ink" ? (
      <>
        <div
          className="glow-a absolute left-1/2 top-[-30%] h-[110%] w-[120%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(50% 55% at 50% 40%, rgba(122,160,255,0.55) 0%, rgba(54,92,220,0.32) 38%, rgba(16,28,80,0.18) 62%, transparent 78%)",
            filter: "blur(10px)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: "linear-gradient(to bottom, transparent, var(--ink) 85%)" }}
        />
      </>
    ) : (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 45%, #4a74ff 0%, #2350ff 45%, #1536c9 100%)",
        }}
      />
    )}
    <div className="grain-layer absolute inset-[-50%]" />
  </div>
);

export default GrainGlow;
