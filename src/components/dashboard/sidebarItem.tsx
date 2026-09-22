import { Home, Building2, ClipboardList, Users, User } from "lucide-react";
import { MdCategory, MdPayment, MdRateReview, MdReviews } from "react-icons/md";

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
      title: "My Properties",
      href: "/dashboard/donor/myProperties",
      icon: Building2,
    },
    {
      title: "Rental Requests",
      href: "/dashboard/donor/requests",
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
      title: "My Requests",
      href: "/dashboard/patient/myRequests",
      icon: ClipboardList,
    },
    {
      title: "Payment History",
      href: "/dashboard/patient/paymentHistory",
      icon: MdPayment,
    },
    {
      title: "Review",
      href: "/dashboard/patient/review",
      icon: MdReviews,
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
      title: "My Requests",
      href: "/dashboard/hospital/myRequests",
      icon: ClipboardList,
    },
    {
      title: "Payment History",
      href: "/dashboard/hospital/paymentHistory",
      icon: MdPayment,
    },
    {
      title: "Review",
      href: "/dashboard/hospital/review",
      icon: MdReviews,
    },
    {
      title: "Profile",
      href: "/dashboard/hospital/profile",
      icon: User,
    },
  ],
};
