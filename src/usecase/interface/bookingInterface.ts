import IBooking from "../../domain/booking";

interface BookingInterface {
  createBooking(booking: IBooking): Promise<IBooking>;
  getAvailableSlots(
    salonId: string,
    date: string,
    duration: number
  ): Promise<{ time: string; chair: number }[]>;
  getBookedChairs(
    salonId: string,
    date: string,
    time: string
  ): Promise<number[]>;
  isChairAvailable(
    salonId: string,
    date: string,
    startTime: string,
    endTime: string,
    chair: number
  ): Promise<boolean>;
}

export default BookingInterface;
