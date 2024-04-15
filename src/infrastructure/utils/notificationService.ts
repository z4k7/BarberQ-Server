import IBooking from "../../domain/booking";

import { Twilio } from "twilio";

import axios, { AxiosRequestConfig, AxiosError } from "axios";

class NotificationService {
  private twilio: Twilio;
  private retryCount: number;

  constructor() {
    this.twilio = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
      {
        timeout: 60000,
      }
    );
    this.retryCount = 3;
  }

  async sendNotification(booking: IBooking): Promise<void> {
    try {
      console.log(`Inside sendNotification`);
      await this.sendWithRetry(booking);
    } catch (error) {
      console.error(
        `Error sending notification for booking ${booking.paymentId}:`,
        error
      );
    }
  }

  private async sendWithRetry(
    booking: IBooking,
    retryCount = this.retryCount
  ): Promise<void> {
    try {
      console.log(`Retry count ${retryCount}`);
      await this.twilio.messages.create({
        body: `Reminder: Your salon appointment at ${booking.salonName} is scheduled for ${booking.date} ${booking.time}.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: "+91" + booking.userMobile,
      });
      console.log(`Notification sent for booking ${booking.paymentId}`);
    } catch (error) {
      if (
        retryCount > 0 &&
        error instanceof AxiosError &&
        error.code === "ERR_SOCKET_CONNECTION_TIMEOUT"
      ) {
        console.log(
          `Retrying notification for booking ${booking.paymentId} (${
            this.retryCount - retryCount + 1
          }/${this.retryCount})`
        );
        await this.sendWithRetry(booking, retryCount - 1);
      } else {
        throw error;
      }
    }
  }
}

export default NotificationService;
