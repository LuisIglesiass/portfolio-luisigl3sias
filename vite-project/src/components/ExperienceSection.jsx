import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

const experience = [
  {
    period: "Jan 2026 — Present",
    duration: "9 mo",
    role: "Webentwickler",
    company: "FLOW4 Webdesign UG & Co. KG",
    type: "Full-time · Remote",
    description:
      "Building modern web platforms with Nuxt.js and Vue.js, custom WordPress and Strapi solutions for client projects, and responsive, TypeScript-driven frontends with Tailwind CSS.",
    tags: ["Nuxt.js", "Vue.js", "TypeScript", "Tailwind CSS", "WordPress", "Strapi"],
  },
  {
    period: "Sept 2024 — Oct 2025",
    duration: "1 yr 2 mo",
    role: "Entwickler",
    company: "Re:frame e.V.",
    type: "Freelance · Remote",
    description:
      "Georeferenced historical place names and integrated data from OpenStreetMap and Wikidata. Built Python scripts to automate enrichment and processing, with quality and plausibility checks on the resulting geodata.",
    tags: ["Python", "OpenStreetMap", "Wikidata", "Data Integration"],
  },
  {
    period: "Aug 2022 — Jul 2025",
    duration: "3 yrs",
    role: "Fachinformatiker für Anwendungsentwicklung",
    company: "Kühne+Nagel",
    type: "Ausbildung · Hybrid",
    description:
      "Trained in full-stack application development — Java and Spring Boot on the backend, Angular and Vue on the frontend — working in Scrum teams and collaborating closely with the frontend department.",
    tags: ["Java", "Spring Boot", "Angular", "Git", "Scrum"],
  },
];

const Row = ({ item, index }) => {
  const rowRef = useRef(null);

  // A plain fade is the same move every other section already makes.
  // Here the divider itself draws in (scaleX 0 → 1) just ahead of the
  // row fading up through it — a case-file line being ruled in before
  // the entry is written above it. First row skips the line, matching
  // the old first:border-t-0 behavior.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const line = el.querySelector("[data-line]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      if (line) gsap.set(line, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 96%", once: true },
      });
      if (line) {
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" });
      }
      tl.fromTo(
        el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        line ? "-=0.35" : 0
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rowRef}
      className="group relative grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-8 opacity-0"
    >
      {index > 0 && (
        <span
          data-line
          className="absolute top-0 left-0 right-0 h-px bg-primary origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      )}
      <div className="md:col-span-1 font-mono text-xs text-muted-foreground">
        0{index + 1}
      </div>
      <div className="md:col-span-3 font-mono text-xs text-muted-foreground">
        <p>{item.period}</p>
        <p className="mt-1 opacity-70">{item.duration} · {item.type}</p>
      </div>
      <div className="md:col-span-8">
        <h3 className="font-display text-xl sm:text-2xl">
          {item.role}
          <span className="text-muted-foreground"> · {item.company}</span>
        </h3>
        <p className="font-mono text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ExperienceSection = () => {
  return (
    <section id="experience" className="py-28 px-6 md:px-12 relative bg-secondary/30">
      <div className="container">
        <p className="index-number mb-3">CAREER</p>
        <RevealText as="h2" text="Experience" className="font-display text-3xl md:text-4xl block" />

        <div className="mt-8">
          {experience.map((item, i) => (
            <Row key={item.company} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
