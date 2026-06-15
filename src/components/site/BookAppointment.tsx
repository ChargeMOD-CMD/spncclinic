import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const departments = ["Neurology", "Dermatology", "Orthopedics", "Psychiatry", "Pharmacy"];
const doctorsByDept: Record<string, string[]> = {
  Neurology: ["Dr. Sreejith Paul", "Dr. Tushar"],
  Dermatology: ["Dr. Nimmy Thomas"],
  Orthopedics: ["Dr. Vyshnav"],
  Psychiatry: ["Dr. Shafeen Hyder"],
  Pharmacy: ["Pharmacy Desk"],
};
const timeSlots = [
  "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(30).regex(/^[+\d\s()-]+$/, "Invalid phone"),
  department: z.enum(departments as [string, ...string[]]),
  doctor: z.string().trim().min(2, "Pick a doctor"),
  appointment_date: z.string().min(1, "Pick a date"),
  appointment_time: z.string().min(1, "Pick a time slot"),
  notes: z.string().max(500).optional(),
});

const today = new Date().toISOString().split("T")[0];

export function BookAppointment() {
  const [dept, setDept] = useState(departments[1]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const parsed = schema.safeParse({
      name, phone, department: dept,
      appointment_date: date, appointment_time: time,
      notes: notes || undefined,
    });
    if (!parsed.success) {
      setStatus({ kind: "err", msg: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      department: parsed.data.department,
      appointment_date: parsed.data.appointment_date,
      appointment_time: parsed.data.appointment_time,
      notes: parsed.data.notes ?? null,
    });
    setSubmitting(false);
    if (error) {
      setStatus({ kind: "err", msg: error.message });
      return;
    }
    setStatus({
      kind: "ok",
      msg: "Request submitted! Our team will confirm shortly via WhatsApp / SMS.",
    });
    setName(""); setPhone(""); setDate(""); setTime(""); setNotes("");
  }

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
                Pick your specialist, date and time slot. Your request is sent to
                our front desk who will confirm via WhatsApp / SMS. Desk hours:
                10:30 AM – 5:00 PM.
              </p>

              <div className="mt-8 space-y-3 text-sm">
                <a href="tel:+918921564251" className="block opacity-90 hover:opacity-100">📞 +91 89215 64251</a>
                <a href="tel:+919656513550" className="block opacity-90 hover:opacity-100">📞 +91 96565 13550</a>
                <div className="opacity-80">SNPC Clinic · Sulthan Bathery, Wayanad, Kerala</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl glass-strong p-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Your name</span>
                  <input required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="Full name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Phone (WhatsApp)</span>
                  <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="+91 ..." />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Department</span>
                  <select value={dept} onChange={(e) => setDept(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]">
                    {departments.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Date</span>
                    <input required type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Time slot</span>
                    <select required value={time} onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]">
                      <option value="">Select slot</option>
                      {timeSlots.map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Notes (optional)</span>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                    className="w-full rounded-xl border border-[var(--input)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="Any concern you'd like the doctor to know" />
                </label>

                {status && (
                  <div className={`rounded-lg px-3 py-2 text-xs ${status.kind === "ok" ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"}`}>
                    {status.msg}
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.01] disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit booking request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
