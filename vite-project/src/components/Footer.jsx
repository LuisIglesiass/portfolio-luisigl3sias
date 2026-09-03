import { ArrowUp } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="px-6 md:px-12 py-8 border-t border-border flex flex-wrap gap-4 justify-between items-center font-mono text-xs text-muted-foreground">
      <p>
        © {new Date().getFullYear()} Luis Iglesias — designed &amp; built by
        hand, no template.
      </p>
      <a
        href="#hero"
        aria-label="Back to top"
        className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
      >
        <ArrowUp size={16} />
      </a>
    </footer>
  );
};
