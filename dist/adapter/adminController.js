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
Object.defineProperty(exports, "__esModule", { value: true });
class AdminController {
    constructor(adminUsecase) {
        this.adminUsecase = adminUsecase;
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.body;
                const adminData = yield this.adminUsecase.adminLogin(admin);
                return res.status(adminData.status).json(adminData);
            }
            catch (error) {
                console.log(`Error in login:`, error);
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const searchQuery = req.query.searchQuery;
                const usersList = yield this.adminUsecase.getUsers(page, limit, searchQuery);
                return res.status(usersList.status).json(usersList);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const searchQuery = req.query.searchQuery;
                const vendorsList = yield this.adminUsecase.getVendors(page, limit, searchQuery);
                return res.status(vendorsList.status).json(vendorsList);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    blockUnblockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.adminUsecase.blockUnblockUser(req.params.id);
                return res.status(user.status).json(user);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    blockUnblockVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.adminUsecase.blockUnblockVendor(req.params.id);
                return res.status(vendor.status).json(vendor);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getAdminData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboardData = yield this.adminUsecase.getDashboardData();
                return res.status(dashboardData.status).json(dashboardData);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
}
exports.default = AdminController;
