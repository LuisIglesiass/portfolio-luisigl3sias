import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LiquidBackground } from "./LiquidBackground";
import { KineticName } from "./KineticName";
import { PhysicsTags } from "./PhysicsTags";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 pb-20 overflow-hidden"
    >
      <LiquidBackground />
      <PhysicsTags />

      <div className="container relative z-10">
        {/* top meta row */}
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground mb-10 opacity-0 animate-fade-in">
          PORTFOLIO — 2026
        </p>

        {/* giant offset name — variable-font weight presses in toward the cursor, like ink into paper */}
        <h1
          aria-label="Luis Iglesias"
          className="font-display leading-[0.92] tracking-tight text-[15vw] sm:text-[11vw] lg:text-[7.2vw]"
        >
          <span aria-hidden="true" className="block opacity-0 animate-fade-in-delay-1">
            <KineticName text="Luis" />
          </span>
          <span
            aria-hidden="true"
            className="block opacity-0 animate-fade-in-delay-2 pl-[6vw] sm:pl-[8vw] lg:pl-[4vw] text-primary"
          >
            <KineticName text="Iglesias" />
          </span>
        </h1>

        {/* role + tagline */}
        <div className="mt-10 lg:mt-14 opacity-0 animate-fade-in-delay-3">
          <p className="lg:max-w-2xl font-mono text-sm sm:text-base text-foreground/80 leading-relaxed">
            Webentwickler at{" "}
            <span className="text-foreground">FLOW4 Webdesign</span>, building
            with Nuxt and Vue. Founder of{" "}
            <span className="text-foreground">Iglesias Web Agency</span> on
            the side. Based in Hamburg, working remote.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-fade-in-delay-4">
          <a href="#projects" className="btn-solid">
            View the work <ArrowUpRight size={15} />
          </a>
          <a href="/CVLuisIglesias.pdf" download className="btn-outline">
            Download CV
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-muted-foreground animate-float">
        <span className="font-mono text-[10px] tracking-[0.2em] [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <ArrowDown className="h-4 w-4 text-primary" />
      </div>
    </section>
  );
};
