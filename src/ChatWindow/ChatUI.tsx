import { TUser } from "../redux/feature/auth/authSlice";
import { useState } from "react";

interface ChatUIProps {
  selectedUser: TUser;
  onBack: () => void;
}

const ChatUI = ({ selectedUser, onBack }: ChatUIProps) => {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      // Logic to send the message (e.g., calling API or updating local state)
      setInput(""); // Clear input after sending message
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-white bg-blue-700 p-2 rounded-lg"
        >
          Back
        </button>
        <h1 className="text-lg font-semibold">
          {selectedUser.firstName} {selectedUser.lastName}
        </h1>
      </div>

      {/* Chat messages area (mocked for now) */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Placeholder messages */}
        <div className="mb-2">
          <div className="flex justify-start">
            <div className="bg-gray-700 p-2 rounded-lg text-white">
              Hello, how are you?
            </div>
          </div>
        </div>
      </div>

      {/* Message input */}
      <div className="flex items-center p-4 border-t bg-gray-800">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
