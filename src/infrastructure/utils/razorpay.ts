import Razorpay from "razorpay";
import axios from "axios";

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
      console.error("Error creating order inside util", error);
      throw new Error("Failed to create order");
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

  async refund(paymentId: string, amount: number, currency = "INR") {
    try {
      console.log(`Inside refund`);
      const refundData = {
        amount,
      };
      const config = {
        auth: {
          username: process.env.RAZORPAY_KEY_ID!,
          password: process.env.RAZORPAY_KEY_SECRET!,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };

      const axiosResponse = await axios.post(
        `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
        refundData,
        config
      );
      return axiosResponse;
    } catch (error) {
      console.error("Error creating order inside util", error);
      throw new Error("Failed to create order");
    }
  }
}

export default RazorpayClass;
