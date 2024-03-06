import { vendorController, salonController } from "../utils/controllers";
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

route.get("/services",vendorAuth,(req,res)=>vendorController.getServices(req,res))

export default route;
