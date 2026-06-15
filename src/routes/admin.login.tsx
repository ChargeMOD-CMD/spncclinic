import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const redirectTo = new URL(`${import.meta.env.BASE_URL}admin/requests`, window.location.origin).toString();
    const fn = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
    const { error } = await fn;
    setLoading(false);
    if (error) { setErr(error.message); return; }
    navigate({ to: "/admin/requests", replace: true });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <h1 className="font-display text-3xl font-semibold">Clinic Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {mode === "signin" ? "Sign in to manage booking requests." : "First-time setup: the very first account becomes admin."}
      </p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
        {err && <div className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-500">{err}</div>}
        <button disabled={loading} className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background disabled:opacity-60">
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline">
        {mode === "signin" ? "First-time setup → create the first admin account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
