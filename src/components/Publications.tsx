import config from "@/data/config.json";
import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";

const Publications = () => {
  return (
    <section id="publications" className="px-6 md:px-12 py-40 bg-[#0e0e0e]">
      <div className="mb-24">
        <Reveal>
          <p className="text-meta text-neutral-500 mb-8">03 — PUBLICATIONS</p>
        </Reveal>
        <KineticHeading
          lines={["PUBLICATIONS"]}
          className="text-7xl md:text-8xl font-display leading-none text-white uppercase"
        />
      </div>

      <div className="space-y-24">
        {config.publications.map((pub, index) => (
          <div key={pub.name} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Faded index number */}
            <div className="md:col-span-2">
              <Reveal y={64}>
                <span className="text-8xl font-display text-white/20">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Reveal>
            </div>

            {/* Content */}
            <div className="md:col-span-10">
              <Reveal delay={0.1}>
                <p className="text-meta text-neutral-500 mb-4">
                  {pub.journal.toUpperCase()} — {pub.date.toUpperCase()}
                </p>
                <h4 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white mb-6">
                  {pub.name}
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed max-w-3xl mb-8">
                  {pub.description}
                </p>
                {pub.link && (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-meta font-bold text-white underline decoration-[0.5px] underline-offset-4 hover:text-neutral-300 transition-colors"
                  >
                    → READ PAPER
                  </a>
                )}
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Publications;
