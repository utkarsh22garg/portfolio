import { useEffect, useState } from "react";
import config from "@/data/config.json";
import { scrollToTop } from "@/lib/smooth-scroll";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="bg-black border-t border-white/5 py-20 px-12 flex flex-col md:flex-row justify-between items-start gap-8">
      {/* Left */}
      <div className="flex flex-col gap-6">
        <div className="text-lg font-bold text-white uppercase tracking-tighter">
          UTKARSH GARG
        </div>
        <p className="text-meta text-neutral-600 max-w-[200px]">
          BUILDING SCALABLE DIGITAL SYSTEMS.
        </p>
        <p className="text-meta text-neutral-600 tabular-nums">
          HYDERABAD — {time} IST
        </p>
      </div>

      {/* Right: link groups */}
      <div className="flex flex-wrap gap-x-16 gap-y-8">
        <div className="flex flex-col gap-4">
          <span className="text-meta text-neutral-600">SOCIALS</span>
          <a
            href={config.personal.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta text-neutral-600 hover:text-white transition-colors underline decoration-[0.5px] underline-offset-4 duration-500"
          >
            LINKEDIN
          </a>
          <a
            href={config.personal.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta text-neutral-600 hover:text-white transition-colors underline decoration-[0.5px] underline-offset-4 duration-500"
          >
            GITHUB
          </a>
          <a
            href={config.personal.social.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta text-neutral-600 hover:text-white transition-colors underline decoration-[0.5px] underline-offset-4 duration-500"
          >
            MEDIUM
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-meta text-neutral-600">CONTACT</span>
          <a
            href={`mailto:${config.personal.email}`}
            className="text-meta text-white hover:text-neutral-300 transition-colors"
          >
            {config.personal.email.toUpperCase()}
          </a>
          <span className="text-meta text-neutral-600">
            {config.personal.location.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Copyright + back to top */}
      <div className="flex flex-col items-start md:items-end gap-6 self-end">
        <button
          onClick={scrollToTop}
          className="text-meta text-neutral-600 hover:text-white transition-colors cursor-pointer"
        >
          ↑ BACK TO TOP
        </button>
        <div className="text-meta text-neutral-600">
          © {currentYear} UTKARSH GARG. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
