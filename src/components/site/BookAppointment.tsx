import { useState } from "react";

const departments = ["Neurology", "Dermatology", "Orthopedics", "Psychiatry", "Pharmacy"];

export function BookAppointment() {
  const [dept, setDept] = useState(departments[1]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");

  const waText = encodeURIComponent(
    `Hi SNPC Clinic, I would like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\nDepartment: ${dept}\nPreferred time: ${time}`,
  );
  const waHref = `https://wa.me/918921564251?text=${waText}`;

  return (
    <section id="book" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-12" style={{ background: "var(--gradient-accent)" }}>
          <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full" style={{ background: "color-mix(in oklab, var(--radiance) 45%, transparent)", filter: "blur(60px)" }} aria-hidden />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="text-[var(--primary-foreground)]">
              <span className="text-xs uppercase tracking-[0.3em] opacity-80">Book Appointment</span>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Reserve your slot in seconds.</h2>
              <p className="mt-4 max-w-md text-[var(--primary-foreground)]/85">
                Pick your specialist, choose a time and we&apos;ll confirm
                instantly over WhatsApp. Our team responds 10:30 AM – 5:00 PM.
              </p>

              <div className="mt-8 space-y-3 text-sm">
                <a href="tel:+918921564251" className="block opacity-90 hover:opacity-100">📞 +91 89215 64251</a>
                <a href="tel:+919656513550" className="block opacity-90 hover:opacity-100">📞 +91 96565 13550</a>
                <div className="opacity-80">SNPC Clinic · Sulthan Bathery, Wayanad, Kerala</div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.open(waHref, "_blank", "noopener");
              }}
              className="rounded-2xl glass-strong p-6"
            >
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Your name</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="Full name"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Phone</span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="+91 ..."
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Department</span>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Preferred time</span>
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="e.g. Friday 11:00 AM"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.01]"
                >
                  Send via WhatsApp
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20 3.5A11.5 11.5 0 0 0 3.5 19.7L2 22l2.4-1.4A11.5 11.5 0 1 0 20 3.5zM12 21a8.9 8.9 0 0 1-4.6-1.3l-.3-.2-2.5.7.7-2.4-.2-.3A9 9 0 1 1 12 21zm5.2-6.7c-.3-.2-1.7-.8-2-.9s-.4-.2-.6.2-.7.9-.9 1.1-.3.2-.6 0a7.3 7.3 0 0 1-2.1-1.3 8 8 0 0 1-1.5-1.8c-.2-.3 0-.5.1-.6l.4-.5a2 2 0 0 0 .3-.5.5.5 0 0 0 0-.5l-.9-2.1c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7s1.8 2.8 4.5 3.9a4.5 4.5 0 0 0 2.7.6 3 3 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3z"/></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
