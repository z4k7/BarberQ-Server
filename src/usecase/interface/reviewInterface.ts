import IReviews from "../../domain/reviews";

interface ReviewInterface {
  addReview(salonId: string, review: IReviews): Promise<any>;
  getReviews(salonId: string): Promise<any>;
  getAverage(salonId: string): Promise<any>;
  userInBooking(salonId: string, userId: string): Promise<any>;
  findReview(salonId: string, userId: string): Promise<any>;
  editReview(salonId: string, review: IReviews): Promise<any>;
}

export default ReviewInterface;
