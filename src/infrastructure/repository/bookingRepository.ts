import BookingModel from "../database/bookings";
import BookingInterface from "../../usecase/interface/bookingInterface";
import IBooking from "../../domain/booking";
import SalonModel from "../database/salonModel";

class BookingRepository implements BookingInterface {
  async createBooking(booking: IBooking): Promise<IBooking> {
    const newBooking = new BookingModel(booking);
    return await newBooking.save();
  }

  async getAvailableSlots(
    salonId: string,
    date: string,
    duration: number
  ): Promise<{ time: string; chair: number }[]> {
    const salon = await this.findSalonById(salonId);
    console.log(`Salon`, salon);
    const openingTime = salon?.openingTime;
    const closingTime = salon?.closingTime;

    const availableSlots = [];
    let currentTime = openingTime;

    console.log(`opening time`, openingTime);
    console.log(`closingTIme`, closingTime);

    while (currentTime < closingTime) {
      const endTime = this.calculateEndTime(currentTime, duration);

      if (endTime <= closingTime) {
        const isSlotAvailable = await this.isSlotAvailable(
          salonId,
          date,
          currentTime,
          endTime
        );

        if (isSlotAvailable) {
          availableSlots.push({ time: currentTime, chair: 1 });
        }
      }
      currentTime = endTime;
    }

    return availableSlots;
  }

  async getBookedChairs(
    salonId: string,
    date: string,
    time: string
  ): Promise<number[]> {
    const bookings = await BookingModel.find({ salonId, date, time });
    return bookings.map((booking) => booking.chairNumber);
  }

  async isChairAvailable(
    salonId: string,
    date: string,
    startTime: string,
    endTime: string,
    chair: number
  ): Promise<boolean> {
    const existingBooking = await BookingModel.findOne({
      salonId,
      date,
      chair,
      $or: [
        { time: { $lte: endTime }, endTime: { $gte: startTime } },
        { time: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });
    return !existingBooking;
  }

  private async isSlotAvailable(
    salonId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const existingBooking = await BookingModel.findOne({
      salonId,
      date,
      $or: [
        { time: { $lte: endTime }, endTime: { $gte: startTime } },
        { time: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });
    return !existingBooking;
  }

  private calculateEndTime(startTime: string, duration: number): string {
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

  private async findSalonById(salonId: string): Promise<any> {
    const salonDetails = await SalonModel.findById(salonId);
    return salonDetails;
  }
}

export default BookingRepository;
