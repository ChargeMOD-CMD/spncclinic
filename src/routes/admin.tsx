import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type UserPermissions, ADMIN_PERMISSIONS } from "@/lib/admin.shared";
import { AdminContext, type AdminContextValue } from "@/lib/admin.context";
import { MedicalFloatersBackground } from "@/components/site/MedicalFloaters";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · SNPC Clinic" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

// ─────────────────────────────────────────────────────────────────────────────
// Fetch role directly from Supabase client (no server-fn / auth-header needed)
// ─────────────────────────────────────────────────────────────────────────────

async function fetchRoleFromDB(
  userId: string
): Promise<{ role: "admin" | "staff"; permissions: UserPermissions }> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role, permissions")
      .eq("user_id", userId)
      .maybeSingle();

    // On any DB error (e.g. table doesn't exist yet), treat as super-admin
    if (error) {
      console.warn("[AdminLayout] fetchRoleFromDB error (falling back to admin):", error.message);
      return { role: "admin", permissions: ADMIN_PERMISSIONS };
    }

    if (!data) {
      // No row = original owner / super-admin
      return { role: "admin", permissions: ADMIN_PERMISSIONS };
    }

    const role = data.role as "admin" | "staff";
    const permissions: UserPermissions =
      role === "admin"
        ? ADMIN_PERMISSIONS
        : ((data.permissions as unknown as UserPermissions) ?? {
            can_edit: true,
            can_change_status: true,
            can_delete: false,
            can_create: false,
          });

    return { role, permissions };
  } catch (err: any) {
    console.warn("[AdminLayout] fetchRoleFromDB threw (falling back to admin):", err?.message);
    return { role: "admin", permissions: ADMIN_PERMISSIONS };
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function AdminLayout() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  // Keep a ref so callbacks always read the latest pathname without it being
  // a dependency (avoids re-registering the auth subscription on every navigation).
  const pathnameRef = useRef(location.pathname);
  pathnameRef.current = location.pathname;

  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [ctx, setCtx] = useState<AdminContextValue>({
    role: null,
    permissions: ADMIN_PERMISSIONS,
    isAdmin: true,
  });

  useEffect(() => {
    let active = true;

    // Failsafe: reveal the UI after 5s if network hangs indefinitely.
    // getSession() should be instant (localStorage) but fetchRoleFromDB needs network.
    const failsafe = setTimeout(() => {
      if (active) setReady(true);
    }, 5000);

    async function init() {
      try {
        // getSession() reads from localStorage — instant, no network needed.
        const { data: { session } } = await supabase.auth.getSession();
        if (!active) return;

        setEmail(session?.user?.email ?? null);

        if (!session?.user) {
          // Not authenticated — redirect to login
          if (pathnameRef.current !== "/admin/login") {
            navigate({ to: "/admin/login", replace: true });
          }
          return;
        }

        // Authenticated — load role & permissions from DB
        const roleData = await fetchRoleFromDB(session.user.id);
        if (!active) return;

        setCtx({
          role: roleData.role,
          permissions: roleData.permissions,
          isAdmin: roleData.role === "admin",
        });
      } catch (err) {
        console.error("[AdminLayout] init error:", err);
      } finally {
        clearTimeout(failsafe);
        if (active) setReady(true);
      }
    }

    init();

    // Keep role fresh when auth state changes (login / logout / token refresh).
    // Using pathnameRef avoids stale closure — always reads the current pathname.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      setEmail(session?.user?.email ?? null);

      if (!session) {
        if (pathnameRef.current !== "/admin/login") {
          navigate({ to: "/admin/login", replace: true });
        }
        return;
      }

      try {
        const roleData = await fetchRoleFromDB(session.user.id);
        if (!active) return;
        setCtx({
          role: roleData.role,
          permissions: roleData.permissions,
          isAdmin: roleData.role === "admin",
        });
      } catch (err) {
        console.error("[AdminLayout] onAuthStateChange error:", err);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount — navigate is stable, pathname is read via ref

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-sm text-muted-foreground">
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          />
        </svg>
        Loading…
      </div>
    );
  }

  const onLogin = location.pathname === "/admin/login";

  return (
    <AdminContext.Provider value={ctx}>
      <div className={`admin-area min-h-screen relative overflow-hidden ${onLogin ? "" : "bg-background text-foreground"}`}>
        {!onLogin && <MedicalFloatersBackground />}
        {!onLogin && (
          <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-6">
                <Link to="/admin/requests" className="font-display text-base font-semibold">
                  SNPC Admin
                </Link>
                <nav className="flex items-center gap-4 text-sm">
                  <Link
                    to="/admin/dashboard"
                    className="text-muted-foreground hover:text-foreground"
                    activeProps={{ className: "text-foreground font-medium" }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/requests"
                    className="text-muted-foreground hover:text-foreground"
                    activeProps={{ className: "text-foreground font-medium" }}
                  >
                    Requests
                  </Link>
                  {ctx.isAdmin && (
                    <Link
                      to="/admin/users"
                      className="text-muted-foreground hover:text-foreground"
                      activeProps={{ className: "text-foreground font-medium" }}
                    >
                      Users
                    </Link>
                  )}
                </nav>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {email && <span className="text-muted-foreground">{email}</span>}
                {ctx.role && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      ctx.isAdmin ? "bg-blue-500/15 text-blue-500" : "bg-slate-500/15 text-slate-400"
                    }`}
                  >
                    {ctx.role}
                  </span>
                )}
                <button
                  onClick={signOut}
                  className="rounded-md border border-border px-3 py-1.5 hover:bg-accent"
                >
                  Sign out
                </button>
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
    </AdminContext.Provider>
  );
}
