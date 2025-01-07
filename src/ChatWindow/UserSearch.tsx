import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/feature/hooks";
import {
  useAddedUserMutation,
  useGetSearchUserQuery,
  useGetAddedUsersQuery,
} from "../redux/api/userApi";
import { logout, TUser } from "../redux/feature/auth/authSlice";
import { useNavigate } from "react-router-dom";

interface UserSearchProps {
  onUserSelect: (user: TUser) => void;
}

const UserSearch = ({ onUserSelect }: UserSearchProps) => {
  const user = useAppSelector((state) => state.auth.user);

  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetSearchUserQuery(searchQuery);
  const [addedUser] = useAddedUserMutation();
  const { data: addedUsers } = useGetAddedUsersQuery(user?._id);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = async (users: TUser) => {
    try {
      await addedUser({
        currentUserId: user?._id,
        otherUserId: users?._id,
      }).unwrap();

      onUserSelect(users);
    } catch (error) {
      console.error("Failed to add user to chat:", error);
    }
  };

  const handleAddedUserSelect = (addedUser: TUser) => {
    onUserSelect(addedUser);
  };
  const handleLogout = () => {
    const res = dispatch(logout());
    if (res) {
      navigate("/login");
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <div className="flex justify-between items-center bg-blue-600  p-4">
        <h1 className="text-lg font-semibold">
          {user?.firstName} {user?.lastName}
        </h1>
        <button onClick={handleLogout} className="py-1 px-3 rounded-lg">
          Logout
        </button>
      </div>

      <div className="p-4 bg-gray-800">
        <input
          type="text"
          className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by Name or Email..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {searchQuery && (
        <ul className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p className="text-red-500">Error loading users</p>
          ) : data?.data?.length > 0 ? (
            data.data.map((user: TUser) => (
              <li
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="flex text-white items-center justify-between p-1 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer"
              >
                <div className="p-4">
                  <h1 className="text-2xl font-semibold text-white">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-sm text-gray-300">{user?.email}</p>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No users found</li>
          )}
        </ul>
      )}

      {addedUsers?.data?.length > 0 && (
        <div className="p-4  mt-4">
          <ul>
            {addedUsers?.data?.map((data: TUser) => (
              <li
                key={data._id}
                onClick={() => handleAddedUserSelect(data)}
                className=" text-white p-1 mb-1 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer"
              >
                <div className="p-4">
                  <h1 className="text-2xl font-semibold text-white">
                    {data?.firstName} {data?.lastName}
                  </h1>
                  <p className="text-sm text-gray-300">{data?.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
