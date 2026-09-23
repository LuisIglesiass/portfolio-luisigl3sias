import { ArrowUp } from "lucide-react";
import { useMagnetic } from "@/hooks/use-magnetic";

export const Footer = () => {
  const magneticTop = useMagnetic(0.5);

  return (
    <footer className="px-6 md:px-12 py-8 border-t border-border flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center font-mono text-xs text-muted-foreground">
      <p>
        © {new Date().getFullYear()} Luis Iglesias — designed &amp; built by
        hand, no template.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <a href="/privacy" className="hover:text-primary transition-colors">
          Privacy Policy (Datenschutz)
        </a>
        <a href="/sitemap.xml" className="hover:text-primary transition-colors">
          Sitemap
        </a>
        <a
          href="/llms.txt"
          className="hover:text-primary transition-colors"
          title="Machine-readable site index for AI agents"
        >
          llms.txt
        </a>
        <a
          ref={magneticTop}
          href="#hero"
          aria-label="Back to top"
          className="group p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
        >
          <ArrowUp size={16} className="transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-0.5 group-hover:rotate-[360deg]" />
        </a>
      </div>
    </footer>
  );
};
