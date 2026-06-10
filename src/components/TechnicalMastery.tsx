import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";

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
        <Reveal>
          <p className="text-meta text-neutral-500 mb-8">01 — STACK</p>
        </Reveal>
        <KineticHeading
          lines={["TECHNICAL", "MASTERY"]}
          className="text-7xl md:text-8xl font-display leading-none text-white uppercase"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
        {columns.map((col, colIndex) => (
          <Reveal key={col.index} delay={colIndex * 0.12}>
            <div className="group border-t border-white/10 pt-10 hover:border-white transition-colors duration-500 h-full">
              <div className="mb-12">
                <h4 className="text-meta font-bold text-white/40 group-hover:text-white transition-colors">
                  {col.index} / {col.label}
                </h4>
              </div>
              <ul className="space-y-6">
                {col.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex flex-col transition-transform duration-500 hover:translate-x-2"
                  >
                    <span className="text-2xl font-bold tracking-tight text-white">{item.name}</span>
                    <span className="text-meta text-neutral-500 mt-1">{item.tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default TechnicalMastery;
