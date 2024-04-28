"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../utils/controllers");
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
route.post("/register", (req, res) => controllers_1.userController.userSignUp(req, res));
route.post("/verifyOtp", (req, res) => controllers_1.userController.userOtpVerification(req, res));
route.get("/resend-otp", (req, res) => controllers_1.userController.resendOtp(req, res));
route.post("/login", (req, res) => controllers_1.userController.userLogin(req, res));
// *Salon Routes
route.get("/salons/nearby", (req, res) => controllers_1.salonController.getNearbySalons(req, res));
route.get("/salon", (req, res) => controllers_1.salonController.getActiveSalons(req, res));
route.get("/salon/:salonId", (req, res) => controllers_1.salonController.getSalonDetaills(req, res));
route.get("/salon/get-services", (req, res) => controllers_1.salonController.getServicesByIds(req, res));
// * payment Routes
route.post("/salons/create-order", (req, res) => controllers_1.salonController.createPaymentOrder(req, res));
route.post("/salons/verify-payment", (req, res) => controllers_1.salonController.verifyPayment(req, res));
// * Booking Routes
route.get("/salons/available-slots", (req, res) => controllers_1.bookingController.getAvailableSlots(req, res));
route.post("/salons/book-slot", (req, res) => controllers_1.bookingController.bookSlot(req, res));
route.get("/salons/bookings", (req, res) => controllers_1.bookingController.getBookings(req, res));
route.post("/salons/cancel-booking", (req, res) => controllers_1.bookingController.cancelBooking(req, res));
// * Chat Routes
route.post("/newConversation", (req, res) => controllers_1.chatController.newConversation(req, res));
route.post("/addMessage", (req, res) => controllers_1.chatController.addMessage(req, res));
route.get("/getMessages/:conversationId", (req, res) => controllers_1.chatController.getMessages(req, res));
// * Review Routes
route.post("/reviews", (req, res) => controllers_1.reviewController.addReview(req, res));
route.get("/reviews", (req, res) => controllers_1.reviewController.getReviews(req, res));
route.get("/reviews/average", (req, res) => controllers_1.reviewController.getAverage(req, res));
route.post("/reviews/user-in-booking", (req, res) => controllers_1.reviewController.userInBooking(req, res));
route.post("/reviews/find-review", (req, res) => controllers_1.reviewController.findReview(req, res));
route.put("/reviews", (req, res) => controllers_1.reviewController.editReview(req, res));
exports.default = route;
