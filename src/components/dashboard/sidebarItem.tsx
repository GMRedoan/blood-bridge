import { Home, Building2, ClipboardList, Users, User, SquarePen, GitPullRequest } from "lucide-react";
import { MdCategory, MdPayment, MdRateReview } from "react-icons/md";

export const sidebarItems = {
  ADMIN: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: Home,
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Properties",
      href: "/dashboard/admin/properties",
      icon: Building2,
    },
    {
      title: "Requests",
      href: "/dashboard/admin/requests",
      icon: ClipboardList,
    },
    {
      title: "Categories",
      href: "/dashboard/admin/categories",
      icon: MdCategory,
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
      title: "Property Reviews",
      href: "/dashboard/donor/reviews",
      icon: MdRateReview,
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
      title: "Payment History",
      href: "/dashboard/patient/paymentHistory",
      icon: MdPayment,
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
      title: "Payment History",
      href: "/dashboard/hospital/paymentHistory",
      icon: MdPayment,
    },
    {
      title: "Profile",
      href: "/dashboard/hospital/profile",
      icon: User,
    },
  ],
};
