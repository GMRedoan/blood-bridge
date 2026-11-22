/* eslint-disable react-hooks/set-state-in-effect */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  CheckCircle2,
  Droplets,
  HeartHandshake,
  Loader2,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { myBloodRequests, requestMatches } from "@/types/patient/patient";
import { getBloodGroupLabel } from "@/types/donor/donor";
import { formatDate } from "@/components/Reusable/FormatDate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toast } from "@/components/Reusable/Toast";
import {
  acceptDonation,
  completeDonation,
} from "@/server/patient/patient.service";
import { Button } from "@/components/ui/button";

const matchStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  ACCEPTED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
  DECLINED: "bg-red-500/10 text-red-600",
  EXPIRED: "bg-red-500/10 text-red-600",
};

export const getLabel = (value?: string | null) => {
  if (!value) return "Unknown";
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getLocalDateTimeValue = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

export function MatchItem({
  match,
  index,
  onMatchUpdated,
}: {
  match: requestMatches;
  index: number;
  onMatchUpdated: (
    matchId: string,
    updatedData: Partial<requestMatches>,
  ) => void;
}) {
  const withTime = { hour: "2-digit", minute: "2-digit" } as const;
  const router = useRouter();
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState("");
  const isPending = match.status === "PENDING";
  const donation = match.donation;

  const handleAccept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!scheduledAt) {
      setError("Please select a donation date and time.");
      return;
    }
    const selectedDate = new Date(scheduledAt);
    if (Number.isNaN(selectedDate.getTime())) {
      setError("Please select a valid date and time.");
      return;
    }
    if (selectedDate.getTime() <= Date.now()) {
      setError("Donation schedule must be in the future.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await acceptDonation(match.id, selectedDate);

      if (!result.success) {
        setError(result.message || "Failed to accept donation request.");
        return;
      }

      onMatchUpdated(match.id, {
        status: "ACCEPTED",
        respondedAt: new Date().toISOString(),
        donation: {
          id: donation?.id || "",
          status: "SCHEDULED",
          scheduledAt: selectedDate.toISOString(),
          completedAt: null,
        },
      });

      Toast({
        icon: "success",
        title: "Donation request accepted successfully!",
      });

      setShowScheduler(false);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);

      const result = await completeDonation(match.donation?.id || "");

      if (!result.success) {
        Toast({
          icon: "error",
          title: result.message || "Failed to complete donation",
        });
        return;
      }

      onMatchUpdated(match.id, {
        donation: {
          ...match.donation!,
          status: "COMPLETED",
          completedAt: new Date().toISOString(),
        },
      });

      Toast({
        icon: "success",
        title: "Donation completed successfully!",
      });

      router.refresh();
    } catch (error) {
      Toast({
        icon: "error",
        title: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold">Donor - {index + 1}</p>
            <p className="text-sm text-muted-foreground">{match.donor.name}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            matchStatusStyles[match.status]
          }`}
        >
          {getLabel(match.status)}
        </span>
      </div>

      {/* Donor information */}
      <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail size={15} />
          <span className="break-all">{match.donor.email}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone size={15} />
          <span>{match.donor.phone}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Notified</span>
          <span className="text-right">
            {formatDate(match.notifiedAt, withTime)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Responded</span>
          <span className="text-right">
            {formatDate(match.respondedAt, withTime)}
          </span>
        </div>
      </div>

      {/* Donation schedule */}
      {donation?.scheduledAt && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays size={15} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Scheduled
            </span>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold tabular-nums">
              {formatDate(donation.scheduledAt, withTime)}
            </p>
            <p
              className={`text-xs font-bold ${donation.status === "SCHEDULED" ? "text-chart-3" : "text-green-600"}`}
            >
              {getLabel(donation.status)}
            </p>
          </div>
        </div>
      )}

      {/* Donation completion */}
      {donation?.scheduledAt &&
        (donation.completedAt ? (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent/20 px-3 py-2">
            <div className="flex items-center gap-2 text-accent-foreground">
              <HeartHandshake size={15} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Completed
              </span>
            </div>

            <p className="text-xs font-semibold tabular-nums">
              {formatDate(donation.completedAt, withTime)}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            The donation has not been completed yet.
          </p>
        ))}

      {/* Accept request */}
      {isPending && !donation && (
        <div className="mt-4 border-t border-border pt-4">
          {!showScheduler ? (
            <Button
              type="button"
              onClick={() => setShowScheduler(true)}
              className="w-full py-2.5 font-semibold"
            >
              <CalendarDays size={16} />
              Accept Request
            </Button>
          ) : (
            <form onSubmit={handleAccept} className="space-y-3">
              <div>
                <label
                  htmlFor={`schedule-${match.id}`}
                  className="mb-2 block text-sm font-semibold"
                >
                  Select Donation Date & Time
                </label>

                <input
                  id={`schedule-${match.id}`}
                  type="datetime-local"
                  required
                  min={getLocalDateTimeValue()}
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Select a future date and time for the donation.
                </p>
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 p-2 text-xs font-medium text-destructive">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setShowScheduler(false);
                    setError("");
                  }}
                  className=""
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || !scheduledAt}
                  className="flex flex-1 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  {isSubmitting ? "Accepting..." : "Confirm & Accept"}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {match.status === "ACCEPTED" &&
        donation?.status === "SCHEDULED" &&
        !donation.completedAt && (
          <div className="mt-4 border-t border-border pt-4">
            <Button
              type="button"
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full bg-green-500! hover:bg-green-700!"
            >
              {isCompleting ? (
                <Loader2 className="mr-2 animate-spin" size={16} />
              ) : (
                <HeartHandshake className="mr-2" size={16} />
              )}

              {isCompleting ? "Completing..." : "Mark as Completed"}
            </Button>
          </div>
        )}
    </div>
  );
}

export function MatchDialog({
  request,
  open,
  onOpenChange,
}: {
  request: myBloodRequests | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [matches, setMatches] = useState<requestMatches[]>([]);
  useEffect(() => {
    setMatches(request?.matches ?? []);
  }, [request]);

  if (!request) return null;

  const sortedMatches = [...matches].sort((a, b) => {
    const aAccepted =
      a.status === "ACCEPTED" || a.status === "COMPLETED" ? 1 : 0;
    const bAccepted = b.status === "ACCEPTED" ? 1 : 0;

    return bAccepted - aAccepted;
  });
  const updateMatch = (
    matchId: string,
    updatedData: Partial<requestMatches>,
  ) => {
    setMatches((previous) =>
      previous.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            ...updatedData,
            ...(updatedData.donation?.status === "COMPLETED"
              ? { status: "COMPLETED" }
              : {}),
          };
        }
        if (updatedData.status === "ACCEPTED" && match.status === "PENDING") {
          return {
            ...match,
            status: "DECLINED",
            respondedAt: new Date().toISOString(),
          };
        }

        return match;
      }),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Droplets className="h-6 w-6" />
            </div>

            <div>
              <DialogTitle className="text-xl">Donor matches</DialogTitle>
              <DialogDescription>
                {request.patientName} blood request
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 rounded-xl border bg-muted/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">
                Requested blood group
              </p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {getBloodGroupLabel(request.bloodGroup)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Required units</p>
              <p className="mt-1 text-2xl font-bold">{request.unitsNeeded}</p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Matched donors</h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {matches.length} {matches.length === 1 ? "match" : "matches"}
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-xl border border-dashed py-10 text-center">
              <Users className="mx-auto h-9 w-9 text-muted-foreground/50" />
              <p className="mt-3 font-medium">No donor matches yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We will show matching donors here when available.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedMatches.map((match, index) => (
                <MatchItem
                  key={match.id}
                  match={match}
                  index={index}
                  onMatchUpdated={updateMatch}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
