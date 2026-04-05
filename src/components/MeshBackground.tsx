import { useEffect, useRef } from "react";

const NODE_COUNT = 55;
const PADDING = 10;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const MeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);
  const glowDecayRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initNodes = (w: number, h: number) => {
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: PADDING + Math.random() * (w - PADDING * 2),
        y: PADDING + Math.random() * (h - PADDING * 2),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initNodes(canvas.width, canvas.height);
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (isVisibleRef.current) {
        ctx.clearRect(0, 0, w, h);

        for (const node of nodesRef.current) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < PADDING || node.x > w - PADDING) node.vx *= -1;
          if (node.y < PADDING || node.y > h - PADDING) node.vy *= -1;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    // Mouse tracking — attach to canvas's parent (Hero section)
    const section = canvas.parentElement;
    if (!section) return;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      lastMouseRef.current = mouseRef.current;
      glowDecayRef.current = 1;
    };
    const onMouseLeave = () => { mouseRef.current = null; };
    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "60%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
      }}
    />
  );
};

export default MeshBackground;
