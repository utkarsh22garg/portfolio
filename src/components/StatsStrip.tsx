import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";

const stats = [
  { value: 5, suffix: "+", decimals: 0, label: "YEARS ENGINEERING" },
  { value: 12, suffix: "×", decimals: 0, label: "DATA THROUGHPUT GAIN" },
  { value: 9.16, suffix: "", decimals: 2, label: "CGPA — NIT ALLAHABAD" },
  { value: 317, suffix: "", decimals: 0, label: "GLOBAL RANK / 10K+ CODERS" },
];

const StatsStrip = () => {
  return (
    <section className="bg-[#0e0e0e] px-12 py-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="flex flex-col gap-4">
              <span className="font-display text-6xl md:text-7xl leading-none text-white">
                <Counter value={stat.value} decimals={stat.decimals} />
                {stat.suffix}
              </span>
              <span className="text-meta text-neutral-500">{stat.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;
