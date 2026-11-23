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
import {
  Ban,
  CheckCircle,
  Trash2,
  Users,
  Droplets,
  MapPin,
  CalendarDays,
  Clock,
} from "lucide-react";
import { IGetUserProfile } from "@/types/user/user";
import Animate from "@/components/Reusable/Animate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/components/Reusable/FormatDate";
import { usePagination } from "@/hooks/usePagination";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Reusable/Pagination";
import { getBloodGroupLabel } from "@/types/donor/donor";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/Reusable/Toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface UserManagementTableProps {
  users: IGetUserProfile[];
  onDeleteUser: (userId: string) => Promise<void>;
  onToggleUserStatus: (
    userId: string,
    status: "ACTIVE" | "BANNED",
  ) => Promise<unknown>;
}

const UserManagementTable = ({
  users,
  onDeleteUser,
  onToggleUserStatus,
}: UserManagementTableProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const roleOrder: Record<string, number> = {
    ADMIN: 0,
    HOSPITAL: 1,
    DONOR: 2,
    PATIENT: 3,
  };
  const getRoleRank = (role: string) => roleOrder[role] ?? 99;
  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return getRoleRank(a.role) - getRoleRank(b.role);
  });

  // pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedUsers,
  } = usePagination({
    data: sortedUsers,
    itemsPerPage: 10,
    resetKey: search,
  });

  const handleDelete = async (userId: string) => {
    try {
      setPendingId(userId);
      await onDeleteUser(userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setPendingId(null);
    }
  };

  const handleStatusChange = async (user: IGetUserProfile) => {
    const isActive = user.status === "ACTIVE";
    const newStatus = isActive ? "BANNED" : "ACTIVE";
    const result = await Swal.fire({
      title: isActive ? "Ban this user?" : "Activate this user?",
      html: `Are you sure you want to ${
        isActive ? "ban" : "activate"
      } <strong>${user.name}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isActive ? "Yes, Ban User" : "Yes, Activate User",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: isActive ? "#dc2626" : "#16a34a",
    });

    if (!result.isConfirmed) return;

    try {
      setPendingId(user.id);

      await onToggleUserStatus(user.id, newStatus);
      router.refresh();
      Toast({
        icon: "success",
        title: `User ${newStatus.toLowerCase()} successfully`,
      });
    } catch (error) {
      console.error("Failed to update user status:", error);

      Toast({
        icon: "error",
        title: "Failed to update user status",
      });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <Animate className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              User Management
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage registered users and their account permissions.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="text-xl font-bold text-foreground">
                {users.length}
              </p>
            </div>
          </div>
        </Animate>

        {/* search */}
        <Animate className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </Animate>

        {/* Table */}
        <div>
          {users.length === 0 ? (
            <Animate
              type="fadeUp"
              className="flex flex-col items-center justify-center px-4 py-16 text-center"
            >
              <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <h3 className="font-semibold text-foreground">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Registered users will appear here.
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
                    <TableHead className="w-[17%] px-3">
                      Role / Blood Group
                    </TableHead>
                    <TableHead className="w-[15%] px-3">Location</TableHead>
                    <TableHead className="w-[14%] px-3">Joined</TableHead>
                    <TableHead className="w-[10%] px-3">Status</TableHead>
                    <TableHead className="w-[14%] px-3 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedUsers.map((user) => {
                    const isPending = pendingId === user.id;

                    return (
                      <TableRow key={user.id}>
                        {/* User information */}
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

                        {/* Role and blood group */}
                        <TableCell className="px-3 py-3">
                          <div className="space-y-1.5">
                            <span className="inline-flex rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                              {user.role}
                            </span>

                            {user.donorProfile && (
                              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                                <Droplets className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">
                                  {getBloodGroupLabel(
                                    user.donorProfile.bloodGroup,
                                  ) ?? "N/A"}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="px-3 py-3">
                          <div className="flex min-w-0 items-center gap-1.5 text-sm text-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">
                              {user.city || "N/A"}
                            </span>
                          </div>
                          <p className="mt-1 truncate pl-5 text-xs text-muted-foreground">
                            {user.area || "No area"}
                          </p>
                        </TableCell>

                        {/* Registration date */}
                        <TableCell className="px-3 py-3">
                          <div className="flex items-center gap-1.5 text-sm text-foreground">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">
                              {formatDate(user.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        {/* Account status */}
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
                          {user.role !== "ADMIN" ? (
                            <div className="flex flex-col items-center gap-1">
                              <Button
                                size="xs"
                                variant={
                                  user.status === "ACTIVE"
                                    ? "destructive"
                                    : "ghost"
                                }
                                type="button"
                                disabled={isPending}
                                onClick={() => handleStatusChange(user)}
                                className="text-xs py-0!"
                              >
                                {isPending ? (
                                  <span className="flex items-center gap-1">
                                    <Clock/>
                                    Wait...
                                    </span>
                                ) : user.status === "ACTIVE" ? (
                                  <>
                                    <Ban />
                                    <span className="hidden xl:inline px-2">
                                      Ban
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle />
                                    <span className="hidden xl:inline">
                                      Active
                                    </span>
                                  </>
                                )}
                              </Button>

                              <Button
                                size="xs"
                                type="button"
                                title="Delete"
                                disabled={isPending}
                                onClick={() => handleDelete(user.id)}
                                className="text-xs"
                              >
                                <Trash2 />
                                <span className="hidden xl:inline">Delete</span>
                              </Button>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground text-center">
                              Admin can not be <br /> banned or deleted
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Animate>
          )}
        </div>
      </div>
      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default UserManagementTable;
