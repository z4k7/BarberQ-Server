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
class VendorController {
    constructor(vendorUsecase) {
        this.vendorUsecase = vendorUsecase;
    }
    vendorSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newVendor = req.body;
                const vendorExistence = yield this.vendorUsecase.isEmailExist(newVendor.email);
                if (vendorExistence.data) {
                    return res
                        .status(401)
                        .json({ data: { message: "Email already in use" } });
                }
                const verificationResponse = yield this.vendorUsecase.verifyMail(newVendor.email);
                req.app.locals.vendor = newVendor;
                req.app.locals.otp = verificationResponse.otp;
                setTimeout(() => {
                    req.app.locals.otp = undefined;
                    console.log(`Otp Expired`);
                }, 1000 * 30);
                return res.status(201).json({ data: { message: "OTP Sent " } });
            }
            catch (error) {
                console.log(`Error in signup:`, error);
                return res.status(500).json({
                    data: {
                        message: "Internal Server Error",
                        error: error.message,
                    },
                });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = req.app.locals.vendor;
                const emailResponse = yield this.vendorUsecase.verifyMail(vendor.email);
                req.app.locals.otp = emailResponse.otp;
                setTimeout(() => {
                    req.app.locals.otp = undefined;
                    console.log(`Otp Expired in resend otp`);
                }, 1000 * 30);
                return res.status(200).json({ response: emailResponse });
            }
            catch (error) {
                console.log(`Error in resendOtp:`, error);
                return res.status(500).json({
                    data: {
                        message: "Internal Server Error",
                        error: error.message,
                    },
                });
            }
        });
    }
    vendorLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = req.body;
                const vendorData = yield this.vendorUsecase.vendorLogin(vendor);
                return res.status(vendorData.status).json(vendorData);
            }
            catch (error) {
                console.log(`Error in login`, error);
                return res.status(500).json({
                    data: {
                        status: 500,
                        success: false,
                        message: "Internal Server Error",
                        error: error.message,
                    },
                });
            }
        });
    }
    vendorOtpVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorToSave = req.app.locals.vendor;
                const generatedOtp = req.app.locals.otp;
                const enteredOtp = req.body.otp;
                if (enteredOtp === generatedOtp) {
                    const savedVendor = yield this.vendorUsecase.saveVendor(vendorToSave);
                    return res.status(201).json({ vendorSave: savedVendor });
                }
                else {
                    return res.status(401).json({ data: { message: "Invalid OTP" } });
                }
            }
            catch (error) {
                console.log(`Error in OtpVerification:`, error);
                return res.status(500).json({
                    data: {
                        message: "Internal server error",
                        error: error.message,
                    },
                });
            }
        });
    }
}
exports.default = VendorController;
