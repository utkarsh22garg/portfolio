# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio single-page app from its card-based dark-green aesthetic to the Editorial Brutalism design system matching two approved Stitch screens.

**Architecture:** Build new section components alongside existing ones (Option C). Rewrite global theme first, then create/rewrite components one at a time, wire everything in Index.tsx last. Old design stays intact until final wiring step — no broken intermediate states.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, content from `src/data/config.json`. Design reference: `docs/DESIGN.md`. Full spec: `docs/superpowers/specs/2026-04-03-portfolio-redesign-design.md`.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `index.html` | Add Inter Google Fonts import |
| Modify | `src/index.css` | Replace all color tokens, border-radius 0, add `.text-huge` / `.text-meta` utilities |
| Rewrite internals | `src/components/Navigation.tsx` | Fixed glassmorphism nav with scrollspy, no buttons/icons |
| Rewrite internals | `src/components/Hero.tsx` | Full-viewport typographic hero, no animations |
| **Create** | `src/components/TechnicalMastery.tsx` | 01 — STACK: 3-column skill grid |
| **Create** | `src/components/Journey.tsx` | 02 — JOURNEY: numbered experience timeline |
| Rewrite internals | `src/components/Publications.tsx` | 03 — PUBLICATIONS: editorial numbered layout |
| **Create** | `src/components/SelectedWorks.tsx` | 04 — PORTFOLIO: bento grid + awards |
| **Create** | `src/components/CTASection.tsx` | LET'S BUILD CTA with two action buttons |
| Rewrite internals | `src/components/Footer.tsx` | Minimal two-column footer, socials + contact |
| Modify | `src/pages/Index.tsx` | Final composition — updated incrementally per task |
| Delete | `src/components/About.tsx` | Replaced by TechnicalMastery |
| Delete | `src/components/Experience.tsx` | Replaced by Journey |
| Delete | `src/components/Projects.tsx` | Replaced by SelectedWorks |
| Delete | `src/components/magicui/` (all 3 files) | OrbitingCircles, FlipText, ScrollProgress — not used |

---

## Task 1: Global Theme & Font Setup

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`

- [ ] **Step 1: Add Inter font to index.html**

Replace the entire `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Utkarsh Garg — Tech Lead & Full-Stack Developer</title>
    <meta name="description" content="Full-Stack developer with 5+ years of experience specialising in TypeScript, ReactJS, and NodeJS. Tech Lead at D.E. Shaw & Co." />
    <meta name="author" content="Utkarsh Garg" />
    <link rel="icon" type="image/x-icon" href="./favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Replace src/index.css with Editorial Brutalism tokens**

Replace the entire file:

```css
@import 'tailwindcss';

@plugin 'tailwindcss-animate';

@custom-variant dark (&:is(.dark *));

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
}

@layer base {
  :root {
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;

    --card: 0 0% 8%;
    --card-foreground: 0 0% 89%;

    --popover: 0 0% 8%;
    --popover-foreground: 0 0% 89%;

    --primary: 0 0% 100%;
    --primary-foreground: 0 0% 11%;

    --secondary: 0 0% 12%;
    --secondary-foreground: 0 0% 89%;

    --muted: 0 0% 12%;
    --muted-foreground: 0 0% 42%;

    --accent: 0 0% 12%;
    --accent-foreground: 0 0% 89%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 95%;

    --border: 0 0% 15%;
    --input: 0 0% 12%;
    --ring: 0 0% 100%;

    --radius: 0rem;
  }
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-border, currentcolor);
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', sans-serif;
  }
}

/* Editorial Brutalism utilities */
.text-huge {
  font-size: clamp(4rem, 12vw, 16rem);
  line-height: 0.85;
  letter-spacing: -0.05em;
}

.text-meta {
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
```

- [ ] **Step 3: Verify dev server compiles cleanly**

```bash
pnpm dev
```

Open `http://localhost:8080`. The page loads (may look visually broken — that's expected). No console errors about missing modules or CSS parse failures.

- [ ] **Step 4: Commit**

```bash
git add index.html src/index.css
git commit -m "feat: apply Editorial Brutalism theme tokens and Inter font"
```

---

## Task 2: Navigation Rewrite

**Files:**
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Replace Navigation.tsx**

```tsx
import { useEffect, useState } from "react";
import config from "@/data/config.json";

const SECTIONS = [
  { id: "home",         label: "HOME" },
  { id: "stack",        label: "STACK" },
  { id: "journey",      label: "JOURNEY" },
  { id: "publications", label: "PUBLICATIONS" },
  { id: "portfolio",    label: "PORTFOLIO" },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      let current = "home";
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            current = section.id;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-12 py-8">
      <button
        onClick={() => scrollToSection("home")}
        className="text-xl font-black tracking-tighter text-white cursor-pointer hover:opacity-70 transition-opacity"
      >
        UTKARSH GARG
      </button>

      <div className="hidden md:flex gap-12">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={
              "text-[11px] font-bold tracking-tighter cursor-pointer transition-colors duration-300 uppercase " +
              (activeSection === section.id
                ? "text-white border-b border-white pb-1"
                : "text-neutral-500 hover:text-white")
            }
          >
            {section.label}
          </button>
        ))}
      </div>

      <a
        href={`mailto:${config.personal.email}`}
        className="text-[11px] font-bold tracking-tighter text-white hover:opacity-70 transition-opacity uppercase"
      >
        CONTACT
      </a>
    </nav>
  );
};

export default Navigation;
```

- [ ] **Step 2: Verify in browser**

```bash
pnpm dev
```

Check: nav is black/blurred at top, "UTKARSH GARG" left, 5 nav links center, "CONTACT" right. Scroll the page — active link gets white underline as sections enter view.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "feat: rewrite Navigation to Editorial Brutalism glassmorphism style"
```

---

## Task 3: Hero Rewrite

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Replace Hero.tsx**

```tsx
const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-end px-12 pb-24 pt-48 bg-black">
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
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Verify in browser**

Check: "UTKARSH GARG" fills the lower portion of the viewport in massive type, subtitle text is large and light gray below it, arrow + meta label aligned bottom-right.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: rewrite Hero to full-viewport typographic layout"
```

---

## Task 4: TechnicalMastery Component (01 — STACK)

**Files:**
- Create: `src/components/TechnicalMastery.tsx`
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Create src/components/TechnicalMastery.tsx**

```tsx
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
```

- [ ] **Step 2: Add TechnicalMastery to Index.tsx**

```tsx
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechnicalMastery from "@/components/TechnicalMastery";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Publications from "@/components/Publications";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TechnicalMastery />
      <About />
      <Experience />
      <Publications />
      <Projects />
      <Footer />
    </div>
  );
};

export default Index;
```

- [ ] **Step 3: Verify in browser**

Check: three-column skill grid appears below Hero. Each column has a top border that brightens to white on hover. Skill names are large/bold, tags are tiny uppercase gray.

- [ ] **Step 4: Commit**

```bash
git add src/components/TechnicalMastery.tsx src/pages/Index.tsx
git commit -m "feat: add TechnicalMastery section (01 — STACK)"
```

---

## Task 5: Journey Component (02 — JOURNEY)

**Files:**
- Create: `src/components/Journey.tsx`
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Create src/components/Journey.tsx**

```tsx
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
```

- [ ] **Step 2: Add Journey to Index.tsx**

```tsx
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechnicalMastery from "@/components/TechnicalMastery";
import Journey from "@/components/Journey";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Publications from "@/components/Publications";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TechnicalMastery />
      <Journey />
      <About />
      <Experience />
      <Publications />
      <Projects />
      <Footer />
    </div>
  );
};

export default Index;
```

- [ ] **Step 3: Verify in browser**

Check: "JOURNEY." fills the width below TechnicalMastery. Three experience entries appear with faded `01`/`02`/`03` numbers, massive role titles, company name light gray, description + bullet list with left border, gradient placeholder image on the right. Space between entries is enormous (256px).

- [ ] **Step 4: Commit**

```bash
git add src/components/Journey.tsx src/pages/Index.tsx
git commit -m "feat: add Journey section (02 — JOURNEY) with experience timeline"
```

---

## Task 6: Publications Rewrite (03 — PUBLICATIONS)

**Files:**
- Modify: `src/components/Publications.tsx`

- [ ] **Step 1: Replace Publications.tsx internals**

```tsx
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
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-8">
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
```

- [ ] **Step 2: Verify in browser**

Check: section background is darker (`#0e0e0e`), creating a clear visual break after Journey without a border. Numbered publication entry appears, "→ READ PAPER" link opens IEEE paper in new tab.

- [ ] **Step 3: Commit**

```bash
git add src/components/Publications.tsx
git commit -m "feat: rewrite Publications to editorial numbered layout (03 — PUBLICATIONS)"
```

---

## Task 7: SelectedWorks Component (04 — PORTFOLIO)

**Files:**
- Create: `src/components/SelectedWorks.tsx`
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Create src/components/SelectedWorks.tsx**

```tsx
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
              key={index}
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
          {config.awards.map((award, index) => (
            <div
              key={index}
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
```

- [ ] **Step 2: Add SelectedWorks to Index.tsx**

```tsx
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechnicalMastery from "@/components/TechnicalMastery";
import Journey from "@/components/Journey";
import Publications from "@/components/Publications";
import SelectedWorks from "@/components/SelectedWorks";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TechnicalMastery />
      <Journey />
      <Publications />
      <SelectedWorks />
      <About />
      <Experience />
      <Projects />
      <Footer />
    </div>
  );
};

export default Index;
```

- [ ] **Step 3: Verify in browser**

Check: project card(s) appear with gradient placeholder images. Arrow `→` shifts right on hover. Awards list below has ultra-thin white/5 separators and no boxes.

- [ ] **Step 4: Commit**

```bash
git add src/components/SelectedWorks.tsx src/pages/Index.tsx
git commit -m "feat: add SelectedWorks section (04 — PORTFOLIO) with projects bento and awards"
```

---

## Task 8: CTASection Component

**Files:**
- Create: `src/components/CTASection.tsx`

- [ ] **Step 1: Create src/components/CTASection.tsx**

```tsx
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
        className="text-huge font-black uppercase text-white mb-12 hover:italic cursor-pointer transition-all duration-300"
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
```

- [ ] **Step 2: Verify**

"LET'S BUILD" spans most of the viewport width. On hover the headline goes italic. "START A CONVERSATION" inverts colors on hover. "DOWNLOAD RESUME" turns white-filled on hover and triggers a PDF download.

- [ ] **Step 3: Commit**

```bash
git add src/components/CTASection.tsx
git commit -m "feat: add CTASection with LET'S BUILD headline and action buttons"
```

---

## Task 9: Footer Rewrite

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace Footer.tsx internals**

```tsx
import config from "@/data/config.json";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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

      {/* Copyright */}
      <div className="text-meta text-neutral-600 self-end">
        © {currentYear} UTKARSH GARG. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 2: Verify in browser**

Check: three-part footer layout, socials fade up to white on hover, email is clickable, copyright at bottom-right. No icons, no buttons.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rewrite Footer to minimal Editorial Brutalism style"
```

---

## Task 10: Wire Index.tsx and Remove Legacy Components

**Files:**
- Modify: `src/pages/Index.tsx`
- Delete: `src/components/About.tsx`
- Delete: `src/components/Experience.tsx`
- Delete: `src/components/Projects.tsx`
- Delete: `src/components/magicui/` (entire directory)

- [ ] **Step 1: Replace Index.tsx with final composition**

```tsx
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechnicalMastery from "@/components/TechnicalMastery";
import Journey from "@/components/Journey";
import Publications from "@/components/Publications";
import SelectedWorks from "@/components/SelectedWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      <Hero />
      <TechnicalMastery />
      <Journey />
      <Publications />
      <SelectedWorks />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
```

- [ ] **Step 2: Stage deletion of legacy component files**

```bash
git rm src/components/About.tsx src/components/Experience.tsx src/components/Projects.tsx
git rm -r src/components/magicui
```

- [ ] **Step 3: Verify TypeScript build — 0 errors**

```bash
pnpm build
```

Expected output ends with: `✓ built in X.XXs` — no TypeScript errors, no unresolved imports.

- [ ] **Step 4: Full end-to-end walkthrough on dev server**

```bash
pnpm dev
```

Walk through every section and verify:

- [ ] Nav: "UTKARSH GARG" left, 5 links center, "CONTACT" right. Glassmorphism blur visible when scrolled.
- [ ] Nav scrollspy: click each link → page scrolls to correct section → link activates white underline.
- [ ] Hero: massive "UTKARSH / GARG", subtitle light gray, ↘ arrow bottom-right.
- [ ] Stack: 3-column grid, column border brightens white on hover.
- [ ] Journey: "JOURNEY." display type, 3 numbered roles with huge vertical gaps, faded numbers.
- [ ] Publications: darker background, numbered IEEE entry, "→ READ PAPER" opens correct IEEE URL.
- [ ] Portfolio: project card with gradient placeholder, awards list with hairline separators.
- [ ] CTA: "LET'S BUILD" goes italic on hover, white button triggers email, ghost button downloads PDF.
- [ ] Footer: socials fade to white on hover, email link opens mail client, GitHub/LinkedIn/Medium open correctly.
- [ ] No colored pixels anywhere except pure white/gray.
- [ ] No rounded corners on any element.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "feat: wire final page composition and remove legacy components"
```
