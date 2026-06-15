import { MedicalFloatersBackground } from "./MedicalFloaters";

const doctors = [
  { name: "Dr. Sreejith Paul", role: "Neurologist", avail: "Fri – Wed · By Appointment", initials: "SP", bg: "#eff6ff", color: "#2563eb" },
  { name: "Dr. Tushar", role: "Neurologist", avail: "On Consultation", initials: "T", bg: "#eff6ff", color: "#2563eb" },
  { name: "Dr. Nimmy Thomas", role: "Dermatologist · Skin & Hair", avail: "Mon – Sat", initials: "NT", bg: "#fdf2f8", color: "#db2777" },
  { name: "Dr. Vyshnav", role: "Orthopedic Surgeon", avail: "Fri · 6:00 – 8:00 PM", initials: "V", bg: "#fffbeb", color: "#d97706" },
  { name: "Dr. Shafeen Hyder", role: "Psychiatrist", avail: "Fri · 4:00 – 6:00 PM", initials: "SH", bg: "#ecfeff", color: "#0891b2" },
];

export function Doctors() {
  return (
    <section id="doctors" className="relative py-20 md:py-28 bg-white overflow-hidden">
      <MedicalFloatersBackground />
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">Our Specialists</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
              Meet Our Consulting Doctors
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-500">
            A senior team of consultants across neurology, dermatology, orthopedics
            and psychiatry — all under one roof in Sulthan Bathery.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {doctors.map((d) => (
            <article
              key={d.name}
              className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Avatar */}
              <div
                className="grid h-20 w-20 place-items-center rounded-full text-2xl font-bold font-display"
                style={{ background: d.bg, color: d.color }}
              >
                {d.initials}
              </div>

              <h3 className="mt-4 font-display text-base font-semibold text-slate-900">{d.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{d.role}</p>

              <div
                className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: d.bg, color: d.color }}
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {d.avail}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
