import config from "@/data/config.json";

const Journey = () => {
  return (
    <section id="journey" className="pt-40 pb-20 px-12 bg-black">
      <div className="mb-32">
        <p className="text-meta text-neutral-500 mb-4">02 — JOURNEY</p>
        <h1 className="text-huge font-black uppercase text-white">JOURNEY.</h1>
      </div>

      <div className="space-y-64">
        {config.experience.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Faded index number */}
            <div className="md:col-span-2">
              <span className="text-6xl md:text-8xl font-black text-white/20 block">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Main content */}
            <div className="md:col-span-7">
              <div className="mb-8">
                <p className="text-meta text-neutral-500 mb-2">{exp.duration.toUpperCase()}</p>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-none mb-4">
                  {exp.position}
                </h2>
                <h3 className="text-2xl font-light text-neutral-400 tracking-tight">{exp.company}</h3>
              </div>
              <div className="max-w-2xl space-y-4">
                <p className="text-neutral-300 leading-snug font-normal">{exp.description}</p>
                <ul className="space-y-4 border-l border-white/10 pl-6 py-2">
                  {exp.achievements.slice(0, 3).map((achievement, i) => (
                    <li key={i} className="text-sm text-neutral-400 leading-relaxed">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grayscale image placeholder */}
            <div className="md:col-span-3 pt-4">
              <div
                className="h-64 overflow-hidden"
                style={{
                  background: `linear-gradient(${135 + index * 30}deg, #2a2a2a, #0e0e0e)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Journey;
