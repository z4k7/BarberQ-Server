import { userAuth } from "../middlewares/userAuth";
import {
  bookingController,
  chatController,
  reviewController,
  salonController,
  userController,
} from "../utils/controllers";

import express from "express";
const route = express.Router();

route.post("/register", (req, res) => userController.userSignUp(req, res));
route.post("/verifyOtp", (req, res) =>
  userController.userOtpVerification(req, res)
);

route.get("/resend-otp", (req, res) => userController.resendOtp(req, res));

route.post("/login", (req, res) => userController.userLogin(req, res));

// *Salon Routes
route.get("/salons/nearby", (req, res) =>
  salonController.getNearbySalons(req, res)
);
route.get("/salon", (req, res) => salonController.getActiveSalons(req, res));
route.get("/salon/:salonId", (req, res) =>
  salonController.getSalonDetaills(req, res)
);
route.get("/salon/get-services", (req, res) =>
  salonController.getServicesByIds(req, res)
);

// * payment Routes

route.post("/salons/create-order", (req, res) =>
  salonController.createPaymentOrder(req, res)
);

route.post("/salons/verify-payment", (req, res) =>
  salonController.verifyPayment(req, res)
);

// * Booking Routes

route.get("/salons/available-slots", (req, res) =>
  bookingController.getAvailableSlots(req, res)
);

route.post("/salons/book-slot", (req, res) =>
  bookingController.bookSlot(req, res)
);

route.get("/salons/bookings", (req, res) =>
  bookingController.getBookings(req, res)
);
route.post("/salons/cancel-booking", (req, res) =>
  bookingController.cancelBooking(req, res)
);

// * Chat Routes

route.post("/newConversation", (req, res) =>
  chatController.newConversation(req, res)
);
route.post("/addMessage", (req, res) => chatController.addMessage(req, res));
route.get("/getMessages/:conversationId", (req, res) =>
  chatController.getMessages(req, res)
);

// * Review Routes
route.post("/reviews", (req, res) => reviewController.addReview(req, res));
route.get("/reviews", (req, res) => reviewController.getReviews(req, res));
route.get("/reviews/average", (req, res) =>
  reviewController.getAverage(req, res)
);
route.post("/reviews/user-in-booking", (req, res) =>
  reviewController.userInBooking(req, res)
);
route.post("/reviews/find-review", (req, res) =>
  reviewController.findReview(req, res)
);
route.put("/reviews", (req, res) => reviewController.editReview(req, res));

export default route;
