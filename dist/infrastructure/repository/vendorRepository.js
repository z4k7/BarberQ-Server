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
const vendorModel_1 = __importDefault(require("../database/vendorModel"));
class VendorRepository {
    saveVendor(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            const Vendor = new vendorModel_1.default(vendor);
            const savedVendor = yield Vendor.save()
                .then((res) => {
                console.log(`success`, res);
                return res;
            })
                .catch((error) => {
                console.log(error);
            });
            return savedVendor;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorFound = yield vendorModel_1.default.findOne({ email });
            console.log("vendorFound", vendorFound);
            return vendorFound;
        });
    }
    findVendorById(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorFound = yield vendorModel_1.default.findById(vendor);
            return vendorFound;
        });
    }
    findAllVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorsList = yield vendorModel_1.default.find();
            return vendorsList;
        });
    }
    findActiveVendorsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeVendorsCount = yield vendorModel_1.default.countDocuments({
                isBlocked: "false",
            });
            console.log(`Vendor Count`, activeVendorsCount);
            return activeVendorsCount;
        });
    }
    findAllVendorsWithCount(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, "i");
                const pipeline = [
                    {
                        $match: {
                            $or: [
                                { name: { $regex: regex } },
                                { email: { $regex: regex } },
                                { mobile: { $regex: regex } },
                            ],
                        },
                    },
                    {
                        $facet: {
                            totalCount: [{ $count: "count" }],
                            paginatedResults: [
                                { $skip: (page - 1) * limit },
                                { $limit: limit },
                                { $project: { password: 0 } },
                            ],
                        },
                    },
                ];
                const [result] = yield vendorModel_1.default.aggregate(pipeline).exec();
                const vendors = result.paginatedResults;
                const vendorCount = result.totalCount.length > 0 ? result.totalCount[0].count : 0;
                return {
                    vendors,
                    vendorCount,
                };
            }
            catch (error) {
                console.log(error);
                throw Error("Error while getting vendor data");
            }
        });
    }
    blockUnblockVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorFound = yield vendorModel_1.default.findById(vendorId);
            console.log(`id`, vendorId);
            console.log(`inside repository`, vendorFound);
            if (vendorFound) {
                vendorFound.isBlocked = !vendorFound.isBlocked;
                return vendorFound.save();
            }
            else {
                throw Error("Vendor not Found");
            }
        });
    }
}
exports.default = VendorRepository;
