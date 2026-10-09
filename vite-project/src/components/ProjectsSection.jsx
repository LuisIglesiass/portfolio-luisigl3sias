import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGsap, gsap } from "@/hooks/use-gsap";
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
 * Works: a dark "WORKS." band, then the featured projects as a normal
 * scrolling list — each one reveals once as it enters the viewport.
 * Archive: remaining projects as rows; hovering one pulls a floating preview
 * that eases toward the cursor.
 */
export const ProjectsSection = () => {
  const ref = useRef(null);
  const previewRef = useRef(null);

  useGsap(ref, (mm) => {
    const root = ref.current;

    // "WORKS." title lines rise out of their masks; the dark band's type drifts
    // slower than the page as it scrolls away.
    const tLines = root.querySelectorAll(".works-turnover__title .line-mask > span");
    gsap.set(tLines, { yPercent: 108 });
    gsap.to(tLines, {
      yPercent: 0,
      duration: 1.4,
      ease: "expo.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ".works-turnover", start: "top 70%", once: true },
    });
    gsap.to(".works-turnover__title", {
      yPercent: -14,
      ease: "none",
      scrollTrigger: { trigger: ".works-turnover", start: "top top", end: "bottom top", scrub: true },
    });

    // Desktop: the gallery is pinned with plain CSS `position: sticky` (the
    // browser does the pinning, so there is no JS pin to drift or jitter). Every
    // frame we read how far the tall wrapper has scrolled and render the whole
    // gallery as a pure function of that single number — nothing is "played",
    // so it can't desync, stall, batch-jump or depend on measurement timing.
    mm.add("(min-width: 900px)", () => {
      const n = featured.length;
      const scroller = root.querySelector(".works-scroller");
      const slides = gsap.utils.toArray(".works-slide", root);
      const bar = root.querySelector(".works-progress i");
      const counter = root.querySelector("[data-current]");
      const copyOf = (slide) =>
        Array.from(slide.querySelectorAll(".works-card-heading, .works-card-description, .works-card-links, .works-card-stack"));
      const imgOf = (slide) => slide.querySelector(".works-art__frame img");
      const parts = slides.map((slide) => ({ slide, img: imgOf(slide), copy: copyOf(slide) }));

      const wipe = 0.78; // share of each step spent moving; the rest is a hold
      const pad0 = (1 - wipe) / 2;
      const inOut = gsap.parseEase("power2.inOut");
      const out = gsap.parseEase("power2.out");
      const clamp = (v) => Math.min(1, Math.max(0, v));

      let last = -1;
      let lastCount = "";
      const render = (p) => {
        const sPos = p * (n - 1);
        parts.forEach((part, k) => {
          if (k === 0) return;
          const t = clamp((sPos - (k - 1) - pad0) / wipe);
          const e = inOut(t);
          const eo = out(t);
          part.slide.style.clipPath = `inset(${((1 - e) * 100).toFixed(3)}% 0% 0% 0%)`;
          parts[k - 1].slide.style.transform = `translate3d(0, ${(-5 * e).toFixed(3)}%, 0)`;
          part.img.style.transform = `translate3d(0, ${(10 * (1 - eo)).toFixed(3)}%, 0) scale(${(1 + 0.07 * (1 - eo)).toFixed(4)})`;
          part.copy.forEach((el, i) => {
            const c = out(clamp((t - 0.35 - i * 0.05) / 0.55));
            el.style.opacity = c.toFixed(3);
            el.style.transform = `translate3d(0, ${(28 * (1 - c)).toFixed(2)}px, 0)`;
          });
        });
        const cnt = pad(Math.min(n, Math.round(sPos) + 1));
        if (cnt !== lastCount) {
          lastCount = cnt;
          counter.textContent = cnt;
        }
        bar.style.transform = `scaleX(${p.toFixed(4)})`;
      };

      const frame = () => {
        const r = scroller.getBoundingClientRect();
        const span = r.height - window.innerHeight;
        const p = span > 0 ? clamp(-r.top / span) : 0;
        if (p !== last) {
          last = p;
          render(p);
        }
      };
      render(0);
      frame();
      gsap.ticker.add(frame);

      return () => {
        gsap.ticker.remove(frame);
        parts.forEach(({ slide, img, copy }) => {
          slide.style.clipPath = "";
          slide.style.transform = "";
          img.style.transform = "";
          copy.forEach((el) => {
            el.style.opacity = "";
            el.style.transform = "";
          });
        });
        bar.style.transform = "";
      };
    });

    // Mobile: no pin, each project reveals once as it enters.
    mm.add("(max-width: 899px)", () => {
      gsap.utils.toArray(".works-slide", root).forEach((slide) => {
        const art = slide.querySelector(".works-art");
        const img = slide.querySelector(".works-art__frame img");
        gsap.set(art, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(img, { scale: 1.12 });
        gsap
          .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: slide, start: "top 80%", once: true } })
          .to(art, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" })
          .to(img, { scale: 1, duration: 1.6 }, 0.1);
      });
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
      <div className="works-turnover" aria-hidden="true">
        <div className="works-turnover__meta">
          <span>(04) Selected work</span>
          <span>2024 — 2026</span>
        </div>
        <h2 className="works-turnover__title">
          <span className="line-mask"><span>Works<span className="dot">.</span></span></span>
          <span className="line-mask"><span className="count">({pad(projects.length)})</span></span>
        </h2>
        <div className="works-turnover__footer">
          <span>Scroll to explore</span>
          <span>↓</span>
        </div>
      </div>

      <div className="works-scroller" style={{ "--steps": FEATURED - 1 }}>
      <div className="works-pin">
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
