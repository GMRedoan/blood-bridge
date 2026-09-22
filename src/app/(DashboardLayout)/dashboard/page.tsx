import { getUser } from "@/server/user/user.service";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await getUser();
  if (user.success === false) {
    redirect("/");
  }

  if (user?.data?.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (user?.data?.role === "DONOR") {
    redirect("/dashboard/donor");
  } else if (user?.data?.role === "PATIENT") {
    redirect("/dashboard/patient");
  }else if (user?.data?.role === "HOSPITAL") {
    redirect("/dashboard/hospital");
  }
};

export default DashboardPage;
