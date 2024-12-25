// import { TUser } from "../redux/feature/auth/authSlice";
// import { useState } from "react";
// import { useAppSelector } from "../redux/feature/hooks";

// interface ChatUIProps {
//   selectedUser: TUser;
//   onBack: () => void;
// }

// const ChatUI = ({ selectedUser, onBack }: ChatUIProps) => {
//   const user = useAppSelector((state) => state.auth.user);
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (input.trim()) {
//       // Logic to send the message (e.g., calling API or updating local state)
//       setInput(""); // Clear input after sending message
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-gray-900 text-white">
//       <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
//         <button
//           onClick={onBack}
//           className="text-white bg-blue-700 p-2 rounded-lg"
//         >
//           Back
//         </button>
//         <h1 className="text-lg font-semibold">
//           {selectedUser.firstName} {selectedUser.lastName}
//         </h1>
//       </div>

//       {/* Chat messages area (mocked for now) */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {/* Placeholder messages */}
//         <div className="mb-2">
//           <div className="flex justify-start">
//             <div className="bg-gray-700 p-2 rounded-lg text-white">
//               Hello, how are you?
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Message input */}
//       <div className="flex items-center p-4 border-t bg-gray-800">
//         <input
//           type="text"
//           className="flex-1 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatUI;

// import { TUser } from "../redux/feature/auth/authSlice";
// import { useState, useEffect } from "react";
// import { useAppSelector } from "../redux/feature/hooks";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // Backend URL

// interface ChatMessage {
//   sender: string;
//   text: string;
// }

// interface ChatUIProps {
//   selectedUser: TUser;
//   onBack: () => void;
// }

// const ChatUI = ({ selectedUser, onBack }: ChatUIProps) => {
//   const user = useAppSelector((state) => state.auth.user);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<ChatMessage[]>([]);

//   useEffect(() => {
//     // Listen for incoming messages
//     socket.on("message", (message: ChatMessage) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Cleanup on component unmount
//     return () => {
//       socket.off("message");
//     };
//   }, []);

//   const sendMessage = () => {
//     if (input.trim() && user) {
//       const message: ChatMessage = {
//         sender: user.firstName, // Include sender's name
//         text: input,
//       };
//       socket.emit("message", message); // Send message to server
//       setMessages((prevMessages) => [...prevMessages, message]); // Optimistically update UI
//       setInput(""); // Clear input
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-gray-900 text-white">
//       <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
//         <button
//           onClick={onBack}
//           className="text-white bg-blue-700 p-2 rounded-lg"
//         >
//           Back
//         </button>
//         <h1 className="text-lg font-semibold">
//           {selectedUser.firstName} {selectedUser.lastName}
//         </h1>
//       </div>

//       {/* Chat messages area */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`mb-2 flex ${
//               msg.sender === user?.firstName ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-2 rounded-lg text-white ${
//                 msg.sender === user?.firstName ? "bg-blue-500" : "bg-gray-700"
//               } max-w-xs`}
//             >
//               <p className="text-sm">
//                 <strong>{msg.sender}</strong>
//               </p>
//               <p>{msg.text}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Message input */}
//       <div className="flex items-center p-4 border-t bg-gray-800">
//         <input
//           type="text"
//           className="flex-1 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatUI;

// this is perfect ----------------------------------------------------------

// import { TUser } from "../redux/feature/auth/authSlice";
// import { useState, useEffect } from "react";
// import { useAppSelector } from "../redux/feature/hooks";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // Backend URL

// interface ChatMessage {
//   sender: string;
//   recipient: string;
//   text: string;
//   timestamp: string;
// }

// interface ChatUIProps {
//   selectedUser: TUser;
//   onBack: () => void;
// }

// const ChatUI = ({ selectedUser, onBack }: ChatUIProps) => {
//   const user = useAppSelector((state) => state.auth.user);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<ChatMessage[]>([]);

//   useEffect(() => {
//     // Fetch previous messages
//     socket.emit("fetchMessages", {
//       user: user?._id,
//       chatWith: selectedUser.userId,
//     });

//     socket.on("previousMessages", (fetchedMessages: ChatMessage[]) => {
//       setMessages(fetchedMessages);
//     });

//     // Listen for incoming messages
//     socket.on("message", (message: ChatMessage) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off("message");
//       socket.off("previousMessages");
//     };
//   }, [selectedUser]);

//   const sendMessage = () => {
//     if (input.trim() && user) {
//       const message: ChatMessage = {
//         sender: user._id,
//         recipient: selectedUser.userId,
//         text: input,
//         timestamp: new Date().toISOString(),
//       };
//       socket.emit("message", message); // Send message to server
//       setMessages((prevMessages) => [...prevMessages, message]); // Optimistically update UI
//       setInput(""); // Clear input
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-gray-900 text-white">
//       <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
//         <button
//           onClick={onBack}
//           className="text-white bg-blue-700 p-2 rounded-lg"
//         >
//           Back
//         </button>
//         <h1 className="text-lg font-semibold">
//           {selectedUser.firstName} {selectedUser.lastName}
//         </h1>
//       </div>

//       {/* Chat messages area */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`mb-2 flex ${
//               msg.sender === user?._id ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-2 rounded-lg text-white ${
//                 msg.sender === user?._id ? "bg-blue-500" : "bg-gray-700"
//               } max-w-xs`}
//             >
//               <p>{msg.text}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Message input */}
//       <div className="flex items-center p-4 border-t bg-gray-800">
//         <input
//           type="text"
//           className="flex-1 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatUI;
import { useState, useEffect } from "react";
import { useAppSelector } from "../redux/feature/hooks";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

interface ChatMessage {
  sender: string;
  recipient: string;
  text: string;
  timestamp: string;
}

interface ChatUIProps {
  selectedUser: TUser;
  onBack: () => void;
}

const ChatUI = ({ selectedUser, onBack }: ChatUIProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (user) {
      // Register the user with the server
      socket.emit("register", user._id);
    }

    // Fetch previous messages
    socket.emit("fetchMessages", {
      user: user?._id,
      chatWith: selectedUser.userId,
    });

    socket.on("previousMessages", (fetchedMessages: ChatMessage[]) => {
      setMessages(fetchedMessages);
    });

    // Listen for incoming messages
    socket.on("message", (message: ChatMessage) => {
      // Update messages only if the message is relevant to the current chat
      if (
        (message.sender === selectedUser.userId &&
          message.recipient === user?._id) ||
        (message.sender === user?._id &&
          message.recipient === selectedUser.userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("message");
      socket.off("previousMessages");
    };
  }, [selectedUser, user]);

  const sendMessage = () => {
    if (input.trim() && user) {
      const message: ChatMessage = {
        sender: user._id,
        recipient: selectedUser.userId,
        text: input,
        timestamp: new Date().toISOString(),
      };
      socket.emit("message", message); // Send message to the server
      setMessages((prevMessages) => [...prevMessages, message]); // Optimistically update UI
      setInput(""); // Clear the input field
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-10">
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

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.sender === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg text-white ${
                msg.sender === user?._id ? "bg-blue-500" : "bg-gray-700"
              } max-w-xs break-words`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

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
