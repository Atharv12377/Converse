import express from "express";
import dotenv from "dotenv";
dotenv.config();

import http from "http"
import { initializeSocket } from "./socket.js";
import cookieparser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3000;

import authRouter from "./route/auth.route.js";
import messageRouter from "./route/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieparser());
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("The server is running on port " + PORT);
      console.log("SocketIO ready")
    });
  })
  .catch((err) => {
    console.log("Some shit happended and mongo db did not connect");
  });
