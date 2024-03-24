import { ObjectId } from "mongoose";

interface IBooking {
  salonId?: string;
  userId?: string;
  userName?: string;
  userMobile?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  date?: string;
  chairNumber?: number;
  totalDuration?: number;
  totalAmount?: number;
  services?: Array<any>;
  appliedCoupon?: {
    couponName?: string;
  };
  walletAmountUsed?: number;
}

export default IBooking;
