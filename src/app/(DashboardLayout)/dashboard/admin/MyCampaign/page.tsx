import { myCampaign } from "@/server/campaign/campaign.service";
import MyCampaignsList from "./_components/MyCampaignsList";

const page = async () => {
  const response = await myCampaign();

  return <MyCampaignsList campaigns={response.data} />;
};

export default page;
