import { myCampaign } from "@/server/campaign/campaign.service";
import MyCampaignsList from "./_components/MyCampaignsList";
import { ICampaign } from "@/types/campaign/campaign";

const page = async () => {
  const response = await myCampaign();
    const campaigns: ICampaign[] = Array.isArray(response?.data)
      ? response.data
      : response?.data
        ? [response.data]
        : [];
   

  return <MyCampaignsList campaigns={campaigns} />;
};

export default page;
