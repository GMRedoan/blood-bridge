"use client";

import { ReactNode, useMemo } from "react";
import Link from "next/link";
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
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  HandCoins,
  HeartHandshake,
  Plus,
  Siren,
  UserRound,
} from "lucide-react";
import Animate from "@/components/Reusable/Animate";
import { formatDate } from "@/components/Reusable/FormatDate";

/* ---------- minimal types (match your real ones) ---------- */
interface RequestItem {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospitalName: string;
  city: string | null;
  urgency: string;
  status: string;
  createdAt: string;
}
interface ContributionItem {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  campaign?: { title: string };
}
interface CampaignItem {
  id: string;
  title: string;
  status: string;
  targetAmount: number;
  raisedAmount: number;
  createdAt: string;
}

interface Props {
  variant: "patient" | "hospital";
  name: string;
  requests: RequestItem[];
  contributions: ContributionItem[];
  campaigns?: CampaignItem[];
}

/* ---------- config: change links here ---------- */
const LINKS = {
  patient: {
    newRequest: "/dashboard/patient/create-request",
    requests: "/dashboard/patient/my-requests",
    campaigns: "",
  },
  hospital: {
    newRequest: "/dashboard/hospital/create-request",
    requests: "/dashboard/hospital/my-requests",
    campaigns: "/dashboard/hospital/my-campaign",
  },
};

/* ---------- helpers ---------- */
const URGENCY_COLORS: Record<string, string> = {
  critical: "var(--destructive)",
  urgent: "#f59e0b",
  normal: "var(--primary)",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  VERIFIED: "#10b981",
  APPROVED: "#10b981",
  ACTIVE: "#10b981",
  FULFILLED: "#06b6d4",
  COMPLETED: "#06b6d4",
  REJECTED: "var(--destructive)",
  CANCELLED: "var(--destructive)",
};
const colorOfStatus = (s: string) =>
  STATUS_COLORS[s.toUpperCase()] ?? "var(--muted-foreground)";

const formatMoney = (n: number) => `৳${n.toLocaleString("en-BD")}`;
const formatGroup = (g: string) => g.replace("_POS", "+").replace("_NEG", "-");
const progressOf = (raised: number, target: number) =>
  target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--foreground)",
};

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
const countBy = <T,>(items: T[], pick: (i: T) => string | null | undefined) => {
  const map: Record<string, number> = {};
  items.forEach((i) => {
    const k = pick(i);
    if (k) map[k] = (map[k] ?? 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

/* ---------- building blocks ---------- */
const Empty = ({ text }: { text: string }) => (
  <p className="py-10 text-center text-sm text-muted-foreground">{text}</p>
);

const ChartCard = ({
  title,
  sub,
  className = "",
  children,
}: {
  title: string;
  sub?: string;
  className?: string;
  children: ReactNode;
}) => (
  <Animate
    type="fadeUp"
    className={`rounded-2xl border bg-card p-5 ${className}`}
  >
    <h3 className="font-semibold text-foreground">{title}</h3>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    <div className="mt-4">{children}</div>
  </Animate>
);

const Donut = ({
  data,
  colorOf,
}: {
  data: { name: string; value: number }[];
  colorOf: (name: string, index: number) => string;
}) =>
  data.length === 0 ? (
    <Empty text="No data yet." />
  ) : (
    <div className="flex h-56 items-center">
      <div className="h-full w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={d.name} fill={colorOf(d.name, i)} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-1/2 space-y-2">
        {data.map((d, i) => (
          <li
            key={d.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 capitalize text-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: colorOf(d.name, i) }}
              />
              {d.name.toLowerCase()}
            </span>
            <span className="font-semibold text-foreground">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );

/* ---------- main ---------- */
const RequesterDashboard = ({
  variant,
  name,
  requests,
  contributions,
  campaigns = [],
}: Props) => {
  const isHospital = variant === "hospital";
  const links = LINKS[variant];
  const months = useMemo(lastSixMonths, []);

  const paid = useMemo(
    () => contributions.filter((c) => c.status === "SUCCEEDED"),
    [contributions],
  );
  const totalGiven = paid.reduce((s, c) => s + c.amount, 0);

  const pending = requests.filter((r) => r.status === "PENDING").length;
  const verified = requests.filter((r) =>
    ["VERIFIED", "APPROVED", "FULFILLED", "COMPLETED"].includes(r.status),
  ).length;
  const unitsTotal = requests.reduce((s, r) => s + r.unitsNeeded, 0);

  const totalRaised = campaigns.reduce((s, c) => s + c.raisedAmount, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;

  const requestsByMonth = useMemo(
    () =>
      months.map(({ key, label }) => ({
        month: label,
        requests: requests.filter((r) => monthKey(r.createdAt) === key).length,
      })),
    [months, requests],
  );

  const givingByMonth = useMemo(
    () =>
      months.map(({ key, label }) => ({
        month: label,
        amount: paid
          .filter((c) => monthKey(c.createdAt) === key)
          .reduce((s, c) => s + c.amount, 0),
      })),
    [months, paid],
  );

  const statusData = useMemo(
    () => countBy(requests, (r) => r.status),
    [requests],
  );
  const urgencyData = useMemo(
    () => countBy(requests, (r) => r.urgency?.toLowerCase()),
    [requests],
  );
  const groupData = useMemo(
    () =>
      countBy(requests, (r) => r.bloodGroup && formatGroup(r.bloodGroup)).sort(
        (a, b) => b.value - a.value,
      ),
    [requests],
  );
  const campaignStatus = useMemo(
    () => countBy(campaigns, (c) => c.status),
    [campaigns],
  );

  const recentRequests = [...requests]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);
  const recentContributions = [...paid]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);
  const topCampaigns = [...campaigns]
    .sort((a, b) => b.raisedAmount - a.raisedAmount)
    .slice(0, 4);

  const cards = [
    {
      icon: Siren,
      label: "Blood requests",
      value: requests.length,
      hint: `${unitsTotal} units requested`,
    },
    {
      icon: Clock,
      label: "Awaiting review",
      value: pending,
      hint: "Pending admin verification",
    },
    {
      icon: CheckCircle2,
      label: "Verified",
      value: verified,
      hint: "Visible to donors",
    },
    isHospital
      ? {
          icon: HeartHandshake,
          label: "My campaigns",
          value: campaigns.length,
          hint: `${formatMoney(totalRaised)} raised`,
        }
      : {
          icon: HandCoins,
          label: "Contributed",
          value: formatMoney(totalGiven),
          hint: `${paid.length} contributions`,
        },
  ];

  const WelcomeIcon = isHospital ? Building2 : UserRound;

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
              <WelcomeIcon className="h-3.5 w-3.5" />
              {isHospital ? "Hospital dashboard" : "Patient dashboard"}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {pending > 0
                ? `${pending} request${pending === 1 ? " is" : "s are"} waiting for admin verification.`
                : "Track your requests and see how donors are responding."}
            </p>
          </div>

          <Link
            href={links.newRequest}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New blood request
          </Link>
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

      {/* Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Requests over time"
          sub="Last 6 months"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={requestsByMonth}
                margin={{ left: -20, right: 8 }}
              >
                <defs>
                  <linearGradient id="reqFill" x1="0" y1="0" x2="0" y2="1">
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
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#reqFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Request status" sub="Where your requests stand">
          <Donut data={statusData} colorOf={colorOfStatus} />
        </ChartCard>
      </div>

      {/* Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="By blood group" sub="Groups you requested">
          {groupData.length === 0 ? (
            <Empty text="No requests yet." />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupData} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
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
                    dataKey="value"
                    name="Requests"
                    fill="var(--primary)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="By urgency" sub="How urgent your cases are">
          <Donut
            data={urgencyData}
            colorOf={(n) => URGENCY_COLORS[n] ?? "var(--muted-foreground)"}
          />
        </ChartCard>

        {isHospital ? (
          <ChartCard title="Campaign status" sub="Your fundraising campaigns">
            <Donut data={campaignStatus} colorOf={colorOfStatus} />
          </ChartCard>
        ) : (
          <ChartCard title="My contributions" sub="Last 6 months">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={givingByMonth} margin={{ left: -10, right: 8 }}>
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
                    cursor={{ fill: "var(--secondary)" }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="var(--primary)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}
      </div>

      {/* Lists */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Siren className="h-4 w-4 text-primary" /> Recent requests
            </h3>
            <Link
              href={links.requests}
              className="group flex items-center gap-1 text-xs font-semibold text-primary"
            >
              View all{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentRequests.length === 0 && (
              <Empty text="No requests yet. Create your first one." />
            )}
            {recentRequests.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {r.patientName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.hospitalName} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="flex items-center justify-end gap-1 font-bold text-primary">
                    <Droplets className="h-3.5 w-3.5" />
                    {formatGroup(r.bloodGroup)}
                  </p>
                  <span
                    className="mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                    style={{
                      color: colorOfStatus(r.status),
                      background:
                        "color-mix(in srgb, currentColor 14%, transparent)",
                    }}
                  >
                    {r.status.toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Animate>

        {isHospital ? (
          <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <HeartHandshake className="h-4 w-4 text-primary" /> My campaigns
              </h3>
              <Link
                href={links.campaigns}
                className="group flex items-center gap-1 text-xs font-semibold text-primary"
              >
                View all{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {topCampaigns.length === 0 && <Empty text="No campaigns yet." />}
              {topCampaigns.map((c) => {
                const p = progressOf(c.raisedAmount, c.targetAmount);
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <p className="truncate font-semibold text-foreground">
                        {c.title}
                      </p>
                      <span className="shrink-0 text-xs font-bold text-primary">
                        {p}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${p}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatMoney(c.raisedAmount)} of{" "}
                      {formatMoney(c.targetAmount)} · {c.status.toLowerCase()}
                    </p>
                  </div>
                );
              })}
            </div>
          </Animate>
        ) : (
          <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <HandCoins className="h-4 w-4 text-primary" /> Recent
              contributions
            </h3>
            <div className="mt-4 space-y-3">
              {recentContributions.length === 0 && (
                <Empty text="No contributions yet." />
              )}
              {recentContributions.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-xl border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {c.campaign?.title ?? "Campaign"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 font-bold text-primary">
                    {formatMoney(c.amount)}
                  </span>
                </div>
              ))}
            </div>
          </Animate>
        )}
      </div>
    </div>
  );
};

export default RequesterDashboard;
