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
const SalonSchema = new mongoose_1.Schema({
    vendorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Vendor",
    },
    salonName: {
        type: String,
    },
    landmark: {
        type: String,
    },
    locality: {
        type: String,
    },
    district: {
        type: String,
    },
    location: {
        type: { type: String, default: "Point", required: true },
        coordinates: { type: [Number], required: true },
    },
    openingTime: {
        type: String,
    },
    closingTime: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
    },
    isPremium: {
        type: Number,
        default: 0,
    },
    chairCount: {
        type: String,
    },
    banners: {
        type: Array,
        required: true,
    },
    facilities: {
        type: Array,
    },
    services: {
        type: Array,
    },
}, {
    timestamps: true,
});
SalonSchema.index({ location: "2dsphere" });
const SalonModel = mongoose_1.default.model("Salon", SalonSchema);
exports.default = SalonModel;
