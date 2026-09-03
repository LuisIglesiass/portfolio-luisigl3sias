import { Instagram, Linkedin, MapPin, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useMagnetic } from "@/hooks/use-magnetic";
import { RevealText } from "./RevealText";

export const ContactSection = () => {
  const ref = useReveal();
  const linkedinMagnetic = useMagnetic(0.5);
  const instagramMagnetic = useMagnetic(0.5);

  return (
    <section id="contact" className="py-32 px-6 md:px-12 relative bg-secondary/30">
      <div className="container">
        <p className="index-number mb-3">GET IN TOUCH</p>
        <RevealText as="h2" text="Contact" className="font-display text-3xl md:text-4xl mb-14 block" />

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-9">
            <p className="font-mono text-sm text-muted-foreground mb-4 max-w-md">
              Have a project in mind, or want to collaborate? I'm always open
              to new opportunities.
            </p>
            <a
              href="mailto:lluis.igl3sias@gmail.com"
              className="group font-display text-3xl sm:text-5xl lg:text-6xl inline-flex items-center gap-4 hover:text-primary transition-colors duration-300 break-all"
            >
              lluis.igl3sias@gmail.com
              <ArrowUpRight className="h-8 w-8 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0" />
            </a>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6 font-mono text-sm">
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              Hamburg / Winsen (Luhe), Germany — Remote
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/luis-iglesias-ab8068243/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                ref={linkedinMagnetic}
                className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/lluis.iglesias?igsh=ZWl1NHg1dm1vMmJ3&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                ref={instagramMagnetic}
                className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
