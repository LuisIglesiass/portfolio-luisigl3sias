import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

const focusAreas = [
  "Nuxt.js",
  "Vue.js",
  "WordPress",
  "Tailwind CSS",
  "TypeScript",
  "UX & Performance",
];

const Tile = ({ className = "", children }) => (
  <div
    data-tile
    className={`rounded-2xl border border-border bg-card p-6 sm:p-8 card-hover opacity-0 ${className}`}
  >
    {children}
  </div>
);

export const AboutSection = () => {
  const gridRef = useRef(null);

  // The bento tiles sit at different heights (the "4 languages" tile is
  // a full row lower than the others), so revealing each one off its
  // own individual scroll position — the previous approach — made the
  // lower tiles visibly lag behind their neighbors. Trigger the whole
  // grid together instead, the moment it enters view, with a short
  // stagger so it still reads as a cascade rather than a single pop-in.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const tiles = grid.querySelectorAll("[data-tile]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(tiles, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: grid,
            start: "top 96%",
            once: true,
          },
        }
      );
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="py-28 px-6 md:px-12 relative">
      <div className="container">
        <p className="index-number mb-3">WHO I AM</p>
        <RevealText as="h2" text="About" className="font-display text-3xl md:text-4xl mb-12 block" />

        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Tile className="lg:col-span-7 lg:row-span-2 flex flex-col justify-between">
            <div className="space-y-5">
              <p className="font-display text-2xl sm:text-3xl leading-snug">
                I turn interfaces into things people actually enjoy using —
                fast, accessible, built to last.
              </p>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                Trained as a Fachinformatiker für Anwendungsentwicklung at
                Kühne+Nagel, then freelanced through Re:frame e.V. before
                joining FLOW4 Webdesign full-time, where I build digital
                platforms with Nuxt and Vue. Alongside that I run{" "}
                <span className="text-foreground">Iglesias Web Agency</span>,
                my own studio for businesses that want a site that doesn't
                look like everyone else's.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-8">
              <a href="#contact" className="btn-solid">
                Get in touch
              </a>
              <a href="/CVLuisIglesias.pdf" download className="btn-outline">
                Download CV
              </a>
            </div>
          </Tile>

          <Tile className="lg:col-span-5">
            <p className="font-display text-5xl text-primary">9+</p>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              side &amp; client projects shipped and live
            </p>
          </Tile>

          <Tile className="lg:col-span-5">
            <p className="font-display text-5xl text-primary">4</p>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              languages — German, Spanish, English, Portuguese
            </p>
          </Tile>

          <Tile className="lg:col-span-12">
            <p className="index-number mb-4">CURRENT FOCUS</p>
            <div className="flex flex-wrap gap-3">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="font-mono text-xs px-4 py-2 rounded-full border border-border text-foreground/80 hover:border-primary hover:text-primary transition-colors duration-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
};
