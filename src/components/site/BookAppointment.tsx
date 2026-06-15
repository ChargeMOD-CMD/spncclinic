import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { MedicalFloatersBackground } from "./MedicalFloaters";
const departments = ["Neurology", "Dermatology", "Orthopedics", "Psychiatry", "Pharmacy", "Any Specialist"];
const allDoctors = [
  "Dr. Sreejith Paul — Neurologist",
  "Dr. Tushar — Neurologist",
  "Dr. Nimmy Thomas — Dermatologist (Skin & Hair)",
  "Dr. Vyshnav — Orthopedic Surgeon",
  "Dr. Shafeen Hyder — Psychiatrist",
  "Pharmacy Desk",
];
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

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500";

export function BookAppointment() {
  const [dept, setDept] = useState(departments[1]);
  const [doctor, setDoctor] = useState(allDoctors[0]);
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
      name, phone, department: dept, doctor,
      appointment_date: date, appointment_time: time,
      notes: notes || undefined,
    });
    if (!parsed.success) {
      setStatus({ kind: "err", msg: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }
    setSubmitting(true);
    const composedNotes = `Doctor: ${parsed.data.doctor}${parsed.data.notes ? ` · ${parsed.data.notes}` : ""}`;
    const { error } = await supabase.from("appointments").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      department: parsed.data.department,
      appointment_date: parsed.data.appointment_date,
      appointment_time: parsed.data.appointment_time,
      notes: composedNotes,
    });
    setSubmitting(false);
    if (error) { setStatus({ kind: "err", msg: error.message }); return; }
    setStatus({ kind: "ok", msg: "Appointment request submitted! Our team will confirm via WhatsApp / SMS." });
    setName(""); setPhone(""); setDate(""); setTime(""); setNotes("");
  }

  return (
    <section id="book" className="relative py-20 md:py-28 bg-slate-50 overflow-hidden">
      <MedicalFloatersBackground />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_1.15fr]">

          {/* Left: info */}
          <div className="bg-blue-700 p-8 text-white md:p-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">Online Booking</span>
            <h2 className="mt-3 font-display text-3xl font-bold">Book Your Appointment</h2>
            <p className="mt-4 text-blue-100 leading-relaxed">
              Fill in your details and preferred slot. Our reception team will confirm
              your appointment via WhatsApp or SMS.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              {[
                { icon: "📍", text: "Sulthan Bathery, Wayanad, Kerala" },
                { icon: "🕐", text: "Desk hours: 10:30 AM – 5:00 PM" },
                { icon: "📞", text: "+91 89215 64251" },
                { icon: "📞", text: "+91 96565 13550" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 text-blue-100">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-blue-600 bg-blue-800 p-4 text-xs text-blue-200">
              <strong className="text-white block mb-1">Please note:</strong>
              Online bookings are requests only. Walk-ins are also welcome during clinic hours.
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="space-y-4">
              <label className="block">
                <span className={labelClass}>Your Full Name</span>
                <input required value={name} onChange={(e) => setName(e.target.value)}
                  className={inputClass} placeholder="e.g. Arun Kumar" />
              </label>

              <label className="block">
                <span className={labelClass}>Phone (WhatsApp)</span>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={inputClass} placeholder="+91 XXXXXXXXXX" />
              </label>

              <label className="block">
                <span className={labelClass}>Department</span>
                <select value={dept} onChange={(e) => setDept(e.target.value)} className={inputClass}>
                  {departments.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
              </label>

              <label className="block">
                <span className={labelClass}>Preferred Doctor</span>
                <select required value={doctor} onChange={(e) => setDoctor(e.target.value)} className={inputClass}>
                  {allDoctors.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Date</span>
                  <input required type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Time Slot</span>
                  <select required value={time} onChange={(e) => setTime(e.target.value)} className={inputClass}>
                    <option value="">Select slot</option>
                    {timeSlots.map((t) => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className={labelClass}>Notes (optional)</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                  className={inputClass} placeholder="Any symptoms or concerns for the doctor" />
              </label>

              {status && (
                <div className={`rounded-lg px-4 py-3 text-sm ${
                  status.kind === "ok"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Appointment Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
