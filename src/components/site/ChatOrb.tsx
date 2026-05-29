import { useState } from "react";

export function ChatOrb() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open SNPC AI Health Assistant"
        className="fixed bottom-6 right-6 z-40 grid h-16 w-16 place-items-center rounded-full text-[var(--primary-foreground)] shadow-glow animate-heartbeat"
        style={{ background: "var(--gradient-accent)" }}
      >
        <span className="absolute inset-0 rounded-full border border-[var(--accent)]/40 animate-pulse-ring" aria-hidden />
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3a4 4 0 0 1 4 4v1a4 4 0 0 1 2 7 4 4 0 0 1-3 4 4 4 0 0 1-6 0 4 4 0 0 1-3-4 4 4 0 0 1 2-7V7a4 4 0 0 1 4-4z" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-28 right-6 z-40 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl glass-strong animate-fade-up">
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--gradient-accent)" }}>
              <span className="h-2 w-2 rounded-full bg-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">SNPC AI Health Assistant</div>
              <div className="text-[11px] text-accent">Online · Heartbeat pulse</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Close">✕</button>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <div className="rounded-2xl glass p-3">
              👋 Hi! I&apos;m SNPC AI. I can help you book an appointment, find
              the right specialist, or guide you on skin &amp; hair concerns.
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["Book appointment", "Find a doctor", "Skin concern", "Hair concern"].map((q) => (
                <a key={q} href="#book" className="rounded-xl glass px-3 py-2 text-center hover:text-accent">
                  {q}
                </a>
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Demo preview · Connect Lovable Cloud to enable live AI replies.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
