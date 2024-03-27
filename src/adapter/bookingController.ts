import { Request, Response } from "express";
import BookingUsecase from "../usecase/bookingUsecase";

class BookingController {
  constructor(private bookingUsecase: BookingUsecase) {}

  async bookSlot(req: Request, res: Response) {
    try {
      console.log(`Inside bookslot controller`);
      const { salonId, userId, paymentId, services, date, time } = req.body;

      const booking = await this.bookingUsecase.bookSlot(
        userId,
        salonId,
        paymentId,
        services,
        date,
        time
      );

      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAvailableSlots(req: Request, res: Response) {
    console.log(`Inside available slots controller`);
    try {
      const { salonId, services, date } = req.query;
      const availableSlots = await this.bookingUsecase.getAvailableSlots(
        salonId as string,
        services as string[],
        date as string
      );

      console.log(`Available Slots`, availableSlots);

      res.status(200).json(availableSlots);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getBookings(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const userId = req.query.userId as string | undefined;
      const searchQuery = req.query.searchQuery as string | undefined;

      const bookingList = await this.bookingUsecase.getBookings(
        page,
        limit,
        userId,
        searchQuery
      );
      return res.status(bookingList.status).json(bookingList);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async cancelBooking(req: Request, res: Response) {
    const { bookingId } = req.body;

    console.log(`Booking Id`, bookingId);

    try {
      const booking = await this.bookingUsecase.cancelBooking(bookingId);

      return res.status(booking.status).json(booking);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }
}

export default BookingController;
