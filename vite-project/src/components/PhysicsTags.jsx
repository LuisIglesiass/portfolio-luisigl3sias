import { useEffect, useRef, useState } from "react";

const TAGS = [
  "Nuxt.js",
  "Vue.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "WordPress",
  "JavaScript",
  "SCSS",
  "Strapi",
  "Git",
  "Figma",
  "Docker",
];

const VARIANTS = ["solid", "outline", "solid", "outline", "ghost"];

/**
 * The stack, literally falling into place. Tags drop with real gravity
 * (Matter.js), cascade and pile up, the cursor acts as a solid obstacle
 * that scatters them, and a click sends the whole pile flying back up
 * to resettle. Big, autonomous, and obvious from the moment the hero
 * loads — no hover required to notice it.
 *
 * Matter.js is loaded on demand (not a static import) and the whole
 * simulation is skipped below the `xl` breakpoint where this is
 * `hidden` anyway — no reason to ship/parse/run a physics engine on
 * mobile just to render nothing. Both matter for Total Blocking Time:
 * a smaller synchronous main bundle, and no wasted setup work on the
 * majority of visits.
 */
export const PhysicsTags = () => {
  const containerRef = useRef(null);
  const [chips, setChips] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.innerWidth < 1280) return; // matches the `xl:` breakpoint this is shown at

    let cancelled = false;
    let cleanup = () => {};

    import("matter-js").then((MatterModule) => {
      if (cancelled) return;
      const Matter = MatterModule.default ?? MatterModule;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const { Engine, Bodies, Body, Composite, Events } = Matter;

      const rect = container.getBoundingClientRect();
      let width = rect.width;
      let height = rect.height;

      const measurer = document.createElement("canvas").getContext("2d");
      measurer.font = "500 13px 'JetBrains Mono', ui-monospace, monospace";

      const engine = Engine.create();
      engine.gravity.y = 1;

      const bodies = TAGS.map((label, i) => {
        const w = Math.ceil(measurer.measureText(label).width) + 30;
        const h = 34;
        const x = 40 + Math.random() * Math.max(1, width - 80);
        const y = reduced
          ? 40 + (i % 4) * 50
          : -60 - i * 60 - Math.random() * 60;
        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: h / 2 },
          restitution: 0.35,
          friction: 0.25,
          frictionAir: 0.012,
          angle: (Math.random() - 0.5) * 0.4,
        });
        return { body, label, w, h, variant: VARIANTS[i % VARIANTS.length] };
      });

      const wallThickness = 60;
      const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 200, wallThickness, {
        isStatic: true,
        restitution: 0.3,
      });
      // Side walls get a bit more restitution than a plain tag-on-tag
      // collision (0.35) — Matter.js takes the max of the two colliding
      // bodies' restitution — but stay well short of "elastic": with near-
      // zero friction a high-restitution wall never bleeds energy and just
      // jitters forever instead of settling, which reads as a bug.
      const sideWallOptions = { isStatic: true, restitution: 0.45, friction: 0.06 };
      const walls = [
        floor,
        Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, sideWallOptions),
        Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 3, sideWallOptions),
      ];

      const cursorBody = Bodies.circle(-100, -100, 22, { isStatic: true });

      Composite.add(engine.world, [...bodies.map((b) => b.body), ...walls, cursorBody]);
      setChips(bodies);

      const [floorBody, leftWall, rightWall] = walls;

      // Without this, the invisible floor/walls stay at their mount-time
      // pixel coordinates forever while the visual container keeps
      // resizing with the viewport/layout — the pile then settles below
      // (or above) where the container actually ends, and gets abruptly
      // clipped by the hero's overflow-hidden instead of resting inside it.
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        Body.setPosition(floorBody, { x: width / 2, y: height + wallThickness / 2 });
        Body.setPosition(leftWall, { x: -wallThickness / 2, y: height / 2 });
        Body.setPosition(rightWall, { x: width + wallThickness / 2, y: height / 2 });
      });
      resizeObserver.observe(container);

      const handleMove = (e) => {
        const r = container.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (x >= -50 && x <= width + 50 && y >= -50 && y <= height + 50) {
          Body.setPosition(cursorBody, { x, y });
        } else {
          Body.setPosition(cursorBody, { x: -1000, y: -1000 });
        }
      };
      window.addEventListener("pointermove", handleMove);

      const handleClick = () => {
        bodies.forEach(({ body }) => {
          Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.03,
            y: -0.05 - Math.random() * 0.03,
          });
        });
      };
      container.addEventListener("click", handleClick);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(container);

      let raf = null;
      let last = performance.now();
      const tick = (now) => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) {
          last = now;
          return;
        }
        const delta = Math.min(now - last, 32);
        last = now;
        if (!reduced) Engine.update(engine, delta);

        bodies.forEach(({ body, w, h }, i) => {
          const el = container.children[i];
          if (!el) return;
          el.style.transform = `translate3d(${body.position.x - w / 2}px, ${body.position.y - h / 2}px, 0) rotate(${body.angle}rad)`;
        });
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", handleMove);
        container.removeEventListener("click", handleClick);
        resizeObserver.disconnect();
        io.disconnect();
        Events.off(engine);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const variantClass = {
    solid: "bg-primary text-primary-foreground",
    outline: "border border-primary text-primary",
    ghost: "bg-secondary text-secondary-foreground",
  };

  return (
    <div
      ref={containerRef}
      className="hidden xl:block absolute inset-y-16 right-0 w-[46vw] z-10 cursor-pointer overflow-hidden"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)",
      }}
      title="Click to toss the stack"
    >
      {chips.map((c, i) => (
        <div
          key={i}
          className={`absolute top-0 left-0 flex items-center justify-center rounded-full font-mono text-[13px] font-medium whitespace-nowrap px-3 shadow-sm ${variantClass[c.variant]}`}
          style={{ width: c.w, height: c.h, willChange: "transform" }}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
};
