import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UserManagementTableSkeletonProps {
  rows?: number;
}

const UserManagementTableSkeleton = ({
  rows = 10,
}: UserManagementTableSkeletonProps) => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-10" />
          </div>
        </div>
      </div>

      {/* Search */}
      <Skeleton className="h-10 w-full max-w-md rounded-md" />

      {/* Table */}
      <div className="w-full overflow-hidden rounded-2xl border bg-background">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%] px-3">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="w-[17%] px-3">
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead className="w-[15%] px-3">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="w-[14%] px-3">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="w-[10%] px-3">
                <Skeleton className="h-4 w-14" />
              </TableHead>
              <TableHead className="w-[14%] px-3 text-right">
                <Skeleton className="ml-auto h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                {/* User */}
                <TableCell className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full max-w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>

                {/* Role / Blood group */}
                <TableCell className="px-3 py-3">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell className="px-3 py-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="ml-5 h-3 w-14" />
                  </div>
                </TableCell>

                {/* Joined */}
                <TableCell className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-4 shrink-0" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="px-3 py-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>

                {/* Actions */}
                <TableCell className="px-3 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg xl:w-16" />
                    <Skeleton className="h-8 w-8 rounded-lg xl:w-20" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer note */}
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
  );
};

export default UserManagementTableSkeleton;
