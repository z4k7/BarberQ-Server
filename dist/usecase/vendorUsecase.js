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
class VendorUsecase {
    constructor(vendorInterface, Encrypt, generateOtp, sendOtp, jwt) {
        this.vendorInterface = vendorInterface;
        this.Encrypt = Encrypt;
        this.generateOtp = generateOtp;
        this.sendOtp = sendOtp;
        this.jwt = jwt;
    }
    saveVendor(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("inside save vendor");
                const hashedPassword = yield this.Encrypt.createHash(vendor.password);
                vendor.password = hashedPassword;
                const vendorData = yield this.vendorInterface.saveVendor(vendor);
                return {
                    status: 200,
                    data: vendorData || { message: "Internal error" },
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
    vendorLogin(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`inside usecase`);
                const vendorFound = yield this.vendorInterface.findByEmail(vendor.email);
                if (!vendorFound) {
                    return {
                        status: 401,
                        data: {
                            message: "Vendor Not Found",
                        },
                    };
                }
                if (vendorFound.isBlocked) {
                    return {
                        status: 401,
                        data: { message: "Sorry! You are blocked by admin." },
                    };
                }
                const passwordMatch = yield this.Encrypt.compare(vendor.password, vendorFound.password);
                if (!passwordMatch) {
                    return {
                        status: 401,
                        data: {
                            message: "Authentication Failed",
                        },
                    };
                }
                const accessToken = this.jwt.generateAccessToken(vendorFound._id);
                const refreshToken = this.jwt.generateRefreshToken(vendorFound._id);
                return {
                    status: 200,
                    data: {
                        vendorData: vendorFound,
                        accessToken,
                        refreshToken,
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
    isEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorFound = yield this.vendorInterface.findByEmail(email);
                return {
                    status: 200,
                    data: vendorFound,
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
    verifyMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield this.generateOtp.genOtp(6);
                console.log(otp);
                const verify = this.sendOtp.sendVerificationMail(email, otp);
                return {
                    status: 200,
                    otp,
                    data: verify,
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
}
exports.default = VendorUsecase;
