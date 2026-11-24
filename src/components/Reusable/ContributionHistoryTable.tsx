"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Animate from "@/components/Reusable/Animate";
import Pagination from "@/components/Reusable/Pagination";
import { formatDate } from "@/components/Reusable/FormatDate";
import { usePagination } from "@/hooks/usePagination";
import { IContribution } from "@/types/contribution/contribution";
import { CalendarDays, HandCoins, HeartHandshake } from "lucide-react";
import { statusStyles } from "@/lib/statusStyles";
 
interface ContributionHistoryTableProps {
  contributions: IContribution[];
  showContributor?: boolean;
}

const formatMoney = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

const ContributionHistoryTable = ({
  contributions,
  showContributor = false,
}: ContributionHistoryTableProps) => {
  console.log(contributions);
  const [search, setSearch] = useState("");
  const filtered = contributions.filter((item) => {
  const keyword = search.trim().toLowerCase();
    return (
      item.campaign?.title.toLowerCase().includes(keyword) ||
      (showContributor &&
        (item.contributor?.name.toLowerCase().includes(keyword) ||
          item.contributor?.email.toLowerCase().includes(keyword)))
    );
  });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedItems,
  } = usePagination({
    data: filtered,
    itemsPerPage: 10,
    resetKey: search,
  });

  const totalAmount = contributions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      <div className="space-y-6">
        <Animate className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder={
              showContributor
                ? "Search by campaign or contributor..."
                : "Search by campaign..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />

          <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-4 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HandCoins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {contributions.length} contributions
              </p>
              <p className="text-lg font-bold leading-tight text-foreground">
                {formatMoney(totalAmount)}
              </p>
            </div>
          </div>
        </Animate>

        {paginatedItems.length === 0 ? (
          <Animate
            type="fadeUp"
            className="flex flex-col items-center justify-center px-4 py-16 text-center"
          >
            <HeartHandshake className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground">
              No contributions found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Contributions will appear here.
            </p>
          </Animate>
        ) : (
          <Animate
            type="fadeUp"
            className="w-full overflow-hidden rounded-2xl border bg-background"
          >
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  {showContributor && (
                    <TableHead className="w-[20%] px-3">Contributor</TableHead>
                  )}
                  <TableHead
                    className={`px-3 ${showContributor ? "w-[22%]" : "w-[30%]"}`}
                  >
                    Campaign
                  </TableHead>
                  <TableHead
                    className={`px-3 ${showContributor ? "w-[12%]" : "w-[15%]"}`}
                  >
                    Amount
                  </TableHead>
                  <TableHead
                    className={`px-3 ${showContributor ? "w-[18%]" : "w-[25%]"}`}
                  >
                    Payment ID
                  </TableHead>
                  <TableHead
                    className={`px-3 ${showContributor ? "w-[14%]" : "w-[15%]"}`}
                  >
                    Status
                  </TableHead>
                  <TableHead
                    className={`px-3 ${showContributor ? "w-[14%]" : "w-[15%]"}`}
                  >
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedItems.map((item) => {
                  const style = statusStyles[item.status];
                  return (
                    <TableRow key={item.id}>
                      {showContributor && (
                        <TableCell className="px-3 py-3">
                          <p className="truncate font-semibold text-foreground">
                            {item.contributor?.name ?? "Unknown"}
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
                      )}

                      <TableCell className="px-3 py-3">
                        <p
                          className="line-clamp-2 wrap-break-words font-medium text-foreground"
                          title={item.campaign?.title}
                        >
                          {item.campaign?.title ?? "Deleted campaign"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.campaign?.description}
                        </p>
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <span className="font-semibold text-primary">
                          {formatMoney(item.amount)}
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {item.stripePaymentIntentId
                            ? `...${item.stripePaymentIntentId.trim().slice(-10)}`
                            : "N/A"}
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
                        >
                          <span />
                          {item.status}
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-foreground">
                          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Animate>
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

export default ContributionHistoryTable;