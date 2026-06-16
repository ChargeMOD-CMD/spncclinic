import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "pending" | "approved" | "declined" | "completed";

type Appointment = {
  id: string;
  name: string;
  phone: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  status: Status;
  created_at: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPARTMENTS = ["All", "Neurology", "Dermatology", "Orthopedics", "Psychiatry", "Pharmacy"];
const STATUSES: Status[] = ["pending", "approved", "declined", "completed"];
const STATUS_COLOR: Record<Status, { bg: string; text: string; bar: string }> = {
  pending:   { bg: "bg-amber-500/10",   text: "text-amber-500",   bar: "bg-amber-400"  },
  approved:  { bg: "bg-emerald-500/10", text: "text-emerald-500", bar: "bg-emerald-400" },
  declined:  { bg: "bg-red-500/10",     text: "text-red-500",     bar: "bg-red-400"    },
  completed: { bg: "bg-sky-500/10",     text: "text-sky-500",     bar: "bg-sky-400"    },
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function pct(n: number, total: number) {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, color, icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className={`mt-1.5 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ${color.replace("text-", "bg-").replace("-500", "-500/10").replace("-600", "-600/10")}`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-0.5 w-full opacity-50 ${color.replace("text-", "bg-")}`} />
    </div>
  );
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

function MiniBarChart({ data, label }: { data: { name: string; value: number }[]; label: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-right text-[11px] text-muted-foreground">{d.name}</span>
            <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${pct(d.value, max)}%` }}
              />
            </div>
            <span className="w-7 shrink-0 text-right text-[11px] font-semibold tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status Donut (CSS only) ──────────────────────────────────────────────────

function StatusRing({ counts, total }: { counts: Record<Status, number>; total: number }) {
  // Build conic-gradient segments
  const segments: { status: Status; pct: number }[] = [];
  let acc = 0;
  STATUSES.forEach((s) => {
    const p = pct(counts[s], total);
    if (p > 0) segments.push({ status: s, pct: p });
    acc += p;
  });

  const colors: Record<Status, string> = {
    pending:   "#f59e0b",
    approved:  "#10b981",
    declined:  "#ef4444",
    completed: "#0ea5e9",
  };

  let conicStr = "";
  let cur = 0;
  STATUSES.forEach((s) => {
    const p = pct(counts[s], total);
    if (p === 0) return;
    conicStr += `${colors[s]} ${cur}% ${cur + p}%, `;
    cur += p;
  });
  if (conicStr.endsWith(", ")) conicStr = conicStr.slice(0, -2);
  if (!conicStr) conicStr = "#e5e7eb 0% 100%";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-36 w-36">
        <div
          className="h-36 w-36 rounded-full"
          style={{ background: `conic-gradient(${conicStr})` }}
        />
        <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-card">
          <span className="text-xl font-bold">{total}</span>
          <span className="text-[10px] text-muted-foreground">total</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {STATUSES.map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-full" style={{ background: colors[s] }} />
            <span className="capitalize text-muted-foreground">{s}</span>
            <span className="font-semibold tabular-nums">{counts[s]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function AdminDashboard() {
  const [all, setAll] = useState<Appointment[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // NOW is computed inside the component so "today" is always the real date,
  // even if the tab stays open past midnight.
  const NOW = useMemo(() => new Date(), []);

  // ── Filters ──────────────────────────────────────────────────────────────
  const [filterYear, setFilterYear] = useState<string>(String(NOW.getFullYear()));
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterDay, setFilterDay] = useState<string>("all");
  const [filterDept, setFilterDept] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // ── Load data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("id,name,phone,department,appointment_date,appointment_time,status,created_at")
          .order("appointment_date", { ascending: false });

        if (!active) return;
        if (error) {
          console.error("[Dashboard] Supabase error:", error);
          setErr(`${error.message} (code: ${error.code})`);
          setAll([]);
        } else {
          setAll((data ?? []) as Appointment[]);
        }
      } catch (e: any) {
        if (!active) return;
        console.error("[Dashboard] fetch threw:", e);
        setErr(e.message ?? "Unexpected error loading dashboard.");
        setAll([]);
      }
    }

    fetchData();
    return () => { active = false; };
  }, [retryCount]);

  // ── Year options derived from data ────────────────────────────────────────
  const yearOptions = useMemo(() => {
    if (!all) return [String(NOW.getFullYear())];
    const yrs = [...new Set(all.map((a) => a.appointment_date.slice(0, 4)))].sort().reverse();
    if (!yrs.includes(String(NOW.getFullYear()))) yrs.unshift(String(NOW.getFullYear()));
    return yrs;
  }, [all]);

  // ── Day options for selected month ────────────────────────────────────────
  const dayOptions = useMemo(() => {
    if (filterMonth === "all" || filterYear === "all") return [];
    const yr = parseInt(filterYear);
    const mo = parseInt(filterMonth);
    const days = new Date(yr, mo, 0).getDate();
    return Array.from({ length: days }, (_, i) => String(i + 1).padStart(2, "0"));
  }, [filterYear, filterMonth]);

  // ── Filtered data ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!all) return [];
    return all.filter((a) => {
      const [yr, mo, dy] = a.appointment_date.split("-");
      if (filterYear !== "all" && yr !== filterYear) return false;
      if (filterMonth !== "all" && mo !== filterMonth.padStart(2, "0")) return false;
      if (filterDay !== "all" && dy !== filterDay) return false;
      if (filterDept !== "All" && a.department !== filterDept) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.phone.includes(q) && !a.department.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [all, filterYear, filterMonth, filterDay, filterDept, filterStatus, search]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const counts = useMemo(() => {
    const c: Record<Status, number> = { pending: 0, approved: 0, declined: 0, completed: 0 };
    filtered.forEach((a) => { c[a.status] = (c[a.status] ?? 0) + 1; });
    return c;
  }, [filtered]);

  const deptCounts = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((a) => { map[a.department] = (map[a.department] ?? 0) + 1; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  // Bookings per day (for current filter scope — last 14 days if no day filter)
  const dailyCounts = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((a) => { map[a.appointment_date] = (map[a.appointment_date] ?? 0) + 1; });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([d, v]) => ({ name: d.slice(5), value: v }));
  }, [filtered]);

  // Approval rate
  const approvalRate = pct(counts.approved + counts.completed, filtered.length);

  // Today's bookings
  const todayStr = NOW.toISOString().split("T")[0];
  const todayCount = useMemo(() => (all ?? []).filter((a) => a.appointment_date === todayStr).length, [all, todayStr]);

  // This week
  const weekStart = new Date(NOW);
  weekStart.setDate(NOW.getDate() - NOW.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const weekCount = useMemo(
    () => (all ?? []).filter((a) => a.appointment_date >= weekStartStr && a.appointment_date <= todayStr).length,
    [all, weekStartStr, todayStr]
  );

  function resetFilters() {
    setFilterYear(String(NOW.getFullYear()));
    setFilterMonth("all");
    setFilterDay("all");
    setFilterDept("All");
    setFilterStatus("all");
    setSearch("");
  }

  const isFiltered =
    filterMonth !== "all" ||
    filterDay !== "all" ||
    filterDept !== "All" ||
    filterStatus !== "all" ||
    search.trim() !== "";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Overview of all booking activity at SNPC Clinic
          </p>
        </div>
        <Link
          to="/admin/requests"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          View All Requests →
        </Link>
      </div>

      {/* ── Global KPIs (unfiltered) ── */}
      {all && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total Bookings"
            value={all.length}
            sub="all time"
            color="text-blue-500"
            icon={<svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <StatCard
            label="Today"
            value={todayCount}
            sub={fmtDate(todayStr)}
            color="text-violet-500"
            icon={<svg className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="This Week"
            value={weekCount}
            sub="Mon – today"
            color="text-emerald-500"
            icon={<svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
          <StatCard
            label="Pending"
            value={(all ?? []).filter((a) => a.status === "pending").length}
            sub="needs action"
            color="text-amber-500"
            icon={<svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Filter &amp; Analyse</p>
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-blue-500 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {/* Year */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Year</label>
            <select
              value={filterYear}
              onChange={(e) => { setFilterYear(e.target.value); setFilterMonth("all"); setFilterDay("all"); }}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="all">All years</option>
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Month */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Month</label>
            <select
              value={filterMonth}
              onChange={(e) => { setFilterMonth(e.target.value); setFilterDay("all"); }}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="all">All months</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
              ))}
            </select>
          </div>

          {/* Day */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Day</label>
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              disabled={dayOptions.length === 0}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
            >
              <option value="all">All days</option>
              {dayOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Department</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name / phone…"
                className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>

        {/* Active filter tags */}
        {isFiltered && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filterMonth !== "all" && (
              <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-500">
                {MONTHS[parseInt(filterMonth) - 1]}
                <button onClick={() => { setFilterMonth("all"); setFilterDay("all"); }}>×</button>
              </span>
            )}
            {filterDay !== "all" && (
              <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-500">
                Day {filterDay}
                <button onClick={() => setFilterDay("all")}>×</button>
              </span>
            )}
            {filterDept !== "All" && (
              <span className="flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-medium text-violet-500">
                {filterDept}
                <button onClick={() => setFilterDept("All")}>×</button>
              </span>
            )}
            {filterStatus !== "all" && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-500">
                {filterStatus}
                <button onClick={() => setFilterStatus("all")}>×</button>
              </span>
            )}
            {search.trim() && (
              <span className="flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                &quot;{search}&quot;
                <button onClick={() => setSearch("")}>×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {err && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-4">
          <p className="text-sm font-semibold text-red-500 mb-1">Failed to load dashboard data</p>
          <p className="text-xs text-red-400 font-mono break-all">{err}</p>
          <button
          onClick={() => { setErr(null); setAll(null); setRetryCount((c) => c + 1); }}
            className="mt-3 rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10"
          >
            ↺ Retry
          </button>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {!all && !err && (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      )}

      {/* ── Charts & Breakdowns ── */}
      {all && (
        <div className="grid gap-6 md:grid-cols-3">

          {/* Status donut */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/20">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Status Breakdown
            </p>
            <StatusRing counts={counts} total={filtered.length} />
          </div>

          {/* Dept bar chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/20">
            <MiniBarChart data={deptCounts} label="By Department" />
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Approval Rate
              </p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-3xl font-bold text-emerald-500">{approvalRate}%</span>
                <span className="mb-1 text-xs text-muted-foreground">approved + completed</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${approvalRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Daily trend */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/20">
            <MiniBarChart data={dailyCounts} label="Bookings Trend (last 14 days in filter)" />
            {dailyCounts.length === 0 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">No data for selected period</p>
            )}
          </div>
        </div>
      )}

      {/* ── Status Summary Cards (filtered) ── */}
      {all && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATUSES.map((s) => {
            const c = STATUS_COLOR[s];
            return (
              <div key={s} className={`rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/20 group`}>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${c.bg} ${c.text}`}>
                    {s}
                  </span>
                  <span className="text-xl font-bold tabular-nums">{counts[s]}</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-1.5 rounded-full ${c.bar} transition-all duration-500`}
                    style={{ width: `${pct(counts[s], filtered.length)}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-[11px] text-muted-foreground">
                  {pct(counts[s], filtered.length)}%
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Recent Appointments Table ── */}
      {all && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="font-semibold">
              Appointments
              <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-500">
                {filtered.length}
              </span>
            </p>
            <Link to="/admin/requests" className="text-xs text-blue-500 hover:underline">
              Manage →
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No appointments match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 50).map((a, i) => (
                    <tr
                      key={a.id}
                      className={`relative border-b border-border/50 transition-all duration-300 hover:bg-muted/40 hover:-translate-y-0.5 hover:shadow-md hover:z-10 ${
                        i % 2 === 0 ? "" : "bg-muted/20"
                      }`}
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium">{a.name}</p>
                        <p className="text-[11px] text-muted-foreground">{a.phone}</p>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{a.department}</td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">{fmtDate(a.appointment_date)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{a.appointment_time}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLOR[a.status].bg} ${STATUS_COLOR[a.status].text}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length > 50 && (
                <p className="border-t border-border px-5 py-3 text-center text-xs text-muted-foreground">
                  Showing 50 of {filtered.length} — use filters to narrow down
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
