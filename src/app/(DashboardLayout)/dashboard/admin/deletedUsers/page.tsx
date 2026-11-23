import { getDeletedUsers } from "@/server/admin/admin.service";
import DeletedUsersTable from "./_components/DeletedUsersTable";
import { IDeleteUser } from "@/types/admin/admin";

const page = async () => {
  const response = await getDeletedUsers();
  const data = response?.data as unknown as IDeleteUser | IDeleteUser[] | undefined;
  const deletedUsers: IDeleteUser[] = Array.isArray(data)
    ? data
    : data
      ? [data]
      : [];
  
  return <DeletedUsersTable users={deletedUsers} />;
};

export default page;
