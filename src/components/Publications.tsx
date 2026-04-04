import config from "@/data/config.json";

const Publications = () => {
  return (
    <section id="publications" className="px-12 py-40 bg-[#0e0e0e]">
      <div className="mb-24">
        <p className="text-meta text-neutral-500 mb-8">03 — PUBLICATIONS</p>
        <h3 className="text-7xl md:text-8xl font-black tracking-tighter leading-none text-white">
          PUBLICATIONS
        </h3>
      </div>

      <div className="space-y-24">
        {config.publications.map((pub, index) => (
          <div key={pub.name} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Faded index number */}
            <div className="md:col-span-2">
              <span className="text-8xl font-black text-white/20">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Content */}
            <div className="md:col-span-10">
              <p className="text-meta text-neutral-500 mb-4">
                {pub.journal.toUpperCase()} — {pub.date.toUpperCase()}
              </p>
              <h4 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white mb-6">
                {pub.name}
              </h4>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-3xl mb-8">
                {pub.description.substring(0, 220)}...
              </p>
              {pub.link && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold uppercase tracking-widest text-white underline decoration-[0.5px] underline-offset-4 hover:text-neutral-300 transition-colors"
                >
                  → READ PAPER
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Publications;
