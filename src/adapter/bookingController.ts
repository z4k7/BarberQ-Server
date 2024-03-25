import { Request, Response } from "express";
import BookingUsecase from "../usecase/bookingUsecase";

class BookingController {
  constructor(private bookingUsecase: BookingUsecase) {}

  async bookSlot(req: Request, res: Response) {
    try {
      console.log(`Inside bookslot controller`);
      const { salonId, userId, services, date, time } = req.body;

      console.log(`Date in controller:`, req.body.date);

      const booking = await this.bookingUsecase.bookSlot(
        userId,
        salonId,
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
}

export default BookingController;
