import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { lockScroll, unlockScroll } from "../lib/smoothScroll";

const greetings = [
  { word: "Hello", lang: "English", script: true },
  { word: "Hola", lang: "Español", script: true },
  { word: "Hallo", lang: "Deutsch", script: true },
  { word: "Olá", lang: "Português", script: true },
  { word: "Ciao", lang: "Italiano", script: true },
  { word: "こんにちは", lang: "日本語", script: false },
  { word: "مرحبا", lang: "العربية", script: false, rtl: true },
  { word: "Hello", lang: "I'm Luis", script: true },
];

/**
 * Full-screen dark intro: cycles "hello" in several languages, then a
 * circular mask opens from the centre and reveals the hero underneath.
 * Auto-plays (~3.6s), click to skip, and is skipped entirely for
 * reduced-motion visitors and repeat visits in the same session.
 */
export const Intro = ({ onDone }) => {
  const rootRef = useRef(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
    } catch {
      /* storage blocked — just play it */
    }
    if (reduced || seen) {
      setGone(true);
      onDone();
      return;
    }

    const root = rootRef.current;
    const panel = root.querySelector(".intro__panel");
    const items = gsap.utils.toArray(".intro__greeting", root);
    const count = root.querySelector("[data-count]");
    lockScroll();
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      unlockScroll();
    };

    const radius = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 60;
    const counter = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        release();
        try {
          sessionStorage.setItem("intro-seen", "1");
        } catch {
          /* ignore */
        }
        setGone(true);
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 0.35 * items.length + 0.4,
      ease: "power1.inOut",
      onUpdate: () => {
        count.textContent = String(Math.round(counter.v)).padStart(2, "0");
      },
    }, 0);

    items.forEach((el, i) => {
      const at = 0.15 + i * 0.35;
      tl.set(el, { visibility: "visible" }, at);
      tl.fromTo(el.children, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.28, ease: "power3.out", stagger: 0.04 }, at);
      if (i < items.length - 1) tl.set(el, { visibility: "hidden" }, at + 0.35);
    });

    const end = 0.15 + items.length * 0.35 + 0.15;
    tl.to(root.querySelectorAll(".intro__greetings, .intro__meta"), { opacity: 0, duration: 0.3, ease: "power2.in" }, end - 0.1);
    tl.call(onDone, null, end + 0.1);
    tl.to(panel, { "--reveal-radius": `${radius}px`, duration: 1.25, ease: "power3.inOut" }, end);

    const skip = () => tl.progress(1);
    root.addEventListener("click", skip);
    root.style.pointerEvents = "auto";
    return () => {
      root.removeEventListener("click", skip);
      tl.kill();
      release();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="intro" aria-hidden="true">
      <div className="intro__panel">
        <div className="intro__meta intro__meta--top kicker">
          <span>Luis Iglesias</span>
          <span>Portfolio — 2026</span>
        </div>
        <div className="intro__greetings">
          {greetings.map((g, i) => (
            <div key={i} className="intro__greeting">
              <span className={`intro__word${g.script ? "" : " intro__word--sans"}`} dir={g.rtl ? "rtl" : undefined}>
                {g.word}
              </span>
              <span className="intro__lang kicker" dir={g.rtl ? "rtl" : undefined}>{g.lang}</span>
            </div>
          ))}
        </div>
        <div className="intro__meta intro__meta--bottom kicker">
          <span>Hamburg, DE<span className="intro__dot"> ●</span></span>
          <span className="intro__count" data-count>00</span>
        </div>
      </div>
    </div>
  );
};
