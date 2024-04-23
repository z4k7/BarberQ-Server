import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IReviews extends Document {
  _id?: string;
  salonId?: ObjectId;
  reviews: [userId?: ObjectId, rating?: number, review?: string, date?: Date];
}

const reviewSchema: Schema = new Schema({
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
      },
      review: {
        type: String,
      },
      date: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const ReviewModel = mongoose.model<IReviews>("Review", reviewSchema);
export default ReviewModel;
