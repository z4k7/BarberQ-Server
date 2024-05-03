"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../utils/controllers");
const vendorAuth_1 = require("../middlewares/vendorAuth");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
route.post("/register", (req, res) => controllers_1.vendorController.vendorSignUp(req, res));
route.post("/verifyOtp", (req, res) => controllers_1.vendorController.vendorOtpVerification(req, res));
route.get("/resend-otp", (req, res) => controllers_1.vendorController.resendOtp(req, res));
route.post("/login", (req, res) => controllers_1.vendorController.vendorLogin(req, res));
route.post("/add-salon", vendorAuth_1.vendorAuth, multerMiddleware_1.multerMiddleware.array("banner"), (req, res) => controllers_1.salonController.addSalon(req, res));
route.get("/services", vendorAuth_1.vendorAuth, (req, res) => controllers_1.serviceController.getAllServices(req, res));
route.get("/salons/bookings", (req, res) => controllers_1.bookingController.getSalonBookings(req, res));
route.get("/salons/:vendorId", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.getSalons(req, res));
route.get("/salons/salon-details/:salonId", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.getSalonById(req, res));
route.put("/salons/:salonId/services", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.updateSalonServices(req, res));
route.patch("/salons/:salonId/services", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.editSalonServices(req, res));
route.patch("/salons/:salonId", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.updateSalon(req, res));
route.delete("/salons/:salonId/services", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.deleteSalonServices(req, res));
route.patch("/salons/:salonId/status", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.updateSalonStatus(req, res));
route.patch("/salons/:salonId/premium", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.upgradeToPremium(req, res));
// * Razorpay Routes
route.post("/salons/create-order", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.createPaymentOrder(req, res));
route.post("/salons/verify-payment", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.verifyPayment(req, res));
// *Dashboard Routes
route.get("/dashboard/:vendorId", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.getVendorDashboardData(req, res));
route.get("/dashboard/salon/:salonId", vendorAuth_1.vendorAuth, (req, res) => controllers_1.salonController.getSalonDashboardData(req, res));
// * Booking Routes
exports.default = route;
