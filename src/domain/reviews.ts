import { ObjectId } from "mongoose";

interface IReviews {
  userId?: ObjectId;
  rating?: number;
  review?: string;
  date?: Date;
}
export default IReviews;
