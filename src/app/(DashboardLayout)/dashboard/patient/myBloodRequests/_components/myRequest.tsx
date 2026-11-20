"use client";

import { useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  Hospital,
  Loader2,
  MapPin,
  MessageCircle,
  Pencil,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { myBloodRequests } from "@/types/patient/patient";
import { getBloodGroupLabel } from "@/types/donor/donor";
import Animate from "@/components/Reusable/Animate";
import { getLabel, MatchDialog } from "./matchDialog";
import { formatDate } from "@/components/Reusable/FormatDate";
import { Button } from "@/components/ui/button";
import { deleteRequest } from "@/server/patient/patient.service";
import { Toast } from "@/components/Reusable/Toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditRequestDialog from "./EditRequestDialog";

interface MyBloodRequestsProps {
  requests: myBloodRequests[];
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  VERIFIED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  FULFILLED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  EXPIRED: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function MyRequests({ requests }: MyBloodRequestsProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<myBloodRequests | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleViewMatches = (request: myBloodRequests) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };
  const [isEditOpen, setIsEditOpen] = useState(false);

const handleDelete = async (requestId: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This blood request will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });

  if (!result.isConfirmed) return;

  try {
    setDeletingId(requestId);
    const response = await deleteRequest(requestId);

    if (!response.success) {
      Toast({
        icon: "error",
        title: response.message ?? "Something went wrong. Please try again.",
      });
      return;
    }

    await Swal.fire({
      title: "Deleted!",
      text: "Your blood request has been deleted successfully.",
      icon: "success",
      timer: 2000,
      confirmButtonColor: "#16a34a",
      showConfirmButton: false,
    });

    router.refresh();
    setDeletingId(null);
  } catch (error) {
    console.error("Delete request error:", error);
    Toast({
      icon: "error",
      title: "Something went wrong. Please try again.",
    })
  ;}
};

const handleEdit = (request: myBloodRequests) => {
  setSelectedRequest(request);
  setIsEditOpen(true);
};

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <Animate type="fadeDown">
          <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  <Droplets className="h-3.5 w-3.5" />
                  BLOOD BRIDGE
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  My blood requests
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Track your blood requests, monitor verification, and see the
                  donors who have responded.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 text-primary" />
                Request overview
              </div>
            </div>
          </div>
        </Animate>

        {/* Request list */}
        <section>
          <Animate type="fadeUp">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Your requests</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  All the blood requests you have submitted.
                </p>
              </div>

              <span className="w-fit rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {requests.length}{" "}
                {requests.length === 1 ? "request" : "requests"}
              </span>
            </div>
          </Animate>

          {requests.length === 0 ? (
            <Animate type="zoom">
              <div className="rounded-2xl border border-dashed bg-card px-5 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Droplets className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No blood requests yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Your submitted blood requests will appear here. Once you
                  create a request, you can track its status and donor
                  responses.
                </p>
              </div>
            </Animate>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {requests.map((request, index) => (
                <Animate key={request.id} type="fadeUp" delay={index * 0.07}>
                  <article className="group h-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                    {/* Card top */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 border-b">
                      {/* Left: Patient information */}
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Blood group */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-extrabold text-primary ring-1 ring-primary/10">
                          {getBloodGroupLabel(request.bloodGroup)}
                        </div>

                        {/* Patient details */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <h3 className="truncate text-base font-bold sm:text-lg">
                            {request.patientName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                statusStyles[request.status] ??
                                "border-border bg-muted text-muted-foreground"
                              }`}
                            >
                              {getLabel(request.status)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                                request.urgency?.toLowerCase() === "urgent" ||
                                request.urgency?.toLowerCase() === "emergency"
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  request.urgency?.toLowerCase() === "urgent" ||
                                  request.urgency?.toLowerCase() === "emergency"
                                    ? "bg-red-500"
                                    : "bg-muted-foreground"
                                }`}
                              />
                              {getLabel(request.urgency)} urgency
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div>
                        <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2 sm:flex-none"
                            onClick={() => handleEdit(request)}
                            disabled={request.matches?.some(
                              (match) => match.status === "ACCEPTED",
                            )}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 gap-2 sm:flex-none"
                            disabled={
                              deletingId !== null ||
                              request.matches?.some(
                                (match) => match.status === "ACCEPTED",
                              )
                            }
                            onClick={() => handleDelete(request.id)}
                          >
                            {deletingId === request.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                        {
                          request.matches?.some(
                              (match) => match.status === "ACCEPTED") && (
                                <span className="text-xs text-amber-300 ml-4">
                                  Donor already accepted
                                </span>
                              )
                        }
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="space-y-5 p-5 sm:p-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            Units needed
                          </p>
                          <p className="mt-1 text-xl font-bold">
                            {request.unitsNeeded}{" "}
                            <span className="text-sm font-medium text-muted-foreground">
                              units
                            </span>
                          </p>
                        </div>

                        <div className="rounded-xl bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            Donor matches
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-xl font-bold">
                            <Users className="h-5 w-5 text-primary" />
                            {request.matches?.length ?? 0}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              {request.area}, {request.city}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Location
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Hospital className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              {request.hospitalName || "Not specified"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Hospital
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              {formatDate(request.createdAt)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Request created
                            </p>
                          </div>
                        </div>
                      </div>

                      {request.reason && (
                        <div className="rounded-xl border border-dashed p-3">
                          <p className="text-xs font-semibold text-muted-foreground">
                            Reason for request
                          </p>
                          <p className="mt-1 text-sm leading-6">
                            {request.reason}
                          </p>
                        </div>
                      )}

                      {/* Verification information */}
                      <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
                        {request.verifiedAt ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            Verified on {formatDate(request.verifiedAt)}
                          </>
                        ) : request.status === "PENDING" ? (
                          <>
                            <Clock3 className="h-4 w-4 shrink-0 text-amber-600" />
                            Waiting for verification
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 shrink-0" />
                            Verification information unavailable
                          </>
                        )}
                      </div>

                      {/* Card action */}
                      <Button
                        type="button"
                        onClick={() => handleViewMatches(request)}
                        className="w-full py-5"
                      >
                        <MessageCircle className="h-4 w-4" />
                        View donors for this request
                        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                          {request.matches?.length ?? 0}
                        </span>
                      </Button>
                    </div>
                  </article>
                </Animate>
              ))}
            </div>
          )}
        </section>
      </div>

      <MatchDialog
        request={selectedRequest}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      {selectedRequest && (
        <EditRequestDialog
          key={selectedRequest.id}
          request={selectedRequest}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </div>
  );
}
