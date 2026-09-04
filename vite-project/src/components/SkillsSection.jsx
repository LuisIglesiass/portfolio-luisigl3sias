import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../lib/utils";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "Nuxt.js", category: "frontend" },
  { name: "Vue.js", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "Angular", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "SCSS", category: "frontend" },
  { name: "HTML5 / CSS", category: "frontend" },

  { name: "WordPress", category: "cms & backend" },
  { name: "Strapi", category: "cms & backend" },
  { name: "Spring Boot", category: "cms & backend" },
  { name: "Express", category: "cms & backend" },
  { name: "MongoDB", category: "cms & backend" },
  { name: "SQL", category: "cms & backend" },
  { name: "Python", category: "cms & backend" },

  { name: "Git / GitHub", category: "tools" },
  { name: "Bitbucket", category: "tools" },
  { name: "Figma", category: "tools" },
  { name: "VS Code", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "Scrum / Kanban", category: "tools" },
];

const categories = ["all", "frontend", "cms & backend", "tools"];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef(null);

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  // Same tween runs both the first scroll-in reveal and every filter
  // switch: ScrollTrigger fires immediately if the grid is already in
  // view (true every time a filter button is clicked, since the user
  // has to be looking at the section to click it), so one code path
  // covers both without a separate "has this played yet" flag. Scale
  // instead of the site's usual slide-up, on purpose — chips settling
  // into place reads differently from a heading or a card.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const items = grid.querySelectorAll("[data-skill]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: grid,
            start: "top 96%",
            once: true,
          },
        }
      );
    }, grid);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section id="skills" className="py-28 px-6 md:px-12 relative">
      <div className="container">
        <p className="index-number mb-3">TOOLKIT</p>
        <RevealText as="h2" text="Stack & tools" className="font-display text-3xl md:text-4xl mb-10 block" />

        <div className="flex flex-wrap gap-2 mb-10 font-mono text-xs">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full border capitalize transition-colors duration-300",
                activeCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              data-skill
              className="rounded-xl border border-border bg-card px-4 py-4 text-center card-hover opacity-0"
            >
              <span className="font-mono text-sm">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
