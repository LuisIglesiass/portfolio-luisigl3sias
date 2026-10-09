import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useActiveSection } from "@/hooks/use-active-section";
import { useBerlinTime } from "@/hooks/use-berlin-time";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];
const navIds = navItems.map((n) => n.id);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Light top bar + full-screen dark menu. The bar tucks away when you scroll
 * down and slides back on the first upward scroll; the MENU pill fills with
 * cream on hover and its glyph rotates into a cross.
 */
export const Navbar = ({ ready }) => {
  const active = useActiveSection(navIds);
  const time = useBerlinTime();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const panelRef = useRef(null);
  const tlRef = useRef(null);
  const hiddenRef = useRef(false);

  // entrance after the intro
  useEffect(() => {
    if (!ready || reduced()) return;
    gsap.fromTo(navRef.current, { yPercent: -100 }, { yPercent: 0, duration: 1, ease: "power3.out" });
  }, [ready]);

  // hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > last;
      if (Math.abs(y - last) < 6) return;
      if (down && y > 240 && !hiddenRef.current && !open) {
        hiddenRef.current = true;
        gsap.to(navRef.current, { yPercent: -100, duration: 0.6, ease: "power3.inOut", overwrite: true });
      } else if (!down && hiddenRef.current) {
        hiddenRef.current = false;
        gsap.to(navRef.current, { yPercent: 0, duration: 0.6, ease: "power3.out", overwrite: true });
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // open/close timeline for the full-screen panel
  useEffect(() => {
    const panel = panelRef.current;
    const links = panel.querySelectorAll(".menu-link__label");
    const aside = panel.querySelectorAll(".menu-aside > *");
    gsap.set(panel, { yPercent: -100 });
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.inOut" } });
    tl.set(panel, { visibility: "visible" })
      .to(panel, { yPercent: 0, duration: 0.9 })
      .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.06 }, 0.35)
      .fromTo(aside, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.6);
    tl.eventCallback("onReverseComplete", () => gsap.set(panel, { visibility: "hidden" }));
    tlRef.current = tl;
    return () => {
      tl.kill();
      gsap.set(panel.querySelectorAll("*"), { clearProps: "transform,opacity" });
      gsap.set(panel, { clearProps: "transform,visibility" });
    };
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    document.documentElement.classList.toggle("is-intro", open);
    open ? tl.timeScale(1).play() : tl.timeScale(1.4).reverse();
    return () => document.documentElement.classList.remove("is-intro");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = () => setOpen(false);

  return (
    <div className="site-nav-layer">
      <header ref={navRef} className="site-nav">
        <div className="site-nav__bar">
          <a href="#hero" className="site-nav__brand" aria-label="Luis Iglesias — home">
            <span className="site-nav__mark">LI</span>
            <span className="site-nav__brand-copy">
              <strong>Luis Iglesias</strong>
              <span>Web Developer</span>
            </span>
          </a>
          <div className="site-nav__status kicker">
            <i aria-hidden="true" />
            <span>Hamburg {time} — open for projects</span>
          </div>
          <button
            type="button"
            className="pill site-nav__menu-button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="glyph" aria-hidden="true"><i /><i /></span>
          </button>
        </div>

        <div ref={panelRef} id="site-menu" className="menu-panel" role="dialog" aria-label="Site menu" aria-hidden={!open}>
          <div className="menu-panel__head">
            <a href="#hero" className="site-nav__brand" onClick={go} tabIndex={open ? 0 : -1}>
              <span className="site-nav__mark">LI</span>
              <span className="site-nav__brand-copy"><strong>Luis Iglesias</strong></span>
            </a>
            <button type="button" className="pill pill--light" onClick={go} tabIndex={open ? 0 : -1}>
              <span>Close</span>
              <span className="glyph" aria-hidden="true"><i /><i /></span>
            </button>
          </div>
          <div className="menu-panel__body">
            <ul className="menu-list">
              {navItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go}
                    tabIndex={open ? 0 : -1}
                    className={`menu-link${active === item.id ? " is-active" : ""}`}
                  >
                    <span className="menu-link__idx">0{i + 1}</span>
                    <span className="menu-link__label">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="menu-aside">
              <div>
                <span className="kicker">Say hello</span>
                <a href="mailto:lluis.igl3sias@gmail.com">lluis.igl3sias@gmail.com</a>
              </div>
              <div>
                <span className="kicker">Based in</span>
                Hamburg / Winsen (Luhe), Germany — working remote
              </div>
              <div>
                <span className="kicker">Elsewhere</span>
                <a href="https://www.linkedin.com/in/luis-iglesias-ab8068243/" target="_blank" rel="noreferrer">
                  LinkedIn <ArrowUpRight size={14} style={{ display: "inline" }} />
                </a>
                <br />
                <a href="https://www.instagram.com/lluis.iglesias" target="_blank" rel="noreferrer">
                  Instagram <ArrowUpRight size={14} style={{ display: "inline" }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
