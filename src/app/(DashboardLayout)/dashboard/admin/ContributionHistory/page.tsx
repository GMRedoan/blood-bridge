import {
  getAllContributionHistory,
  getMyContributionHistory,
} from "@/server/contribution/contribution.service";
import { getUser } from "@/server/user/user.service";
import ContributionHistory from "./_components/ContributionHistory";

const page = async () => {
  const user = await getUser();
  const isAdmin = user.data?.role === "ADMIN";

  const [myRes, allRes] = await Promise.all([
    getMyContributionHistory(),
    isAdmin ? getAllContributionHistory() : Promise.resolve(null),
  ]);

  return (
    <ContributionHistory
      isAdmin={isAdmin}
      myContributions={myRes?.data ?? []}
      allContributions={allRes?.data ?? []}
    />
  );
};

export default page;
