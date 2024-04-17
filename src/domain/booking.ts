interface IBooking {
  salonId?: string;
  userId?: string;
  salonName?: string;
  userName?: string;
  userMobile: string;
  startTime?: string;
  endTime?: string;
  time: string;
  date: string;
  chairNumber?: number;
  totalDuration?: number;
  totalAmount?: number;
  services?: Array<any>;
  orderStatus?: string;
  paymentId?: string;
  refundId?: string;
  choosedServices?: Array<string>;
  appliedCoupon?: {
    couponName?: string;
  };
}

export default IBooking;
