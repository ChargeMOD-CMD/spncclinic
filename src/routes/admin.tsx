import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · SNPC Clinic" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setEmail(data.user?.email ?? null);
      setReady(true);
      if (!data.user && location.pathname !== "/admin/login") {
        navigate({ to: "/admin/login", replace: true });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user?.email ?? null);
      if (!session && location.pathname !== "/admin/login") {
        navigate({ to: "/admin/login", replace: true });
      }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [location.pathname, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }

  const onLogin = location.pathname === "/admin/login";

  return (
    <div className={`admin-area min-h-screen ${onLogin ? "" : "bg-background text-foreground"}`}>
      {!onLogin && (
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-6">
              <Link to="/admin/requests" className="font-display text-base font-semibold">SNPC Admin</Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link to="/admin/requests" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>Requests</Link>
                <Link to="/admin/users" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>Users</Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {email && <span className="text-muted-foreground">{email}</span>}
              <button onClick={signOut} className="rounded-md border border-border px-3 py-1.5 hover:bg-accent">Sign out</button>
            </div>
          </div>
        </header>
      )}
      {onLogin ? (
        <Outlet />
      ) : (
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </main>
      )}
    </div>
  );
}
