import { useEffect, useRef } from "react";

const BASE_WEIGHT = 480;
const MAX_WEIGHT = 860;
const RADIUS = 260; // px of cursor influence

/**
 * The hero's signature moment: the name is a variable font, and the
 * cursor presses into it like fresh ink into paper. Letters near the
 * pointer gain weight and lift slightly; the rest settle back to
 * baseline. All mutation is direct-to-DOM (no React state per frame),
 * so it stays smooth at high refresh rates.
 */
export const KineticName = ({ text, className = "" }) => {
  const letterRefs = useRef([]);
  letterRefs.current = [];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = null;
    const handleMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        letterRefs.current.forEach((el) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          const influence = Math.max(0, 1 - dist / RADIUS);
          const weight = Math.round(BASE_WEIGHT + influence * (MAX_WEIGHT - BASE_WEIGHT));
          el.style.fontVariationSettings = `"wght" ${weight}`;
          el.style.transform = `translateY(${-influence * 5}px)`;
        });
      });
    };

    const reset = () => {
      letterRefs.current.forEach((el) => {
        if (!el) return;
        el.style.fontVariationSettings = `"wght" ${BASE_WEIGHT}`;
        el.style.transform = "translateY(0)";
      });
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", reset);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span className={className}>
      {[...text].map((char, i) => (
        <span
          key={i}
          ref={(el) => (letterRefs.current[i] = el)}
          className="inline-block will-change-transform"
          style={{
            fontVariationSettings: `"wght" ${BASE_WEIGHT}`,
            transition:
              "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), font-variation-settings 0.25s ease-out",
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
};
