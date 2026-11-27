import { getMyContributionHistory } from "@/server/contribution/contribution.service";
import { getMatchingRequest, myDonations } from "@/server/donor/donor.service";
import { getUser } from "@/server/user/user.service";
import DonorDashboard, { DonationItem } from "./_components/DonorDashboard";

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
  const [userRes, contribRes, matchRes, donationRes] = await Promise.all([
    safe(getUser()),
    safe(getMyContributionHistory()),
    safe(getMatchingRequest()),
    safe(myDonations()),
  ]);

  const donations: DonationItem[] = toArray<any>(donationRes?.data).map(
    (d) => ({
      id: d.id,
      date: d.donationDate ?? d.donatedAt ?? d.createdAt,
      units: Number(d.units ?? d.unitsDonated ?? 1),
      hospital: d.hospitalName ?? d.request?.hospitalName ?? "Hospital",
      status: d.status ?? "COMPLETED",
    }),
  );

  return (
    <DonorDashboard
      name={userRes?.data?.name ?? "Donor"}
      bloodGroup={userRes?.data?.donorProfile?.bloodGroup ?? null}
      donations={donations}
      contributions={toArray(contribRes?.data)}
      requests={toArray(matchRes?.data)}
    />
  );
};

export default Page;
