import { useLayoutEffect, useRef, useState } from "react";
import { useGsap, gsap, ScrollTrigger } from "@/hooks/use-gsap";

const groups = [
  {
    name: "Frontend",
    items: ["Nuxt.js", "Vue.js", "React", "Angular", "JavaScript", "TypeScript", "Tailwind CSS", "SCSS", "HTML5 / CSS", "GSAP"],
  },
  {
    name: "CMS & Backend",
    items: ["WordPress", "Strapi", "Spring Boot", "Express", "MongoDB", "SQL", "Python"],
  },
  {
    name: "Tools",
    items: ["Git / GitHub", "Bitbucket", "Figma", "VS Code", "Docker", "Scrum / Kanban"],
  },
];

export const SkillsSection = () => {
  const ref = useRef(null);
  const [open, setOpen] = useState(0);

  // entrance: titles mask up, rules draw
  useGsap(ref, () => {
    const root = ref.current;
    gsap.set(root.querySelectorAll(".skills__name"), { yPercent: 105 });
    gsap.set(root.querySelectorAll(".skills__rule"), { scaleX: 0 });
    root.querySelectorAll(".skills__item").forEach((item) => {
      gsap
        .timeline({ scrollTrigger: { trigger: item, start: "top 88%", once: true } })
        .to(item.querySelector(".skills__name"), { yPercent: 0, duration: 1.1, ease: "power4.out" })
        .to(item.querySelector(".skills__rule"), { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, 0.1);
    });
  });

  // accordion: plain effect (no gsap.context revert, which would snap the
  // previous panel shut). One timeline per change — the outgoing group closes
  // while the incoming one opens, so page height eases instead of jumping.
  const first = useRef(true);
  const tlRef = useRef(null);
  useLayoutEffect(() => {
    const items = ref.current.querySelectorAll(".skills__item");
    if (first.current) {
      first.current = false;
      items.forEach((item, i) => gsap.set(item.querySelector(".skills__panel"), { height: i === open ? "auto" : 0 }));
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tlRef.current?.kill();
    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut", duration: 1 },
      onUpdate: () => ScrollTrigger.update(),
      onComplete: () => ScrollTrigger.refresh(),
    });
    tlRef.current = tl;
    items.forEach((item, i) => {
      const panel = item.querySelector(".skills__panel");
      const chips = item.querySelectorAll(".skills__chips li");
      if (i === open) {
        tl.to(panel, { height: "auto" }, 0);
        tl.fromTo(chips, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.035 }, 0.25);
      } else if (panel.offsetHeight > 0) {
        tl.to(chips, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0);
        tl.to(panel, { height: 0 }, 0);
      }
    });
  }, [open]);

  return (
    <section id="skills" ref={ref} className="skills">
      <div className="skills__inner">
        <div className="skills__intro">
          <h2 className="section-title">
            <span className="line-mask"><span>Stack &amp;</span></span>
            <span className="line-mask"><span>Tools</span></span>
          </h2>
          <p>(03) Toolkit — what I reach for to ship fast, accessible, long-lasting interfaces. Open a group to see the details.</p>
        </div>

        <div className="skills__list">
          {groups.map((g, i) => {
            const isOpen = open === i;
            return (
              <div key={g.name} className={`skills__item${isOpen ? " is-open" : ""}`}>
                <h3 style={{ margin: 0, overflow: "hidden", paddingBottom: "0.08em" }}>
                  <button
                    type="button"
                    className="skills__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`skills-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="skills__name">{g.name}</span>
                    <span className="skills__plus" aria-hidden="true" />
                  </button>
                </h3>
                <span className="skills__count kicker">({String(g.items.length).padStart(2, "0")})</span>
                <div className="skills__rule" />
                <div id={`skills-panel-${i}`} className="skills__panel" role="region">
                  <div className="skills__content">
                    <ul className="skills__chips">
                      {g.items.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
