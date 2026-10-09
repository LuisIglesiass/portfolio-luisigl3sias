import { useRef } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useGsap, gsap } from "@/hooks/use-gsap";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useBerlinTime } from "@/hooks/use-berlin-time";

export const ContactSection = () => {
  const ref = useRef(null);
  const time = useBerlinTime();
  const magneticTop = useMagnetic(0.5);
  const magneticCv = useMagnetic(0.3);

  useGsap(ref, () => {
    const root = ref.current;
    const lines = root.querySelectorAll(".contact__title .line-mask > span");
    gsap.set(lines, { yPercent: 108 });
    gsap.to(lines, {
      yPercent: 0,
      duration: 1.3,
      ease: "power4.out",
      stagger: 0.1,
      scrollTrigger: { trigger: ".contact__title", start: "top 85%", once: true },
    });
    gsap.from(root.querySelectorAll(".contact__grid > *"), {
      opacity: 0,
      y: 32,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ".contact__grid", start: "top 90%", once: true },
    });
    // giant footer name rises as you reach the bottom
    gsap.fromTo(
      ".footer-name",
      { yPercent: 28 },
      { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".footer-name", start: "top bottom", end: "bottom bottom", scrub: true } }
    );
  });

  return (
    <section id="contact" ref={ref} className="contact">
      <div className="contact__inner">
        <div className="contact__kicker kicker">
          <span>(05) Contact</span>
          <span>Available for new projects</span>
        </div>

        <h2 className="contact__title">
          <span className="line-mask"><span>Let's build</span></span>
          <span className="line-mask"><span>something <span className="script">great</span></span></span>
          <span className="line-mask"><span className="muted">together.</span></span>
        </h2>

        <div className="contact__grid">
          <div>
            <span className="kicker muted" style={{ display: "block", marginBottom: 14 }}>Drop me a line</span>
            <a href="mailto:lluis.igl3sias@gmail.com" className="contact__mail">
              lluis.igl3sias@gmail.com
              <ArrowUpRight />
            </a>
          </div>
          <div className="contact__side">
            <div>
              <span className="kicker">Based in</span>
              Hamburg / Winsen (Luhe), Germany — working remote. Local time {time}.
            </div>
            <div className="contact__social">
              <a href="https://www.linkedin.com/in/luis-iglesias-ab8068243/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/lluis.iglesias" target="_blank" rel="noreferrer">Instagram</a>
              <a ref={magneticCv} href="/CVLuisIglesias.pdf" download>CV ↓</a>
            </div>
          </div>
        </div>

        <p className="footer-name" aria-hidden="true">Luis Iglesias</p>

        <footer className="footer-bar kicker">
          <span>© {new Date().getFullYear()} Luis Iglesias — designed &amp; built by hand</span>
          <nav>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Work</a>
            <a href="/privacy">Privacy (Datenschutz)</a>
            <a href="/sitemap.xml">Sitemap</a>
            <a href="/llms.txt" title="Machine-readable site index for AI agents">llms.txt</a>
            <a ref={magneticTop} href="#hero" aria-label="Back to top" className="to-top">
              <ArrowUp size={16} />
            </a>
          </nav>
        </footer>
      </div>
    </section>
  );
};
