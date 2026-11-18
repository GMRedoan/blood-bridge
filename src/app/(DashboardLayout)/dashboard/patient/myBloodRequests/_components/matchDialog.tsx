import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Droplets, Users } from "lucide-react";
import { myBloodRequests, requestMatches } from "@/types/patient/patient";
import { getBloodGroupLabel } from "@/types/donor/donor";
import { formatDate } from "@/components/Reusable/FormatDate";

const matchStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  ACCEPTED: "bg-emerald-500/10 text-emerald-600",
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

export function MatchItem({ match, index }: { match: requestMatches; index: number }) {
  const status = match.status.toUpperCase();

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold">Donor match #{index + 1}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              ID: {match.donorId.slice(0, 8)}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            matchStatusStyles[status] ?? "bg-muted text-muted-foreground"
          }`}
        >
          {getLabel(status)}
        </span>
      </div>

      <div className="mt-4 space-y-2 border-t pt-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Notified</span>
          <span className="text-right">{formatDate(match.notifiedAt)}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Responded</span>
          <span className="text-right">{formatDate(match.respondedAt)}</span>
        </div>
      </div>
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
  if (!request) return null;
  const matches = request.matches ?? [];

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
              {matches.map((match, index) => (
                <MatchItem key={match.id} match={match} index={index} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}