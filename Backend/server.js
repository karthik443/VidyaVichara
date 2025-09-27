import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import myRouter from "./Routers/questionRouter.js";
import userRouter from "./Routers/userRouter.js";
import ConnectDB from "./db.js";

dotenv.config();
ConnectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"] },
});

const JWT_SECRET = process.env.JWT_SECRET || "hope_you_are_doing_well";

app.use(cors());
app.use(express.json());

// Make io accessible in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// **Global JWT middleware**
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
    } catch (err) {
      req.userId = null;
    }
  } else {
    req.userId = null;
  }
  next();
});

// Routers
app.use("/questions", myRouter);
app.use("/users", userRouter);

// Socket.io
io.on("connection", (socket) => {
  console.log("NEW client connected", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
