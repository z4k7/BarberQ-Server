"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const userRoute_1 = __importDefault(require("../router/userRoute"));
const vendorRoute_1 = __importDefault(require("../router/vendorRoute"));
const adminRoute_1 = __importDefault(require("../router/adminRoute"));
const tokenRoute_1 = __importDefault(require("../router/tokenRoute"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const conversationRepository_1 = __importDefault(require("../repository/conversationRepository"));
const messageRepository_1 = __importDefault(require("../repository/messageRepository"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const salonRepository_1 = __importDefault(require("../repository/salonRepository"));
const bookingRepository_1 = __importDefault(require("../repository/bookingRepository"));
const notificationService_1 = __importDefault(require("../utils/notificationService"));
const bookingUsecase_1 = __importDefault(require("../../usecase/bookingUsecase"));
const userRepository = new userRepository_1.default();
const salonRepository = new salonRepository_1.default();
const bookingRepository = new bookingRepository_1.default();
const notification = new notificationService_1.default();
const conversationRepository = new conversationRepository_1.default();
const messageRepository = new messageRepository_1.default();
const bookingUsecase = new bookingUsecase_1.default(bookingRepository, salonRepository, userRepository, notification);
bookingUsecase.scheduleOrderCompletionCheck();
console.log(`Inside config/app`);
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
exports.httpServer = httpServer;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(cors({ origin: "https://barberq.vercel.app", credentials: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:4200",
    credentials: true,
}));
app.use("/api/user", userRoute_1.default);
app.use("/api/vendor", vendorRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
app.use("/api/token", tokenRoute_1.default);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
    },
});
let users = [];
const addUser = (userId, socketId) => {
    console.log(`Inside add user`);
    const existingUser = users.find((user) => user.userId === userId);
    if (existingUser) {
        existingUser.socketId = socketId;
        existingUser.online = true;
    }
    else {
        users.push({ userId, socketId, online: true });
    }
    exports.io.emit("usersOnline", users.filter((user) => user.online));
};
const removeUser = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = users.find((user) => user.socketId === socketId);
    if (user) {
        user.lastSeen = new Date();
        user.online = false;
        try {
            yield conversationRepository.updateUserLastSeen(user.userId, user.lastSeen);
            exports.io.emit("userStatusChanged", {
                userId: user.userId,
                lastSeen: user.lastSeen,
                online: false,
            });
        }
        catch (error) {
            console.error("Failed to update user last seen:", error);
        }
    }
    exports.io.emit("usersOnline", users.filter((user) => user.online));
});
const getUser = (userId) => {
    console.log(`Users inside getUser`, users);
    return users.find((user) => user.userId === userId);
};
exports.io.on("connection", (socket) => {
    console.log(`A user connected ${socket.id}`);
    socket.on("addUser", (userId) => {
        console.log(`inside add user ${userId} socket ${socket.id}`);
        addUser(userId, socket.id);
        exports.io.emit("getUsers", users);
    });
    socket.on("send-message", (data) => {
        console.log(`Data:`, data);
        const saveData = {
            conversationId: data.conversationId,
            senderId: data.senderId,
            text: data.text,
        };
        messageRepository.save(saveData);
        const user = getUser(data.receiverId);
        if (user) {
            exports.io.to(user.socketId).emit("receive-message", { data });
        }
        console.log(`Received message ${data.text} `);
    });
    socket.on("disconnect", () => {
        console.log(`A user disconnected`);
        removeUser(socket.id).catch((err) => console.error("Error during user removal:", err));
        exports.io.emit("usersOnline", users.filter((user) => user.online));
    });
});
