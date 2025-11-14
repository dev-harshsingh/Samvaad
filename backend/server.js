import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import { protect, authorizeRoles } from "./middleware/authMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Normal HTTP route example
app.use("/api/auth", authRoutes);
app.get("/api/test/candidate", protect, authorizeRoles("candidate"), (req, res) => {
  res.send(`Hello Candidate ${req.user.id}`);
});

// --- Socket.io setup ---
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // frontend vite port
    methods: ["GET", "POST"],
  },
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Join room
  socket.on("join-room", (roomId, userRole) => {
    socket.join(roomId);
    console.log(`${userRole} joined room ${roomId}`);
    io.to(roomId).emit("user-joined", `${userRole} joined the interview`);
  });

  // Listen for chat messages
  socket.on("chat-message", (roomId, message) => {
    io.to(roomId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
