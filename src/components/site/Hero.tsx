import { MedicalFloatersBackground } from "./MedicalFloaters";

const base = import.meta.env.BASE_URL ?? "/";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* ── Full-screen SPNC Clinic background image ── */}
      <div className="absolute inset-0 -z-10">
        <img
          src={`${base}images/spnc_clinic_bg.png`}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
        {/* Dark-to-transparent gradient overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.55) 55%, rgba(15,23,42,0.25) 100%)",
          }}
        />
      </div>

      <MedicalFloatersBackground />

      {/* ── Content ── */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-2xl animate-fade-up">
          {/* Location badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Sulthan Bathery · Wayanad · Kerala
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
            SPNC Clinic
            <span className="block text-blue-300">Trusted Healthcare</span>
            <span className="block text-3xl font-normal text-white/80 md:text-4xl">
              for Wayanad & Beyond.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
            SNPC Clinic & Dr. Nimmy's Radiance Skin and Hair Clinic — bringing
            together Neurology, Dermatology, Orthopedics, Psychiatry, and Pharmacy
            under one roof in Sulthan Bathery.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500"
            >
              Book an Appointment
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="tel:+919656513550"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.68 2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 6.4a16 16 0 006.69 6.69l1.35-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.03z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Emergency: +91 96565 13550
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap gap-10 border-t border-white/15 pt-8">
            {[
              { k: "5+", v: "Medical Specialities" },
              { k: "5", v: "Senior Consultants" },
              { k: "Daily", v: "10:30 AM – 7:30 PM" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-3xl font-bold text-blue-300">{s.k}</div>
                <div className="mt-0.5 text-xs uppercase tracking-widest text-white/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <span className="hero-scroll-chevron">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </section>
  );
}
