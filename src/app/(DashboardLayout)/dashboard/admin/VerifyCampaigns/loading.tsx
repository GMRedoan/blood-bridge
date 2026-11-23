import { Skeleton } from "@/components/ui/skeleton";

interface CampaignCardsSkeletonProps {
  count?: number;
  showHeader?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  showCreator?: boolean;
}

const CampaignCardsSkeleton = ({
  count = 6,
  showHeader = true,
  showSearch = true,
  showActions = true,
  showCreator = true,
}: CampaignCardsSkeletonProps) => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && <Skeleton className="h-10 w-full max-w-md rounded-md" />}

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col rounded-2xl border bg-background p-5"
          >
            {/* Title + status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-1/2" />
              </div>
              <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
            </div>

            {/* Description */}
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>

            {/* Funding progress */}
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="mt-2 h-2 w-full rounded-full" />
              <Skeleton className="mt-2 h-3 w-16" />
            </div>

            {/* Creator + date */}
            {showCreator && (
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 shrink-0" />
                  <Skeleton className="h-3 w-40 max-w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 shrink-0" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 shrink-0" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Skeleton className="h-9 rounded-lg" />
                <Skeleton className="h-9 rounded-lg" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignCardsSkeleton;
