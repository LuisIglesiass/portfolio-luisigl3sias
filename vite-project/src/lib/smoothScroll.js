import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let lockCount = 0;

const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);
// Allow the open menu panel to scroll internally on short screens.
const insideScrollable = (t) => t instanceof Element && t.closest("[data-scroll-ok]");
const block = (e) => {
  if (insideScrollable(e.target)) return;
  if (e.type === "keydown") {
    if (!SCROLL_KEYS.has(e.key)) return;
    const t = e.target;
    if (t instanceof Element && t.closest("input, textarea, select")) return;
    // Space/Enter on a focused button or link must still activate it.
    if (e.key === " " && t instanceof Element && t.closest("button, a")) return;
  }
  e.preventDefault();
};
const EVENTS = ["wheel", "touchmove", "keydown"];

const applyLock = () => {
  const locked = lockCount > 0;
  EVENTS.forEach((ev) => {
    window.removeEventListener(ev, block);
    if (locked) window.addEventListener(ev, block, { passive: false });
  });
  if (lenis) (locked ? lenis.stop() : lenis.start());
};

/**
 * Freeze page scroll WITHOUT touching `overflow`. Toggling overflow makes the
 * scrollbar vanish and the whole layout jump sideways by its width; blocking
 * the input instead keeps the scrollbar (and every pixel of layout) still.
 * Reference-counted so the intro and the menu can't unlock each other.
 */
export const lockScroll = () => {
  lockCount++;
  applyLock();
};
export const unlockScroll = () => {
  lockCount = Math.max(0, lockCount - 1);
  applyLock();
};

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
    duration: 0.7,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  if (lockCount > 0) lenis.stop();
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
