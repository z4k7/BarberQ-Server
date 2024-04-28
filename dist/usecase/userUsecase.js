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
class UserUsecase {
    constructor(userInterface, Encrypt, generateOtp, sendOtp, jwt) {
        this.userInterface = userInterface;
        this.Encrypt = Encrypt;
        this.generateOtp = generateOtp;
        this.sendOtp = sendOtp;
        this.jwt = jwt;
    }
    // *Saving user to db
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("inside save user");
                const hashedPassword = yield this.Encrypt.createHash(user.password);
                user.password = hashedPassword;
                const userData = yield this.userInterface.saveUser(user);
                return {
                    status: 200,
                    data: userData || { message: "Internal error" },
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
    userLogin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`inside usecase`);
                const userFound = yield this.userInterface.findByEmail(user.email);
                if (!userFound) {
                    return {
                        status: 401,
                        data: {
                            message: "User Not Found",
                        },
                    };
                }
                if (userFound.isBlocked) {
                    return {
                        status: 401,
                        data: { message: "Sorry! You are blocked by admin." },
                    };
                }
                const passwordMatch = yield this.Encrypt.compare(user.password, userFound.password);
                if (!passwordMatch) {
                    return {
                        status: 401,
                        data: {
                            message: "Authentication Failed",
                        },
                    };
                }
                const accessToken = this.jwt.generateAccessToken(userFound._id);
                const refreshToken = this.jwt.generateRefreshToken(userFound._id);
                return {
                    status: 200,
                    data: {
                        userData: userFound,
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
    // *Checking if the email is already registered in db
    isEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.userInterface.findByEmail(email);
                return {
                    status: 200,
                    data: userFound,
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
exports.default = UserUsecase;
