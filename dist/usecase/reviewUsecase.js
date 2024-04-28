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
class ReviewUsecase {
    constructor(reviewInterface) {
        this.reviewInterface = reviewInterface;
    }
    addReview(salonId, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addedReview = yield this.reviewInterface.addReview(salonId, review);
                return {
                    status: 200,
                    data: addedReview,
                };
            }
            catch (error) {
                return { status: 400, data: error };
            }
        });
    }
    getReviews(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield this.reviewInterface.getReviews(salonId);
                return { status: 200, data: reviews };
            }
            catch (error) {
                return { status: 400, data: error };
            }
        });
    }
    getAverage(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const averageRating = yield this.reviewInterface.getAverage(salonId);
                return {
                    status: 200,
                    data: averageRating,
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
    userInBooking(salonId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.reviewInterface.userInBooking(salonId, userId);
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
    findReview(salonId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewFound = yield this.reviewInterface.findReview(salonId, userId);
                return {
                    status: 200,
                    data: reviewFound,
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
    editReview(salonId, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editedReview = yield this.reviewInterface.editReview(salonId, review);
                return {
                    status: 200,
                    data: editedReview,
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
exports.default = ReviewUsecase;
