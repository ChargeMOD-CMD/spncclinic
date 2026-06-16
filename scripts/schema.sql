-- ══════════════════════════════════════════════════════════════════════════════
-- SNPC Clinic – Full DB Setup
-- Run this in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. Enums ──────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'staff');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.appointment_status AS ENUM ('pending', 'approved', 'declined', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── 2. user_roles ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role        public.app_role NOT NULL,
  permissions jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Add permissions column if missing from an older schema
DO $$ BEGIN
  ALTER TABLE public.user_roles ADD COLUMN permissions jsonb;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ── 3. Helper: has_role ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- ── 4. RLS policies for user_roles ───────────────────────────────────────────
DROP POLICY IF EXISTS "users read own roles"  ON public.user_roles;
DROP POLICY IF EXISTS "admins insert roles"   ON public.user_roles;
DROP POLICY IF EXISTS "admins update roles"   ON public.user_roles;
DROP POLICY IF EXISTS "admins delete roles"   ON public.user_roles;

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

-- ── 5. appointments ───────────────────────────────────────────────────────────
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

DROP POLICY IF EXISTS "anyone can create appointment" ON public.appointments;
DROP POLICY IF EXISTS "public can submit booking"     ON public.appointments;
DROP POLICY IF EXISTS "staff read appointments"       ON public.appointments;
DROP POLICY IF EXISTS "staff update appointments"     ON public.appointments;
DROP POLICY IF EXISTS "admins delete appointments"    ON public.appointments;

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

-- ── 6. updated_at trigger ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS appointments_updated_at ON public.appointments;
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 7. Realtime ───────────────────────────────────────────────────────────────
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
EXCEPTION WHEN others THEN NULL;
END $$;
