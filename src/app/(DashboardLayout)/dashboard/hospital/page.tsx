import { getMyContributionHistory } from "@/server/contribution/contribution.service";
import { myCampaign } from "@/server/campaign/campaign.service";
import { getUser } from "@/server/user/user.service";
import { myBloodRequests } from "@/server/patient/patient.service";
import RequesterDashboard from "@/components/dashboard/RequesterDashboard";

const safe = async <T,>(promise: Promise<T>): Promise<T | null> => {
  try {
    return await promise;
  } catch {
    return null;
  }
};

const toArray = <T,>(data: unknown): T[] =>
  Array.isArray(data) ? (data as T[]) : data ? [data as T] : [];

const Page = async () => {
  const [me, requests, contributions, campaigns] = await Promise.all([
    safe(getUser()),
    safe(myBloodRequests()),
    safe(getMyContributionHistory()),
    safe(myCampaign()),
  ]);

  return (
    <RequesterDashboard
      variant="hospital"
      name={me?.data?.name ?? "Hospital"}
      requests={toArray(requests?.data)}
      contributions={toArray(contributions?.data)}
      campaigns={toArray(campaigns?.data)}
    />
  );
};

export default Page;
