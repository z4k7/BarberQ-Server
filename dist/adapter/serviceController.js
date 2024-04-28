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
class ServiceController {
    constructor(serviceUsecase) {
        this.serviceUsecase = serviceUsecase;
    }
    addService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceExistence = yield this.serviceUsecase.isServiceExist(req.body.serviceName);
                if (serviceExistence.data) {
                    return res
                        .status(401)
                        .json({ data: false, message: "Service already exists" });
                }
                const savedService = yield this.serviceUsecase.saveService(req.body);
                return res.status(201).json({
                    data: savedService,
                    message: "Service Added Successfully",
                });
            }
            catch (error) {
                console.log(`Error while adding Service`, error);
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    editService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedService = yield this.serviceUsecase.editService(req.body);
                return res.status(updatedService.status).json(updatedService);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getAllServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceList = yield this.serviceUsecase.getAllServices();
                return res.status(serviceList.status).json(serviceList);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const searchQuery = req.query.searchQuery;
                const serviceList = yield this.serviceUsecase.getServices(page, limit, searchQuery);
                return res.status(serviceList.status).json(serviceList);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    hideService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceFound = yield this.serviceUsecase.hideService(req.params.id);
                return res.status(serviceFound.status).json(serviceFound);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Error",
                    error: error.message,
                });
            }
        });
    }
}
exports.default = ServiceController;
