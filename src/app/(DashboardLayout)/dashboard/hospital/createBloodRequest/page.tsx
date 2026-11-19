import { getUser } from "@/server/user/user.service";
import CreateBloodRequestForm from "../../patient/createBloodRequest/_components/CreateBloodRequestForm";

const Page = async () => {
  const profile = await getUser();

  return (
    <CreateBloodRequestForm
      profileCity={profile?.data?.city}
      profileArea={profile?.data?.area}
    />
  );
};

export default Page;
