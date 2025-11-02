import React, { useRef, useState } from "react";
import { getPusher } from "../config/pusher";

export default function LiveVideoViewer() {
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);
  const [joining, setJoining] = useState(false);
  const videoRef = useRef();
  const pcRef = useRef(null);
  const pusherChannelRef = useRef(null);

  const handleJoin = async () => {
    if (!roomId) {
      alert("Room ID is required");
      return;
    }
    setJoining(true);
    try {
      // Setup signaling peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      // show remote stream
      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      // Setup signaling via Pusher
      const channel = getPusher(roomId);
      pusherChannelRef.current = channel;

      // Receive offer from broadcaster
      channel.bind("client-sdp-offer", async (data) => {
        if (data.sdp) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          // Create and send answer
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          channel.trigger("client-sdp-answer", { sdp: answer });
          setConnected(true);
        }
      });
      // Receive ICE candidates from broadcaster
      channel.bind("client-ice-candidate", (data) => {
        if (data.candidate) {
          pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      });

      // Send ICE candidates to broadcaster
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          channel.trigger("client-ice-candidate", {
            candidate: event.candidate,
          });
        }
      };
    } catch (err) {
      alert("Failed to join room or signal: " + err);
      setJoining(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Join Live Video (Viewer)</h1>
      <input
        className="border rounded px-2 py-1 mb-4"
        placeholder="Room ID from Pusher"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        disabled={joining}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 disabled:opacity-60"
        onClick={handleJoin}
        disabled={joining || connected}
      >
        Join Live Video
      </button>
      <div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width={600}
          height={400}
          style={{
            background: "#000",
            borderRadius: "8px",
            display: connected ? "block" : "none",
          }}
        />
      </div>
      {joining && !connected && (
        <div className="mt-2 text-blue-600">Connecting to live stream...</div>
      )}
      {connected && (
        <div className="mt-2 text-green-600">Connected! Viewing broadcast.</div>
      )}
    </div>
  );
}
