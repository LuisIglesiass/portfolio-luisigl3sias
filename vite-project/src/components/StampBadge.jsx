import { useEffect, useId, useRef, useState } from "react";

const CIRCLE_TEXT = "AVAILABLE FOR WORK • BASED IN HAMBURG • ";

/**
 * A hand-stamped ink-mark badge — the hero's signature moment. It
 * presses into place on load (not a fade), idles with a cursor-tilt
 * like a real object catching light, and can be picked up and dragged
 * anywhere within the hero — it stays wherever you drop it, with a
 * spring settle. Works with mouse and touch (Pointer Events).
 */
export const StampBadge = () => {
  const pathId = useId();
  const dragRef = useRef(null);
  const tiltRef = useRef(null);
  const [pressed, setPressed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const boundsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPressed(true), 850);
    return () => clearTimeout(t);
  }, []);

  // idle ambient tilt toward the cursor
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = null;
    const handleMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--tilt", `${nx * 10}deg`);
        el.style.setProperty("--liftX", `${nx * 6}px`);
        el.style.setProperty("--liftY", `${ny * 6}px`);
      });
    };

    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // drag-to-place
  const handlePointerDown = (e) => {
    const el = dragRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    const hero = el.closest("section");
    const stampRect = el.getBoundingClientRect();
    const heroRect = hero ? hero.getBoundingClientRect() : null;
    const naturalLeft = stampRect.left - posRef.current.x;
    const naturalTop = stampRect.top - posRef.current.y;

    boundsRef.current = heroRect
      ? {
          minX: heroRect.left - naturalLeft + 8,
          maxX: heroRect.right - naturalLeft - stampRect.width - 8,
          minY: heroRect.top - naturalTop + 8,
          maxY: heroRect.bottom - naturalTop - stampRect.height - 8,
        }
      : null;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...posRef.current };
    setDragging(true);

    const clamp = (v, min, max) => (min > max ? v : Math.min(Math.max(v, min), max));

    const handleMove = (ev) => {
      let nx = startPos.x + (ev.clientX - startX);
      let ny = startPos.y + (ev.clientY - startY);
      const b = boundsRef.current;
      if (b) {
        nx = clamp(nx, b.minX, b.maxX);
        ny = clamp(ny, b.minY, b.maxY);
      }
      posRef.current = { x: nx, y: ny };
      el.style.transform = `translate(${nx}px, ${ny}px)`;
    };

    const handleUp = (ev) => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerup", handleUp);
      el.removeEventListener("pointercancel", handleUp);
      setDragging(false);
      setPos(posRef.current);
      handleMove(ev);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerup", handleUp);
    el.addEventListener("pointercancel", handleUp);
  };

  return (
    <div
      className={`absolute top-20 right-2 sm:top-24 sm:right-8 lg:right-16 z-10 ${
        pressed ? "stamp-in" : "opacity-0"
      }`}
      style={{ width: "clamp(84px, 9vw, 130px)", height: "clamp(84px, 9vw, 130px)" }}
    >
      {/* sr-only: the badge is a decorative drag toy, its meaning stays in real text too */}
      <span className="sr-only">2.8+ years of experience. Open for freelance work.</span>

      <div
        ref={dragRef}
        onPointerDown={handlePointerDown}
        role="presentation"
        aria-hidden="true"
        className="text-primary select-none touch-none"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        <div
          ref={tiltRef}
          style={{
            transform:
              "rotate(calc(-9deg + var(--tilt, 0deg))) translate(var(--liftX, 0px), var(--liftY, 0px))",
            transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <defs>
              <path
                id={pathId}
                d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
              />
            </defs>
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeDasharray="2 2.5 6 2 3 3 8 2"
              opacity="0.85"
            />
            <circle
              cx="60"
              cy="60"
              r="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.55"
            />
            <text
              fontFamily="var(--font-mono)"
              fontSize="7.6"
              letterSpacing="1.5"
              fill="currentColor"
            >
              <textPath href={`#${pathId}`}>{CIRCLE_TEXT.repeat(2)}</textPath>
            </text>
            <text
              x="60"
              y="58"
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize="15"
              fill="currentColor"
            >
              2.8+
            </text>
            <text
              x="60"
              y="70"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="6"
              letterSpacing="1"
              fill="currentColor"
              opacity="0.75"
            >
              YEARS
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};
