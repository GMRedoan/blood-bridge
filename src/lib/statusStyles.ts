export const statusStyles: Record<string, string> = {
  // General
  ACTIVE: "bg-green-500/15 text-green-600 border-green-500/20",
  INACTIVE: "bg-muted text-muted-foreground border-border",

  // Pending
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",

  // Successful statuses
  VERIFIED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  ACCEPTED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",

  // Rejected / cancelled statuses
  DECLINED: "bg-red-500/10 text-red-600 border-red-500/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
  EXPIRED: "bg-red-500/10 text-red-600 border-red-500/20",

  // Other
  SCHEDULED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  FULFILLED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  BANNED: "bg-destructive/10 text-destructive border-destructive/20",
};

export const getStatusStyles = (status: string): string => {
  return statusStyles[status] ?? "bg-muted text-muted-foreground border-border";
};
