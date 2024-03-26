import mongoose, { Document, ObjectId, Schema } from "mongoose";
import IService from "../../domain/services";

export interface IBooking extends Document {
  _id?: ObjectId;
  salonId: string;
  userId: string;
  salonName?: string;
  userName?: string;
  userMobile?: string;
  chairNumber: number;
  time: string;
  startTime: string;
  endTime: string;
  date: string;
  cancelReason: string;
  services: Array<any>;
  totalAmount: number;
  totalDuration: number;
  orderStatus: string;
  paymentId: string;
  choosedServices: Array<string>;
}

const bookingSchema: Schema = new Schema({
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  salonName: {
    type: String,
  },
  userName: {
    type: String,
  },
  userMobile: {
    type: String,
  },
  chairNumber: {
    type: Number,
  },
  time: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  date: {
    type: String,
  },
  cancellationReason: {
    type: String,
  },
  orderStatus: {
    type: String,
    default: "booked",
  },
  services: {
    type: Array,
  },
  choosedServices: { type: Array },
  totalAmount: {
    type: Number,
  },
  totalDuration: {
    type: Number,
  },
  appliedCoupon: {
    type: Object,
  },
  paymentId: {
    type: String,
  },
});

const BookingModel = mongoose.model<IBooking>("Booking", bookingSchema);
export default BookingModel;
