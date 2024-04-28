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
const serviceModel_1 = __importDefault(require("../database/serviceModel"));
class ServiceRepository {
    save(service) {
        return __awaiter(this, void 0, void 0, function* () {
            const Service = new serviceModel_1.default(service);
            const savedService = yield Service.save()
                .then((res) => {
                console.log(`success`, res);
                return res;
            })
                .catch((error) => {
                console.log(error);
            });
            return savedService;
        });
    }
    findServiceByName(serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceFound = yield serviceModel_1.default.findOne({ serviceName });
            return serviceFound;
        });
    }
    findServiceById(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceFound = yield serviceModel_1.default.findById(serviceId);
            return serviceFound;
        });
    }
    findServicesByIds(serviceIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const servicesFound = yield serviceModel_1.default.find({ _id: { $in: serviceIds } });
            return servicesFound;
        });
    }
    findAllServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const allServices = yield serviceModel_1.default.find();
            return allServices;
        });
    }
    findAllServicesWithCount(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, "i");
                const pipeline = [
                    {
                        $match: {
                            $or: [
                                { serviceName: { $regex: regex } },
                                { category: { $regex: regex } },
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
                const [result] = yield serviceModel_1.default.aggregate(pipeline).exec();
                const services = result.paginatedResults;
                const serviceCount = result.totalCount.length > 0 ? result.totalCount[0].count : 0;
                return {
                    services,
                    serviceCount,
                };
            }
            catch (error) { }
        });
    }
    hideService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceFound = yield serviceModel_1.default.findById(serviceId);
            if (serviceFound) {
                serviceFound.isVisible = !serviceFound.isVisible;
                return serviceFound.save();
            }
            else {
                throw Error("Service not found");
            }
        });
    }
    findByIdAndUpdate(service) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceFound = yield serviceModel_1.default.findByIdAndUpdate({ _id: service._id }, {
                $set: service,
            }, { new: true });
            console.log(`service:`, serviceFound);
            return serviceFound;
        });
    }
}
exports.default = ServiceRepository;
