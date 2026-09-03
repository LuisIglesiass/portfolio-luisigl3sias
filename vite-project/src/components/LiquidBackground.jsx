import { useEffect, useRef } from "react";

const VERTEX_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SRC = `
  precision mediump float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec3 u_bg;
  uniform vec3 u_primary;

  void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = v_uv;
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);

    float dist = distance(p, m);

    /* ripple: the cursor pushes a decaying radial wave through the field */
    float ripple = sin(dist * 18.0 - u_time * 2.0) * exp(-dist * 3.0);
    vec2 dir = normalize(p - m + 1e-4);
    vec2 warped = uv + dir * ripple * 0.035;

    /* cheap layered-sine "liquid" flow field, no noise texture needed */
    float flow =
      sin(warped.x * 6.0 + u_time * 0.35) +
      sin(warped.y * 5.0 - u_time * 0.28) +
      sin((warped.x + warped.y) * 4.0 + u_time * 0.18);
    flow = flow / 3.0 * 0.5 + 0.5;

    float mixAmt = smoothstep(0.3, 0.85, flow) * 0.16;
    mixAmt += exp(-dist * 4.0) * 0.14;

    vec3 color = mix(u_bg, u_primary, clamp(mixAmt, 0.0, 0.4));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function hslVarToRgb(varName) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const [h, s, l] = raw.split(" ").map((v) => parseFloat(v));
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m];
}

/**
 * Full-hero liquid-ink background. Hand-rolled WebGL (no Three.js) —
 * a cheap layered-sine flow field the cursor ripples through, mixing
 * toward the primary color. Falls back to nothing (plain background
 * shows through) if WebGL is unavailable or reduced-motion is set.
 */
export const LiquidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    if (!canvas || !section) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uBg = gl.getUniformLocation(program, "u_bg");
    const uPrimary = gl.getUniformLocation(program, "u_primary");

    let bg = hslVarToRgb("--background");
    let primary = hslVarToRgb("--primary");
    const refreshColors = () => {
      bg = hslVarToRgb("--background");
      primary = hslVarToRgb("--primary");
    };
    const themeObserver = new MutationObserver(refreshColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const rect = section.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);

    const target = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };
    const handleMove = (e) => {
      const rect = section.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", handleMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(section);

    let raf = null;
    const start = performance.now();
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;

      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, current.x, current.y);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
      gl.uniform3f(uPrimary, primary[0], primary[1], primary[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handleMove);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
};
