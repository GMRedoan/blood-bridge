import { deleteUser, getAllUsers, updateUserStatus } from "@/server/admin/admin.service";
import UserManagementTable from "./_components/UserManagementTable";
import { IGetUserProfile } from "@/types/user/user";

const Page = async () => {
  const response = await getAllUsers();
  const allUsers: IGetUserProfile[] = Array.isArray(response?.data)
    ? response.data
    : response?.data
      ? [response.data]
      : [];
  
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <UserManagementTable
        users={allUsers}
        onDeleteUser={deleteUser}
        onToggleUserStatus={updateUserStatus}
      />
    </div>
  );
};

export default Page;
