import { useReveal } from "@/hooks/use-reveal";

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
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-8 border-t border-border first:border-t-0 md:first:border-t md:first:pt-0"
    >
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
        <h2 className="font-display text-3xl md:text-4xl">Experience</h2>

        <div className="mt-8">
          {experience.map((item, i) => (
            <Row key={item.company} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
