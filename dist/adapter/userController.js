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
class UserController {
    constructor(userUsecase, chatUsecase) {
        this.userUsecase = userUsecase;
        this.chatUsecase = chatUsecase;
    }
    userSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = req.body;
                const userExistence = yield this.userUsecase.isEmailExist(newUser.email);
                if (userExistence.data) {
                    return res
                        .status(401)
                        .json({ data: { message: "Email already in use" } });
                }
                const verificationResponse = yield this.userUsecase.verifyMail(newUser.email);
                req.app.locals.user = newUser;
                req.app.locals.otp = verificationResponse.otp;
                return res.status(201).json({ response: verificationResponse });
            }
            catch (error) {
                console.error("Error in signUp:", error);
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
                const user = req.app.locals.user;
                const emailResponse = yield this.userUsecase.verifyMail(user.email);
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
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const userData = yield this.userUsecase.userLogin(user);
                return res.status(userData.status).json(userData);
            }
            catch (error) {
                console.error("Error in login:", error);
                return res.status(500).json({
                    data: {
                        status: 500,
                        message: "Internal Server Error",
                        error: error.message,
                    },
                });
            }
        });
    }
    userOtpVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userToSave = req.app.locals.user;
                const generatedOtp = req.app.locals.otp;
                const enteredOtp = req.body.otp;
                if (enteredOtp === generatedOtp) {
                    const savedUser = yield this.userUsecase.saveUser(userToSave);
                    return res.status(201).json({ userSave: savedUser });
                }
                else {
                    return res.status(401).json({ data: { message: "Invalid OTP" } });
                }
            }
            catch (error) {
                console.error("Error in otpVerification:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
}
exports.default = UserController;
