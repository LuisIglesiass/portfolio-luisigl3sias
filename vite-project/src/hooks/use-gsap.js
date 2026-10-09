import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scoped GSAP setup that only runs when the visitor has not asked for
 * reduced motion. `setup(mq)` receives the matchMedia context so a caller
 * can nest further `mq.add(...)` breakpoints (e.g. desktop-only pinning).
 * Everything created inside is reverted automatically on unmount, and
 * initial hidden states are applied in the layout phase — before paint —
 * so reveals never flash.
 */
export const useGsap = (scopeRef, setup, deps = []) => {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const mm = gsap.matchMedia(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => setup(mm));
    return () => {
      mm.revert();
      // revert() leaves GSAP's transform cache behind; on a re-run (React
      // StrictMode) it would parse the leftover inline %-translate as px and
      // stack it on top of the new yPercent. Wipe the cache with the styles.
      gsap.set(scope.querySelectorAll("*"), { clearProps: "transform,opacity,clipPath,scale" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export { gsap, ScrollTrigger };
