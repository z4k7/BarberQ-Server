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
class AdminUsecase {
    constructor(adminInterface, userInterface, vendorInterface, salonInterface, bookingInterface, Encrypt, jwtToken) {
        this.adminInterface = adminInterface;
        this.userInterface = userInterface;
        this.vendorInterface = vendorInterface;
        this.salonInterface = salonInterface;
        this.bookingInterface = bookingInterface;
        this.Encrypt = Encrypt;
        this.jwtToken = jwtToken;
    }
    adminLogin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`admin:`, admin);
                const adminFound = yield this.adminInterface.findByEmail(admin.email);
                console.log(`adminFound:`, adminFound);
                if (!adminFound) {
                    return {
                        status: 401,
                        data: {
                            message: "Admin not Found!",
                        },
                    };
                }
                const passwordMatch = yield this.Encrypt.compare(admin.password, adminFound.password);
                if (!passwordMatch) {
                    return {
                        status: 401,
                        data: {
                            message: "Authentication Failed",
                        },
                    };
                }
                const accessToken = this.jwtToken.generateAccessToken(adminFound._id);
                const refreshToken = this.jwtToken.generateRefreshToken(adminFound._id);
                return {
                    status: 200,
                    data: {
                        adminData: adminFound,
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
    getUsers(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!searchQuery)
                    searchQuery = "";
                const usersList = yield this.userInterface.findAllUsersWithCount(page, limit, searchQuery);
                return {
                    status: 200,
                    data: {
                        adminData: usersList,
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
    getVendors(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!searchQuery)
                    searchQuery = "";
                const vendorsList = yield this.vendorInterface.findAllVendorsWithCount(page, limit, searchQuery);
                return {
                    status: 200,
                    data: {
                        adminData: vendorsList,
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
    blockUnblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`inside Usecase`);
                const user = yield this.userInterface.blockUnblockUser(userId);
                return {
                    status: 200,
                    data: {
                        adminData: user,
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
    blockUnblockVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.vendorInterface.blockUnblockVendor(vendorId);
                return {
                    status: 200,
                    data: {
                        adminData: vendor,
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
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorCount = yield this.vendorInterface.findActiveVendorsCount();
                const activeSalonCount = yield this.salonInterface.findActiveSalonCount();
                const totalRevenue = yield this.bookingInterface.findTotalRevenue();
                const totalBookings = yield this.bookingInterface.findAllBookings();
                return {
                    status: 200,
                    data: {
                        vendors: vendorCount,
                        salons: activeSalonCount,
                        revenue: totalRevenue,
                        bookings: totalBookings,
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
}
exports.default = AdminUsecase;
