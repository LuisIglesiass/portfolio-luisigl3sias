import { useRef } from "react";
import { useGsap, gsap } from "@/hooks/use-gsap";

const experience = [
  {
    period: "Jan 2026 — Present",
    meta: "9 mo · Full-time · Remote",
    role: "Webentwickler",
    company: "FLOW4 Webdesign UG & Co. KG",
    description:
      "Building modern web platforms with Nuxt.js and Vue.js, custom WordPress and Strapi solutions for client projects, and responsive, TypeScript-driven frontends with Tailwind CSS.",
    tags: ["Nuxt.js", "Vue.js", "TypeScript", "Tailwind CSS", "WordPress", "Strapi"],
  },
  {
    period: "Sept 2024 — Oct 2025",
    meta: "1 yr 2 mo · Freelance · Remote",
    role: "Entwickler",
    company: "Re:frame e.V.",
    description:
      "Georeferenced historical place names and integrated data from OpenStreetMap and Wikidata. Built Python scripts to automate enrichment and processing, with quality and plausibility checks on the resulting geodata.",
    tags: ["Python", "OpenStreetMap", "Wikidata", "Data Integration"],
  },
  {
    period: "Aug 2022 — Jul 2025",
    meta: "3 yrs · Ausbildung · Hybrid",
    role: "Fachinformatiker für Anwendungsentwicklung",
    company: "Kühne+Nagel",
    description:
      "Trained in full-stack application development — Java and Spring Boot on the backend, Angular and Vue on the frontend — working in Scrum teams and collaborating closely with the frontend department.",
    tags: ["Java", "Spring Boot", "Angular", "Git", "Scrum"],
  },
];

export const ExperienceSection = () => {
  const ref = useRef(null);

  useGsap(ref, () => {
    const root = ref.current;
    gsap.set(root.querySelectorAll(".exp__title .line-mask > span"), { yPercent: 108 });
    gsap.to(root.querySelectorAll(".exp__title .line-mask > span"), {
      yPercent: 0,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: { trigger: ".exp__title", start: "top 85%", once: true },
    });

    root.querySelectorAll(".exp__row").forEach((row) => {
      const rule = row.querySelector(".exp__rule");
      const items = row.querySelectorAll(".exp__row > :not(.exp__rule):not(.exp__fill)");
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } })
        .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" })
        .fromTo(items, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.2);
    });
    gsap.fromTo(".exp__end", { scaleX: 0, transformOrigin: "left" }, {
      scaleX: 1, duration: 1.1, ease: "power3.inOut",
      scrollTrigger: { trigger: ".exp__end", start: "top 95%", once: true },
    });
  });

  return (
    <section id="experience" ref={ref} className="exp">
      <div className="exp__inner">
        <div className="exp__head">
          <h2 className="section-title exp__title">
            <span className="line-mask"><span>Experience</span></span>
          </h2>
          <span className="kicker" style={{ color: "var(--stone-700)" }}>(02) Career — 2022 → now</span>
        </div>

        <div>
          {experience.map((item, i) => (
            <article key={item.company} className="exp__row">
              <span className="exp__rule" />
              <span className="exp__fill" />
              <span className="exp__idx kicker">0{i + 1}</span>
              <div className="exp__period kicker">
                {item.period}
                <br />
                {item.meta}
              </div>
              <div>
                <h3 className="exp__role">
                  {item.role}
                  <span className="exp__company">{item.company}</span>
                </h3>
                <p className="exp__desc" style={{ marginTop: 18 }}>{item.description}</p>
              </div>
              <ul className="exp__tags">
                {item.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
          <div className="exp__end" />
        </div>
      </div>
    </section>
  );
};
