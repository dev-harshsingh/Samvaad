// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import { connectDB } from "./config/db.js";
// import authRoutes from "./routes/auth.js";
// import { protect, authorizeRoles } from "./middleware/authMiddleware.js";

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.get(
//   "/api/test/candidate",
//   protect,
//   authorizeRoles("candidate"),
//   (req, res) => {
//     res.send(`Hello Candidate ${req.user.id}`);
//   }
// );

// const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);
// socket.on("join-room", (roomId, role) => {
//   const room = io.sockets.adapter.rooms.get(roomId);
//   const isInitiator = !room || room.size === 0;

//   socket.join(roomId);

//   socket.emit("room-info", { isInitiator });

//   socket.to(roomId).emit("user-joined");
// });

//   socket.on("chat-message", (roomId, message) => {
//     io.to(roomId).emit("receive-message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
//   socket.on("offer", (roomId, offer) => {
//   socket.to(roomId).emit("receive-offer", offer);
// });
// socket.on("answer", (roomId, answer) => {
//   socket.to(roomId).emit("receive-answer", answer);
// });
// socket.on("ice-candidate", (roomId, candidate) => {
//   socket.to(roomId).emit("receive-ice-candidate", candidate);
// });

// });

// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Samvaad Backend Running");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-room", (roomId, role) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const isInitiator = !room || room.size === 0;

    socket.join(roomId);

    socket.emit("room-info", { isInitiator });

    socket.to(roomId).emit("user-joined");
  });

  socket.on("offer", (roomId, offer) => {
    console.log("OFFER received for room", roomId);
    socket.to(roomId).emit("receive-offer", offer);
  });

  socket.on("answer", (roomId, answer) => {
    console.log("ANSWER received for room", roomId);
    socket.to(roomId).emit("receive-answer", answer);
  });

  socket.on("ice-candidate", (roomId, candidate) => {
    console.log("ICE candidate for room", roomId);
    socket.to(roomId).emit("receive-ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8686;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
