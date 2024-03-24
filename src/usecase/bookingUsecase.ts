import IBooking from "../domain/booking";
import ISalon from "../domain/salon";
import BookingInterface from "./interface/bookingInterface";
import SalonInterface from "./interface/salonInterface";

class BookingUsecase {
  constructor(
    private bookingInterface: BookingInterface,
    private salonInterface: SalonInterface
  ) {}

  async bookSlot(
    userId: string,
    salonId: string,
    services: string[],
    date: string,
    time: string
  ): Promise<IBooking> {
    const salon = await this.salonInterface.findSalonById(salonId);
    const totalDuration = this.calculateTotalDuration(salon, services);
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
      services,
      date,
      time,
      chairNumber: availableChair,
      totalDuration,
    };

    const createdBooking = await this.bookingInterface.createBooking(booking);
    return createdBooking;
  }

  async getAvailableSlots(
    salonId: string,
    services: string[],
    date: string
  ): Promise<{ time: string; chair: number }[]> {
    console.log(`Inside usecase available slots`);
    const salon = await this.salonInterface.findSalonById(salonId);
    const totalDuration = this.calculateTotalDuration(salon, services);
    const availableSlots = await this.bookingInterface.getAvailableSlots(
      salonId,
      date,
      totalDuration
    );

    console.log(`salonId: ${salonId}, services:${services}, date:${date}`);

    return availableSlots;
  }

  private calculateTotalDuration(salon: ISalon, services: string[]): number {
    let totalDuration = 0;
    services.forEach((serviceId) => {
      const service = salon.services.find((s) => s._id === serviceId);

      if (service) {
        totalDuration += service.duration;
      }
    });
    return totalDuration;
  }

  async getAvailableChair(
    salonId: string,
    date: string,
    time: string,
    duration: number
  ): Promise<number | null> {
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
