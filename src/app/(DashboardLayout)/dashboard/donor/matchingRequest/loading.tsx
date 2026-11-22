import { Skeleton } from "@/components/ui/skeleton";

const MatchingRequestLoading = () => {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6">
        <div className="relative z-10 max-w-2xl space-y-4">
          <Skeleton className="h-7 w-40 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-9 w-64 sm:w-80" />
            <Skeleton className="h-9 w-52 sm:w-64" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-4/5 max-w-md" />
          </div>
        </div>
      </section>

      {/* Section Header */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>

          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>

        {/* Request Cards - 3 Columns */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              {/* Top Accent */}
              <Skeleton className="h-1.5 w-full rounded-none" />

              <div className="space-y-5 p-5 sm:p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />

                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-32 max-w-full" />
                    </div>
                  </div>

                  <div className="flex h-14 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-xl">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>

                {/* Units and Urgency */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>

                  <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4 rounded-xl bg-muted/40 p-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-28" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pl-6">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-4 w-20" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 border-t pt-3">
                    <Skeleton className="mt-0.5 h-4 w-4 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-36 max-w-full" />
                    </div>
                  </div>
                </div>

                {/* Request Reason */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t pt-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Donation Button */}
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MatchingRequestLoading;
