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
class SalonUsecase {
    constructor(salonInterface, bookingInterface, cloudinary) {
        this.salonInterface = salonInterface;
        this.bookingInterface = bookingInterface;
        this.cloudinary = cloudinary;
    }
    addSalon(salonData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside Salon usecase`);
            try {
                const uploadedBanners = yield Promise.all(salonData.banners.map((file) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        return yield this.cloudinary.savetoCloudinary(file);
                    }
                    catch (error) {
                        console.error("Error uploading banner", error);
                        return null;
                    }
                })));
                salonData.banners = uploadedBanners.filter((banner) => banner !== null);
                console.log(`uploadedBanners`, uploadedBanners);
                // salonData.location = {
                //   type: 'Point',
                //   coordinates: [salonData.location.longitude, salonData.location.latitude],
                // };
                const salonStatus = yield this.salonInterface.addSalon(salonData);
                return {
                    status: 200,
                    data: salonStatus,
                };
            }
            catch (error) {
                console.log(`Error in addSalon:`, error);
                throw error;
            }
        });
    }
    getSalons(page, limit, vendorId, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 12;
                if (!vendorId)
                    vendorId = "";
                if (!searchQuery)
                    searchQuery = "";
                const salonList = yield this.salonInterface.findAllSalonsWithCount(page, limit, vendorId, searchQuery);
                return {
                    status: 200,
                    data: {
                        salonData: salonList,
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
    getActiveSalons(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 12;
                if (!searchQuery)
                    searchQuery = "";
                const activeSalons = yield this.salonInterface.findActiveSalons(page, limit, searchQuery);
                return { status: 200, data: { salonData: activeSalons } };
            }
            catch (error) {
                return {
                    status: 400,
                    data: error,
                };
            }
        });
    }
    getSalonById(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonDetails = yield this.salonInterface.findSalonById(salonId);
                return {
                    status: 200,
                    data: { salonData: salonDetails },
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
    upgradeToPremium(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSalon = yield this.salonInterface.upgradeToPremium(salonId);
                return {
                    status: 200,
                    data: {
                        message: "Upgraded to premium successfully",
                        salonData: updatedSalon,
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
    updateSalonStatus(salonId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSalon = yield this.salonInterface.updateSalonStatus(salonId, status);
                return {
                    status: 200,
                    data: {
                        message: "Status updated successfully",
                        salonData: updatedSalon,
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
    updateSalonServices(salonId, services) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSalon = yield this.salonInterface.updateSalonServices(salonId, services);
                return {
                    status: 200,
                    data: {
                        message: "Services updated successfully",
                        salonData: updatedSalon,
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
    editSalonServices(salonId, servicesToEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSalon = yield this.salonInterface.editSalonServices(salonId, servicesToEdit);
                return {
                    status: 200,
                    data: {
                        message: "Services updated successfully",
                        salonData: updatedSalon,
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
    deleteSalonServices(salonId, serviceIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSalon = yield this.salonInterface.deleteSalonServices(salonId, serviceIds);
                return {
                    status: 200,
                    data: {
                        message: "Services Deleted Successfully",
                        salonData: updatedSalon,
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
    updateSalon(salonId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSalon = yield this.salonInterface.updateSalon(salonId, update);
                return {
                    status: 200,
                    data: {
                        message: "Salon Updated Successfully",
                        salonData: updatedSalon,
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
    getVendorDashboardData(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activeSalons = yield this.salonInterface.findActiveSalonsByVendorId(vendorId);
                const bookingData = yield this.bookingInterface.findVendorRevenueAndBookingsByVendorId(vendorId);
                return {
                    status: 200,
                    data: {
                        salons: activeSalons,
                        bookings: bookingData.bookings,
                        revenue: bookingData.totalRevenue,
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
    getSalonDashboardData(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = yield this.bookingInterface.getBookingStatsBySalonId(salonId);
                console.log(`Booking Data`, bookingData);
                return {
                    status: 200,
                    data: {
                        totalBookings: bookingData.totalBookings,
                        todaysBookings: bookingData.todaysBookings,
                        revenue: bookingData.totalRevenue,
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
    getNearbySalons(latitude, longitude, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nearbySalons = yield this.salonInterface.findNearbySalons(latitude, longitude, radius);
                return { status: 200, data: nearbySalons };
            }
            catch (error) {
                return { status: 400, data: error.message };
            }
        });
    }
}
exports.default = SalonUsecase;
