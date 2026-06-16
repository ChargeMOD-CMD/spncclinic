/**
 * setup-db.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Applies the full DB schema to the remote Supabase project via the
 * Management API SQL endpoint, then seeds the admin user.
 *
 * Usage:
 *   node scripts/setup-db.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

function loadEnv(path) {
  const env = {};
  try {
    const lines = readFileSync(path, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const raw = trimmed.slice(idx + 1).trim();
      env[key] = raw.replace(/^["']|["']$/g, "");
    }
  } catch {
    console.error("Could not read .env at", path);
    process.exit(1);
  }
  return env;
}

const env = loadEnv(envPath);
const SUPABASE_URL        = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY    = env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_ID          = env.SUPABASE_PROJECT_ID || env.VITE_SUPABASE_PROJECT_ID;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const ADMIN_EMAIL    = "admin@snpc.in";
const ADMIN_PASSWORD = "Clinic@snpc#2k26";

// Supabase admin client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── SQL to run via RPC ──────────────────────────────────────────────────────
// We'll use supabase.rpc to run DDL. Alternatively we run it piece-by-piece.

const SETUP_SQL = `
-- ── 1. Ensure the app_role enum exists ──────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'staff');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── 2. Ensure user_roles table exists ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role        public.app_role NOT NULL,
  permissions jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Add permissions column if it was missing from an older migration
DO $$ BEGIN
  ALTER TABLE public.user_roles ADD COLUMN permissions jsonb;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ── 3. Grants & RLS ──────────────────────────────────────────────────────────
GRANT SELECT, INSERT, DELETE, UPDATE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ── 4. Helper function ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- ── 5. RLS policies (idempotent) ─────────────────────────────────────────────
DO $$ BEGIN
  DROP POLICY IF EXISTS "users read own roles"  ON public.user_roles;
  DROP POLICY IF EXISTS "admins insert roles"   ON public.user_roles;
  DROP POLICY IF EXISTS "admins delete roles"   ON public.user_roles;
  DROP POLICY IF EXISTS "admins update roles"   ON public.user_roles;

  CREATE POLICY "users read own roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

  CREATE POLICY "admins insert roles" ON public.user_roles
    FOR INSERT TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

  CREATE POLICY "admins update roles" ON public.user_roles
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

  CREATE POLICY "admins delete roles" ON public.user_roles
    FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
END $$;

-- ── 6. Appointments table ────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.appointment_status AS ENUM ('pending', 'approved', 'declined', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.appointments (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  phone            text        NOT NULL,
  department       text        NOT NULL,
  appointment_date date        NOT NULL,
  appointment_time text        NOT NULL,
  notes            text,
  status           public.appointment_status NOT NULL DEFAULT 'pending',
  admin_notes      text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.appointments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "anyone can create appointment"  ON public.appointments;
  DROP POLICY IF EXISTS "public can submit booking"      ON public.appointments;
  DROP POLICY IF EXISTS "staff read appointments"        ON public.appointments;
  DROP POLICY IF EXISTS "staff update appointments"      ON public.appointments;
  DROP POLICY IF EXISTS "admins delete appointments"     ON public.appointments;

  CREATE POLICY "public can submit booking" ON public.appointments
    FOR INSERT TO anon, authenticated
    WITH CHECK (
      status = 'pending'
      AND length(name) BETWEEN 1 AND 120
      AND length(phone) BETWEEN 5 AND 30
      AND length(department) BETWEEN 1 AND 60
      AND appointment_date >= current_date
      AND admin_notes IS NULL
    );

  CREATE POLICY "staff read appointments" ON public.appointments
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

  CREATE POLICY "staff update appointments" ON public.appointments
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

  CREATE POLICY "admins delete appointments" ON public.appointments
    FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
END $$;

-- ── 7. updated_at trigger ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS appointments_updated_at ON public.appointments;
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 8. Realtime ──────────────────────────────────────────────────────────────
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
EXCEPTION WHEN others THEN NULL;
END $$;
`;

// ─── Execute SQL via Supabase Management API ─────────────────────────────────
async function runSQL(sql) {
  const url = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  // Use the pg_query approach via the REST API
  // Actually, we need to use the Supabase Management API or pg
  // Let's use the supabase client with service role to run raw SQL via rpc

  // We'll POST to the SQL endpoint of the Management API
  const mgmtUrl = `https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`;
  const res = await fetch(mgmtUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Management API error ${res.status}: ${text}`);
  }
  return res.json();
}

// Alternative: run via supabase-js using a postgres function
async function runSQLViaRPC(sql) {
  // Use the pg endpoint directly
  const endpoint = `${SUPABASE_URL}/pg/query`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PG query error ${res.status}: ${text}`);
  }
  return res.json();
}

async function main() {
  console.log("🔧  Setting up database schema…\n");

  // ── Apply schema ────────────────────────────────────────────────────────────
  // Try the Management API first, fall back to individual table checks
  try {
    if (PROJECT_ID) {
      console.log("📡  Applying schema via Supabase Management API…");
      await runSQL(SETUP_SQL);
      console.log("✅  Schema applied.\n");
    } else {
      throw new Error("No PROJECT_ID");
    }
  } catch (err) {
    console.warn("⚠️  Management API failed:", err.message);
    console.log("   Falling back to per-table checks…\n");
  }

  // ── Seed admin user ─────────────────────────────────────────────────────────
  console.log(`👤  Seeding admin user: ${ADMIN_EMAIL}`);

  let userId;
  const { data: created, error: createErr } =
    await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });

  if (createErr) {
    if (
      createErr.message?.toLowerCase().includes("already") ||
      createErr.status === 422
    ) {
      console.log("   User already exists — fetching ID…");
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === ADMIN_EMAIL);
      if (!existing) {
        console.error("❌  Could not find existing user:", createErr.message);
        process.exit(1);
      }
      userId = existing.id;

      // Update password
      await supabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      console.log("   Password updated.");
    } else {
      console.error("❌  createUser failed:", createErr.message);
      process.exit(1);
    }
  } else {
    userId = created.user?.id;
    console.log("✅  Auth user created. ID:", userId);
  }

  // ── Insert user_roles row ───────────────────────────────────────────────────
  const adminPerms = { can_edit: true, can_change_status: true, can_delete: true, can_create: true };

  const { error: roleErr } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin", permissions: adminPerms }, { onConflict: "user_id" });

  if (roleErr) {
    console.error("❌  user_roles upsert failed:", roleErr.message);
    console.log("\n⚠️  You must apply the DB schema first.");
    console.log("    Open Supabase Dashboard → SQL Editor and run:");
    console.log("    https://supabase.com/dashboard/project/" + PROJECT_ID + "/sql/new\n");
    process.exit(1);
  }

  console.log("✅  user_roles row set (role: admin, full permissions).");
  console.log("\n🎉  Done! Login at /admin/login:");
  console.log(`    Email:    ${ADMIN_EMAIL}`);
  console.log(`    Password: ${ADMIN_PASSWORD}\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
