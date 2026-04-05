import { Delaunay } from "d3-delaunay";
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

        // Update node positions
        for (const node of nodesRef.current) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < PADDING || node.x > w - PADDING) node.vx *= -1;
          if (node.y < PADDING || node.y > h - PADDING) node.vy *= -1;
        }

        // Compute Delaunay triangulation
        const coords = new Float64Array(nodesRef.current.flatMap(n => [n.x, n.y]));
        const delaunay = new Delaunay(coords);
        const { triangles } = delaunay;

        // Update glow decay when mouse is absent
        if (!mouseRef.current && glowDecayRef.current > 0) {
          glowDecayRef.current = Math.max(0, glowDecayRef.current - 0.02);
        }

        const mouse = mouseRef.current;
        const lastMouse = lastMouseRef.current;
        const decay = glowDecayRef.current;

        // Draw each triangle
        ctx.lineWidth = 0.5;
        for (let i = 0; i < triangles.length; i += 3) {
          const ai = triangles[i] * 2;
          const bi = triangles[i + 1] * 2;
          const ci = triangles[i + 2] * 2;

          const ax = coords[ai],     ay = coords[ai + 1];
          const bx = coords[bi],     by = coords[bi + 1];
          const cx = coords[ci],     cy = coords[ci + 1];
          const centX = (ax + bx + cx) / 3;
          const centY = (ay + by + cy) / 3;

          let opacity = 0.06;

          if (mouse) {
            const d = Math.hypot(centX - mouse.x, centY - mouse.y);
            const t = Math.max(0, 1 - d / 150);
            opacity = 0.06 + 0.29 * t; // lerp(0.06, 0.35, t)
          } else if (lastMouse && decay > 0) {
            const d = Math.hypot(centX - lastMouse.x, centY - lastMouse.y);
            const t = Math.max(0, 1 - d / 150);
            opacity = 0.06 + 0.29 * t * decay; // fade out using decay multiplier
          }

          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.lineTo(cx, cy);
          ctx.closePath();
          ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
          ctx.stroke();
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
