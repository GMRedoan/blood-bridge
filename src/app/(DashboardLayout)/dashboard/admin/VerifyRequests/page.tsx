import { getPendingRequests } from "@/server/admin/admin.service";
import PendingRequestsTable from "./_components/PendingRequestsTable";

const page = async () => {
  const response = await getPendingRequests();

  return <PendingRequestsTable requests={response.data ?? []} />;
};

export default page;
