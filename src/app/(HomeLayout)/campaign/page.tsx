import { getAllCampaign } from "@/server/campaign/campaign.service";
import { getUser } from "@/server/user/user.service";
import CampaignsPage from "./_components/campaignPage";

const page = async () => {
  const [campaignRes, user] = await Promise.all([
    getAllCampaign(),
    getUser().catch(() => null), 
  ]);

  const role = user?.data?.role;
  const canCreate = role === "ADMIN" || role === "HOSPITAL";

  return (
    <CampaignsPage
      campaigns={campaignRes?.data ?? []}
      canCreate={canCreate}
      isLoggedIn={Boolean(user?.data)}
    />
  );
};

export default page;
