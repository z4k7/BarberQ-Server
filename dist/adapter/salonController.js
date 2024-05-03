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
const jsonwebtoken_1 = require("jsonwebtoken");
const razorpay_1 = __importDefault(require("../infrastructure/utils/razorpay"));
class SalonController {
    constructor(salonUsecase, serviceUsecase) {
        this.salonUsecase = salonUsecase;
        this.serviceUsecase = serviceUsecase;
        this.razorpay = new razorpay_1.default();
    }
    addSalon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                if (token) {
                    const decoded = (0, jsonwebtoken_1.verify)(token.slice(7), process.env.JWT_KEY);
                    let vendorId = decoded.id;
                    const banners = req.files;
                    const facilities = JSON.parse(req.body.facilities);
                    const location = JSON.parse(req.body.location);
                    console.log(`Location in body`, req.body.location);
                    console.log(`Location`, location);
                    const { salonName, landmark, locality, district, openingTime, closingTime, contactNumber, chairCount, services, } = req.body;
                    const salonData = {
                        vendorId: vendorId,
                        salonName,
                        landmark,
                        locality,
                        longitude: location.longitude,
                        latitude: location.latitude,
                        district,
                        openingTime,
                        closingTime,
                        contactNumber,
                        chairCount,
                        facilities,
                        banners,
                        services,
                        location,
                    };
                    salonData.location = {
                        type: "Point",
                        coordinates: [salonData.longitude, salonData.latitude],
                    };
                    console.log(`Salon Data`, salonData);
                    const salonAdd = yield this.salonUsecase.addSalon(salonData);
                    res.status(200).json(salonAdd);
                }
            }
            catch (error) {
                console.log(`Error`, error);
            }
        });
    }
    upgradeToPremium(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.params.salonId;
                const salonDetails = yield this.salonUsecase.upgradeToPremium(salonId);
                return res.status(salonDetails.status).json(salonDetails);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    updateSalonStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.params.salonId;
                const status = req.body.status;
                const salonDetails = yield this.salonUsecase.updateSalonStatus(salonId, status);
                return res.status(salonDetails.status).json(salonDetails);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getSalonById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.params.salonId;
                const salonDetails = yield this.salonUsecase.getSalonById(salonId);
                return res.status(salonDetails.status).json(salonDetails);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    updateSalonServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.params.salonId;
                const services = req.body;
                const updatedSalon = yield this.salonUsecase.updateSalonServices(salonId, services);
                res.status(200).json(updatedSalon);
            }
            catch (error) {
                console.error("Error updating salon services:", error);
                res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    updateSalon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.params.salonId;
                const update = req.body;
                const updatedSalon = yield this.salonUsecase.updateSalon(salonId, update);
                res.status(200).json(updatedSalon);
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    editSalonServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.params.salonId;
                const servicesToEdit = req.body;
                const updatedSalon = yield this.salonUsecase.editSalonServices(salonId, servicesToEdit);
                res.status(200).json(updatedSalon);
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getSalons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside getsalons controller`);
            try {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const searchQuery = req.query.searchQuery;
                const vendorId = req.params.vendorId;
                const salonList = yield this.salonUsecase.getSalons(page, limit, vendorId, searchQuery);
                return res.status(salonList.status).json(salonList);
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
    getNearbySalons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Inside Nearby controller`);
                const { longitude, latitude, radius } = req.query;
                if (!longitude || !latitude || !radius) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: "Missing required parameters",
                    });
                }
                const nearbySalons = yield this.salonUsecase.getNearbySalons(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
                res.status(nearbySalons.status).json(nearbySalons);
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
    getActiveSalons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const searchQuery = req.query.searchQuery;
                const activeSalons = yield this.salonUsecase.getActiveSalons(page, limit, searchQuery);
                res.status(200).json(activeSalons);
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
    getSalonDetaills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.params.salonId;
                const salonDetails = yield this.salonUsecase.getSalonById(salonId);
                return res.status(200).json(salonDetails);
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
    getServicesByIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceIds = JSON.parse(req.query.serviceIds);
                const services = yield this.serviceUsecase.getServicesByIds(serviceIds);
                res.status(200).json({ services });
            }
            catch (error) {
                console.error("Error fetching services:", error);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    deleteSalonServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { salonId } = req.params;
            const { serviceIds } = req.body;
            try {
                const result = yield this.salonUsecase.deleteSalonServices(salonId, serviceIds);
                return res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    createPaymentOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount } = req.body;
            try {
                const order = yield this.razorpay.createOrder(amount);
                const premium = "premium";
                if (amount == 2999) {
                    res.status(200).json({ order, premium });
                }
                else {
                    res.status(200).json({ order });
                }
            }
            catch (error) {
                console.error("Error creating payment order", error);
                res.status(500).json({ message: "Failed to create payment order" });
            }
        });
    }
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
            try {
                const isPaymentVerified = yield this.razorpay.verifyPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature);
                if (isPaymentVerified) {
                    res.status(200).json({ message: "Payment verified successfully" });
                }
                else {
                    res.status(400).json({ message: "Payment verification failed" });
                }
            }
            catch (error) {
                console.error("Error verifying payment", error);
                res.status(500).json({ message: "Failed to verify payment" });
            }
        });
    }
    getVendorDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.params.vendorId;
                const dashboardData = yield this.salonUsecase.getVendorDashboardData(vendorId);
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
    getSalonDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.params.salonId;
                const dashboardData = yield this.salonUsecase.getSalonDashboardData(salonId);
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
exports.default = SalonController;
