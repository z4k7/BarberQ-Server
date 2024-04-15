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

      console.log(`Options`, options);

      const order = await this.razorpay.orders.create(options);
      console.log(`Order`, order);
      return order;
    } catch (error: any) {
      console.error("Error creating order inside util", error);
      // Check if error is an instance of Error or if it has a message property
      if (error instanceof Error || error.message) {
        console.error("Error message:", error.message);
      } else {
        // If error is not an instance of Error, log the entire error object
        console.error("Error object:", error);
      }

      // Check if error has a response property and log relevant details
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }

      // Throw a new Error with a more descriptive message
      throw new Error("Failed to create order due to an unexpected error");
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
