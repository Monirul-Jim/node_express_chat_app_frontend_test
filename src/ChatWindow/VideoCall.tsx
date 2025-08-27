import React, { useEffect, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  IAgoraRTCRemoteUser, // 👈 this replaces IRemoteUser
} from "agora-rtc-sdk-ng";


interface VideoCallProps {
  channelName: string;
  uid: string;
  onLeave: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ channelName, uid, onLeave }) => {
  const [client] = useState<IAgoraRTCClient>(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  useEffect(() => {
    const initCall = async () => {
      const res = await fetch(`https://node-express-chat-app-backend-test-hao2.onrender.com/api/v1/agora/token?channel=${channelName}&uid=${uid}`);
      const { appId, token } = await res.json();

      await client.join(appId, channelName, token, uid);

      // Create local tracks
      const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalAudioTrack(micTrack);
      setLocalVideoTrack(camTrack);

      // Play local video
      camTrack.play("local-player");

      // Publish local tracks
      await client.publish([micTrack, camTrack]);

      // Handle remote users
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
          remoteVideoTrack.play(`remote-player-${user.uid}`);
        }
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
          remoteAudioTrack.play();
        }
        setRemoteUsers((prev) => [...prev, user]);
      });

      client.on("user-unpublished", (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });
    };

    initCall();

    return () => {
      localAudioTrack?.close();
      localVideoTrack?.close();
      client.leave();
      onLeave();
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Local video */}
      <div id="local-player" className="w-48 h-36 bg-gray-700 absolute bottom-4 right-4 rounded"></div>

      {/* Remote users */}
      <div className="flex-1 flex justify-center items-center">
        {remoteUsers?.map((user) => (
          <div
            key={user.uid}
            id={`remote-player-${user.uid}`}
            className="w-full h-full bg-gray-800"
          ></div>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 flex justify-center space-x-4 bg-gray-900">
        <button
          className="bg-red-500 px-4 py-2 rounded"
          onClick={() => {
            client.leave();
            onLeave();
          }}
        >
          Leave Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
