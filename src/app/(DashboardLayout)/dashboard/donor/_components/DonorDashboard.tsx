"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  CalendarClock,
  Droplets,
  HandCoins,
  HeartPulse,
  MapPin,
  Siren,
} from "lucide-react";
import Animate from "@/components/Reusable/Animate";
import { formatDate } from "@/components/Reusable/FormatDate";
import { IContribution } from "@/types/contribution/contribution";

export interface DonationItem {
  id: string;
  date: string;
  units: number;
  hospital: string;
  status: string;
}

interface RequestItem {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospitalName: string;
  city: string | null;
  urgency: string;
  createdAt: string;
}

interface Props {
  name: string;
  bloodGroup: string | null;
  donations: DonationItem[];
  contributions: IContribution[];
  requests: RequestItem[];
}

const WAIT_DAYS = 90;
const DAY = 86_400_000;

const URGENCY_COLORS: Record<string, string> = {
  critical: "var(--destructive)",
  urgent: "#f59e0b",
  normal: "var(--primary)",
};

const formatMoney = (n: number) => `৳${n.toLocaleString("en-BD")}`;
const formatGroup = (g: string) => g.replace("_POS", "+").replace("_NEG", "-");

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--foreground)",
};

// last 6 month buckets, oldest first
const lastSixMonths = () => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-US", { month: "short" }),
    };
  });
};

const monthKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}`;
};

const DonorDashboard = ({
  name,
  bloodGroup,
  donations,
  contributions,
  requests,
}: Props) => {
  const months = useMemo(lastSixMonths, []);

  const stats = useMemo(() => {
    const totalUnits = donations.reduce((s, d) => s + d.units, 0);
    const paid = contributions.filter((c) => c.status === "SUCCEEDED");
    const totalGiven = paid.reduce((s, c) => s + c.amount, 0);

    const last = donations.length
      ? Math.max(...donations.map((d) => new Date(d.date).getTime()))
      : null;
    const daysSince = last ? Math.floor((Date.now() - last) / DAY) : null;
    const daysLeft =
      daysSince === null ? 0 : Math.max(0, WAIT_DAYS - daysSince);
    const progress =
      daysSince === null
        ? 100
        : Math.min(100, Math.round((daysSince / WAIT_DAYS) * 100));

    return {
      totalUnits,
      totalGiven,
      last,
      daysLeft,
      progress,
      eligible: daysLeft === 0,
    };
  }, [donations, contributions]);

  const donationsByMonth = useMemo(
    () =>
      months.map(({ key, label }) => ({
        month: label,
        donations: donations.filter((d) => monthKey(d.date) === key).length,
      })),
    [months, donations],
  );

  const givingByMonth = useMemo(
    () =>
      months.map(({ key, label }) => ({
        month: label,
        amount: contributions
          .filter(
            (c) => c.status === "SUCCEEDED" && monthKey(c.createdAt) === key,
          )
          .reduce((s, c) => s + c.amount, 0),
      })),
    [months, contributions],
  );

  const urgencyData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach((r) => {
      const k = r.urgency.toLowerCase();
      counts[k] = (counts[k] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [requests]);

  const recentDonations = [...donations]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5);

  const topRequests = [...requests]
    .sort((a, b) => {
      const rank = (u: string) =>
        ["critical", "urgent", "normal"].indexOf(u.toLowerCase());
      return rank(a.urgency) - rank(b.urgency);
    })
    .slice(0, 5);

  const cards = [
    {
      icon: Droplets,
      label: "Total donations",
      value: donations.length,
      hint: `${stats.totalUnits} units given`,
    },
    {
      icon: HandCoins,
      label: "Contributed",
      value: formatMoney(stats.totalGiven),
      hint: "To campaigns",
    },
    {
      icon: Siren,
      label: "Matching requests",
      value: requests.length,
      hint: bloodGroup ? `For ${formatGroup(bloodGroup)}` : "Near you",
    },
    {
      icon: CalendarClock,
      label: "Last donation",
      value: stats.last
        ? formatDate(new Date(stats.last).toISOString())
        : "None yet",
      hint: stats.eligible
        ? "You can donate now"
        : `${stats.daysLeft} days to go`,
    },
  ];

  // eligibility ring
  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <div className="space-y-6 p-6">
      {/* Welcome */}
      <Animate
        type="fadeUp"
        className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/15 via-card to-card p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <HeartPulse className="h-3.5 w-3.5" />
              Donor dashboard
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.eligible
                ? "You are eligible to donate. Someone may need you today."
                : `You can donate again in ${stats.daysLeft} days. Thank you for your last gift.`}
            </p>
          </div>

          {bloodGroup && (
            <div className="flex w-fit items-center gap-3 rounded-2xl border bg-background/70 px-5 py-3 backdrop-blur">
              <Droplets className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Blood group</p>
                <p className="text-3xl font-black leading-none text-primary">
                  {formatGroup(bloodGroup)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Animate>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, hint }) => (
          <Animate
            key={label}
            type="fadeUp"
            className="rounded-2xl border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </Animate>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Giving area chart */}
        <Animate
          type="fadeUp"
          className="rounded-2xl border bg-card p-5 lg:col-span-2"
        >
          <h3 className="font-semibold text-foreground">
            Campaign contributions
          </h3>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={givingByMonth} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="giveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0"
                      stopColor="var(--primary)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="1"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => formatMoney(Number(v))}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#giveFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Animate>

        {/* Eligibility ring */}
        <Animate
          type="fadeUp"
          className="flex flex-col items-center justify-center rounded-2xl border bg-card p-5 text-center"
        >
          <h3 className="font-semibold text-foreground">Donation readiness</h3>
          <div className="relative mt-4 h-40 w-40">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C - (C * stats.progress) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">
                {stats.progress}%
              </span>
              <span className="text-xs text-muted-foreground">recovered</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {stats.eligible
              ? "Ready to donate"
              : `${stats.daysLeft} days until next donation`}
          </p>
        </Animate>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold text-foreground">Donations per month</h3>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={donationsByMonth}
                margin={{ left: -20, right: 8 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "var(--secondary)" }}
                />
                <Bar
                  dataKey="donations"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Animate>

        <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold text-foreground">Requests by urgency</h3>
          <p className="text-xs text-muted-foreground">
            Matching your blood group
          </p>
          {urgencyData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No matching requests right now.
            </p>
          ) : (
            <div className="mt-4 flex h-56 items-center">
              <div className="h-full w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={urgencyData}
                      dataKey="value"
                      innerRadius="60%"
                      outerRadius="90%"
                      paddingAngle={3}
                      stroke="none"
                    >
                      {urgencyData.map((d) => (
                        <Cell
                          key={d.name}
                          fill={
                            URGENCY_COLORS[d.name] ?? "var(--muted-foreground)"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="w-1/2 space-y-2">
                {urgencyData.map((d) => (
                  <li
                    key={d.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 capitalize text-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          background:
                            URGENCY_COLORS[d.name] ?? "var(--muted-foreground)",
                        }}
                      />
                      {d.name}
                    </span>
                    <span className="font-semibold text-foreground">
                      {d.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Animate>
      </div>

      {/* Lists */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Siren className="h-4 w-4 text-primary" /> Requests that need you
          </h3>
          <div className="mt-4 space-y-3">
            {topRequests.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing urgent right now.
              </p>
            )}
            {topRequests.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {r.patientName}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {r.hospitalName}
                    {r.city ? `, ${r.city}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold text-primary">
                    {formatGroup(r.bloodGroup)}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {r.urgency} · {r.unitsNeeded}u
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Animate>

        <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Activity className="h-4 w-4 text-primary" /> Recent donations
          </h3>
          <div className="mt-4 space-y-3">
            {recentDonations.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No donations yet. Your first one will show here.
              </p>
            )}
            {recentDonations.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {d.hospital}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(d.date)}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {d.units} unit{d.units === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        </Animate>
      </div>
    </div>
  );
};

export default DonorDashboard;
