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
const axios_1 = require("axios");
class NotificationService {
    constructor() {
        this.twilio = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
            timeout: 60000,
        });
        this.retryCount = 3;
    }
    sendNotification(booking) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Inside sendNotification`);
                yield this.sendWithRetry(booking);
            }
            catch (error) {
                console.error(`Error sending notification for booking ${booking.paymentId}:`, error);
            }
        });
    }
    sendWithRetry(booking, retryCount = this.retryCount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Retry count ${retryCount}`);
                yield this.twilio.messages.create({
                    body: `Reminder: Your salon appointment at ${booking.salonName} is scheduled for ${booking.date} ${booking.time}.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: "+91" + booking.userMobile,
                });
                console.log(`Notification sent for booking ${booking.paymentId}`);
            }
            catch (error) {
                if (retryCount > 0 &&
                    error instanceof axios_1.AxiosError &&
                    error.code === "ERR_SOCKET_CONNECTION_TIMEOUT") {
                    console.log(`Retrying notification for booking ${booking.paymentId} (${this.retryCount - retryCount + 1}/${this.retryCount})`);
                    yield this.sendWithRetry(booking, retryCount - 1);
                }
                else {
                    throw error;
                }
            }
        });
    }
}
exports.default = NotificationService;
