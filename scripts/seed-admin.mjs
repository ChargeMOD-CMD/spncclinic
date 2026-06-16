/**
 * seed-admin.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Run once to create the primary admin account in Supabase Auth and add the
 * corresponding user_roles row.
 *
 * Usage (from project root):
 *   node scripts/seed-admin.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env manually (no dotenv dependency required) ───────────────────────
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
      // Strip surrounding quotes
      env[key] = raw.replace(/^["']|["']$/g, "");
    }
  } catch {
    console.error("Could not read .env file at", path);
    process.exit(1);
  }
  return env;
}

const env = loadEnv(envPath);

const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

// ── Admin credentials ────────────────────────────────────────────────────────
const ADMIN_EMAIL    = "admin@snpc.in";
const ADMIN_PASSWORD = "Clinic@snpc#2k26";

// ── Supabase admin client ────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔧  Seeding admin user: ${ADMIN_EMAIL}`);
  console.log(`    Supabase URL: ${SUPABASE_URL}\n`);

  // 1. Try to create the user in Auth
  let userId;
  const { data: created, error: createErr } =
    await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,   // mark email as verified immediately
    });

  if (createErr) {
    // If already exists, look up their ID instead
    if (createErr.message?.toLowerCase().includes("already been registered") ||
        createErr.message?.toLowerCase().includes("already exists") ||
        createErr.status === 422) {
      console.log("⚠️  User already exists in Auth — fetching existing ID…");
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === ADMIN_EMAIL);
      if (!existing) {
        console.error("❌  Could not find existing user. Error:", createErr.message);
        process.exit(1);
      }
      userId = existing.id;

      // Update the password in case it changed
      const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (updErr) {
        console.warn("⚠️  Could not update password:", updErr.message);
      } else {
        console.log("✅  Password updated for existing user.");
      }
    } else {
      console.error("❌  createUser failed:", createErr.message);
      process.exit(1);
    }
  } else {
    userId = created.user?.id;
    console.log("✅  Auth user created. ID:", userId);
  }

  if (!userId) {
    console.error("❌  No user ID obtained.");
    process.exit(1);
  }

  // 2. Upsert the user_roles row (admin = full permissions)
  const adminPermissions = {
    can_edit: true,
    can_change_status: true,
    can_delete: true,
    can_create: true,
  };

  const { error: roleErr } = await supabase
    .from("user_roles")
    .upsert(
      {
        user_id: userId,
        role: "admin",
        permissions: adminPermissions,
      },
      { onConflict: "user_id" }
    );

  if (roleErr) {
    console.error("❌  Could not upsert user_roles:", roleErr.message);
    process.exit(1);
  }

  console.log("✅  user_roles row upserted (role: admin, full permissions).");
  console.log("\n🎉  Done! You can now log in at /admin/login with:");
  console.log(`    Email:    ${ADMIN_EMAIL}`);
  console.log(`    Password: ${ADMIN_PASSWORD}\n`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
