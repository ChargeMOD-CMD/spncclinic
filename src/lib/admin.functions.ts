import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { permissionsSchema, type UserPermissions, DEFAULT_STAFF_PERMISSIONS, ADMIN_PERMISSIONS } from "./admin.shared";

// ─── Schemas ────────────────────────────────────────────────────────────────

const createSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  role: z.enum(["admin", "staff"]),
});

// ─── Helper ─────────────────────────────────────────────────────────────────

async function assertAdmin(supabase: any, userId: string) {
  const { data: roles, error: roleErr } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (roleErr) throw new Error(roleErr.message);
  // If the user has NO row at all in user_roles they are the original owner (super-admin).
  // If they have a row it must be role = 'admin'.
  if (roles && roles.length > 0 && !roles.some((r: any) => r.role === "admin")) {
    throw new Error("Forbidden: admin only");
  }
}

// ─── Server Functions ────────────────────────────────────────────────────────

/** Create a new staff or admin user (admin only). */
export const createStaffUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });
    if (createErr) throw new Error(createErr.message);
    const newUserId = created.user?.id;
    if (!newUserId) throw new Error("User creation returned no id");

    const defaultPerms =
      data.role === "admin" ? ADMIN_PERMISSIONS : DEFAULT_STAFF_PERMISSIONS;

    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: newUserId,
        role: data.role,
        permissions: defaultPerms,
      });
    if (insErr) throw new Error(insErr.message);

    return { ok: true, userId: newUserId };
  });

/** List all staff/admin users with their permissions (admin only). */
export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const { data: allRoles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at, permissions")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const emailById = new Map(users?.users.map((u) => [u.id, u.email]) ?? []);

    return (allRoles ?? []).map((r) => ({
      user_id: r.user_id,
      role: r.role as "admin" | "staff",
      email: emailById.get(r.user_id) ?? "(unknown)",
      created_at: r.created_at,
      permissions: (r.permissions as UserPermissions) ?? DEFAULT_STAFF_PERMISSIONS,
    }));
  });

/** Get the current logged-in user's own role and permissions. */
export const getMyRoleAndPermissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role, permissions")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      // Fall back: no role row means treat as admin (the original owner)
      return { role: "admin" as const, permissions: ADMIN_PERMISSIONS };
    }

    const role = data.role as "admin" | "staff";
    // Admins always get full permissions regardless of stored value
    const permissions: UserPermissions =
      role === "admin"
        ? ADMIN_PERMISSIONS
        : (data.permissions as UserPermissions) ?? DEFAULT_STAFF_PERMISSIONS;

    return { role, permissions };
  });

/** Update permissions for a specific user (admin only). */
export const updateUserPermissions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) =>
    z.object({ targetUserId: z.string().uuid(), permissions: permissionsSchema }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    // Admins cannot have their permissions restricted
    const { data: targetRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", data.targetUserId)
      .single();
    if (targetRole?.role === "admin") {
      throw new Error("Cannot restrict permissions for admin users.");
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .update({ permissions: data.permissions })
      .eq("user_id", data.targetUserId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });

/** Delete a booking appointment (requires can_delete permission). */
export const deleteAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Check caller's permissions
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role, permissions")
      .eq("user_id", userId)
      .single();

    const isAdmin = roleRow?.role === "admin";
    const perms = (roleRow?.permissions as UserPermissions) ?? DEFAULT_STAFF_PERMISSIONS;

    if (!isAdmin && !perms.can_delete) {
      throw new Error("Forbidden: you do not have delete permission.");
    }

    const { error } = await supabaseAdmin
      .from("appointments")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    return { ok: true };
  });
