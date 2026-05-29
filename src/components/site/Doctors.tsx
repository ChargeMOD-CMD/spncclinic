const doctors = [
  { name: "Dr. Sreejith Paul", role: "Neurologist", color: "var(--neural)", avail: "Fri – Wed · Appointment" },
  { name: "Dr. Tushar", role: "Neurologist", color: "var(--neural)", avail: "On consultation" },
  { name: "Dr. Nimmy Thomas", role: "Dermatologist · Skin & Hair", color: "var(--radiance)", avail: "Mon – Sat" },
  { name: "Dr. Vyshnav", role: "Orthopedic Surgeon", color: "var(--skin-glow)", avail: "Fri · 6 – 8 PM" },
  { name: "Dr. Shafeen Hyder", role: "Psychiatrist", color: "var(--accent)", avail: "Fri · 4 – 6 PM" },
];

function initials(name: string) {
  return name
    .replace(/Dr\.?\s*/i, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export function Doctors() {
  return (
    <section id="doctors" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Meet Our Specialists</span>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold md:text-5xl">
              Trusted hands.{" "}
              <span className="text-gradient">Modern minds.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            A senior team of consultants across neurology, dermatology, orthopedics
            and psychiatry — collaborating under one roof in Sulthan Bathery.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {doctors.map((d) => (
            <article
              key={d.name}
              className="group relative overflow-hidden rounded-3xl glass p-5 transition-all hover:-translate-y-1"
            >
              <div
                className="absolute -top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-60 blur-3xl transition-opacity group-hover:opacity-100"
                style={{ background: `color-mix(in oklab, ${d.color} 35%, transparent)` }}
                aria-hidden
              />
              <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${d.color} 18%, transparent)`, border: `1px solid color-mix(in oklab, ${d.color} 40%, transparent)` }}>
                <span className="font-display text-2xl font-bold" style={{ color: d.color }}>{initials(d.name)}</span>
                <span className="absolute inset-0 rounded-full border animate-pulse-ring" style={{ borderColor: d.color }} aria-hidden />
              </div>
              <div className="relative mt-5 text-center">
                <h3 className="font-display text-base font-semibold">{d.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{d.role}</p>
                <div className="mt-4 inline-flex rounded-full glass px-3 py-1 text-[11px] text-foreground/80">
                  {d.avail}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
