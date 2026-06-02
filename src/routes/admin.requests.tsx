import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequests,
});

const DEPARTMENTS = ["Neurology", "Dermatology", "Orthopedics", "Psychiatry", "Pharmacy"];
const TIME_SLOTS = [
  "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];
const TODAY = new Date().toISOString().split("T")[0];

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(30).regex(/^[+\d\s()-]+$/, "Invalid phone"),
  department: z.enum(DEPARTMENTS as [string, ...string[]]),
  appointment_date: z.string().min(1, "Pick a date"),
  appointment_time: z.string().min(1, "Pick a time slot"),
  notes: z.string().max(500).optional(),
  status: z.enum(["pending", "approved", "declined", "completed"]),
});

type Status = "pending" | "approved" | "declined" | "completed";

type Appointment = {
  id: string;
  name: string;
  phone: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
};

const STATUSES: Status[] = ["pending", "approved", "declined", "completed"];

function digitsOnly(p: string) {
  const d = p.replace(/[^\d]/g, "");
  return d.startsWith("91") ? d : d.length === 10 ? "91" + d : d;
}

function buildMessage(a: Appointment, action: Status) {
  const date = new Date(a.appointment_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  switch (action) {
    case "approved":
      return `Hi ${a.name}, your appointment at SNPC Clinic for ${a.department} on ${date} at ${a.appointment_time} is CONFIRMED ✅. Please arrive 10 minutes early. — SNPC Clinic`;
    case "declined":
      return `Hi ${a.name}, unfortunately your appointment request for ${a.department} on ${date} at ${a.appointment_time} could not be confirmed. Please call +91 89215 64251 to reschedule. — SNPC Clinic`;
    case "completed":
      return `Hi ${a.name}, thank you for visiting SNPC Clinic today. Your ${a.department} consult is marked complete. Wishing you a speedy recovery. — SNPC Clinic`;
    default:
      return `Hi ${a.name}, your appointment request for ${a.department} on ${date} at ${a.appointment_time} is being reviewed. — SNPC Clinic`;
  }
}

function AdminRequests() {
  const [items, setItems] = useState<Appointment[] | null>(null);
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { setErr(error.message); return; }
    setItems((data ?? []) as Appointment[]);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("appointments-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) setErr(error.message);
  }

  const filtered = items?.filter((a) => filter === "all" || a.status === filter) ?? [];

  const [showCreate, setShowCreate] = useState(false);
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cDept, setCDept] = useState(DEPARTMENTS[0]);
  const [cDate, setCDate] = useState("");
  const [cTime, setCTime] = useState("");
  const [cNotes, setCNotes] = useState("");
  const [cStatus, setCStatus] = useState<Status>("approved");
  const [creating, setCreating] = useState(false);

  function resetCreate() {
    setCName(""); setCPhone(""); setCDept(DEPARTMENTS[0]);
    setCDate(""); setCTime(""); setCNotes(""); setCStatus("approved");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const parsed = createSchema.safeParse({
      name: cName, phone: cPhone, department: cDept,
      appointment_date: cDate, appointment_time: cTime,
      notes: cNotes || undefined, status: cStatus,
    });
    if (!parsed.success) { setErr(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setCreating(true);
    // Insert as pending (allowed by RLS), then update to chosen status if different.
    const { data, error } = await supabase.from("appointments").insert({
      name: parsed.data.name, phone: parsed.data.phone, department: parsed.data.department,
      appointment_date: parsed.data.appointment_date, appointment_time: parsed.data.appointment_time,
      notes: parsed.data.notes ?? null,
    }).select("id").single();
    if (error) { setCreating(false); setErr(error.message); return; }
    if (parsed.data.status !== "pending" && data?.id) {
      const { error: upErr } = await supabase.from("appointments")
        .update({ status: parsed.data.status }).eq("id", data.id);
      if (upErr) { setCreating(false); setErr(upErr.message); return; }
    }
    setCreating(false);
    resetCreate();
    setShowCreate(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Booking Requests</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(["all", ...STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1.5 capitalize ${filter === s ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-accent"}`}>
              {s}
            </button>
          ))}
          <button onClick={() => setShowCreate((v) => !v)}
            className="ml-2 rounded-full border border-foreground bg-foreground px-3 py-1.5 font-medium text-background hover:opacity-90">
            {showCreate ? "Close" : "+ New booking"}
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Name</span>
            <input required value={cName} onChange={(e) => setCName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Full name" />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Phone</span>
            <input required type="tel" value={cPhone} onChange={(e) => setCPhone(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="+91 ..." />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Department</span>
            <select value={cDept} onChange={(e) => setCDept(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Date</span>
            <input required type="date" min={TODAY} value={cDate} onChange={(e) => setCDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Time slot</span>
            <select required value={cTime} onChange={(e) => setCTime(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select slot</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Status</span>
            <select value={cStatus} onChange={(e) => setCStatus(e.target.value as Status)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize">
              {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </label>
          <label className="block text-xs sm:col-span-2 lg:col-span-3">
            <span className="mb-1 block text-muted-foreground">Notes (optional)</span>
            <textarea value={cNotes} onChange={(e) => setCNotes(e.target.value)} rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </label>
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
            <button type="button" onClick={() => { resetCreate(); setShowCreate(false); }}
              className="rounded-md border border-border px-4 py-2 text-xs hover:bg-accent">Cancel</button>
            <button type="submit" disabled={creating}
              className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-60">
              {creating ? "Creating…" : "Create booking"}
            </button>
          </div>
        </form>
      )}

      {err && <div className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-500">{err}</div>}

      <div className="mt-6 grid gap-4">
        {items === null && <div className="text-sm text-muted-foreground">Loading…</div>}
        {items && filtered.length === 0 && <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No {filter === "all" ? "" : filter} requests.</div>}
        {filtered.map((a) => {
          const phone = digitsOnly(a.phone);
          const dateLabel = new Date(a.appointment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
          return (
            <article key={a.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{a.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                      a.status === "approved" ? "bg-emerald-500/15 text-emerald-500" :
                      a.status === "declined" ? "bg-red-500/15 text-red-500" :
                      a.status === "completed" ? "bg-sky-500/15 text-sky-500" :
                      "bg-amber-500/15 text-amber-600"
                    }`}>{a.status}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {a.department} · {dateLabel} · {a.appointment_time}
                  </div>
                  <div className="mt-1 text-sm">📞 <a className="underline-offset-4 hover:underline" href={`tel:+${phone}`}>{a.phone}</a></div>
                  {a.notes && <p className="mt-2 text-sm text-muted-foreground">📝 {a.notes}</p>}
                </div>
                <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("en-IN")}</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(["pending", "approved", "declined", "completed"] as Status[]).map((s) => (
                  <button key={s} onClick={() => updateStatus(a.id, s)}
                    className={`rounded-md border px-3 py-1.5 text-xs capitalize ${a.status === s ? "border-foreground bg-foreground text-background" : "border-border hover:bg-accent"}`}>
                    Mark {s}
                  </button>
                ))}
                <div className="ml-auto flex flex-wrap gap-2">
                  <a target="_blank" rel="noopener"
                    href={`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage(a, a.status === "pending" ? "approved" : a.status))}`}
                    className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600">
                    WhatsApp
                  </a>
                  <a href={`sms:+${phone}?body=${encodeURIComponent(buildMessage(a, a.status === "pending" ? "approved" : a.status))}`}
                    className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600">
                    SMS
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
