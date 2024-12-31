// import { useState, useEffect, useCallback } from "react";
// import { useAppSelector } from "../redux/feature/hooks";
// import { io } from "socket.io-client";
// import videoCallImg from "../assets/video.png";
// import audioCallImg from "../assets/phone.png";
// const socket = io("http://localhost:5000");

// interface ChatMessage {
//   sender: string;
//   recipient: string;
//   text: string;
//   timestamp: string;
// }

// interface ChatUIProps {
//   selectedUser: { userId: string; firstName: string; lastName: string };
//   onBack: () => void;
// }

// const ChatUI = ({ selectedUser, onBack }: ChatUIProps) => {
//   const user = useAppSelector((state) => state.auth.user);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [isTyping, setIsTyping] = useState(false); // Track if the user is typing

//   useEffect(() => {
//     if (user) {
//       socket.emit("register", user._id);
//     }

//     socket.emit("fetchMessages", {
//       user: user?._id,
//       chatWith: selectedUser.userId,
//     });

//     socket.on("previousMessages", (fetchedMessages: ChatMessage[]) => {
//       setMessages(fetchedMessages);
//     });

//     socket.on("message", (message: ChatMessage) => {
//       if (
//         (message.sender === selectedUser.userId &&
//           message.recipient === user?._id) ||
//         (message.sender === user?._id &&
//           message.recipient === selectedUser.userId)
//       ) {
//         setMessages((prevMessages) => [...prevMessages, message]);
//       }
//     });

//     socket.on("typing", (senderId: string) => {
//       if (senderId === selectedUser.userId) {
//         setIsTyping(true); // Show typing indicator when the other user is typing
//       }
//     });

//     socket.on("stoppedTyping", (senderId: string) => {
//       if (senderId === selectedUser.userId) {
//         setIsTyping(false); // Hide typing indicator when the other user stops typing
//       }
//     });

//     return () => {
//       socket.off("message");
//       socket.off("previousMessages");
//       socket.off("typing");
//       socket.off("stoppedTyping");
//     };
//   }, [selectedUser, user]);

//   const handleTyping = useCallback(() => {
//     if (input.trim()) {
//       socket.emit("typing", {
//         senderId: user?._id,
//         recipientId: selectedUser.userId,
//       });
//     } else {
//       socket.emit("stoppedTyping", {
//         senderId: user?._id,
//         recipientId: selectedUser.userId,
//       });
//     }
//   }, [input, user?._id, selectedUser.userId]);

//   const sendMessage = () => {
//     if (input.trim() && user) {
//       const message: ChatMessage = {
//         sender: user._id,
//         recipient: selectedUser.userId,
//         text: input,
//         timestamp: new Date().toISOString(),
//       };
//       socket.emit("message", message); // Send message to the server
//       setMessages((prevMessages) => [...prevMessages, message]); // Optimistically update UI
//       setInput(""); // Clear the input field
//     }
//   };

//   useEffect(() => {
//     if (input.trim()) {
//       handleTyping(); // Emit typing event if the user is typing
//     } else {
//       handleTyping(); // Emit stopped typing event if input is empty
//     }
//   }, [input, handleTyping]);

//   return (
//     <div className="h-full flex flex-col bg-gray-900 text-white">
//       <div className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-10">
//         <button
//           onClick={onBack}
//           className="text-white bg-blue-700 p-2 rounded-lg"
//         >
//           Back
//         </button>
//         <h1 className="text-lg font-semibold">
//           {selectedUser.firstName} {selectedUser.lastName}
//         </h1>
//         <div className="flex space-x-4">
//           <button className="bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition ease-in-out duration-300">
//             <img src={videoCallImg} alt="video call" className="w-6 h-6" />
//           </button>
//           <button className="bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition ease-in-out duration-300">
//             <img src={audioCallImg} alt="audio call" className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

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
//               } max-w-xs break-words`}
//             >
//               <p className="whitespace-pre-wrap">{msg.text}</p>
//             </div>
//           </div>
//         ))}

//         {/* Show typing indicator only after the last message */}
//         {isTyping && (
//           <div className="mt-2 text-white italic">
//             {selectedUser.firstName} is typing...
//           </div>
//         )}
//       </div>

//       <div className="flex items-center p-4 border-t bg-gray-800">
//         <input
//           type="text"
//           className="flex-1 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)} // Directly set input state
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

import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAppSelector } from "../redux/feature/hooks";
import videoCallImg from "../assets/video.png";
import audioCallImg from "../assets/phone.png";
import microphoneImg from "../assets/microphone.png";
const socket = io("http://localhost:5000"); // Socket.IO server URL

interface ChatMessage {
  sender: string;
  recipient: string;
  text?: string;
  audioUrl?: string;
  timestamp: string;
}

interface ChatUIProps {
  selectedUser: { userId: string; firstName: string; lastName: string };
  onBack: () => void;
}

const ChatUI: React.FC<ChatUIProps> = ({ selectedUser, onBack }) => {
  const user = useAppSelector((state) => state.auth.user);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isVideoCall, setIsVideoCall] = useState<boolean>(false);
  const [callerId, setCallerId] = useState<string | null>(null); // Add state for callerId

  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  // Fetch messages and register user
  useEffect(() => {
    if (user) {
      socket.emit("register", user._id); // Register user with Socket.IO
    }

    socket.emit("fetchMessages", {
      user: user?._id,
      chatWith: selectedUser.userId,
    });

    socket.on("previousMessages", (fetchedMessages: ChatMessage[]) => {
      setMessages(fetchedMessages);
    });

    socket.on("message", (message: ChatMessage) => {
      if (
        (message.sender === selectedUser.userId &&
          message.recipient === user?._id) ||
        (message.sender === user?._id &&
          message.recipient === selectedUser.userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on("typing", (senderId: string) => {
      if (senderId === selectedUser.userId) {
        setIsTyping(true);
      }
    });

    socket.on("stoppedTyping", (senderId: string) => {
      if (senderId === selectedUser.userId) {
        setIsTyping(false);
      }
    });
    socket.on("offer", async ({ offer, senderId }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { answer, recipientId: senderId });
      }
    });
    socket.on("callAccepted", ({ recipientId }) => {
      console.log(`Call accepted by ${recipientId}`);
      // Transition to the call UI
      setIsCallActive(true);
    });

    socket.on("callRejected", ({ recipientId }) => {
      console.log(`Call rejected by ${recipientId}`);
      setIsCallActive(false);
      setCallerId(null);
    });

    socket.on("answer", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });
    socket.on("iceCandidate", async ({ candidate }) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    socket.on("incomingCall", ({ callerId, callType }) => {
      if (callerId !== user?._id) {
        setCallerId(callerId);
        setIsCallActive(true);
        setIsVideoCall(callType === "video");

        const accept = window.confirm(
          `Incoming ${callType.toUpperCase()} call from ${callerId}. Accept?`
        );
        if (accept) {
          startCall(callType === "video", true); // Start WebRTC
          socket.emit("callAccepted", { callerId, recipientId: user?._id });
        } else {
          socket.emit("callRejected", { callerId, recipientId: user?._id });
        }
      }
    });

    socket.on("callEnded", () => {
      endCall();
    });

    return () => {
      socket.off("message");
      socket.off("previousMessages");
      socket.off("typing");
      socket.off("stoppedTyping");
      socket.off("incomingCall");
      socket.off("callEnded");
      socket.off("callAccepted");
      socket.off("callRejected");
    };
  }, [selectedUser, user]);

  const handleTyping = useCallback(() => {
    if (input.trim()) {
      socket.emit("typing", {
        senderId: user?._id,
        recipientId: selectedUser.userId,
      });
    } else {
      socket.emit("stoppedTyping", {
        senderId: user?._id,
        recipientId: selectedUser.userId,
      });
    }
  }, [input, user?._id, selectedUser.userId]);

  useEffect(() => {
    if (input.trim()) {
      handleTyping(); // Emit typing event if the user is typing
    } else {
      handleTyping(); // Emit stopped typing event if input is empty
    }
  }, [input, handleTyping]);

  const sendMessage = () => {
    if (input.trim() && user) {
      const message: ChatMessage = {
        sender: user._id,
        recipient: selectedUser.userId,
        text: input,
        timestamp: new Date().toISOString(),
      };
      socket.emit("message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
    }
  };

  const startCall = async (isVideo: boolean, isIncoming: boolean = false) => {
    setIsVideoCall(isVideo);
    setIsCallActive(true);

    // Capture local media stream
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: isVideo,
      audio: true,
    });

    if (localVideoRef.current && localStream.current) {
      localVideoRef.current.srcObject = localStream.current;
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local tracks to the peer connection
    localStream.current.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream.current!);
    });

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      const [stream] = event.streams;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    // ICE candidate handling
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          candidate: event.candidate,
          recipientId: selectedUser.userId,
        });
      }
    };

    if (!isIncoming) {
      // If this is the caller, create and send an offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", {
        offer,
        recipientId: selectedUser.userId,
      });
    }
  };

  const endCall = () => {
    peerConnection.current?.close();
    localStream.current?.getTracks().forEach((track) => track.stop());
    setIsCallActive(false);
    setIsVideoCall(false);
    setCallerId(null);

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={onBack}
          className="text-white bg-blue-700 px-4 py-2 rounded-lg"
        >
          Back
        </button>
        <h1 className="text-lg font-semibold">
          {selectedUser.firstName} {selectedUser.lastName}
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => startCall(true)}
            className="bg-blue-700 p-2 rounded-full hover:bg-blue-800"
          >
            <img src={videoCallImg} alt="Video Call" className="w-6 h-6" />
          </button>
          <button
            onClick={() => startCall(false)}
            className="bg-blue-700 p-2 rounded-full hover:bg-blue-800"
          >
            <img src={audioCallImg} alt="Audio Call" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Messages */}
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
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <p className="italic">Typing...</p>}
      </div>

      {/* Call UI */}
      {isCallActive && (
        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
          <h2 className="text-white text-lg">
            {isVideoCall ? "Video" : "Audio"} Call
          </h2>
          <div className="flex space-x-4 mt-4">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-1/3 rounded-lg"
            ></video>
            {isVideoCall && (
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-1/3 rounded-lg"
              ></video>
            )}
          </div>
          <button
            onClick={endCall}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            End Call
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 flex items-center border-t bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 rounded-lg"
        >
          Send
        </button>
        <button className="bg-blue-700 p-2 rounded-full hover:bg-blue-800">
          <img src={microphoneImg} alt="Audio Call" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
