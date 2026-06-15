import { MedicalFloatersBackground } from "./MedicalFloaters";

const features = [
  { title: "Personalised Skin Care", desc: "Assessment and recommendations tailored to your skin type and concerns." },
  { title: "Health Guidance", desc: "Clear guidance on symptoms and the right specialist for your needs." },
  { title: "Department Finder", desc: "Quickly find the right department and available consultant." },
  { title: "Appointment Help", desc: "Choose the best date, time and doctor for your visit." },
];

export function AIAssessment() {
  return (
    <section id="ai" className="relative py-20 md:py-28 bg-white overflow-hidden">
      <MedicalFloatersBackground />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-14">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">Patient Services</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
                Your Complete Patient Support Portal
              </h2>
              <p className="mt-5 text-slate-600 leading-relaxed">
                Our dedicated support team is here to help you navigate your care journey.
                Whether you need guidance on symptoms, skin concerns, doctor availability
                or medicines — we're just a call or visit away.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f.title}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl border border-blue-100 bg-blue-700 p-8 text-white">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600">
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.96a16 16 0 006.69 6.69l1.35-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold">Speak With Our Team</h3>
              <p className="mt-3 text-blue-100">
                Our reception team is available during clinic hours to answer your questions
                and help you book the right consultation.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href="tel:+918921564251"
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.96a16 16 0 006.69 6.69l1.35-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  +91 89215 64251
                </a>
                <a
                  href="#book"
                  className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Book an Appointment Online
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
