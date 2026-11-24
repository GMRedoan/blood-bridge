"use client";

import { useState } from "react";
import { CalendarDays, HeartHandshake } from "lucide-react";
import { Input } from "@/components/ui/input";
import Animate from "@/components/Reusable/Animate";
import Pagination from "@/components/Reusable/Pagination";
import { formatDate } from "@/components/Reusable/FormatDate";
import { usePagination } from "@/hooks/usePagination";
import CreateCampaignDialog from "./CreateCampaignDialog";
import { ICampaign } from "@/types/campaign/campaign";
import { statusStyles } from "@/lib/statusStyles";
import CampaignContributionsDialog from "./campaignContributionDialog";
 
interface MyCampaignsListProps {
  campaigns: ICampaign[];
}

const formatMoney = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

const MyCampaignsList = ({ campaigns }: MyCampaignsListProps) => {
  const [search, setSearch] = useState("");
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedCampaigns,
  } = usePagination({
    data: filteredCampaigns,
    itemsPerPage: 6,
    resetKey: search,
  });

   return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <Animate className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              My Campaigns
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track the fundraising campaigns you have created.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-4 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold leading-tight text-foreground">
                  {campaigns.length}
                </p>
              </div>
            </div>

            <CreateCampaignDialog />
          </div>
        </Animate>

        {/* Search */}
        <Animate type="fadeUp">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        </Animate>

        {/* Cards */}
        {paginatedCampaigns.length === 0 ? (
          <Animate
            type="fadeUp"
            className="flex flex-col items-center justify-center px-4 py-16 text-center"
          >
            <HeartHandshake className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground">
              No campaigns found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &quot;Add Campaign&quot; to create your first one.
            </p>
          </Animate>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paginatedCampaigns.map((campaign) => {
              const style = statusStyles[campaign.status] 
              const progress =
                campaign.targetAmount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (campaign.raisedAmount / campaign.targetAmount) * 100,
                      ),
                    )
                  : 0;

              return (
                <Animate
                  key={campaign.id}
                  type="fadeUp"
                  className="flex flex-col rounded-2xl border border-x-primary/30 hover:border-x-primary bg-background p-5"
                >
                  {/* Title + status */}
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="line-clamp-2 text-lg font-semibold text-foreground"
                      title={campaign.title}
                    >
                      {campaign.title}
                    </h3>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
                    >
                      <span />
                      {campaign.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {campaign.description}
                  </p>

                  {/* Funding progress */}
                  <div className="mt-4">
                    <div className="flex items-end justify-between text-sm">
                      <span className="font-semibold text-foreground">
                        {formatMoney(campaign.raisedAmount)}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          raised
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Goal {formatMoney(campaign.targetAmount)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {progress}% funded
                    </p>
                  </div>

                  {/* Date */}
                  <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    <span>Created {formatDate(campaign.createdAt)}</span>
                  </div>
                  <CampaignContributionsDialog
                    campaignId={campaign.id}
                    campaignTitle={campaign.title}
                  />
                </Animate>
              );
            })}
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default MyCampaignsList;