import { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";

function VideoSection() {
  const myVideoRef = useRef(null);
  const socket = useRef(null);
  const peerConnection = useRef(null);
  const isInitiator = useRef(false);

  const ROOM_ID = "room123";
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("INIT START");

        // 1. Get local media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log("Local media acquired");

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        // 2. Create PeerConnection FIRST
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });

        // 3. Add local tracks
        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        // 4. Remote track handler
        peerConnection.current.ontrack = (event) => {
          console.log("REMOTE TRACK RECEIVED");
          const remoteStream = event.streams[0];

          setRemoteStreams((prev) => {
            if (prev.find((s) => s.id === remoteStream.id)) return prev;
            return [...prev, remoteStream];
          });
        };

        // 5. ICE candidate sending
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE candidate");
            socket.current.emit(
              "ice-candidate",
              ROOM_ID,
              event.candidate
            );
          }
        };

        // 6. Connect socket
        socket.current = io("http://localhost:8686");

        socket.current.on("connect", () => {
          console.log("Socket connected:", socket.current.id);
        });

        socket.current.emit("join-room", ROOM_ID, "user");

        // 7. Receive initiator info
        socket.current.on("room-info", ({ isInitiator: initiator }) => {
          isInitiator.current = initiator;
          console.log("Room info received. Initiator:", initiator);
        });

        // 8. When someone else joins → initiator creates offer
        socket.current.on("user-joined", async () => {
          console.log("user-joined event");

          if (!isInitiator.current) {
            console.log("Not initiator, ignoring user-joined");
            return;
          }

          console.log("Creating offer");
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socket.current.emit("offer", ROOM_ID, offer);
        });

        // 9. Receive offer → create answer
        socket.current.on("receive-offer", async (offer) => {
          console.log("Offer received");

          await peerConnection.current.setRemoteDescription(offer);

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          socket.current.emit("answer", ROOM_ID, answer);
        });

        // 10. Receive answer
    socket.current.on("receive-answer", async (answer) => {
  if (
    peerConnection.current.signalingState !== "have-local-offer"
  ) {
    console.warn(
      "Skipping setRemoteDescription(answer). State:",
      peerConnection.current.signalingState
    );
    return;
  }

  await peerConnection.current.setRemoteDescription(answer);
});


        // 11. Receive ICE candidates
        socket.current.on("receive-ice-candidate", async (candidate) => {
          console.log("ICE candidate received");
          try {
            await peerConnection.current.addIceCandidate(candidate);
          } catch (err) {
            console.error("ICE error", err);
          }
        });

      } catch (err) {
        console.error("INIT ERROR", err);
      }
    };

    init();

    return () => {
      console.log("Cleaning up");
      if (socket.current) socket.current.disconnect();
      if (peerConnection.current) peerConnection.current.close();
    };
  }, []);

  return (
    <div className="h-full w-full bg-gray-700 p-4 text-white">
      <div className="grid grid-cols-2 gap-4">

        {/* LOCAL VIDEO */}
        <div className="relative">
          <span className="absolute top-1 left-1 bg-black/70 text-xs px-2 py-1 rounded">
            You
          </span>
          <video
            ref={myVideoRef}
            autoPlay
            muted
            className="bg-black h-40 w-full rounded scale-x-[-1]"
          />
        </div>

        {/* REMOTE VIDEOS */}
        {remoteStreams.map((stream, index) => (
          <div key={index} className="relative">
            <span className="absolute top-1 left-1 bg-black/70 text-xs px-2 py-1 rounded">
              Remote
            </span>
            <video
              autoPlay
              className="bg-black h-40 w-full rounded"
              ref={(el) => el && (el.srcObject = stream)}
            />
          </div>
        ))}

      </div>
    </div>
  );
}

export default VideoSection;
