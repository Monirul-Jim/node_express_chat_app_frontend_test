import { useState } from "react";
import { TUser } from "../redux/feature/auth/authSlice";
import UserSearch from "./UserSearch";
import ChatUI from "./ChatUI";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  const handleUserSelect = (user: TUser) => {
    setSelectedUser(user); // Set the selected user to open chat
  };

  const handleBack = () => {
    setSelectedUser(null); // Reset the selected user when back is clicked
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
      {/* Left panel: Search and Added User List */}
      <div
        className={`flex-1 lg:w-1/4 ${selectedUser ? "hidden lg:block" : ""}`}
      >
        <UserSearch onUserSelect={handleUserSelect} />
      </div>

      {/* Right panel: Chat UI */}
      <div className="flex-1 lg:w-2/3">
        {!selectedUser ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a user to start chatting</p>
          </div>
        ) : (
          <ChatUI selectedUser={selectedUser} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
