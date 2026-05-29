const items = [
  {
    name: "Neurology",
    desc: "Comprehensive brain & nervous system care led by senior neurologists.",
    doctors: "Dr. Sreejith Paul · Dr. Tushar",
    avail: "Friday to Wednesday · Appointment only",
    icon: (
      <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.5A3 3 0 0 0 7 18a3 3 0 0 0 5 1 3 3 0 0 0 5-1 3 3 0 0 0 3-4.5A3 3 0 0 0 18 8V7a3 3 0 0 0-6-1 3 3 0 0 0-3-2z" />
    ),
    color: "var(--neural)",
  },
  {
    name: "Dermatology",
    desc: "Skin, hair & cosmetic dermatology at Radiance Skin and Hair Clinic.",
    doctors: "Dr. Nimmy Thomas",
    avail: "Monday to Saturday",
    icon: <path d="M12 3c4 4 7 7 7 11a7 7 0 1 1-14 0c0-4 3-7 7-11z" />,
    color: "var(--radiance)",
  },
  {
    name: "Orthopedics",
    desc: "Bone, joint & musculoskeletal care with modern diagnostics.",
    doctors: "Dr. Vyshnav",
    avail: "Friday · 6:00 – 8:00 PM",
    icon: <path d="M6 3l4 4-2 2 4 4 2-2 4 4-3 3-4-4 2-2-4-4-2 2-4-4 3-3z" />,
    color: "var(--skin-glow)",
  },
  {
    name: "Psychiatry",
    desc: "Mental wellness, therapy & psychiatric consultation in a calm setting.",
    doctors: "Dr. Shafeen Hyder",
    avail: "Friday · 4:00 – 6:00 PM",
    icon: <path d="M12 3a5 5 0 0 0-5 5v2a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3v3h10v-3a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3V8a5 5 0 0 0-5-5z" />,
    color: "var(--accent)",
  },
  {
    name: "Pharmacy",
    desc: "Valluvassery Medicals — full pharmacy, prescriptions & healthcare products.",
    doctors: "Valluvassery Medicals",
    avail: "Daily · 10:00 AM – 7:30 PM",
    icon: <path d="M7 7a5 5 0 0 1 10 0v10a5 5 0 0 1-10 0V7zM7 12h10" />,
    color: "var(--neural)",
  },
];

export function Departments() {
  return (
    <section id="departments" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Speciality Departments</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            One ecosystem.{" "}
            <span className="text-gradient">Every speciality.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From neurology to dermatology, orthopedics to psychiatry — and an
            in-house pharmacy — your full care journey lives here.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article
              key={it.name}
              className="group relative overflow-hidden rounded-3xl glass p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle, ${it.color} 0%, transparent 60%)`,
                  filter: "blur(20px)",
                }}
                aria-hidden
              />
              <div
                className="relative grid h-12 w-12 place-items-center rounded-2xl"
                style={{
                  background: `color-mix(in oklab, ${it.color} 18%, transparent)`,
                  border: `1px solid color-mix(in oklab, ${it.color} 35%, transparent)`,
                }}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={it.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {it.icon}
                </svg>
              </div>
              <h3 className="relative mt-5 font-display text-xl font-semibold">{it.name}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{it.desc}</p>
              <div className="relative mt-5 space-y-1 border-t border-border pt-4 text-xs">
                <div className="text-foreground/90">{it.doctors}</div>
                <div className="text-muted-foreground">{it.avail}</div>
              </div>
            </article>
          ))}

          {/* Final CTA card */}
          <a
            href="#book"
            className="group relative flex items-end overflow-hidden rounded-3xl p-6"
            style={{ background: "var(--gradient-accent)" }}
          >
            <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
            <div className="relative">
              <h3 className="font-display text-2xl font-bold text-[var(--primary-foreground)]">
                Not sure which doctor?
              </h3>
              <p className="mt-2 max-w-xs text-sm text-[var(--primary-foreground)]/85">
                Our AI Health Assistant will route you to the right specialist.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-foreground)]">
                Ask SNPC AI
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
