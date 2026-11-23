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
import {
  BadgeCheck,
  Building2,
  Clock,
  Droplets,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { myBloodRequests } from "@/types/patient/patient";
import { getBloodGroupLabel } from "@/types/donor/donor";
import { useRouter } from "next/navigation";
import { verifyRequest } from "@/server/admin/admin.service";
import { Toast } from "@/components/Reusable/Toast";
import { Button } from "@/components/ui/button";

interface PendingRequestsTableProps {
  requests: myBloodRequests[];
}

const urgencyStyles: Record<string, string> = {
  normal: "bg-secondary text-secondary-foreground",
  urgent: "bg-destructive/10 text-destructive",
};

const PendingRequestsTable = ({ requests }: PendingRequestsTableProps) => {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const filteredRequests = requests.filter((request) => {
    const keyword = search.trim().toLowerCase();
    return (
      request.patientName.toLowerCase().includes(keyword) ||
      request.hospitalName?.toLowerCase().includes(keyword) ||
      request.creator?.name.toLowerCase().includes(keyword) ||
      request.creator?.email.toLowerCase().includes(keyword)
    );
  });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRequests,
  } = usePagination({
    data: filteredRequests,
    itemsPerPage: 10,
    resetKey: search,
  });

  const handleVerify = async (requestId: string) => {
    try {
      setPendingId(requestId);
      await verifyRequest(requestId);
      Toast({
        icon: "success",
        title: "Request verified successfully",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to verify request:", error);
      Toast({
        icon: "error",
        title: "Failed to verify request",
      });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <Animate className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Pending Requests
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Blood requests waiting for verification.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Pending</p>
              <p className="text-xl font-bold text-foreground">
                {requests.length}
              </p>
            </div>
          </div>
        </Animate>

        {/* Search */}
        <Animate type="fadeUp">
          <Input
            placeholder="Search by patient, hospital or creator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </Animate>

        {/* Table */}
        {paginatedRequests.length === 0 ? (
          <Animate
            type="fadeUp"
            className="flex flex-col items-center justify-center px-4 py-16 text-center"
          >
            <Clock className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground">
              No pending requests found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pending blood requests will appear here.
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
                  <TableHead className="w-[17%] px-3">Creator</TableHead>
                  <TableHead className="w-[12%] px-3">Patient</TableHead>
                  <TableHead className="w-[11%] px-3">Blood / Units</TableHead>
                  <TableHead className="w-[20%] px-3">
                    Hospital / Location
                  </TableHead>
                  <TableHead className="w-[9%] px-3">Urgency</TableHead>
                  <TableHead className="w-[13%] px-3">Reason</TableHead>
                  <TableHead className="w-[10%] px-3">Created</TableHead>
                  <TableHead className="w-[8%] px-3 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedRequests.map((request) => (
                  <TableRow key={request.id}>
                    {/* Creator */}
                    <TableCell className="px-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                          {request.creator?.name}
                        </p>
                        <p
                          className="truncate text-xs text-muted-foreground"
                          title={request.creator?.email}
                        >
                          {request.creator?.email}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {request.creator?.phone}
                        </p>
                      </div>
                    </TableCell>

                    {/* Patient */}
                    <TableCell className="px-3 py-3">
                      <p
                        className="truncate font-medium text-foreground"
                        title={request.patientName}
                      >
                        {request.patientName}
                      </p>
                    </TableCell>

                    {/* Blood group + units */}
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                        <Droplets className="h-4 w-4 shrink-0" />
                        <span>{getBloodGroupLabel(request.bloodGroup)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.unitsNeeded}{" "}
                        {request.unitsNeeded === 1 ? "unit" : "units"}
                      </p>
                    </TableCell>

                    {/* Hospital + city + area */}
                    <TableCell className="px-3 py-3">
                      <div className="flex min-w-0 items-center gap-1.5 text-sm text-foreground">
                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          {request?.hospitalName}
                        </span>
                      </div>
                      <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {[request.city, request.area]
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Urgency */}
                    <TableCell className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          urgencyStyles[request.urgency.toLowerCase()] ??
                          "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {request.urgency}
                      </span>
                    </TableCell>

                    {/* Reason */}
                    <TableCell className="px-3 py-3">
                      <p
                        className="line-clamp-2 wrap-break-words text-xs text-muted-foreground"
                        title={request.reason ?? ""}
                      >
                        {request.reason || "No reason provided"}
                      </p>
                    </TableCell>

                    {/* Created at */}
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <span className="truncate">
                          {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          title="Verify"
                          disabled={pendingId === request.id}
                          onClick={() => handleVerify(request.id)}
                        >
                          {pendingId === request.id ? (
                            <>
                              <Loader2 className="animate-spin" />
                              <p>wait..</p>
                            </>
                          ) : (
                            <>
                              <BadgeCheck />
                              <p>verify</p>
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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

export default PendingRequestsTable;
