import {
  vendorController,
  salonController,
  serviceController,
} from "../utils/controllers";
import { vendorAuth } from "../middlewares/vendorAuth";
import { multerMiddleware } from "../middlewares/multerMiddleware";

import express from "express";
const route = express.Router();

route.post("/register", (req, res) => vendorController.vendorSignUp(req, res));

route.post("/verifyOtp", (req, res) =>
  vendorController.vendorOtpVerification(req, res)
);

route.get("/resend-otp", (req, res) => vendorController.resendOtp(req, res));

route.post("/login", (req, res) => vendorController.vendorLogin(req, res));

route.post(
  "/add-salon",
  vendorAuth,
  multerMiddleware.array("banner"),
  (req, res) => salonController.addSalon(req, res)
);

route.get("/services", vendorAuth, (req, res) =>
  serviceController.getAllServices(req, res)
);
route.get("/salons/:vendorId", vendorAuth, (req, res) =>
  salonController.getSalons(req, res)
);

route.get("/salons/salon-details/:salonId", vendorAuth, (req, res) =>
  salonController.getSalonById(req, res)
);

route.put("/salons/:salonId/services", vendorAuth, (req, res) =>
  salonController.updateSalonServices(req, res)
);

route.patch("/salons/:salonId/services", vendorAuth, (req, res) =>
  salonController.editSalonServices(req, res)
);

route.patch("/salons/:salonId", vendorAuth, (req, res) =>
  salonController.updateSalon(req, res)
);

route.delete("/salons/:salonId/services", vendorAuth, (req, res) =>
  salonController.deleteSalonServices(req, res)
);

route.patch("/salons/:salonId/status", vendorAuth, (req, res) =>
  salonController.updateSalonStatus(req, res)
);

// * Razorpay Routes

route.post("/salons/approve", vendorAuth, (req, res) =>
  salonController.approveSalon(req, res)
);

route.post("/salons/verify-payment", vendorAuth, (req, res) =>
  salonController.verifyPayment(req, res)
);

export default route;
