/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BadgeCheck, ChevronRight, LogOut, Phone, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { SidebarTrigger } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { logout } from "@/server/auth/auth.service";
import { Toast } from "../Reusable/Toast";
import { ThemeToggle } from "../Shared/theme/ThemeToggle";

export default function DashboardNavbar() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      const result = await logout();

      if (!result.success) {
        Toast({
          icon: "error",
          title: result?.message || "Login failed",
        });
        return;
      }
      setUser(null);
      router.push("/");
      Swal.fire({
        icon: "success",
        title: "Logout successful",
        text: "You have been logged out successfully",
        confirmButtonColor: "#D43333",
      });
    } catch (error: any) {
      Toast({
        icon: "error",
        title: error?.message || "Logout failed",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-xl">
      {/* Left */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 rounded-lg border hover:bg-muted" />

        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <p className="text-xs text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full cursor-pointer border border-primary/60 hover:border-primary">
              <Avatar>
                <AvatarImage
                  src={user?.profilePhoto ?? undefined}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-72 rounded-xl border bg-background p-4 shadow-xl"
          >
            {/* Header */}
            <div className="group mb-4 flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-foreground/3 p-3 transition-all hover:border-primary/20 hover:bg-foreground/5">
              <Link
                href={`/dashboard/${user?.role.toLocaleLowerCase()}/profile`}
                className="flex items-center gap-3 min-w-0"
              >
                <Avatar className="h-11 w-11 border">
                  <AvatarImage
                    src={user?.profilePhoto ?? undefined}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-sm font-semibold">
                      {user?.name}
                    </p>
                    {user?.status === "ACTIVE" && (
                      <div className="bg-primary text-primary-foreground rounded-full">
                        <BadgeCheck className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </Link>

              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
            </div>

            {/* Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </span>
                <span className="font-medium">{user?.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  Role
                </span>
                <span className="font-medium">{user?.role}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 border-t pt-3">
              <button
                onClick={handleLogOut}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer text-red-500 transition-all hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
