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
const razorpay_1 = __importDefault(require("../infrastructure/utils/razorpay"));
const node_cron_1 = __importDefault(require("node-cron"));
class BookingUsecase {
    constructor(bookingInterface, salonInterface, userInterface, notificationService) {
        this.bookingInterface = bookingInterface;
        this.salonInterface = salonInterface;
        this.userInterface = userInterface;
        this.notificationService = notificationService;
        this.razorpay = new razorpay_1.default();
    }
    getBookings(page, limit, userId, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!userId)
                    userId = "";
                if (!searchQuery)
                    searchQuery = "";
                const bookingList = yield this.bookingInterface.findAllBookingsWithCount(page, limit, userId, searchQuery);
                return {
                    status: 200,
                    data: {
                        bookingData: bookingList,
                    },
                };
            }
            catch (error) {
                return {
                    status: 400,
                    data: error,
                };
            }
        });
    }
    getSalonBookings(page, limit, salonId, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside get salon bookings usecase`);
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!salonId)
                    salonId = "";
                if (!searchQuery)
                    searchQuery = "";
                const bookingList = yield this.bookingInterface.findSalonBookingsWithCount(page, limit, salonId, searchQuery);
                return {
                    status: 200,
                    data: {
                        bookingData: bookingList,
                    },
                };
            }
            catch (error) {
                return {
                    status: 400,
                    data: error,
                };
            }
        });
    }
    cancelBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield this.bookingInterface.findBookingById(bookingId);
                if (booking) {
                    const amount = booking.totalAmount * 100;
                    const paymentId = booking.paymentId;
                    const refund = yield this.razorpay.refund(paymentId, amount);
                    const refundId = refund.data.id;
                    console.log("Refund inside bookingUsecase", refund.data);
                    if (refund.data.status == "processed") {
                        const updateBooking = yield this.bookingInterface.findBookingByIdAndUpdate(bookingId, refundId);
                        return {
                            status: 200,
                            data: {
                                bookingData: updateBooking,
                                refundData: refund.data,
                            },
                        };
                    }
                }
            }
            catch (error) {
                return {
                    status: 400,
                    data: error,
                };
            }
        });
    }
    bookSlot(userId, salonId, paymentId, services, date, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const salon = yield this.salonInterface.findSalonById(salonId);
            const salonName = salon.salonName;
            const { totalDuration, totalAmount, choosedServices } = this.calculateTotalDuration(salon, services);
            const user = yield this.userInterface.findUserById(userId);
            const userName = user.name;
            const userMobile = user.mobile;
            const availableChair = yield this.getAvailableChair(salonId, date, time, totalDuration);
            if (!availableChair) {
                throw new Error("No available chair found for the selected time slot");
            }
            const booking = {
                userId,
                userName,
                userMobile,
                salonId,
                paymentId,
                services,
                date,
                time,
                chairNumber: availableChair,
                totalDuration,
                totalAmount,
                choosedServices,
                salonName,
            };
            console.log(`Booking in bookslot usecase`, booking);
            const createdBooking = yield this.bookingInterface.createBooking(booking);
            console.log(`Created Booking`, createdBooking);
            this.scheduleNotification(createdBooking);
            return createdBooking;
        });
    }
    scheduleNotification(booking) {
        const [dateString, timeString] = [booking.date, booking.time];
        const [day, month, year] = dateString.split("-").map(Number);
        const [hour, minute] = timeString.split(":").map(Number);
        const notificationTime = new Date(year, month - 1, day, hour, minute - 30);
        const cronExpression = `${notificationTime.getMinutes()} ${notificationTime.getHours()} ${notificationTime.getDate()} ${notificationTime.getMonth() + 1} *`;
        node_cron_1.default.schedule(cronExpression, () => __awaiter(this, void 0, void 0, function* () {
            yield this.notificationService.sendNotification(booking);
        }));
        console.log(`Notification scheduled for booking ${booking.paymentId}`);
    }
    getAvailableSlots(salonId, services, date) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside usecase available slots`);
            const salon = yield this.salonInterface.findSalonById(salonId);
            const { totalDuration } = this.calculateTotalDuration(salon, services);
            const availableSlots = yield this.bookingInterface.getAvailableSlots(salonId, date, totalDuration);
            console.log(`salonId: ${salonId}, services:${services}, date:${date}`);
            return availableSlots;
        });
    }
    calculateTotalDuration(salon, services) {
        let totalDuration = 0;
        let totalAmount = 0;
        let choosedServices = [];
        if (Array.isArray(services)) {
            services.forEach((serviceId) => {
                const service = salon.services.find((s) => s._id === serviceId);
                if (service) {
                    totalDuration += service.duration;
                    totalAmount += service.price;
                    choosedServices.push(service.serviceName);
                }
            });
        }
        else {
            const service = salon.services.find((s) => s._id === services);
            if (service) {
                totalDuration += service.duration;
                totalAmount += service.price;
                choosedServices.push(service.serviceName);
            }
        }
        return { totalDuration, totalAmount, choosedServices };
    }
    getAvailableChair(salonId, date, time, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside get available chair`);
            console.log(`Date in getavailable chair:`, date);
            const bookedChairs = yield this.bookingInterface.getBookedChairs(salonId, date, time);
            const totalChairs = (yield this.salonInterface.findSalonById(salonId))
                .chairCount;
            for (let chair = 1; chair <= totalChairs; chair++) {
                if (!bookedChairs.includes(chair)) {
                    const endTime = this.calculateEndTime(time, duration);
                    const isChairAvailable = yield this.bookingInterface.isChairAvailable(salonId, date, time, endTime, chair);
                    if (isChairAvailable) {
                        return chair;
                    }
                }
            }
            return null;
        });
    }
    calculateEndTime(startTime, duration) {
        if (!startTime) {
            throw new Error("Start time is undefined");
        }
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
    scheduleOrderCompletionCheck() {
        node_cron_1.default.schedule("0 * * * *", () => __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCompleteOrders();
        }));
    }
    checkAndCompleteOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date();
            const bookingsToComplete = yield this.bookingInterface.findBookingsToComplete(currentTime);
            for (const booking of bookingsToComplete) {
                yield this.bookingInterface.updateBookingStatus(booking._id, "completed");
            }
        });
    }
}
exports.default = BookingUsecase;
