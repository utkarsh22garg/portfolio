const columns = [
  {
    index: "01",
    label: "FRONTEND ARCHITECTURE",
    items: [
      { name: "JAVASCRIPT & TYPESCRIPT", tag: "STRICT TYPING / ES2022 / INTERFACES" },
      { name: "REACT & REDUX", tag: "COMPONENT ARCHITECTURE / STATE MANAGEMENT" },
      { name: "MATERIAL-UI & STORYBOOK", tag: "DESIGN SYSTEMS / COMPONENT LIBRARIES" },
    ],
  },
  {
    index: "02",
    label: "BACKEND SYSTEMS",
    items: [
      { name: "NODE.JS", tag: "RUNTIME / REST APIS / MICROSERVICES" },
      { name: "PYTHON & DASK", tag: "DATA PIPELINES / PARALLEL COMPUTING" },
      { name: "TESTING LIBRARY & MOCHA", tag: "UNIT TESTING / INTEGRATION TESTING" },
    ],
  },
  {
    index: "03",
    label: "INFRASTRUCTURE & TOOLS",
    items: [
      { name: "GIT & LINUX", tag: "VERSION CONTROL / SHELL SCRIPTING" },
      { name: "SQL & JUPYTERLAB", tag: "DATA QUERYING / ANALYTICS NOTEBOOKS" },
      { name: "VS CODE & CI/CD", tag: "DEVELOPER TOOLING / AUTOMATION" },
    ],
  },
];

const TechnicalMastery = () => {
  return (
    <section id="stack" className="px-12 py-40 bg-black">
      <div className="mb-24">
        <p className="text-meta text-neutral-500 mb-8">01 — STACK</p>
        <h3 className="text-7xl md:text-8xl font-black tracking-tighter leading-none text-white">
          TECHNICAL<br />MASTERY
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
        {columns.map((col) => (
          <div
            key={col.index}
            className="group border-t border-white/10 pt-10 hover:border-white transition-colors duration-500"
          >
            <div className="mb-12">
              <h4 className="text-xs font-black tracking-[0.3em] uppercase text-white/40 group-hover:text-white transition-colors">
                {col.index} / {col.label}
              </h4>
            </div>
            <ul className="space-y-6">
              {col.items.map((item) => (
                <li key={item.name} className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-white">{item.name}</span>
                  <span className="text-xs uppercase tracking-widest text-neutral-500 mt-1">{item.tag}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalMastery;
