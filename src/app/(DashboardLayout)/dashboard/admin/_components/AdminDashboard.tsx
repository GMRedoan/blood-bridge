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
  Ban,
  BadgeCheck,
  Clock,
  Droplets,
  HandCoins,
  HeartHandshake,
  ShieldCheck,
  Siren,
  Trash2,
  Users,
} from "lucide-react";
import Animate from "@/components/Reusable/Animate";
import { formatDate } from "@/components/Reusable/FormatDate";
import { IGetUserProfile } from "@/types/user/user";
import { IContribution } from "@/types/contribution/contribution";

interface CampaignItem {
  id: string;
  title: string;
  status: string;
  targetAmount: number;
  raisedAmount: number;
  createdAt: string;
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
  users: IGetUserProfile[];
  deletedUsers: unknown[];
  contributions: IContribution[];
  campaigns: CampaignItem[];
  pendingCampaigns: CampaignItem[];
  pendingRequests: RequestItem[];
}

/* ---------- helpers ---------- */
const PALETTE = ["var(--primary)", "#f59e0b", "#10b981", "#6366f1", "#06b6d4"];
const URGENCY_COLORS: Record<string, string> = {
  critical: "var(--destructive)",
  urgent: "#f59e0b",
  normal: "var(--primary)",
};

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

/* ---------- small building blocks ---------- */
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

const Empty = ({ text }: { text: string }) => (
  <p className="py-10 text-center text-sm text-muted-foreground">{text}</p>
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
const AdminDashboard = ({
  name,
  users,
  deletedUsers,
  contributions,
  campaigns,
  pendingCampaigns,
  pendingRequests,
}: Props) => {
  const months = useMemo(lastSixMonths, []);

  const paid = useMemo(
    () => contributions.filter((c) => c.status === "SUCCEEDED"),
    [contributions],
  );
  const totalRaised = paid.reduce((s, c) => s + c.amount, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE");
  const banned = users.filter((u) => u.status === "BANNED").length;
  const pendingTotal = pendingRequests.length + pendingCampaigns.length;

  const raisedByMonth = useMemo(
    () =>
      months.map(({ key, label }) => ({
        month: label,
        amount: paid
          .filter((c) => monthKey(c.createdAt) === key)
          .reduce((s, c) => s + c.amount, 0),
      })),
    [months, paid],
  );

  const signupsByMonth = useMemo(
    () =>
      months.map(({ key, label }) => ({
        month: label,
        users: users.filter((u) => monthKey(u.createdAt) === key).length,
      })),
    [months, users],
  );

  const roleData = useMemo(() => countBy(users, (u) => u.role), [users]);
  const statusData = useMemo(() => countBy(users, (u) => u.status), [users]);
  const urgencyData = useMemo(
    () => countBy(pendingRequests, (r) => r.urgency?.toLowerCase()),
    [pendingRequests],
  );

  const donorGroups = useMemo(
    () =>
      countBy(
        users,
        (u) =>
          u.donorProfile?.bloodGroup && formatGroup(u.donorProfile.bloodGroup),
      ).sort((a, b) => b.value - a.value),
    [users],
  );

  const topCities = useMemo(
    () =>
      countBy(users, (u) => u.city?.trim().toLowerCase())
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
        .map((c) => ({
          name: c.name.charAt(0).toUpperCase() + c.name.slice(1),
          value: c.value,
        })),
    [users],
  );

  const topCampaigns = [...activeCampaigns]
    .sort((a, b) => b.raisedAmount - a.raisedAmount)
    .slice(0, 4);
  const recentContributions = [...paid]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);
  const latestRequests = [...pendingRequests]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4);

  const cards = [
    {
      icon: Users,
      label: "Total users",
      value: users.length,
      hint: `${banned} banned`,
    },
    {
      icon: HandCoins,
      label: "Total raised",
      value: formatMoney(totalRaised),
      hint: `${paid.length} contributions`,
    },
    {
      icon: HeartHandshake,
      label: "Active campaigns",
      value: activeCampaigns.length,
      hint: `${pendingCampaigns.length} pending`,
    },
    {
      icon: Trash2,
      label: "Deleted users",
      value: deletedUsers.length,
      hint: "Can be restored",
    },
  ];

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
              <ShieldCheck className="h-3.5 w-3.5" /> Admin dashboard
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {pendingTotal > 0
                ? `${pendingTotal} item${pendingTotal === 1 ? "" : "s"} are waiting for your review.`
                : "You are all caught up. Nothing is waiting for review."}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/admin/pending-requests"
              className="flex items-center gap-3 rounded-2xl border bg-background/70 px-4 py-3 backdrop-blur transition-colors hover:border-primary/50"
            >
              <Siren className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Requests</p>
                <p className="text-2xl font-black leading-none text-foreground">
                  {pendingRequests.length}
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/admin/pending-campaigns"
              className="flex items-center gap-3 rounded-2xl border bg-background/70 px-4 py-3 backdrop-blur transition-colors hover:border-primary/50"
            >
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Campaigns</p>
                <p className="text-2xl font-black leading-none text-foreground">
                  {pendingCampaigns.length}
                </p>
              </div>
            </Link>
          </div>
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

      {/* Row 1: revenue + roles */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Funds raised"
          sub="Successful contributions, last 6 months"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={raisedByMonth} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="adminFill" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#adminFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Users by role" sub="Everyone on the platform">
          <Donut
            data={roleData}
            colorOf={(_, i) => PALETTE[i % PALETTE.length]}
          />
        </ChartCard>
      </div>

      {/* Row 2: signups + blood groups */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="New users" sub="Registrations, last 6 months">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupsByMonth} margin={{ left: -20, right: 8 }}>
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
                  dataKey="users"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Donors by blood group"
          sub="Registered donor profiles"
        >
          {donorGroups.length === 0 ? (
            <Empty text="No donor profiles yet." />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donorGroups} margin={{ left: -20, right: 8 }}>
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
                  <Bar dataKey="value" name="Donors" radius={[8, 8, 0, 0]}>
                    {donorGroups.map((d) => (
                      <Cell key={d.name} fill="var(--primary)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Row 3: urgency + status + cities */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Pending by urgency"
          sub="Requests awaiting verification"
        >
          <Donut
            data={urgencyData}
            colorOf={(n) => URGENCY_COLORS[n] ?? "var(--muted-foreground)"}
          />
        </ChartCard>

        <ChartCard title="Account status" sub="Active vs banned">
          <Donut
            data={statusData}
            colorOf={(n) => (n === "ACTIVE" ? "#10b981" : "var(--destructive)")}
          />
        </ChartCard>

        <ChartCard title="Top cities" sub="Users by location">
          {topCities.length === 0 ? (
            <Empty text="No location data." />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCities}
                  layout="vertical"
                  margin={{ left: 10, right: 8 }}
                >
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "var(--secondary)" }}
                  />
                  <Bar
                    dataKey="value"
                    name="Users"
                    fill="var(--primary)"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Lists */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" /> Requests to verify
            </h3>
            <Link
              href="/dashboard/admin/pending-requests"
              className="group flex items-center gap-1 text-xs font-semibold text-primary"
            >
              View all{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {latestRequests.length === 0 && (
              <Empty text="No pending requests." />
            )}
            {latestRequests.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {r.patientName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.hospitalName}
                    {r.city ? `, ${r.city}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="flex items-center justify-end gap-1 font-bold text-primary">
                    <Droplets className="h-3.5 w-3.5" />
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
            <HeartHandshake className="h-4 w-4 text-primary" /> Top campaigns
          </h3>
          <div className="mt-4 space-y-4">
            {topCampaigns.length === 0 && <Empty text="No active campaigns." />}
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
                    {formatMoney(c.targetAmount)}
                  </p>
                </div>
              );
            })}
          </div>
        </Animate>
      </div>

      <Animate type="fadeUp" className="rounded-2xl border bg-card p-5">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <HandCoins className="h-4 w-4 text-primary" /> Recent contributions
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
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
                  {c.contributor?.name ?? "Anonymous"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.campaign?.title ?? "Campaign"} · {formatDate(c.createdAt)}
                </p>
              </div>
              <span className="shrink-0 font-bold text-primary">
                {formatMoney(c.amount)}
              </span>
            </div>
          ))}
        </div>
      </Animate>

      {banned > 0 && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Ban className="h-4 w-4" /> {banned} account
          {banned === 1 ? " is" : "s are"} currently banned.
        </p>
      )}
    </div>
  );
};

export default AdminDashboard;
