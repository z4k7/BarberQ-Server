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
class BookingController {
    constructor(bookingUsecase) {
        this.bookingUsecase = bookingUsecase;
    }
    bookSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { salonId, userId, paymentId, services, date, time } = req.body;
                const booking = yield this.bookingUsecase.bookSlot(userId, salonId, paymentId, services, date, time);
                res.status(200).json(booking);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    getAvailableSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { salonId, services, date } = req.query;
                const availableSlots = yield this.bookingUsecase.getAvailableSlots(salonId, services, date);
                res.status(200).json(availableSlots);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    getBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const userId = req.query.userId;
                const searchQuery = req.query.searchQuery;
                const bookingList = yield this.bookingUsecase.getBookings(page, limit, userId, searchQuery);
                return res.status(bookingList.status).json(bookingList);
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
    cancelBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingId } = req.body;
            try {
                const booking = yield this.bookingUsecase.cancelBooking(bookingId);
                return res.status(booking.status).json(booking);
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
exports.default = BookingController;
