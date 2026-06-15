import { useEffect, useRef, type ReactNode } from "react";

import { MedicalFloatersBackground } from "./MedicalFloaters";

// ─── Icon map for department cards ───────────────────────────────────────────
const DEPT_ICONS: Record<string, React.ReactNode> = {
  Neurology: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3"/><path d="M12 8v2M9 10c-2 1-3 3-3 5v1h12v-1c0-2-1-4-3-5M6 21h12"/>
    </svg>
  ),
  Dermatology: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c4 4 7 7 7 11a7 7 0 1 1-14 0c0-4 3-7 7-11z"/>
    </svg>
  ),
  Orthopedics: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M5 5l7 7 7-7M5 19l7-7 7 7"/>
    </svg>
  ),
  Psychiatry: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h6M12 9v6"/><circle cx="12" cy="12" r="9"/>
    </svg>
  ),
  Pharmacy: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7a5 5 0 0 1 10 0v10a5 5 0 0 1-10 0V7zM7 12h10"/>
    </svg>
  ),
};

const items = [
  {
    name: "Neurology",
    desc: "Comprehensive brain & nervous system care led by senior neurologists.",
    doctors: "Dr. Sreejith Paul · Dr. Tushar",
    avail: "Friday to Wednesday · Appointment only",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    name: "Dermatology",
    desc: "Skin, hair & cosmetic dermatology at Radiance Skin and Hair Clinic.",
    doctors: "Dr. Nimmy Thomas",
    avail: "Monday to Saturday",
    color: "#db2777",
    bg: "#fdf2f8",
  },
  {
    name: "Orthopedics",
    desc: "Bone, joint & musculoskeletal care with modern diagnostics.",
    doctors: "Dr. Vyshnav",
    avail: "Friday · 6:00 – 8:00 PM",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    name: "Psychiatry",
    desc: "Mental wellness, therapy & psychiatric consultation in a calm setting.",
    doctors: "Dr. Shafeen Hyder",
    avail: "Friday · 4:00 – 6:00 PM",
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    name: "Pharmacy",
    desc: "Valluvassery Medicals — full pharmacy, prescriptions & healthcare products.",
    doctors: "Valluvassery Medicals",
    avail: "Daily · 10:00 AM – 7:30 PM",
    color: "#059669",
    bg: "#ecfdf5",
  },
];

export function Departments() {
  return (
    <section id="departments" className="relative overflow-hidden py-20 md:py-28 bg-slate-50">
      <MedicalFloatersBackground />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">Our Departments</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
            Comprehensive Care Under One Roof
          </h2>
          <p className="mt-4 text-slate-500">
            From neurology to dermatology, orthopedics to psychiatry — and an in-house pharmacy —
            your complete care journey begins here.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article
              key={it.name}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Icon */}
              <div
                className="mb-4 grid h-12 w-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: it.bg, color: it.color }}
              >
                {DEPT_ICONS[it.name]}
              </div>

              <h3 className="font-display text-lg font-semibold text-slate-900">{it.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{it.desc}</p>

              <div className="mt-5 space-y-1 border-t border-slate-100 pt-4 text-xs">
                <div className="font-medium text-slate-700">{it.doctors}</div>
                <div className="text-slate-400">{it.avail}</div>
              </div>
            </article>
          ))}

          {/* CTA card */}
          <a
            href="#book"
            className="group flex flex-col justify-end rounded-2xl bg-blue-700 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-800 hover:shadow-md"
          >
            <div className="mb-2">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white">Not sure which doctor?</h3>
            <p className="mt-2 text-sm text-blue-100">
              Our reception team will route you to the right specialist.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              Book Consultation
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
