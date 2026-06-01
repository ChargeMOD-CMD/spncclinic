import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { createStaffUser, listStaff } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

type Row = { user_id: string; role: "admin" | "staff"; email: string; created_at: string };

function AdminUsers() {
  const create = useServerFn(createStaffUser);
  const list = useServerFn(listStaff);

  const [rows, setRows] = useState<Row[] | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try { setRows((await list()) as Row[]); }
    catch (e) { setMsg({ kind: "err", msg: (e as Error).message }); }
  }
  useEffect(() => { refresh(); }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    try {
      await create({ data: { email, password, role } });
      setEmail(""); setPassword("");
      setMsg({ kind: "ok", msg: "User created." });
      refresh();
    } catch (e) {
      setMsg({ kind: "err", msg: (e as Error).message });
    } finally { setBusy(false); }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
      <section>
        <h1 className="font-display text-2xl font-semibold">Create user</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add an admin or staff member who can manage booking requests.</p>
        <form onSubmit={onCreate} className="mt-5 space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@clinic.com"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temporary password (min 8)"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
          <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "staff")}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm">
            <option value="staff">Staff (view & update bookings)</option>
            <option value="admin">Admin (full access + manage users)</option>
          </select>
          {msg && <div className={`rounded-md px-3 py-2 text-xs ${msg.kind === "ok" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>{msg.msg}</div>}
          <button disabled={busy} className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background disabled:opacity-60">
            {busy ? "Creating…" : "Create user"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">Team members</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-2">Email</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Added</th></tr>
            </thead>
            <tbody>
              {rows === null && <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>}
              {rows?.map((r) => (
                <tr key={`${r.user_id}-${r.role}`} className="border-t border-border">
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2 capitalize">{r.role}</td>
                  <td className="px-4 py-2 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {rows && rows.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
