import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useGsap, gsap } from "@/hooks/use-gsap";
import { useBerlinTime } from "@/hooks/use-berlin-time";
import { useMagnetic } from "@/hooks/use-magnetic";

const Chars = ({ text }) =>
  text.split("").map((c, i) => (
    <span key={i} className="hero__char" aria-hidden="true">
      {c}
    </span>
  ));

export const HeroSection = ({ ready }) => {
  const ref = useRef(null);
  const time = useBerlinTime();
  const magnetic = useMagnetic(0.25);

  useGsap(
    ref,
    () => {
      const chars = ref.current.querySelectorAll(".hero__char");
      const fades = ref.current.querySelectorAll("[data-fade]");
      gsap.set(chars, { yPercent: 115 });
      gsap.set(fades, { opacity: 0, y: 18 });

      if (ready) {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to(chars, { yPercent: 0, duration: 1.3, stagger: { each: 0.045, from: "start" } })
          .to(fades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.5);
      }

      // scroll-away: title drifts up and tightens as the next section arrives
      gsap.to(".hero__title", {
        yPercent: -14,
        scale: 0.97,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    [ready]
  );

  return (
    <section id="hero" ref={ref} className="hero">
      <div className="hero__meta kicker">
        <span data-fade>Portfolio — 2026</span>
        <span data-fade>Webentwickler &amp; Founder</span>
        <span data-fade>Hamburg, DE — {time}</span>
      </div>

      <h1 className="hero__title" aria-label="Luis Iglesias">
        <span className="hero__line hero__line--1">
          <Chars text="LUIS" />
        </span>
        <span className="hero__line hero__line--2">
          <Chars text="IGLESIAS" />
        </span>
      </h1>

      <div className="hero__foot">
        <p className="hero__lede" data-fade>
          Webentwickler at <strong>FLOW4 Webdesign</strong>, building with Nuxt and Vue. Founder of{" "}
          <strong>Iglesias Web Agency</strong> on the side — websites that don't look like everyone else's.
        </p>
        <a href="#about" className="hero__scroll kicker" data-fade aria-label="Scroll to about">
          Scroll
          <ArrowDown className="hero__scroll-arrow" />
        </a>
        <div className="hero__cta" data-fade>
          <a ref={magnetic} href="#projects" className="pill">
            <span>View the work</span>
            <span className="pill__icon"><ArrowUpRight size={15} /></span>
          </a>
          <a href="/CVLuisIglesias.pdf" download className="pill pill--ghost">
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </section>
  );
};
