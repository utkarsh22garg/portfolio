import config from "@/data/config.json";

const placeholderGradients = [
  "linear-gradient(135deg, #2a2a2a, #0e0e0e)",
  "linear-gradient(165deg, #1f1f1f, #131313)",
  "linear-gradient(120deg, #353535, #1b1b1b)",
  "linear-gradient(150deg, #2a2a2a, #131313)",
];

const SelectedWorks = () => {
  const projects = config.projects;

  return (
    <section id="portfolio" className="px-12 py-40 bg-[#0e0e0e]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-8">
        <div>
          <p className="text-meta text-neutral-500 mb-4">04 — PORTFOLIO</p>
          <h3 className="text-8xl font-black tracking-tighter leading-none text-white">
            SELECTED<br />WORKS
          </h3>
        </div>
        <div className="max-w-md">
          <p className="text-neutral-400 leading-relaxed">
            A curation of projects where engineering meets precision. Focused on
            full-stack scalability and technical excellence.
          </p>
        </div>
      </div>

      {/* Projects bento grid */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className={
                "group cursor-pointer " +
                (index === 0 ? "md:col-span-12" : index % 2 === 1 ? "md:col-span-8" : "md:col-span-4")
              }
            >
              <div
                className="overflow-hidden mb-6 relative"
                style={{
                  aspectRatio: index === 0 ? "21/9" : "16/10",
                  background: placeholderGradients[index % placeholderGradients.length],
                }}
              />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-meta text-neutral-500 mb-1">
                    {project.technologies.join(" / ")}
                  </p>
                  <h4 className="text-3xl font-bold text-white">{project.name}</h4>
                  <p className="text-sm text-neutral-400 mt-2 max-w-xl">{project.description}</p>
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-3xl text-white group-hover:translate-x-2 transition-transform inline-block ml-4 shrink-0"
                    aria-label={`View ${project.name} on GitHub`}
                  >
                    →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      <div className="mt-24">
        <p className="text-meta text-neutral-500 mb-12">RECOGNITION</p>
        <div className="space-y-0">
          {config.awards.map((award) => (
            <div
              key={award.title}
              className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-t border-white/5 py-8"
            >
              <h4 className="text-2xl font-bold text-white">{award.title}</h4>
              <div className="flex items-baseline gap-8 md:max-w-xl">
                <p className="text-sm text-neutral-400">{award.description}</p>
                <span className="text-meta text-neutral-500 shrink-0">{award.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWorks;
