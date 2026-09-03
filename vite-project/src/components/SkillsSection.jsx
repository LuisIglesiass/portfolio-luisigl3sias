import { useState } from "react";
import { cn } from "../lib/utils";

const skills = [
  { name: "Nuxt.js", category: "frontend" },
  { name: "Vue.js", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "HTML / CSS", category: "frontend" },

  { name: "WordPress", category: "cms & backend" },
  { name: "Express", category: "cms & backend" },
  { name: "MongoDB", category: "cms & backend" },
  { name: "SQL", category: "cms & backend" },

  { name: "Git / GitHub", category: "tools" },
  { name: "Figma", category: "tools" },
  { name: "VS Code", category: "tools" },
  { name: "Docker", category: "tools" },
];

const categories = ["all", "frontend", "cms & backend", "tools"];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <section id="skills" className="py-28 px-6 md:px-12 relative">
      <div className="container">
        <p className="index-number mb-3">TOOLKIT</p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">Stack &amp; tools</h2>

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="rounded-xl border border-border bg-card px-4 py-4 text-center card-hover"
            >
              <span className="font-mono text-sm">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
