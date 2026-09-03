import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section-heading mask reveal: each word sits in its own overflow-hidden
 * sleeve and rises up from below it on scroll-in, staggered — the same
 * technique behind most premium hero/heading reveals (word masked in a
 * clipped box, not just faded). Falls back to plain static text under
 * prefers-reduced-motion.
 */
// eslint-disable-next-line no-unused-vars -- Tag is used as a JSX element below; this project's eslint config doesn't track that usage
export const RevealText = ({ text, as: Tag = "span", className = "" }) => {
  const containerRef = useRef(null);
  const words = text.split(" ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = containerRef.current;
    if (!el) return;

    const wordEls = el.querySelectorAll("[data-word]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordEls,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    <Tag ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
            <span data-word style={{ display: "inline-block" }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
};
