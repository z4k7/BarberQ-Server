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
class ReviewController {
    constructor(revieUsecase) {
        this.revieUsecase = revieUsecase;
    }
    addReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.query.salonId;
                const review = req.body;
                const addedReview = yield this.revieUsecase.addReview(salonId, review);
                res.status(addedReview.status).json(addedReview);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.query.salonId;
                const reviews = yield this.revieUsecase.getReviews(salonId);
                res.status(reviews.status).json(reviews);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    getAverage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Salon id in get average`, req.query);
                const salonId = req.query.salonId;
                const averageRating = yield this.revieUsecase.getAverage(salonId);
                res.status(averageRating.status).json(averageRating);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    userInBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.query.salonId;
                const userId = req.body;
                const userFound = yield this.revieUsecase.userInBooking(salonId, userId);
                res.status(userFound.status).json(userFound);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    findReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.query.salonId;
                const userId = req.body;
                const reviewFound = yield this.revieUsecase.findReview(salonId, userId);
                res.status(reviewFound.status).json(reviewFound);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    editReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salonId = req.query.salonId;
                const review = req.body;
                const editedReview = yield this.revieUsecase.editReview(salonId, review);
                res.status(editedReview.status).json(editedReview);
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
}
exports.default = ReviewController;
