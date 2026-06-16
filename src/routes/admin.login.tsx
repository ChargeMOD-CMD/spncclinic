import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

/* ── Floating medical icons (SVG paths) ─────────────────────────── */
const ICONS = [
  /* stethoscope */
  "M19 8a7 7 0 0 1-7 7H8a7 7 0 0 1-7-7V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a4 4 0 0 0 8 0V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3zM12 15v5m0 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  /* cross */
  "M12 2v20M2 12h20",
  /* heart */
  "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z",
  /* pill */
  "M10.5 3.5a6 6 0 0 1 8.49 8.49l-8.49 8.49a6 6 0 0 1-8.49-8.49l8.49-8.49zM12 12l4-4",
  /* activity */
  "M22 12h-4l-3 9L9 3l-3 9H2",
];

const FLOATERS = [
  { icon: 0, top: "10%",  left: "5%",   size: 28, delay: "0s",   dur: "12s" },
  { icon: 1, top: "70%",  left: "8%",   size: 22, delay: "2s",   dur: "9s"  },
  { icon: 2, top: "20%",  left: "88%",  size: 30, delay: "1s",   dur: "14s" },
  { icon: 3, top: "80%",  left: "85%",  size: 24, delay: "3s",   dur: "11s" },
  { icon: 4, top: "50%",  left: "3%",   size: 20, delay: "4s",   dur: "10s" },
  { icon: 1, top: "15%",  left: "45%",  size: 18, delay: "2.5s", dur: "13s" },
  { icon: 0, top: "88%",  left: "40%",  size: 26, delay: "5s",   dur: "8s"  },
  { icon: 2, top: "40%",  left: "92%",  size: 20, delay: "1.5s", dur: "15s" },
];

const base = import.meta.env.BASE_URL ?? "/";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    navigate({ to: "/admin/dashboard", replace: true });
  }

  return (
    <div className="login-page-root fixed inset-0 overflow-hidden flex items-center justify-center">

      {/* ══ 1. Full-screen clinic background with Ken-Burns zoom ══ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${base}images/clinic_login_bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "kenBurns 20s ease-in-out infinite alternate",
        }}
      />

      {/* ══ 2. Dark overlay gradient ══ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,12,34,0.82) 0%, rgba(10,30,70,0.72) 50%, rgba(6,12,34,0.85) 100%)",
        }}
      />

      {/* ══ 3. Animated colour orbs ══ */}
      <div aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="absolute rounded-full opacity-25"
          style={{
            width: 500, height: 500,
            top: "-120px", left: "-120px",
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            animation: "orbDrift1 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: 400, height: 400,
            bottom: "-100px", right: "-100px",
            background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
            animation: "orbDrift2 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full opacity-15"
          style={{
            width: 300, height: 300,
            top: "40%", left: "60%",
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            animation: "orbDrift3 15s ease-in-out infinite",
          }}
        />
      </div>

      {/* ══ 4. Heartbeat pulse ring ══ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-blue-400/20"
            style={{
              width: 300 * i,
              height: 300 * i,
              animation: `pulseRing 4s ease-out ${i * 1.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ══ 5. Floating medical icons ══ */}
      <div aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none">
        {FLOATERS.map((f, idx) => (
          <svg
            key={idx}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(147,197,253,0.35)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute"
            style={{
              width: f.size,
              height: f.size,
              top: f.top,
              left: f.left,
              animation: `floatIcon ${f.dur} ease-in-out ${f.delay} infinite`,
            }}
          >
            <path d={ICONS[f.icon]} />
          </svg>
        ))}
      </div>

      {/* ══ 6. Particle dots ══ */}
      <div aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-300/30"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 5}s ease-in-out ${Math.random() * 4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ══ 7. Login card (glassmorphism) ══ */}
      <div
        className="relative z-20 w-full max-w-md mx-4 rounded-3xl p-8 md:p-10"
        style={{
          background: "rgba(10, 20, 50, 0.55)",
          backdropFilter: "blur(28px) saturate(1.4)",
          border: "1px solid rgba(147,197,253,0.18)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06) inset, 0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(59,130,246,0.12)",
        }}
      >
        {/* Brand header */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className="rounded-2xl p-1.5"
            style={{
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
            }}
          >
            <img
              src={`${base}images/logo.png`}
              alt="SPNC Clinic"
              className="h-11 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="text-xl font-black tracking-widest text-white"
              style={{ fontFamily: "'Outfit','Inter',sans-serif", letterSpacing: "0.08em" }}
            >
              SPNC CLINIC
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300/80">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mb-7 h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(147,197,253,0.3), transparent)" }}
        />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-white">
          Welcome back 👋
        </h1>
        <p className="mt-1.5 text-sm text-blue-200/60">
          Sign in to manage booking requests.
        </p>

        {/* Form */}
        <form onSubmit={submit} className="mt-7 space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300/70">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@spncclinic.com"
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(147,197,253,0.15)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(59,130,246,0.7)";
                e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(147,197,253,0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300/70">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(147,197,253,0.15)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(59,130,246,0.7)";
                e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(147,197,253,0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error */}
          {err && (
            <div
              className="rounded-xl px-4 py-3 text-xs text-red-300"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              {err}
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            disabled={loading}
            type="submit"
            className="mt-2 w-full rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)",
              boxShadow: "0 4px 24px rgba(37,99,235,0.45), 0 0 0 1px rgba(147,197,253,0.15) inset",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "0 8px 40px rgba(37,99,235,0.7), 0 0 0 1px rgba(147,197,253,0.2) inset";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(37,99,235,0.45), 0 0 0 1px rgba(147,197,253,0.15) inset";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                </svg>
                Please wait…
              </span>
            ) : "Sign In"}
          </button>
        </form>

      </div>

      {/* ══ CSS animations ══ */}
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)    translateX(0)    translateY(0); }
          100% { transform: scale(1.12) translateX(-2%)  translateY(-1%); }
        }
        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0,   0)   scale(1);    }
          33%       { transform: translate(60px, 40px) scale(1.1); }
          66%       { transform: translate(20px, 80px) scale(0.95); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0)     scale(1);    }
          50%       { transform: translate(-80px, -60px) scale(1.15); }
        }
        @keyframes orbDrift3 {
          0%, 100% { transform: translate(0, 0)     scale(1);   }
          50%       { transform: translate(40px, -50px) scale(1.1); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.6); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0;   }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px)   rotate(0deg);   opacity: 0.35; }
          25%       { transform: translateY(-20px) rotate(6deg);   opacity: 0.5;  }
          75%       { transform: translateY(10px)  rotate(-4deg);  opacity: 0.28; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1);   }
          50%       { opacity: 0.6;  transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
