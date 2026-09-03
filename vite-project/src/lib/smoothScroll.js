import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/**
 * Site-wide inertia scrolling (Lenis), synced to GSAP's ticker so
 * ScrollTrigger-driven reveals stay perfectly in step with it. Also
 * delegates any in-page `#anchor` link click to a Lenis-eased scroll,
 * so the fixed nav / hero / footer links all move with the same feel
 * instead of snapping instantly via the browser's native hash jump.
 * Skipped entirely under prefers-reduced-motion — native CSS
 * `scroll-smooth` remains as the fallback.
 */
export const initSmoothScroll = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);

  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // ScrollTrigger measures trigger positions in pixels at creation time.
  // Variable-font swaps, lazy images, and the hero's physics settling
  // all change page height slightly after that — the drift compounds
  // going down the page, so the last section's trigger point can end
  // up past the real bottom of the document and simply never fire.
  // Recalculate once layout has actually settled.
  document.fonts?.ready?.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
  const settleRefresh = setTimeout(() => ScrollTrigger.refresh(), 1500);

  const handleAnchorClick = (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -64, duration: 1.3 });
  };
  document.addEventListener("click", handleAnchorClick);

  return () => {
    clearTimeout(settleRefresh);
    document.removeEventListener("click", handleAnchorClick);
    gsap.ticker.remove(tick);
    lenis.off("scroll", onScroll);
    lenis.destroy();
    lenis = null;
  };
};
