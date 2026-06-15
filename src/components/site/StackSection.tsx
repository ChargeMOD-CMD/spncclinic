import { useEffect, useRef, type ReactNode } from "react";

interface StackSectionProps {
  children: ReactNode;
  /** Background colour class, e.g. "bg-white" or "bg-slate-50" */
  bg?: string;
  zIndex?: number;
}

/**
 * StackSection
 * ─────────────────────────────────────────────────────────
 * Each section is sticky at top:0 so that when the NEXT
 * section scrolls in it literally slides up over this one —
 * giving the premium "stacking card" page-turn effect.
 *
 * As a bonus, when the section is being pushed behind the
 * next one, we gently scale it down and fade it, adding
 * depth.
 */
export function StackSection({ children, bg = "bg-white", zIndex = 10 }: StackSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // How far the bottom of this section has scrolled past the top of the viewport
      const overlap = -rect.top; // positive when we've scrolled past the top
      if (overlap <= 0) {
        el.style.transform = "";
        el.style.borderRadius = "";
        return;
      }
      const sectionH = el.offsetHeight;
      // Progress 0→1 as we scroll through the full height
      const progress = Math.min(overlap / sectionH, 1);
      // Scale from 1 down to 0.92
      const scale = 1 - progress * 0.06;
      // Border radius grows as it shrinks
      const radius = progress * 20;
      el.style.transform = `scale(${scale})`;
      el.style.borderRadius = `${radius}px`;
      el.style.transformOrigin = "top center";
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`sticky top-0 w-full overflow-hidden transition-[border-radius] duration-100 ${bg}`}
      style={{ zIndex, willChange: "transform" }}
    >
      {children}
    </div>
  );
}
