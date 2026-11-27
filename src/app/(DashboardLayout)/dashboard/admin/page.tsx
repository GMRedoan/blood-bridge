import { getAllContributionHistory } from "@/server/contribution/contribution.service";
import {
  getAllUsers,
  getDeletedUsers, 
  getPendingRequests,
} from "@/server/admin/admin.service";
import {
  getAllCampaign,
  getPendingCampaigns,
} from "@/server/campaign/campaign.service";
import { getUser } from "@/server/user/user.service";
import AdminDashboard from "./_components/AdminDashboard";

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
  const [
    me,
    users,
    deleted,
    contributions,
    campaigns,
    pendingCampaigns,
    pendingRequests,
  ] = await Promise.all([
    safe(getUser()),
    safe(getAllUsers()),
    safe(getDeletedUsers()),
    safe(getAllContributionHistory()),
    safe(getAllCampaign()),
    safe(getPendingCampaigns()),
    safe(getPendingRequests()),
  ]);

  return (
    <AdminDashboard
      name={me?.data?.name ?? "Admin"}
      users={toArray(users?.data)}
      deletedUsers={toArray(deleted?.data)}
      contributions={toArray(contributions?.data)}
      campaigns={toArray(campaigns?.data)}
      pendingCampaigns={toArray(pendingCampaigns?.data)}
      pendingRequests={toArray(pendingRequests?.data)}
    />
  );
};

export default Page;
