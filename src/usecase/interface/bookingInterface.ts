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
  findBookingByIdAndUpdate(bokingId: string, refundId: string): Promise<any>;
  findBookingsToComplete(currentTime: Date): Promise<any[]>;
  updateBookingStatus(bookingId: string, newStatus: string): Promise<any>;
  findCompletedBookingsCount(): Promise<number>;
  findTotalRevenue(): Promise<number>;
  findTotalRevenueBySalonId(salonId: string): Promise<number>;
  findVendorRevenueAndBookingsByVendorId(
    vendorId: string
  ): Promise<{ totalRevenue: number; bookings: any[] }>;
  getBookingStatsBySalonId(salonId: string): Promise<any>;
}

export default BookingInterface;
