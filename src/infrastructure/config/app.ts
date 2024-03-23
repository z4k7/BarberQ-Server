import express from "express";
import http from "http";
import userRoute from "../router/userRoute";
import vendorRoute from "../router/vendorRoute";
import adminRoute from "../router/adminRoute";
import tokenRoute from "../router/tokenRoute";
import cors from "cors";
import { Server } from "socket.io";

console.log(`Inside config/app`);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:4200", credentials: true }));

app.use("/api/user", userRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/token", tokenRoute);

io.on("connection", (socket: any) => {
  console.log("A user connected");

  socket.on("message", (data: any) => {
    console.log(`Received message: ${data}`);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected`);
  });
});

export { httpServer };
