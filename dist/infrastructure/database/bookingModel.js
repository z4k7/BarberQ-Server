"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    salonId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Salon",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    salonName: {
        type: String,
    },
    userName: {
        type: String,
    },
    userMobile: {
        type: String,
    },
    chairNumber: {
        type: Number,
    },
    time: {
        type: String,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    date: {
        type: String,
    },
    cancellationReason: {
        type: String,
    },
    orderStatus: {
        type: String,
        default: "booked",
    },
    services: {
        type: Array,
    },
    choosedServices: { type: Array },
    totalAmount: {
        type: Number,
    },
    totalDuration: {
        type: Number,
    },
    appliedCoupon: {
        type: Object,
    },
    paymentId: {
        type: String,
    },
    refundId: {
        type: String,
    },
}, { timestamps: true });
const BookingModel = mongoose_1.default.model("Booking", bookingSchema);
exports.default = BookingModel;
