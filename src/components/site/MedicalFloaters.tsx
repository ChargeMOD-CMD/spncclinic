import { useEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

// ── Floating medical objects that follow the mouse with parallax ──
export interface FloatObj {
  x: number;   // % from left
  y: number;   // % from top
  size: number;
  speed: number;  // parallax multiplier
  opacity: number;
  rotate: number;
  color: string;
  icon: "cross" | "stethoscope" | "pill" | "heart" | "syringe" | "dna" | "shield" | "activity";
}

export const FLOAT_OBJECTS: FloatObj[] = [
  { x: 5,  y: 15, size: 60, speed: 0.08, opacity: 0.25, rotate: 15,  color: "#2563eb", icon: "stethoscope" },
  { x: 90, y: 10, size: 48, speed: 0.12, opacity: 0.20, rotate: -20, color: "#db2777", icon: "heart"        },
  { x: 3,  y: 75, size: 64, speed: 0.10, opacity: 0.22, rotate: 30,  color: "#0891b2", icon: "dna"          },
  { x: 95, y: 65, size: 52, speed: 0.15, opacity: 0.25, rotate: -10, color: "#059669", icon: "pill"         },
  { x: 45, y: 2,  size: 40, speed: 0.07, opacity: 0.15, rotate: 5,   color: "#d97706", icon: "cross"        },
  { x: 15, y: 92, size: 56, speed: 0.11, opacity: 0.20, rotate: -25, color: "#2563eb", icon: "syringe"      },
  { x: 80, y: 88, size: 44, speed: 0.09, opacity: 0.18, rotate: 20,  color: "#0891b2", icon: "shield"       },
  { x: 65, y: 8,  size: 50, speed: 0.14, opacity: 0.22, rotate: -15, color: "#7c3aed", icon: "activity"     },
  { x: 10, y: 45, size: 36, speed: 0.16, opacity: 0.18, rotate: 45,  color: "#059669", icon: "cross"        },
  { x: 85, y: 40, size: 42, speed: 0.13, opacity: 0.20, rotate: -30, color: "#db2777", icon: "heart"        },
];

const ICONS: Record<FloatObj["icon"], ReactNode> = {
  stethoscope: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
      <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2v6H5v4h6v6h4v-6h6V8h-6V2z"/>
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  pill: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7z"/>
      <path d="M8.5 8.5 15.5 15.5"/>
    </svg>
  ),
  syringe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 2 4 4-10 10H8v-4L18 2z"/>
      <path d="m8 12-5 5M2 22l5-5M12 8l-4 4"/>
    </svg>
  ),
  dna: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6"/>
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>
      <path d="M13 2c-1.798 1.998-2.518 3.995-2.807 5.993"/>
      <path d="m2 9 4-4 5.5 5.5-4 4z"/>
      <path d="m14 2 4 4-5.5 5.5-4-4z"/>
      <path d="M2 15l4 4 5.5-5.5-4-4z"/>
      <path d="m14 22 4-4-5.5-5.5-4 4z"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

function MedicalFloater({ obj }: { obj: FloatObj }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      const maxDist = 60;
      target.current.x = nx * maxDist * (obj.speed * 10);
      target.current.y = ny * maxDist * (obj.speed * 10);
    }

    function animate() {
      pos.current.x += (target.current.x - pos.current.x) * 0.08;
      pos.current.y += (target.current.y - pos.current.y) * 0.08;
      if (ref.current) {
        ref.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${obj.rotate}deg)`;
      }
      raf.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [obj.speed, obj.rotate]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute"
      style={{
        left: `${obj.x}%`,
        top: `${obj.y}%`,
        width: obj.size,
        height: obj.size,
        color: obj.color,
        opacity: obj.opacity,
        transform: `rotate(${obj.rotate}deg)`,
        transition: "opacity 0.3s",
      }}
      aria-hidden
    >
      {ICONS[obj.icon]}
    </div>
  );
}

export function MedicalFloatersBackground() {
  const router = useRouterState();
  if (router.location.pathname === "/") return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {FLOAT_OBJECTS.map((obj, i) => (
        <MedicalFloater key={i} obj={obj} />
      ))}
    </div>
  );
}
