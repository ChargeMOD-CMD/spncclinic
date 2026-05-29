import heroImg from "@/assets/hero-radiance.jpg";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      {/* Floating molecules */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full animate-float-y"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 90}%`,
              width: `${4 + (i % 4) * 3}px`,
              height: `${4 + (i % 4) * 3}px`,
              background:
                i % 3 === 0
                  ? "var(--radiance)"
                  : i % 3 === 1
                    ? "var(--accent)"
                    : "var(--skin-glow)",
              opacity: 0.45,
              filter: "blur(1px)",
              animationDelay: `${(i % 6) * 0.7}s`,
              boxShadow: "0 0 14px currentColor",
              color: "var(--accent)",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            Sulthan Bathery · Wayanad · Kerala
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Advanced healthcare,{" "}
            <span className="text-gradient">radiant living.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            SNPC Clinic &amp; Dr. Nimmy&apos;s Radiance Skin and Hair Clinic — a
            multi-speciality healthcare ecosystem uniting Neurology, Dermatology,
            Orthopedics, Psychiatry, and Pharmacy under one premium roof.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--neural)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-glow transition-transform hover:scale-[1.03]"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              Book Appointment
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="tel:+919656513550"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:text-radiance"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--radiance)" }} />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: "var(--radiance)" }} />
              </span>
              Emergency · +91 96565 13550
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            {[
              { k: "5+", v: "Specialities" },
              { k: "5", v: "Senior Consultants" },
              { k: "10:30–7:30", v: "Daily Care" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl font-bold text-gradient md:text-3xl">{s.k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-[var(--accent)]/30 via-[var(--radiance)]/20 to-[var(--skin-glow)]/20 blur-3xl" aria-hidden />
          <div className="relative">
            <div className="absolute inset-0 -z-10 animate-spin-slow">
              <div className="absolute inset-0 rounded-full border border-[var(--accent)]/20" />
              <div className="absolute inset-6 rounded-full border border-[var(--radiance)]/15" />
              <div className="absolute inset-12 rounded-full border border-[var(--skin-glow)]/15" />
            </div>
            <img
              src={heroImg}
              alt="Glowing neural network sphere merged with radiant skin halo and a futuristic medical cross"
              width={1600}
              height={1200}
              className="relative w-full rounded-3xl object-cover shadow-elevated"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            />

            {/* Floating cards */}
            <div className="absolute -left-4 top-10 hidden animate-float-y glass rounded-2xl px-4 py-3 md:flex md:items-center md:gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--accent)]/20 grid place-items-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M3 12h3l2-7 4 14 2-7h7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="text-xs">
                <div className="font-semibold">Live Vitals</div>
                <div className="text-muted-foreground">Neural pulse · 72 bpm</div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-10 hidden animate-float-y glass rounded-2xl px-4 py-3 md:flex md:items-center md:gap-3" style={{ animationDelay: "1.4s" }}>
              <div className="h-8 w-8 rounded-full grid place-items-center" style={{ background: "color-mix(in oklab, var(--radiance) 25%, transparent)" }}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="var(--radiance)" strokeWidth="2"><path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" strokeLinejoin="round"/></svg>
              </div>
              <div className="text-xs">
                <div className="font-semibold">Radiance Scan</div>
                <div className="text-muted-foreground">Skin glow · 94%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
