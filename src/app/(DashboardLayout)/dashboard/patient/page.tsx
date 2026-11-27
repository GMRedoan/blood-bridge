import RequesterDashboard from "@/components/dashboard/RequesterDashboard";
import { getMyContributionHistory } from "@/server/contribution/contribution.service";
import { myBloodRequests } from "@/server/patient/patient.service";
import { getUser } from "@/server/user/user.service";

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
  const [me, requests, contributions] = await Promise.all([
    safe(getUser()),
    safe(myBloodRequests()),
    safe(getMyContributionHistory()),
  ]);

  return (
    <RequesterDashboard
      variant="patient"
      name={me?.data?.name ?? "Patient"}
      requests={toArray(requests?.data)}
      contributions={toArray(contributions?.data)}
    />
  );
};

export default Page;
