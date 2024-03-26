import IBooking from "../domain/booking";
import ISalon from "../domain/salon";
import RazorpayClass from "../infrastructure/utils/razorpay";
import BookingInterface from "./interface/bookingInterface";
import SalonInterface from "./interface/salonInterface";

class BookingUsecase {
  razorpay = new RazorpayClass();
  constructor(
    private bookingInterface: BookingInterface,
    private salonInterface: SalonInterface
  ) {}

  async getBookings(
    page: number,
    limit: number,
    userId: string | undefined,
    searchQuery: string | undefined
  ) {
    try {
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!userId) userId = "";
      if (!searchQuery) searchQuery = "";

      const bookingList = await this.bookingInterface.findAllBookingsWithCount(
        page,
        limit,
        userId,
        searchQuery
      );

      return {
        status: 200,
        data: {
          bookingData: bookingList,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async cancelBooking(bookingId: string): Promise<any> {
    const booking = await this.bookingInterface.findBookingById(bookingId);

    if (booking) {
      const amount = booking.totalAmount;
      const paymentId = booking.paymentId;
      const refund = await this.razorpay.refund(paymentId, amount);
    }
  }

  async bookSlot(
    userId: string,
    salonId: string,
    paymentId: string,
    services: string[],
    date: string,
    time: string
  ): Promise<IBooking> {
    const salon = await this.salonInterface.findSalonById(salonId);
    const salonName = salon.salonName;
    const { totalDuration, totalAmount, choosedServices } =
      this.calculateTotalDuration(salon, services);
    const availableChair = await this.getAvailableChair(
      salonId,
      date,
      time,
      totalDuration
    );

    if (!availableChair) {
      throw new Error("No available chair found for the selected time slot");
    }

    const booking: IBooking = {
      userId,
      salonId,
      paymentId,
      services,
      date,
      time,
      chairNumber: availableChair,
      totalDuration,
      totalAmount,
      choosedServices,
      salonName,
    };

    const createdBooking = await this.bookingInterface.createBooking(booking);
    return createdBooking;
  }

  async getAvailableSlots(
    salonId: string,
    services: string[],
    date: string
  ): Promise<string[]> {
    console.log(`Inside usecase available slots`);
    const salon = await this.salonInterface.findSalonById(salonId);
    const { totalDuration } = this.calculateTotalDuration(salon, services);
    const availableSlots = await this.bookingInterface.getAvailableSlots(
      salonId,
      date,
      totalDuration
    );

    console.log(`salonId: ${salonId}, services:${services}, date:${date}`);

    return availableSlots;
  }

  private calculateTotalDuration(
    salon: ISalon,
    services: string[]
  ): { totalDuration: number; totalAmount: number; choosedServices: string[] } {
    let totalDuration = 0;
    let totalAmount = 0;
    let choosedServices = [];

    if (Array.isArray(services)) {
      services.forEach((serviceId) => {
        const service = salon.services.find((s) => s._id === serviceId);
        if (service) {
          totalDuration += service.duration;
          totalAmount += service.price;
          choosedServices.push(service.serviceName);
        }
      });
    } else {
      const service = salon.services.find((s) => s._id === services);
      if (service) {
        totalDuration += service.duration;
        totalAmount += service.price;
        choosedServices.push(service.serviceName);
      }
    }
    return { totalDuration, totalAmount, choosedServices };
  }

  private async getAvailableChair(
    salonId: string,
    date: string,
    time: string,
    duration: number
  ): Promise<number | null> {
    console.log(`Inside get available chair`);
    console.log(`Date in getavailable chair:`, date);
    const bookedChairs = await this.bookingInterface.getBookedChairs(
      salonId,
      date,
      time
    );
    const totalChairs = (await this.salonInterface.findSalonById(salonId))
      .chairCount;

    for (let chair = 1; chair <= totalChairs; chair++) {
      if (!bookedChairs.includes(chair)) {
        const endTime = this.calculateEndTime(time, duration);
        const isChairAvailable = await this.bookingInterface.isChairAvailable(
          salonId,
          date,
          time,
          endTime,
          chair
        );

        if (isChairAvailable) {
          return chair;
        }
      }
    }
    return null;
  }

  private calculateEndTime(startTime: string, duration: number): string {
    if (!startTime) {
      throw new Error("Start time is undefined");
    }

    const [hours, minutes] = startTime.split(":").map(Number);
    const durationHours = Math.floor(duration / 60);
    const durationMinutes = duration % 60;
    let endHours = hours + durationHours;
    let endMinutes = minutes + durationMinutes;

    if (endMinutes >= 60) {
      endHours++;
      endMinutes -= 60;
    }

    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  }
}

export default BookingUsecase;
