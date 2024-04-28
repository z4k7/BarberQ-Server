"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminAuth_1 = require("../middlewares/adminAuth");
const controllers_1 = require("../utils/controllers");
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
route.post("/login", (req, res) => controllers_1.adminController.adminLogin(req, res));
//* Admin-User Routes
route.get("/users", adminAuth_1.adminAuth, (req, res) => controllers_1.adminController.getUsers(req, res));
route.patch("/users/block/:id", adminAuth_1.adminAuth, (req, res) => controllers_1.adminController.blockUnblockUser(req, res));
//* Admin-Vendor Routes
route.get("/vendors", adminAuth_1.adminAuth, (req, res) => controllers_1.adminController.getVendors(req, res));
route.patch("/vendors/block/:id", adminAuth_1.adminAuth, (req, res) => controllers_1.adminController.blockUnblockVendor(req, res));
// * Admin-Salon Routes
route.get("/salons", adminAuth_1.adminAuth, (req, res) => controllers_1.salonController.getSalons(req, res));
route.get("/salons/salon-details/:salonId", adminAuth_1.adminAuth, (req, res) => controllers_1.salonController.getSalonById(req, res));
route.patch("/salons/:salonId/status", adminAuth_1.adminAuth, (req, res) => controllers_1.salonController.updateSalonStatus(req, res));
// *Admin-Service Routes
route.get("/services", adminAuth_1.adminAuth, (req, res) => controllers_1.serviceController.getServices(req, res));
route.post("/services/addService", adminAuth_1.adminAuth, (req, res) => controllers_1.serviceController.addService(req, res));
route.put("/services/editService", adminAuth_1.adminAuth, (req, res) => controllers_1.serviceController.editService(req, res));
route.patch("/services/hide/:id", adminAuth_1.adminAuth, (req, res) => controllers_1.serviceController.hideService(req, res));
//* Chat Routes
route.get("/get-all-conversations", adminAuth_1.adminAuth, (req, res) => controllers_1.chatController.getAllConversations(req, res));
route.get("/getMessages/:conversationId", adminAuth_1.adminAuth, (req, res) => controllers_1.chatController.getMessages(req, res));
route.post("/addMessage", adminAuth_1.adminAuth, (req, res) => controllers_1.chatController.addMessage(req, res));
// * Dashboard Routes
route.get("/dashboard", adminAuth_1.adminAuth, (req, res) => controllers_1.adminController.getAdminData(req, res));
exports.default = route;
