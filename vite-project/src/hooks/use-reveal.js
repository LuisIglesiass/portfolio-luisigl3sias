import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered reveal, GSAP-powered (same ref-based API as before,
 * so every existing call site keeps working unchanged). Uses a real
 * expo-out curve instead of a CSS cubic-bezier approximation.
 */
export const useReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 96%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
};
