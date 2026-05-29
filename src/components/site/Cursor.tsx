import { useEffect, useRef, useState } from "react";

/**
 * Floating Healthcare Orb cursor with magnetic attraction + healing particle trail.
 * Disabled on touch / coarse-pointer devices via CSS media query check.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const canvas = trailRef.current!;
    const ctx = canvas.getContext("2d")!;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    type P = { x: number; y: number; life: number; hue: number; size: number };
    const particles: P[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      // particle emission
      if (particles.length < 80) {
        particles.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          life: 1,
          hue: Math.random() < 0.5 ? 180 : 330,
          size: Math.random() * 2 + 1,
        });
      }

      const t = e.target as HTMLElement | null;
      const interactive = t?.closest("a,button,[role='button'],input,textarea,select,[data-cursor]");
      setHovering(!!interactive);
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.025;
        p.y -= 0.4;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.life * 0.7})`;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, ${p.life})`;
        ctx.shadowBlur = 12;
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <canvas
        ref={trailRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden
      />
      <div
        ref={ringRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border transition-[width,height,border-color,background] duration-200 ${
          hovering
            ? "border-radiance bg-radiance/10 shadow-radiance"
            : "border-accent bg-accent/5 shadow-glow"
        }`}
        style={{ borderColor: hovering ? "var(--radiance)" : "var(--accent)" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full"
        style={{
          background: hovering ? "var(--radiance)" : "var(--accent)",
          boxShadow: `0 0 12px ${hovering ? "var(--radiance)" : "var(--accent)"}`,
        }}
      />
    </>
  );
}
