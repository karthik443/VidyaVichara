import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import myRouter from "./Routers/questionRouter.js";
import userRouter from "./Routers/userRouter.js";
import ConnectDB from "./db.js";
import {verifyToken} from "./middleware/auth.js"
import lectureRouter from "./Routers/lectureRouter.js"
dotenv.config();
ConnectDB();
console.log("JWT_SECRET used:",process.env.JWT_SECRET ? "Loaded" : "MISSING");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"] },
});


app.use(cors());
app.use(express.json());

// Make io accessible in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});


// Routers

app.use("/users", userRouter);

app.use("/questions", verifyToken,myRouter);
app.use("/lecture", verifyToken,lectureRouter);

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
