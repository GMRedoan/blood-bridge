"use client";

import { useMemo, useState } from "react";
import {
    BadgeCheck,
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Animate from "@/components/Reusable/Animate";
import Pagination from "@/components/Reusable/Pagination";
import { formatDate } from "@/components/Reusable/FormatDate";
import { usePagination } from "@/hooks/usePagination";
import { ICampaign } from "@/types/campaign/campaign";
import CreateCampaignDialog from "@/app/(DashboardLayout)/dashboard/admin/MyCampaign/_components/CreateCampaignDialog";
import ContributeDialog from "./contributeDialog";
import { formatMoney } from "@/lib/formatMoney";
import CampaignWorkflow from "./CampaignWorkflow";
import Stats from "./Stats";

interface CampaignsPageProps {
  campaigns: ICampaign[];
  canCreate: boolean;
  isLoggedIn: boolean;
}
type SortKey = "newest" | "mostFunded" | "almostThere";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "mostFunded", label: "Most funded" },
  { key: "almostThere", label: "Almost there" },
];

const getProgress = (raised: number, target: number) =>
  target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

const CampaignsPage = ({
  campaigns,
  canCreate,
  isLoggedIn,
}: CampaignsPageProps) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const visibleCampaigns = useMemo(() => {
  const keyword = search.trim().toLowerCase();
  const filtered = campaigns.filter(
      (c) =>
        !keyword ||
        c.title.toLowerCase().includes(keyword) ||
        c.createdBy?.name.toLowerCase().includes(keyword),
    );
  return [...filtered].sort((a, b) => {
      if (sort === "mostFunded") return b.raisedAmount - a.raisedAmount;
      if (sort === "almostThere")
        return (
          getProgress(b.raisedAmount, b.targetAmount) -
          getProgress(a.raisedAmount, a.targetAmount)
        );
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [campaigns, search, sort]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedCampaigns,
  } = usePagination({
    data: visibleCampaigns,
    itemsPerPage: 9,
    resetKey: `${search}-${sort}`,
  });

  return (
    <div className="space-y-12 my-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-primary/15 via-background to-background">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          {canCreate && (
            <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
              <CreateCampaignDialog />
            </div>
          )}

          <Animate type="fadeUp" className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Every taka saves a life
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Fund a cause that{" "}
              <span className="text-primary">truly matters</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Support verified medical fundraising campaigns and help patients
              get the care they urgently need.
            </p>
          </Animate>

          {/* Stats */}
          <div>
            <Stats campaigns={campaigns} />
          </div>
         </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
        {/* Workflow */}
        <div>
          <CampaignWorkflow/>
        </div>

        {/* Toolbar */}
        <section className="space-y-6">
          <Animate className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Active campaigns
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {visibleCampaigns.length} campaign
                {visibleCampaigns.length === 1 ? "" : "s"} need your support.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 sm:w-64"
                />
              </div>

              <div className="flex rounded-lg border p-1">
                {SORTS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSort(key)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      sort === key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </Animate>

          {/* Cards */}
          {paginatedCampaigns.length === 0 ? (
            <Animate
              type="fadeUp"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-16 text-center"
            >
              <HeartHandshake className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <h3 className="font-semibold text-foreground">
                No campaigns found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search or check back soon.
              </p>
            </Animate>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedCampaigns.map((campaign) => {
                const progress = getProgress(
                  campaign.raisedAmount,
                  campaign.targetAmount,
                );
                const goalReached = progress >= 100;

                return (
                  <Animate
                    key={campaign.id}
                    type="fadeUp"
                    className="group flex flex-col overflow-hidden rounded-2xl border bg-background transition-all  hover:border-primary/50 hover:shadow-lg"
                  >
                    {/* Banner */}
                    <div className="relative flex h-28 items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
                      <HeartHandshake className="h-12 w-12 text-primary/60 transition-transform group-hover:scale-110" />
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-green-500/80 px-2.5 py-1 text-xs font-semibold">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                      <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                        {progress}%
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3
                        className="line-clamp-2 text-lg font-semibold text-foreground"
                        title={campaign.title}
                      >
                        {campaign.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {campaign.description}
                      </p>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-end justify-between text-sm">
                          <span className="font-bold text-foreground">
                            {formatMoney(campaign.raisedAmount)}
                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                              raised
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            of {formatMoney(campaign.targetAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="mt-4 space-y-1.5 border-t pt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                           Created By: {campaign.createdBy?.name ?? "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span>{campaign.createdBy?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{campaign.createdBy?.phone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          <span>Started {formatDate(campaign.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="mt-auto pt-5">
                        <ContributeDialog
                          campaignId={campaign.id}
                          campaignTitle={campaign.title}
                          isLoggedIn={isLoggedIn}
                          disabled={goalReached}
                        />
                      </div>
                    </div>
                  </Animate>
                );
              })}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>

        {/* Trust footer */}
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          All campaigns are reviewed by administrators before going live.
        </p>
      </div>
    </div>
  );
};

export default CampaignsPage;