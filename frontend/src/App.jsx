import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:8686");

    socket.on("connect", () => {
      console.log("Connected to Socket.io server:", socket.id);
    });

    socket.emit("join-room", "room123", "candidate");

    socket.on("user-joined", (msg) => {
      console.log("Server says:", msg);
    });

    socket.emit("chat-message", "room123", "Hello from frontend!");

    socket.on("receive-message", (message) => {
      console.log("Message received:", message);
    });

    return () => socket.disconnect();
  }, []);

  return <h1>Socket.io Test</h1>;
}

export default App;
