"use client";

import { useState } from "react";
import { HandCoins, Loader2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/components/Reusable/FormatDate";
import { IContribution } from "@/types/contribution/contribution";
import { Toast } from "@/components/Reusable/Toast"; // your path
import { getCampaignContributionHistory } from "@/server/contribution/contribution.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays } from "lucide-react";
import Animate from "@/components/Reusable/Animate";
import { statusStyles } from "@/lib/statusStyles";
import { formatMoney } from "@/lib/formatMoney";

interface CampaignContributionsDialogProps {
  campaignId: string;
  campaignTitle: string;
}

const CampaignContributionsDialog = ({
  campaignId,
  campaignTitle,
}: CampaignContributionsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contributions, setContributions] = useState<IContribution[]>([]);
  const total = contributions.reduce((sum, item) => sum + item.amount, 0);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    setContributions([]);

    try {
      const res = await getCampaignContributionHistory(campaignId);
      setContributions(res?.data ?? []);
    } catch (error) {
      console.error("Failed to load contributions:", error);
      Toast({ icon: "error", title: "Failed to load contributions" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleOpen}
        className="mt-4 w-full gap-2"
      >
        <Users className="h-4 w-4" />
        View Contributions
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="line-clamp-1">{campaignTitle}</DialogTitle>
            <DialogDescription>
              Everyone who contributed to this campaign.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : contributions.length === 0 ? (
            <Animate type="fadeUp" className="flex flex-col items-center py-12 text-center">
              <HandCoins className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-semibold text-foreground">
                No contributions yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Contributions will appear here once someone donates.
              </p>
            </Animate>
          ) : (
            <Animate type="fadeUp" className="space-y-4">
              {/* Summary */}
              <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {contributions.length}{" "}
                    {contributions.length === 1
                      ? "contribution"
                      : "contributions"}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatMoney(total)}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HandCoins className="h-5 w-5" />
                </div>
              </div>

              {/* Table */}
              <div className="max-h-[50vh] w-full overflow-y-auto rounded-2xl border bg-background">
                <Table className="w-full table-fixed">
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow>
                      <TableHead className="w-[30%] px-3">
                        Contributor
                      </TableHead>
                      <TableHead className="w-[16%] px-3">Amount</TableHead>
                      <TableHead className="w-[22%] px-3">Payment ID</TableHead>
                      <TableHead className="w-[16%] px-3">Status</TableHead>
                      <TableHead className="w-[16%] px-3">Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {contributions.map((item) => (
                      <TableRow key={item.id}>
                        {/* Contributor */}
                        <TableCell className="px-3 py-3">
                          <p className="truncate font-semibold text-foreground">
                            {item.contributor?.name ?? "Anonymous"}
                          </p>
                          <p
                            className="truncate text-xs text-muted-foreground"
                            title={item.contributor?.email}
                          >
                            {item.contributor?.email}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.contributor?.phone}
                          </p>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="px-3 py-3">
                          <span className="font-semibold text-primary">
                            {formatMoney(item.amount)}
                          </span>
                        </TableCell>

                        {/* Payment ID */}
                        <TableCell className="px-3 py-3">
                          <span
                            className="block truncate font-mono text-xs text-muted-foreground"
                            title={item.stripePaymentIntentId}
                          >
                            {item.stripePaymentIntentId ?? "N/A"}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              statusStyles[item.status] ??
                              "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {item.status}
                          </span>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="px-3 py-3">
                          <div className="flex items-center gap-1.5 text-sm text-foreground">
                            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Animate>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CampaignContributionsDialog;