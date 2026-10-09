import { useCallback, useEffect, useState } from "react";
import { Intro } from "../components/Intro";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ExperienceSection } from "../components/ExperienceSection";
import { SkillsSection } from "../components/SkillsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ContactSection } from "../components/ContactSection";
import { initSmoothScroll } from "../lib/smoothScroll";

export const Home = () => {
  const [ready, setReady] = useState(false);
  const onIntroDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:rounded-full focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>
      <Intro onDone={onIntroDone} />
      <Navbar ready={ready} />
      <main id="main-content">
        <HeroSection ready={ready} />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
};
