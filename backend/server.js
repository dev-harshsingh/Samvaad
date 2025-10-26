import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import { authorizeRoles, protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

const router = express.Router();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Samvaad Backend Running");
});

app.get(
  "/api/test/candidate",
  protect,
  authorizeRoles("candidate"),
  (req, res) => {
    res.send(`Hello Candidate ${req.user.id}`);
  }
);

app.get(
  "/api/test/interviewer",
  protect,
  authorizeRoles("interviewer"),
  (req, res) => {
    res.send(`Hello Interviewer ${req.user.id}`);
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
