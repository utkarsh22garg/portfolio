import MeshBackground from "@/components/MeshBackground";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex flex-col justify-end px-12 pb-24 pt-48 bg-black">
      <MeshBackground />
      <div className="relative z-10">
        <div className="mb-12">
          <p className="text-meta text-neutral-500 mb-6">
            TECH LEAD &amp; FULL STACK DEVELOPER
          </p>
          <h1 className="text-huge font-black uppercase text-white">
            UTKARSH<br />GARG
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-neutral-400 max-w-4xl">
              CRAFTING END-TO-END DIGITAL SYSTEMS THROUGH FULL-STACK EXPERTISE, MINIMALIST EXECUTION, AND RIGOROUS TECHNICAL LEADERSHIP.
            </h2>
          </div>
          <div className="md:col-span-4 flex flex-col items-start md:items-end">
            <span className="text-6xl mb-4 text-white">↘</span>
            <p className="text-meta text-neutral-500 md:text-right">SCROLL TO DISCOVER</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
