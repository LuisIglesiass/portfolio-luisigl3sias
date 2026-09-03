import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const Navbar = () => {
  const active = useActiveSection(navItems.map((n) => n.id));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="nav-surface fixed top-0 inset-x-0 z-50"
    >
      <nav className="container flex items-center justify-between py-4 px-6 md:px-12">
        <a href="#hero" className="font-display text-lg shrink-0">
          <span className="sm:hidden">LI</span>
          <span className="hidden sm:inline">Luis Iglesias</span>
        </a>

        <div className="flex items-center gap-5 sm:gap-8 font-mono text-xs tracking-[0.08em] overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <a
              key={item.id}
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
              <span
                className={cn(
                  "absolute left-0 -bottom-0.5 h-px bg-primary transition-all duration-300",
                  active === item.id ? "w-full" : "w-0"
                )}
              />
            </a>
          ))}
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
};
