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
  } catch {}
  return env;
}

const env = loadEnv(envPath);
const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: { session }, error: signErr } = await supabase.auth.signInWithPassword({
    email: 'admin@snpc.in',
    password: 'Clinic@snpc#2k26'
  });

  if (signErr) {
    console.error("Login failed:", signErr);
    return;
  }
  
  console.log("Logged in successfully!", session.user.id);
  
  const { data: roles, error: roleErr } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", session.user.id);
    
  console.log("Roles fetch:", { roles, roleErr });

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching appointments:", error);
  } else {
    console.log(`Appointments fetched successfully: ${data.length} records`);
  }
}

main();
