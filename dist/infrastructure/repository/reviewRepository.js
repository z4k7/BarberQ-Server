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
const reviewModel_1 = __importDefault(require("../database/reviewModel"));
const bookingModel_1 = __importDefault(require("../database/bookingModel"));
const mongoose_1 = require("mongoose");
class ReviewRepository {
    addReview(salonId, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addedReview = yield reviewModel_1.default.updateOne({ salonId }, { $push: { reviews: review } }, { upsert: true });
                return addedReview;
            }
            catch (error) {
                console.log(`Error in repository`, error);
            }
        });
    }
    getReviews(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield reviewModel_1.default.findOne({ salonId }).populate("reviews.userId");
                return reviews;
            }
            catch (error) {
                console.log(`Error in get review `, error);
            }
        });
    }
    getAverage(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const averageRating = yield reviewModel_1.default.aggregate([
                    {
                        $match: {
                            salonId: new mongoose_1.Types.ObjectId(salonId),
                        },
                    },
                    { $unwind: "$reviews" },
                    {
                        $group: {
                            _id: null,
                            totalCount: { $sum: 1 },
                            totalScore: { $sum: "$reviews.rating" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            totalCount: { $toDouble: "$totalCount" },
                            totalScore: { $toDouble: "$totalScore" },
                            averageRating: { $divide: ["$totalScore", "$totalCount"] },
                        },
                    },
                ]);
                console.log(`Average Rating`, averageRating);
                return averageRating;
            }
            catch (error) {
                console.log(`Error in get average repository`, error);
            }
        });
    }
    findReview(salonId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewFound = yield reviewModel_1.default.findOne({
                    salonId,
                    "reviews.userId": userId,
                });
                return reviewFound;
            }
            catch (error) {
                console.log(`Error in find review repository`, error);
            }
        });
    }
    userInBooking(salonId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield bookingModel_1.default.findOne({
                    salonId: salonId,
                    bookings: {
                        $elemMatch: {
                            userId: userId,
                            orderStatus: "completed",
                        },
                    },
                });
                return userFound;
            }
            catch (error) {
                console.log(`Error in user in booking`, error);
            }
        });
    }
    editReview(salonId, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editedReview = yield reviewModel_1.default.updateOne({ salonId, "reviews.userId": review.userId }, {
                    $set: {
                        "reviews.$.rating": review.rating,
                        "review.$.review": review.review,
                    },
                });
                return editedReview;
            }
            catch (error) {
                console.log(`Error in edit review`, error);
            }
        });
    }
}
exports.default = ReviewRepository;
