import { myBloodRequests } from "@/server/patient/patient.service";
import MyRequests from "./_components/myRequest";

const Page = async () => {
  const response = await myBloodRequests();

  return (
    <MyRequests
      requests={
        response?.success && Array.isArray(response.data) ? response.data : []
      }
    />
  );
};

export default Page;
