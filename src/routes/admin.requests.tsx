import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { deleteAppointment } from "@/lib/admin.functions";
import { useAdminContext } from "@/lib/admin.context";
import { z } from "zod";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequests,
});

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPARTMENTS = ["Neurology", "Dermatology", "Orthopedics", "Psychiatry", "Pharmacy"];
const TIME_SLOTS = [
  "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];
const TODAY = new Date().toISOString().split("T")[0];

// ─── Schemas / Types ─────────────────────────────────────────────────────────

const bookingSchema = z.object({
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function digitsOnly(p: string) {
  // Strip everything except digits
  let d = p.replace(/[^\d]/g, "");
  // Remove a leading 0 (e.g. 09876543210 → 9876543210)
  if (d.startsWith("0")) d = d.slice(1);
  // If it already starts with country code 91, keep it; else prepend for 10-digit numbers
  return d.startsWith("91") ? d : d.length === 10 ? "91" + d : d;
}

function buildMessage(a: Appointment, action: Status) {
  const date = new Date(a.appointment_date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
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

const STATUS_STYLE: Record<Status, string> = {
  approved:  "bg-emerald-500/15 text-emerald-500",
  declined:  "bg-red-500/15 text-red-500",
  completed: "bg-sky-500/15 text-sky-500",
  pending:   "bg-amber-500/15 text-amber-600",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Inline edit modal panel */
function EditPanel({
  apt,
  onSave,
  onClose,
}: {
  apt: Appointment;
  onSave: (updated: Partial<Appointment>) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(apt.name);
  const [phone, setPhone] = useState(apt.phone);
  const [dept, setDept] = useState(apt.department);
  const [date, setDate] = useState(apt.appointment_date);
  const [time, setTime] = useState(apt.appointment_time);
  const [notes, setNotes] = useState(apt.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLocalErr(null);
    const parsed = bookingSchema.safeParse({
      name, phone, department: dept,
      appointment_date: date, appointment_time: time,
      notes: notes || undefined,
      status: apt.status,
    });
    if (!parsed.success) { setLocalErr(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setSaving(true);
    await onSave({ name, phone, department: dept, appointment_date: date, appointment_time: time, notes: notes || null });
    setSaving(false);
    onClose();
  }

  const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30";
  return (
    <form
      onSubmit={handleSave}
      className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <label className="block text-xs">
        <span className="mb-1 block text-muted-foreground">Name</span>
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Full name" />
      </label>
      <label className="block text-xs">
        <span className="mb-1 block text-muted-foreground">Phone</span>
        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+91 ..." />
      </label>
      <label className="block text-xs">
        <span className="mb-1 block text-muted-foreground">Department</span>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className={inputCls}>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </label>
      <label className="block text-xs">
        <span className="mb-1 block text-muted-foreground">Date</span>
        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
      </label>
      <label className="block text-xs">
        <span className="mb-1 block text-muted-foreground">Time slot</span>
        <select required value={time} onChange={(e) => setTime(e.target.value)} className={inputCls}>
          <option value="">Select slot</option>
          {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label className="block text-xs sm:col-span-2 lg:col-span-1">
        <span className="mb-1 block text-muted-foreground">Notes</span>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} placeholder="Optional notes" />
      </label>
      {localErr && (
        <div className="sm:col-span-2 lg:col-span-3 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-500">{localErr}</div>
      )}
      <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-xs hover:bg-accent">Cancel</button>
        <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

/** Delete confirmation inline */
function DeleteConfirm({ onConfirm, onCancel, busy }: { onConfirm: () => void; onCancel: () => void; busy: boolean }) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
      <span className="flex-1 text-xs text-red-400">Are you sure? This cannot be undone.</span>
      <button onClick={onCancel} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">Cancel</button>
      <button onClick={onConfirm} disabled={busy} className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60">
        {busy ? "Deleting…" : "Yes, delete"}
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function AdminRequests() {
  const { permissions } = useAdminContext();

  const [items, setItems] = useState<Appointment[] | null>(null);
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [err, setErr] = useState<string | null>(null);

  // Per-card UI state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Create panel state
  const [showCreate, setShowCreate] = useState(false);
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cDept, setCDept] = useState(DEPARTMENTS[0]);
  const [cDate, setCDate] = useState("");
  const [cTime, setCTime] = useState("");
  const [cNotes, setCNotes] = useState("");
  const [cStatus, setCStatus] = useState<Status>("approved");
  const [creating, setCreating] = useState(false);

  // ── Data loading ──────────────────────────────────────────────────────────

  // Wrapped in useCallback so the realtime subscription callback always calls
  // the latest version and never holds a stale closure over state setters.
  const load = useCallback(async () => {
    setErr(null);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Requests] Supabase error:", error);
        setErr(`${error.message} (code: ${error.code})`);
        setItems([]);
        return;
      }
      setItems((data ?? []) as Appointment[]);
    } catch (e: any) {
      console.error("[Requests] fetch threw:", e);
      setErr(e.message ?? "An unexpected error occurred while loading appointments.");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("appointments-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  // ── Actions ───────────────────────────────────────────────────────────────

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) setErr(error.message);
  }

  async function updateDetails(id: string, updates: Partial<Appointment>) {
    const { error } = await supabase.from("appointments").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
  }

  async function handleDelete(id: string) {
    setDeleteBusy(true);
    setErr(null);
    try {
      await deleteAppointment({ data: { id } });
      setDeletingId(null);
      load();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setDeleteBusy(false);
    }
  }

  // ── Create booking ────────────────────────────────────────────────────────

  function resetCreate() {
    setCName(""); setCPhone(""); setCDept(DEPARTMENTS[0]);
    setCDate(""); setCTime(""); setCNotes(""); setCStatus("approved");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const parsed = bookingSchema.safeParse({
      name: cName, phone: cPhone, department: cDept,
      appointment_date: cDate, appointment_time: cTime,
      notes: cNotes || undefined, status: cStatus,
    });
    if (!parsed.success) { setErr(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setCreating(true);
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

  // ── Derived ───────────────────────────────────────────────────────────────

  const filtered = items?.filter((a) => filter === "all" || a.status === filter) ?? [];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Header row ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Booking Requests</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1.5 capitalize ${filter === s ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-accent"}`}
            >
              {s}
            </button>
          ))}
          {/* Create button — only if permitted */}
          {permissions.can_create && (
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="ml-2 rounded-full border border-foreground bg-foreground px-3 py-1.5 font-medium text-background hover:opacity-90"
            >
              {showCreate ? "Close" : "+ New booking"}
            </button>
          )}
        </div>
      </div>

      {/* ── Permissions notice for staff ── */}
      {!permissions.can_create && !permissions.can_edit && !permissions.can_delete && !permissions.can_change_status && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-600">
          ⚠️ You currently have view-only access. Contact your admin to enable actions.
        </div>
      )}

      {/* ── Create panel ── */}
      {showCreate && permissions.can_create && (
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

      {/* ── Error banner ── */}
      {err && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-xs font-semibold text-red-500 mb-1">Error loading appointments</p>
          <p className="text-xs text-red-400 font-mono break-all">{err}</p>
          <button
            onClick={load}
            className="mt-2 rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10"
          >
            ↺ Retry
          </button>
        </div>
      )}

      {/* ── Booking cards ── */}
      <div className="mt-6 grid gap-4">
        {items === null && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" /></svg>
            Loading appointments…
          </div>
        )}
        {items && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No {filter === "all" ? "" : filter} requests.
          </div>
        )}

        {filtered.map((a) => {
          const phone = digitsOnly(a.phone);
          const dateLabel = new Date(a.appointment_date).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
          });
          const isEditing = editingId === a.id;
          const isConfirmingDelete = deletingId === a.id;

          return (
            <article key={a.id} className="relative z-0 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-lg">
              {/* ── Card header ── */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{a.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${STATUS_STYLE[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {a.department} · {dateLabel} · {a.appointment_time}
                  </div>
                  <div className="mt-1 text-sm">
                    📞 <a className="underline-offset-4 hover:underline" href={`tel:+${phone}`}>{a.phone}</a>
                  </div>
                  {a.notes && <p className="mt-2 text-sm text-muted-foreground">📝 {a.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("en-IN")}</span>
                  {/* Edit button */}
                  {permissions.can_edit && (
                    <button
                      onClick={() => { setEditingId(isEditing ? null : a.id); setDeletingId(null); }}
                      title="Edit booking"
                      className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${isEditing ? "border-blue-500 bg-blue-500/10 text-blue-500" : "border-border hover:bg-accent"}`}
                    >
                      ✏️ Edit
                    </button>
                  )}
                  {/* Delete button */}
                  {permissions.can_delete && (
                    <button
                      onClick={() => { setDeletingId(isConfirmingDelete ? null : a.id); setEditingId(null); }}
                      title="Delete booking"
                      className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${isConfirmingDelete ? "border-red-500 bg-red-500/10 text-red-500" : "border-border hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500"}`}
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>

              {/* ── Edit panel ── */}
              {isEditing && permissions.can_edit && (
                <EditPanel
                  apt={a}
                  onSave={(updates) => updateDetails(a.id, updates)}
                  onClose={() => setEditingId(null)}
                />
              )}

              {/* ── Delete confirmation ── */}
              {isConfirmingDelete && permissions.can_delete && (
                <DeleteConfirm
                  onConfirm={() => handleDelete(a.id)}
                  onCancel={() => setDeletingId(null)}
                  busy={deleteBusy}
                />
              )}

              {/* ── Status controls ── */}
              <div className="mt-4 flex flex-wrap gap-2">
                {permissions.can_change_status && (
                  STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(a.id, s)}
                      className={`rounded-md border px-3 py-1.5 text-xs capitalize transition-colors ${a.status === s ? "border-foreground bg-foreground text-background" : "border-border hover:bg-accent"}`}
                    >
                      Mark {s}
                    </button>
                  ))
                )}

                {/* WhatsApp / SMS — always visible for communication */}
                <div className="ml-auto flex flex-wrap gap-2">
                  <a
                    target="_blank" rel="noopener"
                    href={`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage(a, a.status))}`}
                    className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`sms:+${phone}?body=${encodeURIComponent(buildMessage(a, a.status))}`}
                    className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600"
                  >
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
