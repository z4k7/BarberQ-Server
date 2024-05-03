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
const salonModel_1 = __importDefault(require("../database/salonModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class SalonRepository {
    addSalon(salonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const salon = new salonModel_1.default(salonData);
            const salonRequest = yield salon.save();
            return salonRequest;
        });
    }
    activeSalons() {
        return __awaiter(this, void 0, void 0, function* () {
            const allSalons = yield salonModel_1.default.find()
                .populate({
                path: "vendorId",
                model: "Vendor",
                match: { isBlocked: false },
            })
                .exec();
            const salonsWithUnblockedVendors = allSalons.filter((salon) => salon.vendorId !== null);
            return salonsWithUnblockedVendors;
        });
    }
    findActiveSalonCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeSalonCount = yield salonModel_1.default.countDocuments({
                status: "active",
            });
            console.log(`Salon Count`, activeSalonCount);
            return activeSalonCount;
        });
    }
    findAllSalons() {
        return __awaiter(this, void 0, void 0, function* () {
            const allSalons = yield salonModel_1.default.find();
            return allSalons;
        });
    }
    findSalonById(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const salonDetails = yield salonModel_1.default.findById(salonId);
            return salonDetails;
        });
    }
    findActiveSalons(_page_, _limit_, _searchQuery_) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(_searchQuery_, "i");
                const matchStage = {
                    $or: [
                        { salonName: { $regex: regex } },
                        { locality: { $regex: regex } },
                        { district: { $regex: regex } },
                    ],
                    status: "active",
                };
                const lookupStage = {
                    $lookup: {
                        from: "vendors",
                        localField: "vendorId",
                        foreignField: "_id",
                        as: "vendor",
                    },
                };
                const unblockedVendorMatchStage = {
                    $match: {
                        "vendor.isBlocked": { $ne: true },
                    },
                };
                const sortStage = { $sort: { isPremium: -1 } };
                const pipeline = [
                    sortStage,
                    lookupStage,
                    unblockedVendorMatchStage,
                    { $match: matchStage },
                    {
                        $facet: {
                            totalCount: [{ $count: "count" }],
                            paginatedResults: [
                                { $skip: (_page_ - 1) * _limit_ },
                                { $limit: _limit_ },
                                { $project: { password: 0 } },
                            ],
                        },
                    },
                ];
                const result = yield salonModel_1.default.aggregate(pipeline).exec();
                const salons = result[0].paginatedResults;
                const salonCount = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
                return {
                    salons,
                    salonCount,
                };
            }
            catch (error) {
                console.log(error);
                throw new Error("Error while getting active salon data");
            }
        });
    }
    findAllSalonsWithCount(page, limit, vendorId, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, "i");
                const matchStage = {
                    $or: [
                        { salonName: { $regex: regex } },
                        { locality: { $regex: regex } },
                        { district: { $regex: regex } },
                    ],
                };
                if (vendorId !== "") {
                    matchStage["vendorId"] = new mongoose_1.default.Types.ObjectId(vendorId);
                }
                const lookupStage = {
                    $lookup: {
                        from: "vendors",
                        localField: "vendorId",
                        foreignField: "_id",
                        as: "vendor",
                    },
                };
                const unblockedVendorMatchStage = {
                    $match: {
                        "vendor.isBlocked": { $ne: true },
                    },
                };
                const paginationStage = [
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    { $project: { password: 0 } },
                ];
                const pipeline = [
                    lookupStage,
                    unblockedVendorMatchStage,
                    { $match: matchStage },
                    {
                        $facet: {
                            totalCount: [{ $count: "count" }],
                            paginatedResults: paginationStage,
                        },
                    },
                ];
                const [result] = yield salonModel_1.default.aggregate(pipeline)
                    .sort({ isPremium: -1 })
                    .exec();
                const salons = result.paginatedResults;
                const salonCount = result.totalCount.length > 0 ? result.totalCount[0].count : 0;
                return { salons, salonCount };
            }
            catch (error) {
                console.log(error);
                throw new Error("Error while getting salon data");
            }
        });
    }
    updateSalonServices(salonId, services) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salon = yield salonModel_1.default.findById(salonId);
                if (!salon) {
                    throw new Error("Salon not found");
                }
                const newServices = services.filter((service) => {
                    return !salon.services.some((existingService) => existingService._id === service._id);
                });
                if (newServices.length > 0) {
                    const updatedSalon = yield salonModel_1.default.findByIdAndUpdate(salonId, { $addToSet: { services: { $each: newServices } } }, { new: true });
                    return updatedSalon;
                }
                else {
                    return salon;
                }
            }
            catch (error) {
                console.error("Error updating salon services in repository:", error);
                throw new Error("Failed to update salon services");
            }
        });
    }
    editSalonServices(salonId, servicesToEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salon = yield salonModel_1.default.findById(salonId);
                if (!salon) {
                    throw new Error("Salon not found");
                }
                for (const serviceToEdit of servicesToEdit) {
                    const serviceIndex = salon.services.findIndex((service) => service._id.toString() === serviceToEdit._id);
                    if (serviceIndex !== -1) {
                        if (serviceToEdit.price !== undefined) {
                            salon.services[serviceIndex].price = serviceToEdit.price;
                        }
                        if (serviceToEdit.duration !== undefined) {
                            salon.services[serviceIndex].duration = serviceToEdit.duration;
                        }
                    }
                    else {
                        throw new Error(`Service with ID ${serviceToEdit._id} not found in salon`);
                    }
                }
                const editedSalon = new salonModel_1.default(salon);
                const updatedSalon = yield editedSalon.save();
                return updatedSalon;
            }
            catch (error) {
                console.error("Error editing salon services in repository", error);
                throw new Error("Failed to edit salon services");
            }
        });
    }
    deleteSalonServices(salonId, serviceIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salon = yield salonModel_1.default.findById(salonId);
                if (!salon) {
                    throw new Error("Salon not found");
                }
                const updatedSalon = yield salonModel_1.default.findByIdAndUpdate(salonId, { $pull: { services: { _id: { $in: serviceIds } } } }, { new: true });
                if (!updatedSalon) {
                    throw new Error("Failed to update salon");
                }
                return updatedSalon;
            }
            catch (error) {
                console.error("Error deleting salon services in repository", error);
                throw new Error("Failed to delete salon services");
            }
        });
    }
    updateSalon(salonId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salon = yield salonModel_1.default.findById(salonId);
                if (!salon) {
                    throw new Error("Salon not found");
                }
                salon.salonName = update.salonName || salon.salonName;
                salon.contactNumber = update.contactNumber || salon.contactNumber;
                salon.chairCount = update.chairCount || salon.chairCount;
                salon.facilities = update.facilities || salon.facilities;
                salon.openingTime = update.openingTime || salon.openingTime;
                salon.closingTime = update.closingTime || salon.closingTime;
                const updatedSalon = yield salon.save();
                return updatedSalon;
            }
            catch (error) {
                if (error instanceof mongoose_1.default.Error.CastError) {
                    throw new Error("Invalid salon ID");
                }
                throw error;
            }
        });
    }
    updateSalonStatus(salonId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salon = yield salonModel_1.default.findById(salonId);
                if (!salon) {
                    throw new Error("Salon not found");
                }
                salon.status = status;
                const updatedSalon = yield salon.save();
                return updatedSalon;
            }
            catch (error) {
                if (error instanceof mongoose_1.default.Error.CastError) {
                    throw new Error("Invalid salon ID");
                }
                throw error;
            }
        });
    }
    upgradeToPremium(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salon = yield salonModel_1.default.findById(salonId);
                if (!salon) {
                    throw new Error("Salon not found");
                }
                salon.isPremium = 1;
                const updatedSalon = yield salon.save();
                return updatedSalon;
            }
            catch (error) {
                if (error instanceof mongoose_1.default.Error.CastError) {
                    throw new Error("Invalid salon ID");
                }
                throw error;
            }
        });
    }
    findActiveSalonsByVendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ObjectId = new mongoose_1.default.Types.ObjectId(vendorId);
                const count = yield salonModel_1.default.countDocuments({
                    vendorId: ObjectId,
                    status: "active",
                });
                return count;
            }
            catch (error) {
                if (error instanceof mongoose_1.default.Error.CastError) {
                    throw new Error("Invalid salon ID");
                }
                throw error;
            }
        });
    }
    findNearbySalons(latitude, longitude, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nearbySalons = yield salonModel_1.default.find({
                    location: {
                        $geoWithin: {
                            $centerSphere: [[longitude, latitude], radius / 6378.1],
                        },
                    },
                });
                console.log(`Nearby Salons`, nearbySalons);
                return nearbySalons;
            }
            catch (error) {
                return { status: 400, data: error.message };
            }
        });
    }
}
exports.default = SalonRepository;
