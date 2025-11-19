import { useRef, useState, useEffect } from "react";

function VideoSection() {
  const myVideoRef = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [myStream, setMyStream] = useState(null);

  useEffect(() => {
    const startMyVideo = async () => {
      try {
        const stream = navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setMyStream(stream);

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error capturing video:", error);
      }
    };

    startMyVideo();
  }, []);

  return (
    <div className="h-full w-full bg-gray-700 text-white p-4">
      <h2 className="text-xl mb-4">Video Call</h2>

      <div className="grid grid-cols-2 gap-4">
        <video
          ref={myVideoRef}
          autoPlay
          muted
          className="bg-black rounded w-full h-40"
        ></video>

        {remoteStreams.map((stream, index) => (
          <video
            key={index}
            autoPlay
            className="bg-black rounded w-full h-40"
            ref={(el) => {
              if (el) el.srcObject = stream;
            }}
          ></video>
        ))}
      </div>
    </div>
  );
}

export default VideoSection;
