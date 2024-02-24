import { adminAuth } from "../middlewares/adminAuth";
import { adminController,serviceController } from "../utils/controllers";



import express from "express";
const route = express.Router();

route.post("/login",  (req, res) => adminController.adminLogin(req, res));

//* Admin-User Routes
route.get("/users",adminAuth, (req, res) => adminController.getUsers(req, res));
route.patch("/users/block/:id",adminAuth, (req, res) =>
  adminController.blockUnblockUser(req, res)
);

//* Admin-Vendor Routes
route.get("/vendors",adminAuth, (req, res) => adminController.getVendors(req, res));
route.patch("/vendors/block/:id",adminAuth, (req, res) =>
  adminController.blockUnblockVendor(req, res)
);

// *Admin-Service Routes
route.get("/services",adminAuth, (req, res) => serviceController.getServices(req, res));
route.post("/services/addService",adminAuth, (req, res) =>
  serviceController.addService(req, res)
);
route.put("/services/editService",adminAuth, (req, res) =>
  serviceController.editService(req, res)
);
route.patch("/services/hide/:id",adminAuth, (req, res) =>
  serviceController.hideService(req, res)
);

export default route;
