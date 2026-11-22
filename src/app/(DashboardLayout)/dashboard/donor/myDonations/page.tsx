import Animate from "@/components/Reusable/Animate";
import { formatDate } from "@/components/Reusable/FormatDate";
import { myDonations } from "@/server/donor/donor.service";
import { ICreateDonation } from "@/types/donor/donor";
import {
  Building2,
  CalendarDays,
  Clock3,
  Droplets,
  HeartHandshake,
} from "lucide-react";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "ACCEPTED":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "COMPLETED":
      return "bg-green-500/10 text-green-600 border-green-500/20";
      case "DECLINED":
        return "bg-red-500/10 text-red-600 border-red-500/20";
  }
};

const Page = async () => {
  const response = await myDonations();
  const withTime = { hour: "2-digit", minute: "2-digit" } as const;
  const donations: ICreateDonation[] = Array.isArray(response?.data)
    ? response.data
    : response?.data
      ? [response.data]
      : [];

  return (
    <main className="min-h-screen space-y-7 p-6">
      {/* Hero */}
      <Animate type="fadeDown">
        <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-red-400 via-red-500 to-rose-700 p-6 text-primary-foreground shadow-lg sm:p-8">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-35 border-white/10" />
          <div className="absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium opacity-80">
                <HeartHandshake size={18} />
                Donor Dashboard
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                My Donation Activities
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 opacity-80 sm:text-base">
                Track your donation interests and stay updated on responses from
                patients.
              </p>
            </div>

            <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm">
              <span className="text-3xl font-bold tabular-nums">
                {donations.length}
              </span>
              <span className="text-xs font-medium opacity-80">
                Total requests
              </span>
            </div>
          </div>
        </section>
      </Animate>

      {/* Section heading */}
      <Animate type="fadeUp" delay={0.1}>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Your Donation Requests
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              All your submitted donation interests in one place.
            </p>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            {donations.length} {donations.length === 1 ? "request" : "requests"}{" "}
            found
          </p>
        </div>
      </Animate>

      {/* Donation cards */}
      {donations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation, index) => {
            const timeline = [
              {
                label: "Submitted",
                icon: CalendarDays,
                value: donation.createdAt,
              },
              { label: "Notified", icon: Clock3, value: donation.notifiedAt },
              {
                label: "Responded",
                icon: HeartHandshake,
                value: donation.respondedAt,
              },
            ];
            return (
              <Animate
                key={donation.id}
                type="fadeUp"
                delay={0.15 + index * 0.08}
              >
                <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
                  {/* Header: icon + patient + status */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Droplets size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold capitalize leading-tight">
                        {donation.request?.patientName || "Unknown patient"}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2
                          size={13}
                          className="shrink-0 text-primary"
                        />
                        <span className="truncate capitalize">
                          {donation.request?.hospitalName ||
                            "Hospital not provided"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyles(
                        donation.status,
                      )}`}
                    >
                      {donation.status}
                    </span>
                  </div>
                  {/* Reason */}
                  <div className="mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Reason
                    </p>
                    <p
                      title={donation.request?.reason}
                      className="mt-0.5 line-clamp-2 text-sm leading-5"
                    >
                      {donation.request?.reason || "No reason provided"}
                    </p>
                  </div>
                  {/* Timeline: one line per item */}
                  <ul className="mt-3 divide-y divide-border text-sm">
                    {timeline.map(({ label, icon: Icon, value }) => (
                      <li
                        key={label}
                        className="flex items-center justify-between gap-3 py-1.5"
                      >
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon size={14} className="text-primary" />
                          {label}
                        </span>
                        <span className="text-xs font-medium tabular-nums">
                          {formatDate(value, withTime)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {/* Scheduled donation */}
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                    <div className="flex items-center gap-2 text-primary">
                      <CalendarDays size={15} />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Scheduled
                      </span>
                    </div>

                    <div className="text-right">
                      {donation.donation?.scheduledAt ? (
                        <>
                          <p className="text-xs font-semibold tabular-nums">
                            {formatDate(
                              donation.donation.scheduledAt,
                              withTime,
                            )}
                          </p>

                          <p
                            className={`text-xs font-bold ${
                              donation.donation.status === "SCHEDULED"
                                ? "text-chart-3"
                                : "text-chart-2"
                            }`}
                          >
                            {donation.donation.status}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          The donation has not been scheduled yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Completed donation */}
                  {donation.donation?.scheduledAt &&
                    (donation.donation?.completedAt ? (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent/20 px-3 py-2">
                        <div className="flex items-center gap-2 text-accent-foreground">
                          <HeartHandshake size={15} />
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Completed
                          </span>
                        </div>

                        <p className="text-xs font-semibold tabular-nums">
                          {formatDate(donation.donation.completedAt, withTime)}
                        </p>
                      </div>
                    ) : (
                      <p className="h-10 py-5 text-center text-xs text-muted-foreground">
                        The donation has not been completed yet.
                      </p>
                    ))}{" "}
                </article>
              </Animate>
            );
          })}
        </div>
      ) : (
        <Animate type="fadeUp" delay={0.15}>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HeartHandshake size={30} />
            </div>

            <h3 className="mt-5 text-lg font-bold">No donation requests yet</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              When you express interest in donating blood, your donation
              requests will appear here.
            </p>
          </div>
        </Animate>
      )}
    </main>
  );
};

export default Page;
