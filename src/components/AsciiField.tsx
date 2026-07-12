import { useEffect, useRef } from "react";

/**
 * AsciiField — a coarse character grid rendering an interference field of
 * traveling sine waves, the footer's ambient backdrop. The cursor drops a
 * ripple into the field; when idle the ripple source wanders a Lissajous
 * path instead. Very dim, ~30fps, so it reads as texture, not distraction.
 *
 * A Nokia-style snake lives in the grid too: it steers toward the pointer
 * (or hunts food autonomously when idle) and eats food to grow, splashing a
 * transient ripple into the wave field on each bite. Ambience, not a game —
 * no death, no game-over.
 */

const FONT = '"IBM Plex Mono", ui-monospace, monospace';
const RAMP = " ·:-=+*#%@";
const BRIGHT_CYAN = "103, 232, 249"; // #67e8f9
const FRAME_INTERVAL = 1 / 30;
const CELL_W = 10;
const CELL_H = 16;
const CELL_W_SMALL = 12;
const CELL_H_SMALL = 19;
const SMALL_BREAKPOINT = 768;
// Field range: theoretical peak is ±5.2, but the three phase-independent
// sines rarely stack that high — normalizing against the real range keeps
// the grid mostly blank with characters only surfacing on genuine crests.
const V_LO = 0.7;
const V_HI = 2.9;

const SNAKE_TICK_RATE = 8; // grid-cell steps per second — no interpolation between ticks
const SNAKE_TICK_INTERVAL = 1 / SNAKE_TICK_RATE;
const SNAKE_SPAWN_LEN = 6;
const SNAKE_LENGTH_CAP = 40;
const FOOD_COUNT = 3;
const FOOD_MIN_SEP = 3;
const RIPPLE_LIFE = 1.2; // seconds for a food-eaten ripple to decay to zero
const RIPPLE_AMP_MULT = 1.5; // relative to the pointer ripple's amplitude
const FOOD_BLINK_INTERVAL = 0.5;
const FOOD_GLYPH = "¤";
const HEAD_GLYPH = "@";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Grid {
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
}

interface Cell {
  x: number;
  y: number;
  ch: string;
}

interface Vec {
  x: number;
  y: number;
}

interface Ripple {
  x: number;
  y: number;
  born: number;
}

interface Snake {
  cells: Vec[]; // head first
  dir: Vec;
}

const lissajous = (t: number, cols: number, rows: number) => ({
  x: cols * (0.5 + 0.36 * Math.sin(t * 0.13)),
  y: rows * (0.5 + 0.34 * Math.sin(t * 0.17 + 1.3)),
});

const rippleTerm = (d: number, t: number, amp: number) => amp * Math.sin(d * 0.85 - t * 4.2) * Math.exp(-d / 11);

const fieldValue = (
  x: number,
  y: number,
  t: number,
  sx: number,
  sy: number,
  strength: number,
  ripples: Ripple[]
) => {
  const base = Math.sin(x * 0.32 + t * 0.9) + Math.sin(y * 0.48 - t * 0.55) + Math.sin((x + y) * 0.21 + t * 0.38);
  let ripple = rippleTerm(Math.hypot(x - sx, y - sy), t, 2.2 * strength);
  for (const r of ripples) {
    const age = t - r.born;
    if (age < 0 || age >= RIPPLE_LIFE) continue;
    const decay = 1 - age / RIPPLE_LIFE;
    ripple += rippleTerm(Math.hypot(x - r.x, y - r.y), t, 2.2 * RIPPLE_AMP_MULT * decay);
  }
  return clamp01((base + ripple - V_LO) / (V_HI - V_LO));
};

const mod = (v: number, m: number) => ((v % m) + m) % m;
const wrapCell = (c: Vec, cols: number, rows: number): Vec => ({ x: mod(c.x, cols), y: mod(c.y, rows) });
const cellsEqual = (a: Vec, b: Vec) => a.x === b.x && a.y === b.y;
const sameDir = (a: Vec, b: Vec) => a.x === b.x && a.y === b.y;
const rotateLeft = (d: Vec): Vec => ({ x: d.y, y: -d.x });
const rotateRight = (d: Vec): Vec => ({ x: -d.y, y: d.x });

const toroidalDist = (a: Vec, b: Vec, cols: number, rows: number) => {
  const dx = Math.min(Math.abs(a.x - b.x), cols - Math.abs(a.x - b.x));
  const dy = Math.min(Math.abs(a.y - b.y), rows - Math.abs(a.y - b.y));
  return Math.hypot(dx, dy);
};

const spawnSnake = (cols: number, rows: number): Snake => {
  const hx = Math.floor(cols * 0.25);
  const hy = Math.floor(rows * 0.55);
  const cells: Vec[] = [];
  for (let i = 0; i < SNAKE_SPAWN_LEN; i++) cells.push(wrapCell({ x: hx - i, y: hy }, cols, rows));
  return { cells, dir: { x: 1, y: 0 } };
};

const randCell = (cols: number, rows: number): Vec => ({
  x: Math.floor(Math.random() * cols),
  y: Math.floor(Math.random() * rows),
});

const spawnFood = (cols: number, rows: number, snake: Vec[], existing: Vec[]): Vec => {
  let c = randCell(cols, rows);
  let tries = 0;
  while (
    tries++ < 50 &&
    (snake.some((s) => cellsEqual(s, c)) || existing.some((f) => Math.hypot(f.x - c.x, f.y - c.y) < FOOD_MIN_SEP))
  ) {
    c = randCell(cols, rows);
  }
  return c;
};

// One movement tick: pick the non-reversing turn that best closes the toroidal
// distance to `target`, deprioritizing turns that land on the snake's own body
// (falling back to the collision nearest the tail — which vacates soonest — if
// every candidate collides). Mutates `snake` and `food`, may push a ripple.
const stepSnake = (snake: Snake, food: Vec[], ripples: Ripple[], cols: number, rows: number, target: Vec, t: number) => {
  const head = snake.cells[0];
  const candidates = [snake.dir, rotateLeft(snake.dir), rotateRight(snake.dir)];

  let best: { dir: Vec; cell: Vec; dist: number } | null = null;
  let bestCollide: { dir: Vec; cell: Vec; bodyIdx: number } | null = null;

  for (const dir of candidates) {
    const cell = wrapCell({ x: head.x + dir.x, y: head.y + dir.y }, cols, rows);
    const bodyIdx = snake.cells.findIndex((c) => cellsEqual(c, cell));
    if (bodyIdx === -1) {
      const dist = toroidalDist(cell, target, cols, rows);
      if (!best || dist < best.dist - 1e-9 || (Math.abs(dist - best.dist) <= 1e-9 && sameDir(dir, snake.dir))) {
        best = { dir, cell, dist };
      }
    } else if (!bestCollide || bodyIdx > bestCollide.bodyIdx) {
      bestCollide = { dir, cell, bodyIdx };
    }
  }

  const choice = (best ?? bestCollide)!;
  snake.dir = choice.dir;
  snake.cells.unshift(choice.cell);

  const foodIdx = food.findIndex((f) => cellsEqual(f, choice.cell));
  if (foodIdx !== -1) {
    ripples.push({ x: choice.cell.x, y: choice.cell.y, born: t });
    if (snake.cells.length > SNAKE_LENGTH_CAP) snake.cells.pop(); // at cap: splash, no growth
    food[foodIdx] = spawnFood(cols, rows, snake.cells, food.filter((_, i) => i !== foodIdx));
  } else {
    snake.cells.pop();
  }
};

const nearestFood = (head: Vec, food: Vec[], cols: number, rows: number): Vec => {
  let best = food[0];
  let bestDist = Infinity;
  for (const f of food) {
    const d = toroidalDist(head, f, cols, rows);
    if (d < bestDist) {
      bestDist = d;
      best = f;
    }
  }
  return best;
};

const AsciiField = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const gridRef = useRef<Grid>({ cols: 0, rows: 0, cellW: CELL_W, cellH: CELL_H });
  const snakeRef = useRef<Snake>({ cells: [], dir: { x: 1, y: 0 } });
  const foodRef = useRef<Vec[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      const small = w < SMALL_BREAKPOINT;
      const cellW = small ? CELL_W_SMALL : CELL_W;
      const cellH = small ? CELL_H_SMALL : CELL_H;
      gridRef.current = { cols: Math.ceil(w / cellW), rows: Math.ceil(h / cellH), cellW, cellH };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `11px ${FONT}`;
      ctx.textBaseline = "top";
    };

    const drawFrame = (t: number, sx: number, sy: number, strength: number) => {
      const { cols, rows, cellW, cellH } = gridRef.current;
      ctx.clearRect(0, 0, wrap.offsetWidth, wrap.offsetHeight);

      const snake = snakeRef.current;
      const food = foodRef.current;
      const ripples = ripplesRef.current;
      const occupied = new Set<string>();
      for (const c of snake.cells) occupied.add(`${c.x},${c.y}`);
      for (const f of food) occupied.add(`${f.x},${f.y}`);

      const normalCells: Cell[] = [];
      const brightCells: Cell[] = [];

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          if (occupied.has(`${gx},${gy}`)) continue;
          const v = fieldValue(gx, gy, t, sx, sy, strength, ripples);
          const idx = Math.floor(v * (RAMP.length - 1) + 0.5);
          if (idx < 3) continue;
          const cell = { x: gx * cellW, y: gy * cellH, ch: RAMP[idx] };
          if (v >= 0.82) brightCells.push(cell);
          else normalCells.push(cell);
        }
      }

      ctx.fillStyle = "rgba(255,255,255,0.07)";
      for (const c of normalCells) ctx.fillText(c.ch, c.x, c.y);

      ctx.fillStyle = `rgba(${BRIGHT_CYAN},0.30)`;
      for (const c of brightCells) ctx.fillText(c.ch, c.x, c.y);

      const blinkAlpha = Math.floor(t / FOOD_BLINK_INTERVAL) % 2 === 0 ? 0.55 : 0.3;
      ctx.fillStyle = `rgba(${BRIGHT_CYAN},${blinkAlpha})`;
      for (const f of food) ctx.fillText(FOOD_GLYPH, f.x * cellW, f.y * cellH);

      const body = snake.cells.slice(1);
      for (let i = 0; i < body.length; i++) {
        const distFromHead = i + 1;
        const glyph = distFromHead <= 4 ? "█" : distFromHead <= 12 ? "▓" : "▒";
        const frac = body.length > 1 ? i / (body.length - 1) : 0;
        const alpha = 0.5 - frac * 0.34;
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fillText(glyph, body[i].x * cellW, body[i].y * cellH);
      }

      if (snake.cells.length) {
        ctx.fillStyle = `rgba(${BRIGHT_CYAN},0.9)`;
        ctx.fillText(HEAD_GLYPH, snake.cells[0].x * cellW, snake.cells[0].y * cellH);
      }
    };

    const initSnake = () => {
      const { cols, rows } = gridRef.current;
      snakeRef.current = spawnSnake(cols, rows);
      const food: Vec[] = [];
      for (let i = 0; i < FOOD_COUNT; i++) food.push(spawnFood(cols, rows, snakeRef.current.cells, food));
      foodRef.current = food;
      ripplesRef.current = [];
    };

    const remodSnake = () => {
      const { cols, rows } = gridRef.current;
      snakeRef.current.cells = snakeRef.current.cells.map((c) => wrapCell(c, cols, rows));
      foodRef.current = foodRef.current.map((f) => wrapCell(f, cols, rows));
    };

    if (reduce) {
      resize();
      initSnake();
      const { cols, rows } = gridRef.current;
      const { x, y } = lissajous(0, cols, rows);
      drawFrame(0, x, y, 0.55);
      const ro = new ResizeObserver(() => {
        resize();
        remodSnake();
        const g = gridRef.current;
        const src = lissajous(0, g.cols, g.rows);
        drawFrame(0, src.x, src.y, 0.55);
      });
      ro.observe(wrap);
      return () => ro.disconnect();
    }

    resize();
    initSnake();

    let time = 0;
    let last = performance.now();
    let acc = 0;
    let snakeAcc = 0;
    let sx = gridRef.current.cols / 2;
    let sy = gridRef.current.rows / 2;
    let strength = 0.55;

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      acc += dt;

      const rect = wrap.getBoundingClientRect();
      const over =
        mouse.x >= rect.left && mouse.x <= rect.right && mouse.y >= rect.top && mouse.y <= rect.bottom;

      const { cols, rows, cellW, cellH } = gridRef.current;
      const targetStrength = over ? 1 : 0.55;
      strength += (targetStrength - strength) * 2 * dt;

      let targetSx: number;
      let targetSy: number;
      if (over) {
        targetSx = (mouse.x - rect.left) / cellW;
        targetSy = (mouse.y - rect.top) / cellH;
      } else {
        const src = lissajous(time, cols, rows);
        targetSx = src.x;
        targetSy = src.y;
      }
      sx += (targetSx - sx) * 6 * dt;
      sy += (targetSy - sy) * 6 * dt;

      // Movement ticks run on their own 8/sec cadence, independent of the redraw
      // rate — accumulate dt so a stalled tab still catches up cell-by-cell.
      const target = over
        ? wrapCell({ x: Math.floor((mouse.x - rect.left) / cellW), y: Math.floor((mouse.y - rect.top) / cellH) }, cols, rows)
        : nearestFood(snakeRef.current.cells[0], foodRef.current, cols, rows);
      snakeAcc += dt;
      while (snakeAcc >= SNAKE_TICK_INTERVAL) {
        snakeAcc -= SNAKE_TICK_INTERVAL;
        stepSnake(snakeRef.current, foodRef.current, ripplesRef.current, cols, rows, target, time);
      }
      ripplesRef.current = ripplesRef.current.filter((r) => time - r.born < RIPPLE_LIFE);

      if (acc >= FRAME_INTERVAL) {
        acc = 0;
        drawFrame(time, sx, sy, strength);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      resize();
      remodSnake();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !rafRef.current) {
          last = performance.now();
          rafRef.current = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default AsciiField;
