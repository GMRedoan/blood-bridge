import { myBloodRequests } from "@/types/patient/patient";
import {
  MapPin,
  Droplets,
  CalendarDays,
  Heart,
  Building2,
  Clock3,
  Activity,
} from "lucide-react";
import GiveDonationButton from "./giveDonationButton";
import Animate from "@/components/Reusable/Animate";
import { getBloodGroupLabel } from "@/types/donor/donor";
import { formatDate } from "@/components/Reusable/FormatDate";

interface MatchingRequestProps {
  requests: myBloodRequests[];
}

const MatchingRequest = ({ requests }: MatchingRequestProps) => {
  return (
    <main className="min-h-screen space-y-8 p-6">
      {/* Page Header */}
      <Animate type="fadeUp" className="relative overflow-hidden rounded-2xl bg-linear-to-br from-red-400 via-red-500 to-rose-700 p-6 shadow-lg ">
        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-35 border-white/10" />
        <div className="absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium">
            <Activity size={10} />
            Donor Matching Center
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your Donation Can <br className="hidden sm:block" />
            Save a Life.
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
            Discover verified blood requests that match your donor profile. Your
            one decision could make someone tomorrow possible.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Heart size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold">{requests.length}</p>
              <p className="text-xs text-based-foreground">
                Matching requests available
              </p>
            </div>
          </div>
        </div>
      </Animate>

      {/* Section Heading */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Matching Blood Requests
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Verified requests based on your blood group and location.
            </p>
          </div>

          <div className="rounded-lg border bg-card px-4 py-2 text-sm">
            <span className="font-semibold">{requests.length}</span>{" "}
            <span className="text-muted-foreground">Found</span>
          </div>
        </div>

        {/* Request List */}
        {requests.length > 0 ? (
          <Animate type="fadeUp" className="grid gap-5 lg:grid-cols-3 2xl:grid-cols-4">
            {requests.map((request) => (
              <article
                key={request.id}
                className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-xl dark:hover:border-red-900"
              >
                <div className="h-1.5 w-full bg-linear-to-r from-red-500 via-rose-500 to-red-300" />

                <div className="space-y-4 p-5 sm:p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        <Heart size={22} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Blood needed for
                        </p>
                        <h3 className="truncate text-lg font-bold">
                          {request?.patientName}
                        </h3>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-xl bg-red-500 px-3 py-1 text-center text-white shadow-sm">
                      <p className="text-sm font-medium tracking-wider text-red-100">
                        Blood
                      </p>
                      <p className="text-lg font-bold leading-tight">
                        {getBloodGroupLabel(request.bloodGroup)}
                      </p>
                    </div>
                  </div>

                  {/* Units and Urgency */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Droplets size={15} className="text-primary" />
                        <span className="text-xs">Required units</span>
                      </div>
                      <p className="mt-1 text-xl font-bold">
                        {request.unitsNeeded}{" "}
                        <span className="text-xs font-medium text-muted-foreground">
                          {request.unitsNeeded === 1 ? "Unit" : "Units"}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock3 size={15} className="text-orange-500" />
                        <span className="text-xs">Urgency</span>
                      </div>
                      <p className="mt-1 text-base font-bold capitalize">
                        {request.urgency}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-3 rounded-xl bg-muted/40 p-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={17} className="shrink-0 text-red-500" />
                      <span className="text-sm font-semibold">
                        Location Details
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pl-6">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">City</p>
                        <p className="truncate text-sm font-medium">
                          {request.city}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Area</p>
                        <p className="truncate text-sm font-medium">
                          {request.area}
                        </p>
                      </div>
                    </div>

                     
                      <div className="flex items-start gap-2 border-t pt-3">
                        <Building2
                          size={16}
                          className="mt-0.5 shrink-0 text-muted-foreground"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Hospital
                          </p>
                          <p className="text-sm font-medium">
                            {request.hospitalName || "N/A"}
                          </p>
                        </div>
                      </div>                   
                  </div>

                  {/* Reason */}
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider">
                      Request Reason
                    </p>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {request.reason}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays size={14} />
                      {formatDate(request.createdAt)}
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Verified
                    </span>
                  </div>

                  <GiveDonationButton requestId={request.id} />
                </div>
              </article>
            ))}
          </Animate>
        ) : (
          <Animate type="fadeUp" className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-5 py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-primary">
              <Droplets size={30} />
            </div>

            <h3 className="text-xl font-bold">No Matching Requests Yet</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We could not find any verified blood requests matching your
              profile right now. Check back later to discover new opportunities
              to donate.
            </p>
          </Animate>
        )}
      </section>
    </main>
  );
};

export default MatchingRequest;