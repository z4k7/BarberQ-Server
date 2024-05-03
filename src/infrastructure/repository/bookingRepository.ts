import BookingModel from "../database/bookingModel";
import BookingInterface from "../../usecase/interface/bookingInterface";
import IBooking from "../../domain/booking";
import SalonModel from "../database/salonModel";
import mongoose from "mongoose";
import { PipelineStage } from "mongoose";
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

    console.log(`start Time`, startTime);

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
    const currentTime = new Date();

    const offsetInMilliseconds = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;

    const adjustedTime = new Date(currentTime.getTime() + offsetInMilliseconds);

    const adjustedTimeString = adjustedTime.toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    return adjustedTimeString;
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

  async findBookingByIdAndUpdate(
    bookingId: string,
    refundId: string
  ): Promise<any> {
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { orderStatus: "cancelled", refundId: refundId },
      { new: true }
    );
    return booking;
  }

  async findSalonBookingsWithCount(
    page: number,
    limit: number,
    salonId: string,
    searchQuery: string
  ): Promise<any> {
    console.log(`Inside get salon bookings repository`);
    try {
      const regex = new RegExp(searchQuery, "i");

      const matchStage: any = {
        $or: [
          { salonName: { $regex: regex } },
          { orderStatus: { $regex: regex } },
          { date: { $regex: regex } },
        ],
      };

      if (salonId !== "") {
        (matchStage as any)["salonId"] = new mongoose.Types.ObjectId(salonId);
      }

      const pipeline: PipelineStage[] = [
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
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
        (matchStage as any)["userId"] = new mongoose.Types.ObjectId(userId);
      }

      const pipeline: PipelineStage[] = [
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
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

  async findBookingsToComplete(currentTime: Date): Promise<any[]> {
    const bookings = await BookingModel.find({
      orderStatus: "booked",
    });
    return bookings.filter((booking) => {
      const endTime = this.calculateEndTime(
        booking.time,
        booking.totalDuration
      );

      const [day, month, year] = booking.date.split("-").map(Number);
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      const bookingEndTime = new Date(`${formattedDate}T${endTime}:00`);

      return currentTime > bookingEndTime;
    });
  }

  async updateBookingStatus(
    bookingId: string,
    newStatus: string
  ): Promise<any> {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { orderStatus: newStatus },
      { new: true }
    );
  }

  async findCompletedBookingsCount(): Promise<number> {
    const completedBookingsCount = await BookingModel.countDocuments({
      orderStatus: "completed",
    });
    return completedBookingsCount;
  }
  async findAllBookings(): Promise<any> {
    const totalBookings = await BookingModel.find({
      orderStatus: { $ne: "cancelled" },
    });
    return totalBookings;
  }

  async findTotalRevenue(): Promise<number> {
    const totalRevenue = await BookingModel.aggregate([
      { $match: { orderStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    return totalRevenue.length > 0 ? totalRevenue[0].total : 0;
  }

  async findTotalRevenueBySalonId(salonId: string): Promise<number> {
    const totalRevenue = await BookingModel.aggregate([
      { $match: { orderStatus: "completed", salonId: salonId } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    console.log(`Total Revenue`, totalRevenue[0].total);
    return totalRevenue.length > 0 ? totalRevenue[0].total : 0;
  }

  async findVendorRevenueAndBookingsByVendorId(
    vendorId: string
  ): Promise<{ totalRevenue: number; bookings: any[] }> {
    const ObjectId = mongoose.Types.ObjectId;
    const vendorObjectId = new ObjectId(vendorId);
    const activeSalons = await SalonModel.find(
      {
        vendorId: vendorObjectId,
        status: "active",
      },
      "_id"
    );
    const salonIds = activeSalons.map((salon) => salon._id);

    const result = await BookingModel.aggregate([
      { $match: { salonId: { $in: salonIds } } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$orderStatus", "completed"] },
                "$totalAmount",
                0,
              ],
            },
          },
          bookings: {
            $push: "$$ROOT",
          },
        },
      },
    ]);

    return {
      totalRevenue: result.length > 0 ? result[0].totalRevenue : 0,
      bookings: result.length > 0 ? result[0].bookings : [],
    };
  }

  async getBookingStatsBySalonId(salonId: string): Promise<any> {
    try {
      const today = new Date();
      const formattedToday = `${today.getDate().toString().padStart(2, "0")}-${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${today.getFullYear()}`;
      console.log(`Formatted Date`, formattedToday);

      const objectId = new mongoose.Types.ObjectId(salonId);

      const totalBookings = await BookingModel.find({
        salonId: objectId,
        orderStatus: { $ne: "cancelled" },
      });

      const todaysBookings = await BookingModel.find({
        salonId: objectId,
        date: formattedToday,
        orderStatus: { $ne: "cancelled" },
      });

      const completedBookingsSum = await BookingModel.aggregate([
        { $match: { salonId: objectId, orderStatus: "completed" } },
        { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
      ]);

      const totalRevenue =
        completedBookingsSum.length > 0
          ? completedBookingsSum[0].totalAmount
          : 0;

      console.log(`TotalRevenue`, totalRevenue);

      return { totalBookings, todaysBookings, totalRevenue };
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      throw error;
    }
  }
}

export default BookingRepository;
