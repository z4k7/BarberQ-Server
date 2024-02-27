import { userAuth } from "../middlewares/userAuth";
import { salonController, userController } from "../utils/controllers";


import express from "express";
const route = express.Router();


route.post("/register", (req, res) => userController.userSignUp(req, res));
route.post("/verifyOtp", (req, res) =>
  userController.userOtpVerification(req, res)
);

route.get("/resend-otp", (req, res) => userController.resendOtp(req, res));


route.post("/login", (req, res) => userController.userLogin(req, res));

route.get("/salon",(req,res)=>salonController.getSalons(req,res) )


export default route;
