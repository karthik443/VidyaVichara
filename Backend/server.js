import express from "express";
import http from "http";
import {Server} from "socket.io"
import cors from "cors";
import dotenv from "dotenv";
import myRouter  from "./Routers/questionRouter.js"
import ConnectDB  from "./db.js";
dotenv.config();
ConnectDB();

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
app.use("/questions",myRouter);
io.on("connection",(socket)=>{
    console.log("NEW client connected",socket.id);
    socket.on("disconnect",()=>{
        console.log("Client disconnected",socket.id);
    });
})
const PORT  = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log("Server running on port "+ PORT);
})
