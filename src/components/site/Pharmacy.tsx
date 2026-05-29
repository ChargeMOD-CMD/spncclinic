export function Pharmacy() {
  return (
    <section id="pharmacy" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent">In-house Pharmacy</span>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Valluvassery <span className="text-gradient">Medicals</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              A full-service pharmacy attached to the clinic. Pick up prescriptions,
              check medicine availability, and find everyday healthcare products —
              open every day.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl glass px-4 py-3 text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--accent)" }} />
              Open Daily · 10:00 AM – 7:30 PM
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { t: "Medicine Availability", d: "Check stock before you visit." },
              { t: "Prescription Support", d: "Refills and digital prescriptions." },
              { t: "Healthcare Products", d: "Wellness, skincare and daily essentials." },
            ].map((c) => (
              <div key={c.t} className="rounded-3xl glass p-5">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl" style={{ background: "color-mix(in oklab, var(--accent) 18%, transparent)", border: "1px solid color-mix(in oklab, var(--accent) 35%, transparent)" }}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M8 3h8l-1 4H9L8 3zM7 7h10l-1 14H8L7 7zM10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="font-display text-base font-semibold">{c.t}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
