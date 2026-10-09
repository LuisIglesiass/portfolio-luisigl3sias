import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGsap, gsap, ScrollTrigger } from "@/hooks/use-gsap";
import { projects, FEATURED } from "@/data/projects";

const featured = projects.slice(0, FEATURED);
const archive = projects.slice(FEATURED);
const pad = (n) => String(n).padStart(2, "0");

const Links = ({ p }) => (
  <>
    {p.demoUrl && (
      <a className="ulink" href={p.demoUrl} target="_blank" rel="noreferrer">Live ↗</a>
    )}
    {p.caseStudyUrl && (
      <a className="ulink" href={p.caseStudyUrl} target="_blank" rel="noreferrer">Case study ↗</a>
    )}
    {p.githubUrl && (
      <a className="ulink" href={p.githubUrl} target="_blank" rel="noreferrer">Code ↗</a>
    )}
  </>
);

/**
 * Desktop: the section pins. A dark "WORKS" turnover panel lifts away, then the
 * track of project slides scrolls vertically (snapping to each) while a hairline
 * progress bar fills. Below 900px it degrades to a normal stacked list.
 * Archive: remaining projects as rows; hovering one pulls a floating preview
 * that eases toward the cursor.
 */
export const ProjectsSection = () => {
  const ref = useRef(null);
  const previewRef = useRef(null);

  useGsap(ref, (mm) => {
    const root = ref.current;

    mm.add("(min-width: 900px)", () => {
      const n = featured.length;
      const turnover = root.querySelector(".works-turnover");
      const title = root.querySelector(".works-turnover__title");
      const inner = root.querySelector(".works-inner");
      const bar = root.querySelector(".works-progress i");
      const counter = root.querySelector("[data-current]");
      const slides = gsap.utils.toArray(".works-slide", root);
      const copyOf = (slide) =>
        slide.querySelectorAll(".works-card-heading, .works-card-description, .works-card-links, .works-card-stack");
      const imgOf = (slide) => slide.querySelector(".works-art__frame img");
      const targets = [turnover, title, inner, bar, ...slides, ...slides.flatMap((sl) => [imgOf(sl), ...copyOf(sl)])];

      // Stage 0 = dark "WORKS." panel, stage k = project k. Scroll only decides
      // WHICH stage we're on; the transition itself is a timed tween, so it
      // plays at one calm speed no matter how hard the wheel is flicked.
      gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(inner, { opacity: 0, y: 40 });
      gsap.set(slides.flatMap(copyOf), { opacity: 0, y: 28 });
      gsap.set(bar, { scaleX: 0 });

      let stage = -1;
      const go = (next, instant = false) => {
        const prev = stage;
        stage = next;
        const k = instant ? 0 : 1;
        const open = next >= 1;
        const cur = next - 1;

        gsap.to(turnover, { yPercent: open ? -101 : 0, duration: 1.3 * k, ease: "expo.inOut", overwrite: "auto" });
        gsap.to(title, { yPercent: open ? 24 : 0, duration: 1.3 * k, ease: "expo.inOut", overwrite: "auto" });
        gsap.to(inner, { opacity: open ? 1 : 0, y: open ? 0 : 40, duration: 0.9 * k, delay: open ? 0.45 * k : 0, ease: "power3.out", overwrite: "auto" });
        gsap.to(bar, { scaleX: Math.max(0, cur) / (n - 1), duration: 1 * k, ease: "power3.inOut", overwrite: "auto" });
        counter.textContent = pad(Math.max(0, cur) + 1);

        slides.forEach((slide, j) => {
          if (j > 0) {
            gsap.to(slide, { clipPath: cur >= j ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", duration: 1.2 * k, ease: "expo.inOut", overwrite: "auto" });
          }
          // slides already covered drift up a touch; gives the wipe some depth
          gsap.to(slide, { yPercent: cur > j ? -5 : 0, duration: 1.2 * k, ease: "expo.inOut" });

          const copy = copyOf(slide);
          const img = imgOf(slide);
          if (j === cur && j !== prev - 1) {
            gsap.fromTo(img, { yPercent: 10, scale: 1.07 }, { yPercent: 0, scale: 1, duration: 1.6 * k, ease: "expo.out", overwrite: "auto", delay: 0.2 * k });
            gsap.to(copy, { opacity: 1, y: 0, duration: 1 * k, ease: "power3.out", stagger: 0.07, delay: (open && prev < 1 ? 0.7 : 0.35) * k, overwrite: "auto" });
          } else if (j > cur) {
            gsap.to(copy, { opacity: 0, y: 28, duration: 0.5 * k, ease: "power2.in", overwrite: "auto" });
          }
        });
      };

      const H = 0.08; // hysteresis: don't flip stages right on a boundary
      ScrollTrigger.create({
        trigger: root.querySelector(".works-pin"),
        start: "top top",
        end: () => "+=" + window.innerHeight * (n + 1) * 0.7,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => go(Math.min(n, Math.floor(self.progress * (n + 1))), true),
        onUpdate: (self) => {
          const raw = self.progress * (n + 1);
          let next = stage;
          if (raw >= stage + 1 + H) next = Math.min(n, Math.floor(raw - H));
          else if (raw < stage - H) next = Math.max(0, Math.floor(raw + H));
          if (next !== stage) go(next);
        },
      });

      return () => {
        gsap.killTweensOf(targets);
        gsap.set(targets, { clearProps: "transform,clipPath,opacity" });
      };
    });

    // reveal on mobile where nothing is pinned
    mm.add("(max-width: 899px)", () => {
      gsap.utils.toArray(".works-slide", root).forEach((s) =>
        gsap.from(s, { opacity: 0, y: 40, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: s, start: "top 88%", once: true } })
      );
    });

    // archive rows draw in
    gsap.utils.toArray(".archive__row", root).forEach((row) =>
      gsap.from(row, { opacity: 0, y: 30, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 94%", once: true } })
    );

    // floating preview that trails the cursor
    const prev = previewRef.current;
    if (matchMedia("(hover: hover)").matches) {
      const xTo = gsap.quickTo(prev, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(prev, "y", { duration: 0.6, ease: "power3.out" });
      const img = prev.querySelector("img");
      const list = root.querySelector(".archive__list");
      const move = (e) => {
        xTo(e.clientX + 28);
        yTo(e.clientY - 70);
      };
      const enter = (e) => {
        const row = e.target.closest("[data-src]");
        if (!row) return;
        img.src = row.dataset.src;
        gsap.to(prev, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      };
      const leave = () => gsap.to(prev, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power3.in", overwrite: "auto" });
      list.addEventListener("mousemove", move);
      list.addEventListener("mouseover", enter);
      list.addEventListener("mouseleave", leave);
      return () => {
        list.removeEventListener("mousemove", move);
        list.removeEventListener("mouseover", enter);
        list.removeEventListener("mouseleave", leave);
      };
    }
  });

  return (
    <section id="projects" ref={ref} className="works">
      <div className="works-pin">
        <div className="works-turnover" aria-hidden="true">
          <div className="works-turnover__meta">
            <span>(04) Selected work</span>
            <span>2024 — 2026</span>
          </div>
          <h2 className="works-turnover__title">
            Works<span className="dot">.</span>
            <br />
            <span>({pad(projects.length)})</span>
          </h2>
          <div className="works-turnover__footer">
            <span>Scroll to explore</span>
            <span>↓</span>
          </div>
        </div>

        <div className="works-inner">
          <div>
            <div className="works-kicker">
              <span>Featured — {pad(FEATURED)} projects</span>
              <span>
                <span data-current>01</span> / {pad(FEATURED)}
              </span>
            </div>
            <div className="works-heading-line">
              <h2 className="section-title">Selected Work</h2>
              <a href="#archive" className="pill pill--ghost"><span>All projects</span></a>
            </div>
          </div>

          <div className="works-gallery">
            <div className="works-track">
              {featured.map((p, i) => (
                <article key={p.title} className="works-slide" style={{ "--accent-p": p.accent, "--soft": p.soft }}>
                  <div className="works-card-info">
                    <div className="works-card-heading">
                      <span className="works-card-number">{pad(i + 1)}</span>
                      <div>
                        <h3>{p.title}</h3>
                        <p>{p.client ? "Client project" : "Personal project"} — {p.year}</p>
                      </div>
                    </div>
                    <div style={{ alignSelf: "end" }}>
                      <p className="works-card-description" style={{ marginBottom: 0 }}>{p.description}</p>
                      <div className="works-card-links"><Links p={p} /></div>
                    </div>
                    <ul className="works-card-stack">
                      {p.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <a
                    className="works-art"
                    href={p.demoUrl || p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${p.title}`}
                  >
                    <div className="works-art__kicker">
                      <span>{p.client ? "Client work" : "Side project"}</span>
                      <span>{pad(i + 1)} / {pad(FEATURED)}</span>
                    </div>
                    <span className="works-art__disc" aria-hidden="true" />
                    <div className="works-art__frame">
                      <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" />
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="works-progress"><i /></div>
            <div className="works-footer">
              <span>Luis Iglesias — Selected work</span>
              <span>Scroll</span>
            </div>
          </div>
        </div>
      </div>

      <div id="archive" className="archive">
        <div className="archive__inner">
          <div className="archive__head">
            <h2 className="section-title" style={{ fontSize: "clamp(40px, 7vw, 120px)" }}>Archive</h2>
            <span className="kicker" style={{ color: "var(--stone-700)" }}>
              ({pad(archive.length)}) More experiments &amp; tools
            </span>
          </div>
          <ul className="archive__list">
            {archive.map((p, i) => (
              <li key={p.title} className="archive__row" data-src={p.image}>
                <span className="archive__idx kicker">{pad(FEATURED + i + 1)}</span>
                <span className="archive__title">{p.title}</span>
                <span className="archive__stack kicker">{p.tags.join(" · ")}</span>
                <span className="archive__links kicker"><Links p={p} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div ref={previewRef} className="archive__preview" aria-hidden="true">
        <img alt="" />
      </div>
    </section>
  );
};
