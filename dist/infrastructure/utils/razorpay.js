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
const razorpay_1 = __importDefault(require("razorpay"));
const axios_1 = __importDefault(require("axios"));
class RazorpayClass {
    constructor() {
        this.razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    createOrder(amount, currency = "INR") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    amount: amount * 100,
                    currency,
                    receipt: "receipt_order_id",
                    payment_capture: 1,
                };
                console.log(`Options`, options);
                const order = yield this.razorpay.orders.create(options);
                console.log(`Order`, order);
                return order;
            }
            catch (error) {
                console.error("Error creating order inside util", error);
                // Check if error is an instance of Error or if it has a message property
                if (error instanceof Error || error.message) {
                    console.error("Error message:", error.message);
                }
                else {
                    // If error is not an instance of Error, log the entire error object
                    console.error("Error object:", error);
                }
                // Check if error has a response property and log relevant details
                if (error.response) {
                    console.error("Error response data:", error.response.data);
                    console.error("Error response status:", error.response.status);
                    console.error("Error response headers:", error.response.headers);
                }
                // Throw a new Error with a more descriptive message
                throw new Error("Failed to create order due to an unexpected error");
            }
        });
    }
    verifyPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const crypto = require("crypto");
                const expectedSignature = crypto
                    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                    .update(razorpayOrderId + "|" + razorpayPaymentId)
                    .digest("hex");
                if (expectedSignature === razorpaySignature) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error("Error verifying payment");
                throw error;
            }
        });
    }
    refund(paymentId, amount, currency = "INR") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Inside refund`);
                const refundData = {
                    amount,
                };
                const config = {
                    auth: {
                        username: process.env.RAZORPAY_KEY_ID,
                        password: process.env.RAZORPAY_KEY_SECRET,
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                const axiosResponse = yield axios_1.default.post(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, refundData, config);
                return axiosResponse;
            }
            catch (error) {
                console.error("Error creating order inside util", error);
                throw new Error("Failed to create order");
            }
        });
    }
}
exports.default = RazorpayClass;
