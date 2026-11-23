import { myCampaign } from "@/server/campaign/campaign.service";
import { ICampaign } from "@/types/campaign/campaign";
import MyCampaignsList from "../../admin/MyCampaign/_components/MyCampaignsList";

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
