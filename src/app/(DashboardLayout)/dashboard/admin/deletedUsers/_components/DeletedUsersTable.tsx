"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Animate from "@/components/Reusable/Animate";
import Pagination from "@/components/Reusable/Pagination";
import { formatDate } from "@/components/Reusable/FormatDate";
import { usePagination } from "@/hooks/usePagination";
import { restoreUser } from "@/server/admin/admin.service";
import {
  CalendarDays,
  MapPin,
  RotateCcw,
  Trash2,
  Users,
} from "lucide-react";
import { IDeleteUser } from "@/types/admin/admin";
import { Toast } from "@/components/Reusable/Toast";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

interface DeletedUsersTableProps {
  users: IDeleteUser[];
}

const DeletedUsersTable = ({ users }: DeletedUsersTableProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const filteredUsers = users.filter((user) => {
  const keyword = search.trim().toLowerCase();
    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedUsers,
  } = usePagination({
    data: filteredUsers,
    itemsPerPage: 10,
    resetKey: search,
  });

const handleRestore = async (userId: string) => {
  const result = await Swal.fire({
    title: "Restore this user?",
    text: "Are you sure you want to restore this user? Their account will become active again.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Restore User",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#64748b",
  });
  if (!result.isConfirmed) return;
  try {
    setPendingId(userId);
    await restoreUser(userId);

    Toast({
      icon: "success",
      title: "User restored successfully",
    });

    router.refresh();
  } catch (error) {
    console.error("Failed to restore user:", error);

    Toast({
      icon: "error",
      title: "Failed to restore user",
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
              Deleted Users
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review deleted accounts and restore them when needed.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Deleted</p>
              <p className="text-xl font-bold text-foreground">
                {users.length}
              </p>
            </div>
          </div>
        </Animate>

        {/* Search */}
        <Animate type="fadeUp">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </Animate>

        {/* Table */}
        {paginatedUsers.length === 0 ? (
          <Animate
            type="fadeUp"
            className="flex flex-col items-center justify-center px-4 py-16 text-center"
          >
            <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground">
              No deleted users found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Deleted users will appear here.
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
                  <TableHead className="w-[30%] px-3">User</TableHead>
                  <TableHead className="w-[12%] px-3">Role</TableHead>
                  <TableHead className="w-[16%] px-3">Location</TableHead>
                  <TableHead className="w-[15%] px-3">Joined</TableHead>
                  <TableHead className="w-[15%] px-3">Deleted On</TableHead>
                  <TableHead className="w-[10%] px-3">Status</TableHead>
                  <TableHead className="w-[12%] px-3 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.map((user) => {
                  const isPending = pendingId === user.id;

                  return (
                    <TableRow key={user.id}>
                      {/* User */}
                      <TableCell className="px-3 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={user.profilePhoto ?? ""} />
                            <AvatarFallback>
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-foreground">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell className="px-3 py-3">
                        <span className="inline-flex rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                          {user.role}
                        </span>
                      </TableCell>

                      {/* Location */}
                      <TableCell className="px-3 py-3">
                        <div className="flex min-w-0 items-center gap-1.5 text-sm text-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{user.city || "N/A"}</span>
                        </div>
                        <p className="mt-1 truncate pl-5 text-xs text-muted-foreground">
                          {user.area || "No area"}
                        </p>
                      </TableCell>

                      {/* Joined */}
                      <TableCell className="px-3 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-foreground">
                          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">
                            {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Deleted on */}
                      <TableCell className="px-3 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-destructive">
                          <Trash2 className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {user.deletedAt
                              ? formatDate(user.deletedAt)
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-3 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            user.status === "ACTIVE"
                              ? "bg-green-200 text-green-600"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              user.status === "ACTIVE"
                                ? "bg-green-600 animate-pulse"
                                : "bg-destructive"
                            }`}
                          />
                          {user.status}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-3 py-3">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            type="button"
                            title="Restore"
                            disabled={isPending}
                            onClick={() => handleRestore(user.id)}
                          >
                            <RotateCcw
                              className={`h-3.5 w-3.5 shrink-0 ${
                                isPending ? "animate-spin" : ""
                              }`}
                            />
                            <span className="hidden xl:inline">
                              {isPending ? "Restoring..." : "Restore"}
                            </span>
                          </Button>
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

export default DeletedUsersTable;
