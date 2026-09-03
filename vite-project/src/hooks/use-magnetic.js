import { useEffect, useRef } from "react";

/**
 * Pulls the element toward the cursor as it nears — the standard
 * "magnetic button" feel. Desktop/fine-pointer only, and a no-op under
 * prefers-reduced-motion.
 */
export const useMagnetic = (strength = 0.35) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)";

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const reset = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", reset);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [strength]);

  return ref;
};
