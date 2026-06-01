import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const createSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  role: z.enum(["admin", "staff"]),
});

export const createStaffUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Caller must be admin
    const { data: roles, error: roleErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin");
    if (roleErr) throw new Error(roleErr.message);
    if (!roles || roles.length === 0) throw new Error("Forbidden: admin only");

    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });
    if (createErr) throw new Error(createErr.message);
    const newUserId = created.user?.id;
    if (!newUserId) throw new Error("User creation returned no id");

    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUserId, role: data.role });
    if (insErr) throw new Error(insErr.message);

    return { ok: true, userId: newUserId };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin");
    if (!roles || roles.length === 0) throw new Error("Forbidden: admin only");

    const { data: allRoles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const emailById = new Map(users?.users.map((u) => [u.id, u.email]) ?? []);

    return (allRoles ?? []).map((r) => ({
      user_id: r.user_id,
      role: r.role,
      email: emailById.get(r.user_id) ?? "(unknown)",
      created_at: r.created_at,
    }));
  });
