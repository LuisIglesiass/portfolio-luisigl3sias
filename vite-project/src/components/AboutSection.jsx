import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGsap, gsap } from "@/hooks/use-gsap";

const stats = [
  { n: 11, suffix: "+", label: "side & client projects shipped and live" },
  { n: 4, suffix: "", label: "languages — German, Spanish, English, Portuguese" },
  { n: 3, suffix: "", label: "years of professional dev work, and counting" },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const [photoOk, setPhotoOk] = useState(true);

  useGsap(ref, () => {
    const root = ref.current;

    // title lines slide up out of their masks
    gsap.set(root.querySelectorAll(".about__title .line-mask > span"), { yPercent: 108 });
    gsap.to(root.querySelectorAll(".about__title .line-mask > span"), {
      yPercent: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.1,
      scrollTrigger: { trigger: ".about__title", start: "top 82%", once: true },
    });

    gsap.fromTo(
      root.querySelectorAll("[data-rise]"),
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".about__intro", start: "top 88%", once: true },
      }
    );

    // portrait: curtain wipe up + counter-parallax inside the frame
    gsap.fromTo(
      ".about__portrait",
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: { trigger: ".about__portrait", start: "top 85%", once: true },
      }
    );
    gsap.fromTo(
      ".about__media",
      { scale: 1.1 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: ".about__portrait", start: "top bottom", end: "bottom top", scrub: true },
      }
    );

    // stats: rule draws, numbers count up
    gsap.fromTo(
      ".about__stats",
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: ".about__stats", start: "top 90%", once: true } }
    );
    root.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const o = { v: 0 };
      gsap.to(o, {
        v: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => (el.firstChild.textContent = String(Math.round(o.v))),
        scrollTrigger: { trigger: ".about__stats", start: "top 90%", once: true },
      });
    });
  });

  return (
    <section id="about" ref={ref} className="about">
      <div className="about__inner">
        <div className="about__layout">
          <div className="about__copy">
            <div className="about__kicker kicker">
              <span>(01) What I do</span>
              <span>Hamburg, DE</span>
            </div>
            <h2 className="about__title">
              <span className="line-mask"><span>I build fast,</span></span>
              <span className="line-mask"><span>considered websites</span></span>
              <span className="line-mask"><span className="muted">that people enjoy</span></span>
              <span className="line-mask"><span className="muted">actually using.</span></span>
            </h2>
            <p className="about__intro" data-rise>
              Trained as a <strong>Fachinformatiker für Anwendungsentwicklung</strong> at Kühne+Nagel, then freelancing
              through Re:frame e.V. before joining <strong>FLOW4 Webdesign</strong> full-time to build platforms with
              Nuxt and Vue.
              <span style={{ display: "block", marginTop: "1.2em" }}>
                Alongside that I run <strong>Iglesias Web Agency</strong> — my own studio for businesses that want a
                site that doesn't look like everyone else's.
              </span>
            </p>
            <div className="about__actions" data-rise>
              <a href="#contact" className="pill">
                <span>Get in touch</span>
                <span className="pill__icon"><ArrowUpRight size={15} /></span>
              </a>
              <a href="/CVLuisIglesias.pdf" download className="pill pill--ghost">
                <span>Download CV</span>
              </a>
            </div>
          </div>

          <figure className="about__portrait">
            <div className="about__media">
              {photoOk ? (
                <img src="/luis-iglesias.webp" alt="Portrait of Luis Iglesias" loading="lazy" onError={() => setPhotoOk(false)} />
              ) : (
                <div className="about__monogram" aria-hidden="true">
                  L<b>I</b>
                </div>
              )}
            </div>
            <figcaption className="kicker">
              <span>Luis Iglesias</span>
              <span>Hamburg, DE — Remote</span>
            </figcaption>
          </figure>
        </div>

        <div className="about__stats">
          {stats.map((s) => (
            <div key={s.label} className="about__stat">
              <span className="about__stat-num">
                <span data-count={s.n}>0</span>
                {s.suffix && <sup>{s.suffix}</sup>}
              </span>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
