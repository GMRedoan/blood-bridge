import { getMatchingRequest } from "@/server/donor/donor.service";
import { myBloodRequests } from "@/types/patient/patient";
import MatchingRequest from "./_components/matchingRequest";

const Page = async () => {
  const response = await getMatchingRequest();

  const requests: myBloodRequests[] = response?.data ?? [];

  return <MatchingRequest requests={requests} />;
};

export default Page;
