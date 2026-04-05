import resume from "@/assets/resume.pdf";
import config from "@/data/config.json";

const CTASection = () => {
  const handleContact = () => {
    window.open(`mailto:${config.personal.email}`, "_blank");
  };

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = resume;
    link.download = `${config.personal.name}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="px-12 py-64 text-center bg-black">
      <p className="text-meta text-neutral-500 mb-12">HAVE A PROJECT IN MIND?</p>
      <h2
        className="text-huge font-black uppercase text-white mb-12 cursor-pointer transition-transform duration-500 ease-out hover:-skew-x-6 will-change-transform"
        onClick={handleContact}
      >
        LET&apos;S BUILD
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-12 mt-24">
        <button
          onClick={handleContact}
          className="px-12 py-6 bg-white text-black font-bold uppercase tracking-widest text-sm hover:invert transition-all duration-300 cursor-pointer"
        >
          START A CONVERSATION
        </button>
        <button
          onClick={handleDownloadResume}
          className="px-12 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
        >
          DOWNLOAD RESUME
        </button>
      </div>
    </section>
  );
};

export default CTASection;
