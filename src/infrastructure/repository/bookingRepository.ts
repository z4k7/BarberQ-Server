import BookingModel from "../database/bookingModel";
import BookingInterface from "../../usecase/interface/bookingInterface";
import IBooking from "../../domain/booking";
import SalonModel from "../database/salonModel";
import mongoose from "mongoose";

class BookingRepository implements BookingInterface {
  async createBooking(booking: IBooking): Promise<IBooking> {
    const newBooking = new BookingModel(booking);
    return await newBooking.save();
  }

  async getAvailableSlots(
    salonId: string,
    date: string,
    duration: number
  ): Promise<string[]> {
    const salon = await this.findSalonById(salonId);
    const openingTime = salon?.openingTime;
    const closingTime = salon?.closingTime;
    const totalChairs = salon?.chairCount || 1;
    const availableSlots: string[] = [];

    const requestedDate = date;
    const currentDateObj = new Date();
    const currentDate = `${currentDateObj
      .getDate()
      .toString()
      .padStart(2, "0")}-${(currentDateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDateObj.getFullYear()}`;

    const bookedChairs = await this.getBookedChairsForDate(
      salonId,
      requestedDate
    );

    let startTime =
      requestedDate === currentDate
        ? this.getCurrentTime()
        : this.toTimeString(openingTime);

    let currentTime = startTime;
    while (currentTime < closingTime) {
      const endTime = this.calculateEndTime(currentTime, duration);
      if (endTime <= closingTime) {
        const availableChairs = Array.from(
          { length: totalChairs },
          (_, i) => i + 1
        ).filter((chair) => !bookedChairs[currentTime]?.includes(chair));
        if (availableChairs.length > 0) {
          availableSlots.push(currentTime);
        }
      }
      currentTime = endTime;
    }

    return availableSlots;
  }

  private async getBookedChairsForDate(
    salonId: string,
    date: string
  ): Promise<{ [time: string]: number[] }> {
    const bookings = await BookingModel.find({ salonId, date });
    const bookedChairs: { [time: string]: number[] } = {};
    bookings.forEach((booking) => {
      if (!bookedChairs[booking.time]) {
        bookedChairs[booking.time] = [];
      }
      bookedChairs[booking.time].push(booking.chairNumber);
    });
    return bookedChairs;
  }

  private getCurrentTime(): string {
    const currentTimeString = new Date().toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    return currentTimeString;
  }

  private toTimeString(time: string): string {
    return time;
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

  async findBookingById(bookingId: string): Promise<any> {
    const booking = await BookingModel.findById(bookingId);
    return booking;
  }

  async findBookingByIdAndUpdate(bookingId: string): Promise<any> {
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { orderStatus: "cancelled" },
      { new: true }
    );
    return booking;
  }

  async findAllBookingsWithCount(
    page: number,
    limit: number,
    userId: string,
    searchQuery: string
  ): Promise<any> {
    try {
      const regex = new RegExp(searchQuery, "i");

      const matchStage: any = {
        $or: [
          { salonName: { $regex: regex } },
          { orderStatus: { $regex: regex } },
          { date: { $regex: regex } },
        ],
      };

      if (userId !== "") {
        matchStage["userId"] = new mongoose.Types.ObjectId(userId);
      }

      const pipeline = [
        { $match: matchStage },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            paginatedResults: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $project: { password: 0 } },
            ],
          },
        },
      ];

      const [result] = await BookingModel.aggregate(pipeline).exec();

      const bookings = result.paginatedResults;
      const bookingsCount =
        result.totalCount.length > 0 ? result.totalCount[0].count : 0;

      return {
        bookings,
        bookingsCount,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error while getting salon data");
    }
  }
}

export default BookingRepository;
