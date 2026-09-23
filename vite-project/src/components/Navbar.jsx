import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

// Hoisted so it's the same array reference on every render. Passing a
// fresh `navItems.map(...)` inline here made useActiveSection's effect
// dependency change on every render (since setActive itself triggers
// a re-render), tearing down and rebuilding the IntersectionObserver
// on every single active-section change — the flicker/lag the nav
// highlight showed.
const navIds = navItems.map((n) => n.id);

export const Navbar = () => {
  const active = useActiveSection(navIds);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navListRef = useRef(null);
  const indicatorRef = useRef(null);
  const itemRefs = useRef({});

  // Morphing nav pill: one shared indicator slides + resizes to sit
  // behind whichever link is active, instead of each link owning its
  // own underline. Recomputed on every active change and on resize,
  // since the pill's target rect depends on live layout.
  useEffect(() => {
    const list = navListRef.current;
    const indicator = indicatorRef.current;
    const activeEl = itemRefs.current[active];
    if (!list || !indicator || !activeEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const position = (animate) => {
      const listRect = list.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const x = activeRect.left - listRect.left;
      const width = activeRect.width;

      if (!animate || reduced) {
        gsap.set(indicator, { x, width, opacity: 1 });
        return;
      }
      gsap.to(indicator, { x, width, opacity: 1, duration: 0.5, ease: "power3.out" });
    };

    position(true);
    const onResize = () => position(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the menu automatically if the viewport grows past mobile
  // (e.g. rotating a tablet, or resizing a browser window).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handle = () => setMenuOpen(false);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  return (
    <header
      data-scrolled={scrolled || menuOpen}
      className="nav-surface fixed top-0 inset-x-0 z-50"
    >
      <nav className="container h-16 flex items-center justify-between px-6 md:px-12">
        <a href="#hero" className="font-display text-lg shrink-0">
          <span className="md:hidden">LI</span>
          <span className="hidden md:inline">Luis Iglesias</span>
        </a>

        {/* desktop nav */}
        <div
          ref={navListRef}
          className="relative hidden md:flex items-center gap-8 font-mono text-xs tracking-[0.08em]"
        >
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="absolute left-0 -bottom-0.5 h-px bg-primary opacity-0"
            style={{ willChange: "transform, width" }}
          />
          {navItems.map((item) => (
            <a
              key={item.id}
              ref={(el) => {
                itemRefs.current[item.id] = el;
              }}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "relative pb-1 transition-colors duration-300",
                active === item.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center h-9 w-9 -mr-2 text-foreground/80 hover:text-primary transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* mobile menu overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-16 z-40 bg-background transition-opacity duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <ul className="flex flex-col px-6 pt-4">
          {navItems.map((item, i) => (
            <li key={item.id} className="border-b border-border">
              <a
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 py-5 font-display text-3xl transition-colors",
                  active === item.id ? "text-primary" : "text-foreground"
                )}
              >
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};
