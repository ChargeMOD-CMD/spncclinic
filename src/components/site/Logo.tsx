export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent)] via-[var(--neural)] to-[var(--radiance)] opacity-90 blur-[2px]" />
        <div className="absolute inset-[3px] rounded-full bg-[var(--background)] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 4v16M4 12h16" style={{ stroke: "var(--accent)" }} />
          </svg>
        </div>
        <div className="absolute -inset-1 rounded-full border border-[var(--radiance)]/30 animate-pulse-ring" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-sm font-bold tracking-tight">SNPC Clinic</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-radiance">Radiance</div>
      </div>
    </div>
  );
}
