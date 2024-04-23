import ReviewModel from "../database/reviewModel";
import ReviewInterface from "../../usecase/interface/reviewInterface";
import IReviews from "../../domain/reviews";
import BookingModel from "../database/bookingModel";
import { Types } from "mongoose";

class ReviewRepository implements ReviewInterface {
  async addReview(salonId: string, review: IReviews): Promise<any> {
    try {
      const addedReview = await ReviewModel.updateOne(
        { salonId },
        { $push: { reviews: review } },
        { upsert: true }
      );
      return addedReview;
    } catch (error) {
      console.log(`Error in repository`, error);
    }
  }

  async getReviews(salonId: string): Promise<any> {
    try {
      const reviews = await ReviewModel.findOne({ salonId }).populate(
        "reviews.userId"
      );
      return reviews;
    } catch (error) {
      console.log(`Error in get review `, error);
    }
  }

  async getAverage(salonId: string): Promise<any> {
    try {
      const averageRating = await ReviewModel.aggregate([
        {
          $match: {
            salonId: new Types.ObjectId(salonId),
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
    } catch (error) {
      console.log(`Error in get average repository`, error);
    }
  }

  async findReview(salonId: string, userId: string): Promise<any> {
    try {
      const reviewFound = await ReviewModel.findOne({
        salonId,
        "reviews.userId": userId,
      });
      return reviewFound;
    } catch (error) {
      console.log(`Error in find review repository`, error);
    }
  }
  async userInBooking(salonId: string, userId: string): Promise<any> {
    try {
      const userFound = await BookingModel.findOne({
        salonId: salonId,
        bookings: {
          $elemMatch: {
            userId: userId,
            orderStatus: "completed",
          },
        },
      });
      return userFound;
    } catch (error) {
      console.log(`Error in user in booking`, error);
    }
  }
  async editReview(salonId: string, review: IReviews): Promise<any> {
    try {
      const editedReview = await ReviewModel.updateOne(
        { salonId, "reviews.userId": review.userId },
        {
          $set: {
            "reviews.$.rating": review.rating,
            "review.$.review": review.review,
          },
        }
      );
      return editedReview;
    } catch (error) {
      console.log(`Error in edit review`, error);
    }
  }
}

export default ReviewRepository;
