import Razorpay from "razorpay";

class RazorpayClass {
  razorpay: Razorpay;
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(amount: number, currency = "INR") {
    try {
      const options = {
        amount: amount * 100,
        currency,
        receipt: "receipt_order_id",
        payment_capture: 1,
      };
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error("Error creating order", error);
      throw error;
    }
  }

  async verifyPayment(
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ) {
    try {
      const crypto = require("crypto");
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");

      if (expectedSignature === razorpaySignature) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error verifying payment");
      throw error;
    }
  }
}

export default RazorpayClass;
