// import { useState } from "react";
// import { useAppSelector } from "../redux/feature/hooks";
// import {
//   useAddedUserMutation,
//   useGetAddedUsersQuery,
//   useGetSearchUserQuery,
// } from "../redux/api/userApi";
// import { TUser } from "../redux/feature/auth/authSlice";

// interface Message {
//   id: number;
//   sender: "me" | "other";
//   content: string;
// }

// interface TAddedUser {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// const Chat = () => {
//   const user = useAppSelector((state) => state.auth.user);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
//   const [input, setInput] = useState("");

//   // Fetch users based on the search query
//   const { data, isLoading, isError } = useGetSearchUserQuery(searchQuery);
//   const [addedUser] = useAddedUserMutation();
//   const { data: addedUsers } = useGetAddedUsersQuery(user?._id);

//   const [messages, setMessages] = useState<Message[]>([
//     { id: 1, sender: "other", content: "Hi! How are you?" },
//     { id: 2, sender: "me", content: "I'm good, thanks! How about you?" },
//   ]);

//   const sendMessage = () => {
//     if (input.trim()) {
//       setMessages((prev) => [
//         ...prev,
//         { id: prev.length + 1, sender: "me", content: input.trim() },
//       ]);
//       setInput("");
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value); // Update the search query on input change
//   };

//   const handleUserSelect = async (users: TUser) => {
//     try {
//       // Add the user to the chat
//       await addedUser({
//         currentUserId: user?._id,
//         otherUserId: users?._id,
//       }).unwrap();

//       // Set the selected user for the chat
//       setSelectedUser(users);
//     } catch (error) {
//       console.error("Failed to add user to chat:", error);
//     }
//   };

//   return (
//     <div className="h-screen bg-gray-900 text-white">
//       <div className="h-full grid lg:grid-cols-3">
//         <div
//           className={`${
//             selectedUser && "hidden lg:block"
//           } bg-gray-800 border-r lg:col-span-1 flex flex-col`}
//         >
//           <div className="bg-blue-600 text-white p-4">
//             <h1 className="text-lg font-semibold">
//               {user?.firstName} {user?.lastName}
//             </h1>
//           </div>

//           <div className="p-4 bg-gray-800">
//             <input
//               type="text"
//               className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Search by Name or Email..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>

//           {searchQuery && (
//             <ul className="flex-1 overflow-y-auto p-4 space-y-2">
//               {isLoading ? (
//                 <p>Loading...</p>
//               ) : isError ? (
//                 <p className="text-red-500">Error loading users</p>
//               ) : data?.data?.length > 0 ? (
//                 data.data.map((user: TUser) => (
//                   <li
//                     key={user._id}
//                     onClick={() => handleUserSelect(user)}
//                     className="flex text-white items-center justify-between p-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer"
//                   >
//                     <span className="text-2xl">{user.firstName}</span>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-gray-400">No users found</li>
//               )}
//             </ul>
//           )}

//           {addedUsers?.data?.length > 0 && (
//             <div className="p-4 bg-gray-800 mt-4">
//               <ul>
//                 {addedUsers?.data?.map((data: TAddedUser) => (
//                   <li
//                     key={data?.userId}
//                     className="flex text-white items-center justify-between p-2 mb-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer"
//                   >
//                     <span className="text-2xl">
//                       {data?.firstName} {data?.lastName}
//                     </span>
//                     <span
//                       className={`h-3 w-3 rounded-full ${
//                         user?.online ? "bg-green-500" : "bg-gray-400"
//                       }`}
//                     />
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         <div
//           className={`${
//             !selectedUser && "hidden lg:flex"
//           } flex flex-col lg:col-span-2`}
//         >
//           {selectedUser ? (
//             <>
//               <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
//                 <button
//                   onClick={() => setSelectedUser(null)}
//                   className="text-white bg-blue-700 p-2 rounded-lg lg:hidden"
//                 >
//                   Back
//                 </button>
//                 <h1 className="text-lg font-semibold">
//                   {selectedUser.firstName} {selectedUser.lastName}
//                 </h1>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4">
//                 {messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex ${
//                       message.sender === "me" ? "justify-end" : "justify-start"
//                     } mb-2`}
//                   >
//                     <div
//                       className={`max-w-xs p-2 rounded-lg ${
//                         message.sender === "me"
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-700 text-white"
//                       }`}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex items-center p-4 border-t bg-gray-800">
//                 <input
//                   type="text"
//                   className="flex-1 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Type a message..."
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                 />
//                 <button
//                   className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                   onClick={sendMessage}
//                 >
//                   Send
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-400">Select a user to start chatting</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
