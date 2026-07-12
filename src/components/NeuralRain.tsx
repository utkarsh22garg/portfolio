import { useEffect, useRef } from "react";

/**
 * NeuralRain — minimal matrix-style data rain, re-themed for ML.
 * Sparse columns of binary / katakana / ML-notation glyphs fall in three
 * depth layers. Glyphs passing near the cursor ignite in cyan and fade
 * out through the trail overlay. Static glyph field under reduced motion.
 */

const GLYPHS = "0011アイウカキクサシスタチツナニヌ∇θλΣπ∂ημε<>+=#";
const FONT = '"IBM Plex Mono", ui-monospace, monospace';
const CYAN = "103, 232, 249"; // #67e8f9 — same accent as project artwork
const CURSOR_RADIUS = 140;
const AMBIENT_CYAN_CHANCE = 0.025;

interface Drop {
  x: number;
  y: number;
  speed: number; // px per second
  fontSize: number;
  alpha: number;
  lastCell: number;
}

const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

const buildDrops = (w: number, h: number): Drop[] => {
  const drops: Drop[] = [];
  let x = 8;
  while (x < w - 8) {
    const r = Math.random();
    // three depth layers: small/dim/slow → large/bright/fast
    const fontSize = r < 0.45 ? 12 : r < 0.85 ? 16 : 21;
    const alpha = fontSize === 12 ? 0.28 : fontSize === 16 ? 0.5 : 0.75;
    drops.push({
      x,
      y: -Math.random() * h * 1.5,
      speed: fontSize * (3.5 + Math.random() * 4), // ~3.5–7.5 cells/sec
      fontSize,
      alpha,
      lastCell: -1,
    });
    x += fontSize * (1.4 + Math.random() * 1.6);
  }
  return drops;
};

const NeuralRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const drawStatic = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const count = Math.floor((w * h) / 14000);
      for (let i = 0; i < count; i++) {
        const size = 12 + Math.random() * 8;
        ctx.font = `${size}px ${FONT}`;
        ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.1})`;
        ctx.fillText(randomGlyph(), Math.random() * w, Math.random() * h);
      }
    };

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) {
        drawStatic();
      } else {
        dropsRef.current = buildDrops(w, h);
      }
    };

    const draw = (now: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000 || 0.016);
      lastTimeRef.current = now;

      // translucent black wash: previous glyphs decay into trails
      ctx.fillStyle = `rgba(0,0,0,${Math.min(1, dt * 5)})`;
      ctx.fillRect(0, 0, w, h);

      const mouse = mouseRef.current;
      for (const drop of dropsRef.current) {
        drop.y += drop.speed * dt;
        const cell = Math.floor(drop.y / drop.fontSize);
        if (cell !== drop.lastCell && drop.y > 0) {
          drop.lastCell = cell;
          const gy = cell * drop.fontSize;
          const nearCursor =
            mouse && Math.hypot(drop.x - mouse.x, gy - mouse.y) < CURSOR_RADIUS;
          ctx.font = `${drop.fontSize}px ${FONT}`;
          ctx.fillStyle = nearCursor
            ? `rgba(${CYAN},${Math.min(1, drop.alpha + 0.4)})`
            : Math.random() < AMBIENT_CYAN_CHANCE
              ? `rgba(${CYAN},${drop.alpha})`
              : `rgba(255,255,255,${drop.alpha})`;
          ctx.fillText(randomGlyph(), drop.x, gy);
        }
        if (drop.y > h + 60) {
          drop.y = -Math.random() * 400 - 50;
          drop.lastCell = -1;
          drop.speed = drop.fontSize * (3.5 + Math.random() * 4);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    if (!reduce) {
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        if (entry.isIntersecting && !rafRef.current) {
          lastTimeRef.current = performance.now();
          rafRef.current = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const section = canvas.parentElement;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = null;
    };
    section?.addEventListener("mousemove", onMouseMove);
    section?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      section?.removeEventListener("mousemove", onMouseMove);
      section?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default NeuralRain;
