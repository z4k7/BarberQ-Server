import ReviewInterface from "./interface/reviewInterface";
import IReviews from "../domain/reviews";

class ReviewUsecase {
  constructor(private reviewInterface: ReviewInterface) {}

  async addReview(salonId: string, review: IReviews) {
    try {
      const addedReview = await this.reviewInterface.addReview(salonId, review);
      return {
        status: 200,
        data: addedReview,
      };
    } catch (error) {
      return { status: 400, data: error };
    }
  }

  async getReviews(salonId: string) {
    try {
      const reviews = await this.reviewInterface.getReviews(salonId);
      return { status: 200, data: reviews };
    } catch (error) {
      return { status: 400, data: error };
    }
  }

  async getAverage(salonId: string) {
    try {
      const averageRating = await this.reviewInterface.getAverage(salonId);
      return {
        status: 200,
        data: averageRating,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async userInBooking(salonId: string, userId: string) {
    try {
      const userFound = await this.reviewInterface.userInBooking(
        salonId,
        userId
      );
      return {
        status: 200,
        data: userFound,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async findReview(salonId: string, userId: string) {
    try {
      const reviewFound = await this.reviewInterface.findReview(
        salonId,
        userId
      );
      return {
        status: 200,
        data: reviewFound,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async editReview(salonId: string, review: IReviews) {
    try {
      const editedReview = await this.reviewInterface.editReview(
        salonId,
        review
      );
      return {
        status: 200,
        data: editedReview,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }
}

export default ReviewUsecase;
