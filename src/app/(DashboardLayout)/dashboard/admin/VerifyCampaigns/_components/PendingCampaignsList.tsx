"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Animate from "@/components/Reusable/Animate";
import Pagination from "@/components/Reusable/Pagination";
import { formatDate } from "@/components/Reusable/FormatDate";
import { usePagination } from "@/hooks/usePagination";
import { verifyCampaign } from "@/server/campaign/campaign.service";
import {
  CalendarDays,
  CheckCircle,
  HeartHandshake,
  Loader2,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { ICampaign } from "@/types/campaign/campaign";
import { Toast } from "@/components/Reusable/Toast";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

interface PendingCampaignsListProps {
  campaigns: ICampaign[];
}

type CampaignAction = "ACTIVE" | "CANCELLED";

const formatMoney = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

const PendingCampaignsList = ({ campaigns }: PendingCampaignsListProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<{
    id: string;
    action: CampaignAction;
  } | null>(null);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const keyword = search.trim().toLowerCase();
    return (
      campaign.title.toLowerCase().includes(keyword) ||
      campaign?.createdBy?.name.toLowerCase().includes(keyword) ||
      campaign?.createdBy?.email.toLowerCase().includes(keyword)
    );
  });

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

const handleVerify = async (id: string, action: CampaignAction) => {
  const isActive = action === "ACTIVE";

  const result = await Swal.fire({
    title: isActive ? "Activate this campaign?" : "Cancel this campaign?",
    text: isActive
      ? "Are you sure you want to activate this campaign?"
      : "Are you sure you want to cancel this campaign?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: isActive ? "Yes, Activate" : "Yes, Cancel",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: isActive ? "#16a34a" : "#dc2626",
  });

  if (!result.isConfirmed) return;

  try {
    setPending({ id, action });

    await verifyCampaign(id, action);

    Toast({
      icon: "success",
      title: "Campaign updated successfully",
    });

    router.refresh();
  } catch (error) {
    console.error("Failed to update campaign:", error);

    Toast({
      icon: "error",
      title: "Failed to update campaign",
    });
  } finally {
    setPending(null);
  }
};

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <Animate className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Pending Campaigns
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review fundraising campaigns and activate or cancel them.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Pending</p>
              <p className="text-xl font-bold text-foreground">
                {campaigns.length}
              </p>
            </div>
          </div>
        </Animate>

        {/* Search */}
        <Animate type="fadeUp">
        <Input
          placeholder="Search by title or creator..."
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
              No pending campaigns found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Campaigns waiting for approval will appear here.
            </p>
          </Animate>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paginatedCampaigns.map((campaign) => {
              const isPending = pending?.id === campaign.id;
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
                  className="flex flex-col rounded-2xl border bg-background p-5"
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
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        campaign.status === "PENDING"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-red-500/15 text-red-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          campaign.status === "PENDING"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      />
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

                  {/* Creator + date */}
                  <div className="mt-4 space-y-1.5 border-t pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">
                        {campaign?.createdBy?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {campaign?.createdBy?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {campaign?.createdBy?.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      <span>Created {formatDate(campaign.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Button
                      variant="ghost"
                      type="button"
                      disabled={isPending}
                      onClick={() => handleVerify(campaign.id, "ACTIVE")}
                    >
                      {isPending && pending?.action === "ACTIVE" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Activate
                    </Button>

                    <Button
                      type="button"
                      disabled={isPending || campaign.status === "CANCELLED"}
                      onClick={() => handleVerify(campaign.id, "CANCELLED")}
                    >
                      {isPending && pending?.action === "CANCELLED" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Cancel
                    </Button>
                  </div>
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

export default PendingCampaignsList;
