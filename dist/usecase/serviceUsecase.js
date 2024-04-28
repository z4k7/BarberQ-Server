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
class ServiceUsecase {
    constructor(serviceInterface) {
        this.serviceInterface = serviceInterface;
    }
    saveService(service) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`inside saveService`);
                const serviceData = yield this.serviceInterface.save(service);
                return {
                    status: 200,
                    data: serviceData || { message: "Internal Error" },
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
    editService(service) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Inside Service Usecase`);
                const serviceData = yield this.serviceInterface.findByIdAndUpdate(service);
                return {
                    status: 200,
                    message: "Service Edited Successfully",
                    data: serviceData || { message: "Internal Error" },
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
    isServiceExist(serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Inside isServiceExist usecase`);
                const serviceFound = yield this.serviceInterface.findServiceByName(serviceName);
                console.log(`serviceFound`, serviceFound);
                return {
                    status: 200,
                    data: serviceFound,
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
    getServices(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!searchQuery)
                    searchQuery = "";
                const serviceList = yield this.serviceInterface.findAllServicesWithCount(page, limit, searchQuery);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: "Service list found",
                        serviceData: serviceList,
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
    getAllServices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Inside Usecase`);
                const serviceList = yield this.serviceInterface.findAllServices();
                console.log(`service list found`, serviceList);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: "Service List Found",
                        serviceData: serviceList,
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
    getServicesByIds(serviceIds) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`inside getservice usecase`);
            try {
                const services = yield this.serviceInterface.findServicesByIds(serviceIds);
                console.log(`services from usecase`, services);
                return {
                    status: 200,
                    data: services,
                };
            }
            catch (error) {
                console.log(`inside catch from usecase`);
                console.log(`Error in getServicesByIds:`, error);
                return {
                    status: 400,
                };
            }
        });
    }
    hideService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Inside Usecase`);
                const serviceFound = yield this.serviceInterface.hideService(serviceId);
                return {
                    status: 200,
                    data: serviceFound,
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
exports.default = ServiceUsecase;
