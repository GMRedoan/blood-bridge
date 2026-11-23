import { getPendingCampaigns } from "@/server/campaign/campaign.service";
import PendingCampaignsList from "./_components/PendingCampaignsList";
import { ICampaign } from "@/types/campaign/campaign";

const page = async () => {
  const response = await getPendingCampaigns();
  const pendingCampaigns: ICampaign[] = Array.isArray(response?.data)
      ? response.data
      : response?.data
        ? [response.data]
        : [];

  return <PendingCampaignsList campaigns={pendingCampaigns} />;
};

export default page;
