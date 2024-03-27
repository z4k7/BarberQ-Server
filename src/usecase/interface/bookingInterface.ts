import IBooking from "../../domain/booking";

interface BookingInterface {
  createBooking(booking: IBooking): Promise<IBooking>;
  getAvailableSlots(
    salonId: string,
    date: string,
    duration: number
  ): Promise<string[]>;
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
  findAllBookingsWithCount(
    page: number,
    limit: number,
    userId: string,
    searchQuery: string
  ): Promise<any>;

  findBookingById(bookingId: string): Promise<any>;
  findBookingByIdAndUpdate(bokingId: string): Promise<any>;
}

export default BookingInterface;
