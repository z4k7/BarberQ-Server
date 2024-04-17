import express from "express";
import http from "http";
import userRoute from "../router/userRoute";
import vendorRoute from "../router/vendorRoute";
import adminRoute from "../router/adminRoute";
import tokenRoute from "../router/tokenRoute";
import cors from "cors";
import { Server, Socket } from "socket.io";
import ConversationRepository from "../repository/conversationRepository";
import MessageRepository from "../repository/messageRepository";
import UserRepository from "../repository/userRepository";
import SalonRepository from "../repository/salonRepository";
import BookingRepository from "../repository/bookingRepository";
import NotificationService from "../utils/notificationService";
import BookingUsecase from "../../usecase/bookingUsecase";
import { bookingController } from "../utils/controllers";

const userRepository = new UserRepository();
const salonRepository = new SalonRepository();
const bookingRepository = new BookingRepository();
const notification = new NotificationService();
const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository();
const bookingUsecase = new BookingUsecase(
  bookingRepository,
  salonRepository,
  userRepository,
  notification
);

bookingUsecase.scheduleOrderCompletionCheck();

console.log(`Inside config/app`);

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:4200", credentials: true }));

app.use("/api/user", userRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/token", tokenRoute);

interface IUser {
  userId: string;
  socketId: string;
  lastSeen?: Date;
  online?: boolean;
}

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

let users: IUser[] = [];

const addUser = (userId: string, socketId: string) => {
  console.log(`Inside add user`);
  const existingUser = users.find((user) => user.userId === userId);
  if (existingUser) {
    existingUser.socketId = socketId;
    existingUser.online = true;
  } else {
    users.push({ userId, socketId, online: true });
  }
  io.emit(
    "usersOnline",
    users.filter((user) => user.online)
  );
};

const removeUser = async (socketId: string) => {
  const user = users.find((user) => user.socketId === socketId);
  if (user) {
    user.lastSeen = new Date();
    user.online = false;
    try {
      await conversationRepository.updateUserLastSeen(
        user.userId,
        user.lastSeen
      );
      io.emit("userStatusChanged", {
        userId: user.userId,
        lastSeen: user.lastSeen,
        online: false,
      });
    } catch (error) {
      console.error("Failed to update user last seen:", error);
    }
  }
  io.emit(
    "usersOnline",
    users.filter((user) => user.online)
  );
};

const getUser = (userId: string) => {
  console.log(`Users inside getUser`, users);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket: Socket) => {
  console.log(`A user connected ${socket.id}`);

  socket.on("addUser", (userId: any) => {
    console.log(`inside add user ${userId} socket ${socket.id}`);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on(
    "send-message",
    (data: {
      conversationId: string;
      senderId: string;
      receiverId: string;
      text: string;
    }) => {
      console.log(`Data:`, data);
      const saveData = {
        conversationId: data.conversationId,
        senderId: data.senderId,
        text: data.text,
      };
      messageRepository.save(saveData);
      const user = getUser(data.receiverId);
      if (user) {
        io.to(user.socketId).emit("receive-message", { data });
      }
      console.log(`Received message ${data.text} `);
    }
  );

  socket.on("disconnect", () => {
    console.log(`A user disconnected`);
    removeUser(socket.id).catch((err) =>
      console.error("Error during user removal:", err)
    );
    io.emit(
      "usersOnline",
      users.filter((user) => user.online)
    );
  });
});

export { httpServer };
