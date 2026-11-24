import { Home, ClipboardList, UserRoundX, User, SquarePen, GitPullRequest, Users, BookOpenCheck, TicketCheck, List, Clock } from "lucide-react";
import { MdPayment, MdRateReview } from "react-icons/md";

export const sidebarItems = {
  ADMIN: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: Home,
    },
    {
      title: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Deleted Users",
      href: "/dashboard/admin/deletedUsers",
      icon: UserRoundX,
    },
    {
      title: "Manage Blood Requests",
      href: "/dashboard/admin/VerifyRequests",
      icon: BookOpenCheck,
    },
    {
      title: "My Campaigns",
      href: "/dashboard/admin/MyCampaign",
      icon: List,
    },
    {
      title: "Manage Campaigns",
      href: "/dashboard/admin/VerifyCampaigns",
      icon: TicketCheck,
    },
    {
      title: "Contribution History",
      href: "/dashboard/admin/ContributionHistory",
      icon: Clock,
    },
    {
      title: "Profile",
      href: "/dashboard/admin/profile",
      icon: User,
    },
  ],

  DONOR: [
    {
      title: "Dashboard",
      href: "/dashboard/donor",
      icon: Home,
    },
    {
      title: "Matching Request",
      href: "/dashboard/donor/matchingRequest",
      icon: GitPullRequest,
    },
    {
      title: "My Donations",
      href: "/dashboard/donor/myDonations",
      icon: ClipboardList,
    },
    {
      title: "Contribution History",
      href: "/dashboard/donor/ContributionHistory",
      icon: Clock,
    },
    {
      title: "Profile",
      href: "/dashboard/donor/profile",
      icon: User,
    },
  ],

  PATIENT: [
    {
      title: "Dashboard",
      href: "/dashboard/patient",
      icon: Home,
    },
    {
      title: "Create Blood Request",
      href: "/dashboard/patient/createBloodRequest",
      icon: SquarePen,
    },
    {
      title: "My Blood Requests",
      href: "/dashboard/patient/myBloodRequests",
      icon: ClipboardList,
    },
    {
      title: "Contribution History",
      href: "/dashboard/patient/ContributionHistory",
      icon: Clock,
    },
    {
      title: "Profile",
      href: "/dashboard/patient/profile",
      icon: User,
    },
  ],
  HOSPITAL: [
    {
      title: "Dashboard",
      href: "/dashboard/hospital",
      icon: Home,
    },
    {
      title: "Create Blood Request",
      href: "/dashboard/hospital/createBloodRequest",
      icon: SquarePen,
    },
    {
      title: "My Blood Requests",
      href: "/dashboard/hospital/myBloodRequests",
      icon: ClipboardList,
    },
    {
      title: "My Campaigns",
      href: "/dashboard/hospital/MyCampaign",
      icon: List,
    },
    {
      title: "Contribution History",
      href: "/dashboard/hospital/ContributionHistory",
      icon: Clock,
    },
    {
      title: "Profile",
      href: "/dashboard/hospital/profile",
      icon: User,
    },
  ],
};
