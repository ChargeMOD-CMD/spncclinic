import { MedicalFloatersBackground } from "./MedicalFloaters";

export function Pharmacy() {
  return (
    <section id="pharmacy" className="relative py-20 md:py-28 bg-emerald-50 overflow-hidden">
      <MedicalFloatersBackground />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          {/* Text */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">In-house Pharmacy</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
              Valluvassery Medicals
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              A full-service pharmacy attached to the clinic. Pick up prescriptions,
              check medicine availability, and find everyday healthcare products —
              open every day.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-700">Open Daily · 10:00 AM – 7:30 PM</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                t: "Medicine Availability",
                d: "Check stock before you visit.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                ),
              },
              {
                t: "Prescription Support",
                d: "Refills and digital prescriptions.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                ),
              },
              {
                t: "Healthcare Products",
                d: "Wellness, skincare and daily essentials.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/>
                  </svg>
                ),
              },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  {c.icon}
                </div>
                <h3 className="font-display text-base font-semibold text-slate-900">{c.t}</h3>
                <p className="mt-1 text-xs text-slate-500">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
