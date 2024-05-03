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
const bookingModel_1 = __importDefault(require("../database/bookingModel"));
const salonModel_1 = __importDefault(require("../database/salonModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class BookingRepository {
    createBooking(booking) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBooking = new bookingModel_1.default(booking);
            return yield newBooking.save();
        });
    }
    getAvailableSlots(salonId, date, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const salon = yield this.findSalonById(salonId);
            const openingTime = salon === null || salon === void 0 ? void 0 : salon.openingTime;
            const closingTime = salon === null || salon === void 0 ? void 0 : salon.closingTime;
            const totalChairs = (salon === null || salon === void 0 ? void 0 : salon.chairCount) || 1;
            const availableSlots = [];
            const requestedDate = date;
            const currentDateObj = new Date();
            const currentDate = `${currentDateObj
                .getDate()
                .toString()
                .padStart(2, "0")}-${(currentDateObj.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${currentDateObj.getFullYear()}`;
            const bookedChairs = yield this.getBookedChairsForDate(salonId, requestedDate);
            let startTime = requestedDate === currentDate
                ? this.getCurrentTime()
                : this.toTimeString(openingTime);
            console.log(`start Time`, startTime);
            let currentTime = startTime;
            while (currentTime < closingTime) {
                const endTime = this.calculateEndTime(currentTime, duration);
                if (endTime <= closingTime) {
                    const availableChairs = Array.from({ length: totalChairs }, (_, i) => i + 1).filter((chair) => { var _a; return !((_a = bookedChairs[currentTime]) === null || _a === void 0 ? void 0 : _a.includes(chair)); });
                    if (availableChairs.length > 0) {
                        availableSlots.push(currentTime);
                    }
                }
                currentTime = endTime;
            }
            return availableSlots;
        });
    }
    getBookedChairsForDate(salonId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookingModel_1.default.find({ salonId, date });
            const bookedChairs = {};
            bookings.forEach((booking) => {
                if (!bookedChairs[booking.time]) {
                    bookedChairs[booking.time] = [];
                }
                bookedChairs[booking.time].push(booking.chairNumber);
            });
            return bookedChairs;
        });
    }
    getCurrentTime() {
        const currentTime = new Date();
        const offsetInMilliseconds = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
        const adjustedTime = new Date(currentTime.getTime() + offsetInMilliseconds);
        const adjustedTimeString = adjustedTime.toLocaleTimeString(undefined, {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
        return adjustedTimeString;
    }
    toTimeString(time) {
        return time;
    }
    getBookedChairs(salonId, date, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookingModel_1.default.find({ salonId, date, time });
            return bookings.map((booking) => booking.chairNumber);
        });
    }
    isChairAvailable(salonId, date, startTime, endTime, chair) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingBooking = yield bookingModel_1.default.findOne({
                salonId,
                date,
                chair,
                $or: [
                    { time: { $lte: endTime }, endTime: { $gte: startTime } },
                    { time: { $gte: startTime }, endTime: { $lte: endTime } },
                ],
            });
            return !existingBooking;
        });
    }
    calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(":").map(Number);
        const durationHours = Math.floor(duration / 60);
        const durationMinutes = duration % 60;
        let endHours = hours + durationHours;
        let endMinutes = minutes + durationMinutes;
        if (endMinutes >= 60) {
            endHours++;
            endMinutes -= 60;
        }
        return `${endHours.toString().padStart(2, "0")}:${endMinutes
            .toString()
            .padStart(2, "0")}`;
    }
    findSalonById(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const salonDetails = yield salonModel_1.default.findById(salonId);
            return salonDetails;
        });
    }
    findBookingById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookingModel_1.default.findById(bookingId);
            return booking;
        });
    }
    findBookingByIdAndUpdate(bookingId, refundId) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookingModel_1.default.findByIdAndUpdate(bookingId, { orderStatus: "cancelled", refundId: refundId }, { new: true });
            return booking;
        });
    }
    findSalonBookingsWithCount(page, limit, salonId, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside get salon bookings repository`);
            try {
                const regex = new RegExp(searchQuery, "i");
                const matchStage = {
                    $or: [
                        { salonName: { $regex: regex } },
                        { orderStatus: { $regex: regex } },
                        { date: { $regex: regex } },
                    ],
                };
                if (salonId !== "") {
                    matchStage["salonId"] = new mongoose_1.default.Types.ObjectId(salonId);
                }
                const pipeline = [
                    { $match: matchStage },
                    { $sort: { createdAt: -1 } },
                    {
                        $facet: {
                            totalCount: [{ $count: "count" }],
                            paginatedResults: [
                                { $skip: (page - 1) * limit },
                                { $limit: limit },
                                { $project: { password: 0 } },
                            ],
                        },
                    },
                ];
                const [result] = yield bookingModel_1.default.aggregate(pipeline).exec();
                const bookings = result.paginatedResults;
                const bookingsCount = result.totalCount.length > 0 ? result.totalCount[0].count : 0;
                return {
                    bookings,
                    bookingsCount,
                };
            }
            catch (error) {
                console.log(error);
                throw new Error("Error while getting salon data");
            }
        });
    }
    findAllBookingsWithCount(page, limit, userId, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, "i");
                const matchStage = {
                    $or: [
                        { salonName: { $regex: regex } },
                        { orderStatus: { $regex: regex } },
                        { date: { $regex: regex } },
                    ],
                };
                if (userId !== "") {
                    matchStage["userId"] = new mongoose_1.default.Types.ObjectId(userId);
                }
                const pipeline = [
                    { $match: matchStage },
                    { $sort: { createdAt: -1 } },
                    {
                        $facet: {
                            totalCount: [{ $count: "count" }],
                            paginatedResults: [
                                { $skip: (page - 1) * limit },
                                { $limit: limit },
                                { $project: { password: 0 } },
                            ],
                        },
                    },
                ];
                const [result] = yield bookingModel_1.default.aggregate(pipeline).exec();
                const bookings = result.paginatedResults;
                const bookingsCount = result.totalCount.length > 0 ? result.totalCount[0].count : 0;
                return {
                    bookings,
                    bookingsCount,
                };
            }
            catch (error) {
                console.log(error);
                throw new Error("Error while getting salon data");
            }
        });
    }
    findBookingsToComplete(currentTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookingModel_1.default.find({
                orderStatus: "booked",
            });
            return bookings.filter((booking) => {
                const endTime = this.calculateEndTime(booking.time, booking.totalDuration);
                const [day, month, year] = booking.date.split("-").map(Number);
                const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
                    .toString()
                    .padStart(2, "0")}`;
                const bookingEndTime = new Date(`${formattedDate}T${endTime}:00`);
                return currentTime > bookingEndTime;
            });
        });
    }
    updateBookingStatus(bookingId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookingModel_1.default.findByIdAndUpdate(bookingId, { orderStatus: newStatus }, { new: true });
        });
    }
    findCompletedBookingsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const completedBookingsCount = yield bookingModel_1.default.countDocuments({
                orderStatus: "completed",
            });
            return completedBookingsCount;
        });
    }
    findAllBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalBookings = yield bookingModel_1.default.find({
                orderStatus: { $ne: "cancelled" },
            });
            return totalBookings;
        });
    }
    findTotalRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalRevenue = yield bookingModel_1.default.aggregate([
                { $match: { orderStatus: "completed" } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]);
            return totalRevenue.length > 0 ? totalRevenue[0].total : 0;
        });
    }
    findTotalRevenueBySalonId(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalRevenue = yield bookingModel_1.default.aggregate([
                { $match: { orderStatus: "completed", salonId: salonId } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]);
            console.log(`Total Revenue`, totalRevenue[0].total);
            return totalRevenue.length > 0 ? totalRevenue[0].total : 0;
        });
    }
    findVendorRevenueAndBookingsByVendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ObjectId = mongoose_1.default.Types.ObjectId;
            const vendorObjectId = new ObjectId(vendorId);
            const activeSalons = yield salonModel_1.default.find({
                vendorId: vendorObjectId,
                status: "active",
            }, "_id");
            const salonIds = activeSalons.map((salon) => salon._id);
            const result = yield bookingModel_1.default.aggregate([
                { $match: { salonId: { $in: salonIds } } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$orderStatus", "completed"] },
                                    "$totalAmount",
                                    0,
                                ],
                            },
                        },
                        bookings: {
                            $push: "$$ROOT",
                        },
                    },
                },
            ]);
            return {
                totalRevenue: result.length > 0 ? result[0].totalRevenue : 0,
                bookings: result.length > 0 ? result[0].bookings : [],
            };
        });
    }
    getBookingStatsBySalonId(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                const formattedToday = `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${today.getFullYear()}`;
                console.log(`Formatted Date`, formattedToday);
                const objectId = new mongoose_1.default.Types.ObjectId(salonId);
                const totalBookings = yield bookingModel_1.default.find({
                    salonId: objectId,
                    orderStatus: { $ne: "cancelled" },
                });
                const todaysBookings = yield bookingModel_1.default.find({
                    salonId: objectId,
                    date: formattedToday,
                    orderStatus: { $ne: "cancelled" },
                });
                const completedBookingsSum = yield bookingModel_1.default.aggregate([
                    { $match: { salonId: objectId, orderStatus: "completed" } },
                    { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
                ]);
                const totalRevenue = completedBookingsSum.length > 0
                    ? completedBookingsSum[0].totalAmount
                    : 0;
                console.log(`TotalRevenue`, totalRevenue);
                return { totalBookings, todaysBookings, totalRevenue };
            }
            catch (error) {
                console.error("Error fetching booking stats:", error);
                throw error;
            }
        });
    }
}
exports.default = BookingRepository;
