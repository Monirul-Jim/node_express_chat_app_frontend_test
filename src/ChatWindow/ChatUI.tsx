import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAppSelector } from "../redux/feature/hooks";
import videoCallImg from "../assets/video.png";
import audioCallImg from "../assets/phone.png";
import microphoneImg from "../assets/microphone.png";
import { TUser } from "../redux/feature/auth/authSlice";
const socket = io("http://localhost:5000");

interface ChatMessage {
  sender: string;
  recipient: string;
  text?: string;
  audioUrl?: string;
  timestamp: string;
}

interface ChatUIProps {
  selectedUser: TUser;
  onBack: () => void;
}

const ChatUI: React.FC<ChatUIProps> = ({ selectedUser, onBack }) => {
  const user = useAppSelector((state) => state.auth.user);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [userStatus, setUserStatus] = useState<string>("offline");
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (user) {
      socket.emit("register", user._id);
    }
    if (selectedUser && user) {
      socket.emit("startChat", {
        userId: user._id,
        selectedUserId: selectedUser.userId,
      });

      socket.emit("checkUserStatus", selectedUser.userId);

      socket.on("userStatus", ({ userId, status }) => {
        if (userId === selectedUser.userId) {
          setUserStatus(status);
        }
      });
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

    return () => {
      if (selectedUser && user) {
        socket.emit("endChat", {
          userId: user?._id,
          selectedUserId: selectedUser.userId,
        });
      }
      socket.off("message");
      socket.off("previousMessages");
      socket.off("typing");
      socket.off("stoppedTyping");
      socket.off("userStatus");
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
      handleTyping();
    } else {
      handleTyping();
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

  //  here start audio record

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Audio = reader.result as string; // Base64 audio string
        socket.emit("message", {
          sender: user?._id,
          recipient: selectedUser.userId,
          audioUrl: base64Audio,
          timestamp: new Date().toISOString(),
        });
      };

      reader.readAsDataURL(audioBlob); // Convert blob to base64
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const formatDateLabel = (date: string): string => {
    const today = new Date();
    const messageDate = new Date(date);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const groupedMessages = messages.reduce<Record<string, ChatMessage[]>>(
    (acc, msg) => {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    },
    {}
  );
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between sticky top-0 z-10">
        {/* Left Section: Back button and selected user */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-white bg-blue-700 px-4 py-2 rounded-lg"
          >
            Back
          </button>
          <div>
            <h1 className="text-lg font-semibold">
              {selectedUser.firstName} {selectedUser.lastName}
            </h1>
            <span className="text-sm">
              {userStatus === "online" ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Right Section: Video and Audio Call buttons */}
        <div className="flex space-x-4">
          <button className="bg-blue-700 p-2 rounded-full hover:bg-blue-800">
            <img src={videoCallImg} alt="Video Call" className="w-6 h-6" />
          </button>
          <button className="bg-blue-700 p-2 rounded-full hover:bg-blue-800">
            <img src={audioCallImg} alt="Audio Call" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollableContainerRef} className="flex-1 overflow-y-auto p-4">
        <div>
          {Object.keys(groupedMessages).map((dateKey, index) => (
            <div key={index}>
              <div className="text-center text-gray-500 my-4">
                {formatDateLabel(dateKey)}
              </div>
              {groupedMessages[dateKey].map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 flex ${
                    msg.sender === user?._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg text-white flex items-center ${
                      msg.sender === user?._id ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  >
                    {msg.text ? (
                      <span>{msg.text}</span>
                    ) : msg.audioUrl ? (
                      <audio controls className="mr-2">
                        <source src={msg.audioUrl} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : null}
                    <span className="text-sm text-gray-300 ml-2">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.sender === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg text-white flex items-center ${
                msg.sender === user?._id ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              {msg.text ? (
                <span>{msg.text}</span>
              ) : msg.audioUrl ? (
                <audio controls className="mr-2">
                  <source src={msg.audioUrl} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              ) : null}
              <span className="text-sm text-gray-300 ml-2">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))} */}

        {isTyping && <p className="italic">Typing...</p>}
        {isRecording && (
          <div className="ml-4 flex items-center">
            <div className="animate-pulse bg-red-500 h-4 w-4 rounded-full"></div>
            <span className="ml-2 text-white">Recording...</span>
          </div>
        )}
      </div>

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
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`bg-blue-700 p-2 rounded-full hover:bg-blue-800 ${
            isRecording ? "bg-red-500" : ""
          }`}
        >
          <img src={microphoneImg} alt="Audio Call" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
