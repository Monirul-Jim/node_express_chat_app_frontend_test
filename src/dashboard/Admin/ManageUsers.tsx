import {
  useGetAllUserQuery,
  useUpdateIsDeletedMutation,
  useUpdateRoleMutation,
  useUpdateStatusMutation,
} from "../../redux/api/authApi";

// Define the types for the user data
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isDeleted: boolean;
  status: string;
  __v: number;
}

interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

const ManageUsers = () => {
  const { data, isLoading } = useGetAllUserQuery(null) as {
    data: GetAllUsersResponse | undefined;
    isLoading: boolean;
  };
  const [updateIsDeleted] = useUpdateIsDeletedMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [updateStatus] = useUpdateStatusMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDeleteToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await updateIsDeleted({ userId, isDeleted: !currentStatus }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleUpdate = async (userId: string, role: string) => {
    try {
      await updateRole({ userId, role }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      await updateStatus({ userId, status }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Users</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">First Name</th>
              <th className="px-6 py-3 text-left">Last Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Is Deleted</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((user, index) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                <td className="px-6 py-4 text-gray-600">{user.firstName}</td>
                <td className="px-6 py-4 text-gray-600">{user.lastName}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.role}</td>
                <td className="px-6 py-4 text-gray-600">
                  {user.isDeleted ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.status}</td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleRoleUpdate(
                          user._id,
                          user.role === "admin" ? "user" : "admin"
                        )
                      }
                      className="bg-blue-500 text-white py-1 px-4 rounded-md text-sm"
                    >
                      {user.role === "admin"
                        ? "Demote to User"
                        : "Promote to Admin"}
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteToggle(user._id, user.isDeleted)
                      }
                      className="bg-yellow-500 text-white py-1 px-4 rounded-md text-sm"
                    >
                      {user.isDeleted ? "Restore" : "Delete"}
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          user._id,
                          user.status === "active" ? "blocked" : "active"
                        )
                      }
                      className="bg-red-600 text-white py-1 px-4 rounded-md text-sm"
                    >
                      {user.status === "active" ? "Block" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
