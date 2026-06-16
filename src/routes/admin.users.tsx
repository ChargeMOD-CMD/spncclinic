import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createStaffUser, listStaff, updateUserPermissions } from "@/lib/admin.functions";
import type { UserPermissions } from "@/lib/admin.shared";
import { useAdminContext } from "@/lib/admin.context";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

type Row = {
  user_id: string;
  role: "admin" | "staff";
  email: string;
  created_at: string;
  permissions: UserPermissions;
};

const PERM_LABELS: { key: keyof UserPermissions; label: string; description: string }[] = [
  { key: "can_create",        label: "Create",        description: "Manually add new bookings" },
  { key: "can_edit",          label: "Edit",          description: "Edit booking details" },
  { key: "can_change_status", label: "Status",        description: "Change booking status" },
  { key: "can_delete",        label: "Delete",        description: "Delete bookings permanently" },
];

function PermissionToggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
  disabled?: boolean;
}) {
  return (
    <label
      title={description}
      className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors select-none ${
        disabled
          ? "cursor-not-allowed opacity-40 border-border text-muted-foreground"
          : checked
          ? "border-blue-500/40 bg-blue-500/10 text-blue-500"
          : "border-border text-muted-foreground hover:bg-accent"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className={`h-3.5 w-3.5 rounded-sm border flex items-center justify-center text-[9px] ${
        checked ? "border-blue-500 bg-blue-500 text-white" : "border-input"
      }`}>
        {checked ? "✓" : ""}
      </span>
      {label}
    </label>
  );
}

function AdminUsers() {
  const { permissions, isAdmin } = useAdminContext();

  const [rows, setRows] = useState<Row[] | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // Per-user permissions being saved (userId → saving state)
  const [savingPerms, setSavingPerms] = useState<Record<string, boolean>>({});
  const [permMsg, setPermMsg] = useState<Record<string, { kind: "ok" | "err"; text: string }>>({});
  // Local unsaved permissions edits
  const [localPerms, setLocalPerms] = useState<Record<string, UserPermissions>>({});

  async function refresh() {
    setMsg(null);
    setRows(null);
    try {
      const data = await listStaff();
      setRows(data as Row[]);
    } catch (e: any) {
      const msg = e.message ?? "Unexpected error loading users.";
      console.error("[AdminUsers] refresh error:", msg);
      setMsg({ kind: "err", msg });
      setRows([]);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    try {
      await createStaffUser({ data: { email, password, role } });
      setEmail(""); setPassword("");
      setMsg({ kind: "ok", msg: "User created." });
      refresh();
    } catch (e) {
      setMsg({ kind: "err", msg: (e as Error).message });
    } finally { setBusy(false); }
  }

  function updateLocalPerm(userId: string, key: keyof UserPermissions, value: boolean, basePerms: UserPermissions) {
    setLocalPerms((prev) => ({
      ...prev,
      // Seed from the full row permissions first (in case this is the first toggle),
      // then apply the changed key. This ensures all 4 keys are always present.
      [userId]: { ...(prev[userId] ?? basePerms), [key]: value },
    }));
    // Clear any previous save message
    setPermMsg((prev) => { const n = { ...prev }; delete n[userId]; return n; });
  }

  async function handleSavePerms(userId: string) {
    const perms = localPerms[userId];
    if (!perms) return;
    setSavingPerms((prev) => ({ ...prev, [userId]: true }));
    setPermMsg((prev) => { const n = { ...prev }; delete n[userId]; return n; });
    try {
      await updateUserPermissions({ data: { targetUserId: userId, permissions: perms } });
      setPermMsg((prev) => ({ ...prev, [userId]: { kind: "ok", text: "Saved!" } }));
      refresh();
    } catch (e) {
      setPermMsg((prev) => ({ ...prev, [userId]: { kind: "err", text: (e as Error).message } }));
    } finally {
      setSavingPerms((prev) => ({ ...prev, [userId]: false }));
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.6fr]">
      {/* ── Create user form ── */}
      <section>
        <h1 className="font-display text-2xl font-semibold">Create user</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a staff member who can manage booking requests.
        </p>
        <form onSubmit={onCreate} className="mt-5 space-y-3">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="email@clinic.com"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Temporary password (min 8)"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <select
            value={role} onChange={(e) => setRole(e.target.value as "admin" | "staff")}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="staff">Staff (view &amp; update bookings)</option>
            <option value="admin">Admin (full access + manage users)</option>
          </select>

          {/* Default permissions preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Default permissions for {role}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PERM_LABELS.map(({ key, label }) => {
                const defaultPerms = role === "admin"
                  ? { can_edit: true, can_change_status: true, can_delete: true, can_create: true }
                  : { can_edit: true, can_change_status: true, can_delete: false, can_create: false };
                const on = defaultPerms[key];
                return (
                  <span key={key} className={`rounded-md border px-2 py-1 text-[11px] font-medium ${on ? "border-blue-500/40 bg-blue-500/10 text-blue-500" : "border-border text-muted-foreground line-through"}`}>
                    {label}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">You can adjust these after creation.</p>
          </div>

          {msg && (
            <div className={`rounded-md px-3 py-2 text-xs ${msg.kind === "ok" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>
              {msg.msg}
            </div>
          )}
          <button disabled={busy} className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background disabled:opacity-60">
            {busy ? "Creating…" : "Create user"}
          </button>
        </form>
      </section>

      {/* ── Team members + permissions ── */}
      <section>
        <h2 className="font-display text-xl font-semibold">Team members</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage what each staff member can do in Booking Requests.
        </p>

        <div className="mt-4 space-y-3">
          {rows === null && !msg && (
            <div className="rounded-xl border border-border p-6 text-center text-sm text-muted-foreground">
              <svg className="mx-auto mb-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" /></svg>
              Loading team members…
            </div>
          )}
          {msg && msg.kind === "err" && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs font-semibold text-red-500 mb-1">Error loading users</p>
              <p className="text-xs text-red-400 font-mono break-all">{msg.msg}</p>
              <button
                onClick={refresh}
                className="mt-3 rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10"
              >
                ↺ Retry
              </button>
            </div>
          )}
          {rows && rows.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No users yet.</div>
          )}
          {rows?.map((r) => {
            const perms = localPerms[r.user_id] ?? r.permissions;
            const isAdminRow = r.role === "admin";
            const saving = savingPerms[r.user_id] ?? false;
            const pMsg = permMsg[r.user_id];

            return (
              <div key={r.user_id} className="relative z-0 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-lg">
                {/* User info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.email}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${isAdminRow ? "bg-blue-500/15 text-blue-500" : "bg-slate-500/15 text-slate-400"}`}>
                        {r.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Added {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Permissions section */}
                <div className="mt-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {isAdminRow ? "Full access (admin)" : "Permissions"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PERM_LABELS.map(({ key, label, description }) => (
                      <PermissionToggle
                        key={key}
                        checked={isAdminRow ? true : (perms[key] ?? false)}
                        onChange={(v) => updateLocalPerm(r.user_id, key, v, r.permissions)}
                        label={label}
                        description={description}
                        disabled={isAdminRow || !isAdmin}
                      />
                    ))}
                  </div>

                  {/* Save button — only for non-admin rows, only for admins, and only when changes exist */}
                  {!isAdminRow && isAdmin && localPerms[r.user_id] !== undefined && (
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => handleSavePerms(r.user_id)}
                        disabled={saving}
                        className="rounded-md bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background disabled:opacity-60"
                      >
                        {saving ? "Saving…" : "Save permissions"}
                      </button>
                      {pMsg && (
                        <span className={`text-[11px] ${pMsg.kind === "ok" ? "text-emerald-600" : "text-red-500"}`}>
                          {pMsg.text}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
