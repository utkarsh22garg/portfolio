import Marquee from "@/components/motion/Marquee";

const items = ["FULL-STACK", "TYPESCRIPT", "REACT", "NODE.JS", "PYTHON", "SYSTEM DESIGN"];

/** Velocity-reactive kinetic type band — alternating solid and outline words. */
const MarqueeBand = () => {
  return (
    <section aria-hidden className="bg-black py-20 overflow-hidden" data-cursor>
      <Marquee baseVelocity={2.5}>
        {items.map((item, i) => (
          <span
            key={item}
            className={
              "font-display uppercase text-[clamp(4rem,10vw,9rem)] leading-none pr-10 " +
              (i % 2 === 0 ? "text-white" : "text-outline")
            }
          >
            {item}
            <span className="pl-10 text-white/20">·</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
};

export default MarqueeBand;
