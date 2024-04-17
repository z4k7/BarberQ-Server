import SalonInterface from "./interface/salonInterface";
import ISalon from "../domain/salon";
import Cloudinary from "../infrastructure/utils/cloudinary";
import IService from "../domain/services";
import BookingInterface from "./interface/bookingInterface";

class SalonUsecase {
  constructor(
    private salonInterface: SalonInterface,
    private bookingInterface: BookingInterface,
    private cloudinary: Cloudinary
  ) {}

  async addSalon(salonData: ISalon) {
    console.log(`Inside Salon usecase`);
    try {
      const uploadedBanners = await Promise.all(
        salonData.banners.map(async (file: any) => {
          try {
            return await this.cloudinary.savetoCloudinary(file);
          } catch (error) {
            console.error("Error uploading banner", error);
            return null;
          }
        })
      );

      salonData.banners = uploadedBanners.filter((banner) => banner !== null);

      console.log(`uploadedBanners`, uploadedBanners);

      const salonStatus = await this.salonInterface.addSalon(salonData);

      return {
        status: 200,
        data: salonStatus,
      };
    } catch (error) {
      console.log(`Error in addSalon:`, error);
      throw error;
    }
  }
  async getSalons(
    page: number,
    limit: number,
    vendorId: string | undefined,
    searchQuery: string | undefined
  ): Promise<any> {
    try {
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 12;
      if (!vendorId) vendorId = "";
      if (!searchQuery) searchQuery = "";

      const salonList = await this.salonInterface.findAllSalonsWithCount(
        page,
        limit,
        vendorId,
        searchQuery
      );
      return {
        status: 200,
        data: {
          salonData: salonList,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }
  async getActiveSalons(
    page: number,
    limit: number,
    searchQuery: string | undefined
  ): Promise<any> {
    try {
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 12;
      if (!searchQuery) searchQuery = "";

      const activeSalons = await this.salonInterface.findActiveSalons(
        page,
        limit,
        searchQuery
      );
      return { status: 200, data: { salonData: activeSalons } };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async getSalonById(salonId: string): Promise<any> {
    try {
      const salonDetails = await this.salonInterface.findSalonById(salonId);
      return {
        status: 200,
        data: { salonData: salonDetails },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }
  async updateSalonStatus(salonId: string, status: string): Promise<any> {
    try {
      const updatedSalon = await this.salonInterface.updateSalonStatus(
        salonId,
        status
      );

      return {
        status: 200,
        data: {
          message: "Status updated successfully",
          salonData: updatedSalon,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async updateSalonServices(
    salonId: string,
    services: IService[]
  ): Promise<any> {
    try {
      const updatedSalon = await this.salonInterface.updateSalonServices(
        salonId,
        services
      );
      return {
        status: 200,
        data: {
          message: "Services updated successfully",
          salonData: updatedSalon,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async editSalonServices(
    salonId: string,
    servicesToEdit: IService[]
  ): Promise<any> {
    try {
      const updatedSalon = await this.salonInterface.editSalonServices(
        salonId,
        servicesToEdit
      );

      return {
        status: 200,
        data: {
          message: "Services updated successfully",
          salonData: updatedSalon,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async deleteSalonServices(
    salonId: string,
    serviceIds: string[]
  ): Promise<any> {
    try {
      const updatedSalon = await this.salonInterface.deleteSalonServices(
        salonId,
        serviceIds
      );

      return {
        status: 200,
        data: {
          message: "Services Deleted Successfully",
          salonData: updatedSalon,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async updateSalon(salonId: string, update: any): Promise<any> {
    try {
      const updatedSalon = await this.salonInterface.updateSalon(
        salonId,
        update
      );
      return {
        status: 200,
        data: {
          message: "Salon Updated Successfully",
          salonData: updatedSalon,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async getVendorDashboardData(vendorId: string) {
    try {
      const activeSalons = await this.salonInterface.findActiveSalonsByVendorId(
        vendorId
      );
      const bookingData =
        await this.bookingInterface.findVendorRevenueAndBookingsByVendorId(
          vendorId
        );

      return {
        status: 200,
        data: {
          salons: activeSalons,
          bookings: bookingData.bookings,
          revenue: bookingData.totalRevenue,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async getSalonDashboardData(salonId: string) {
    try {
      const bookingData = await this.bookingInterface.getBookingStatsBySalonId(
        salonId
      );
      console.log(`Booking Data`, bookingData);

      return {
        status: 200,
        data: {
          totalBookings: bookingData.totalBookings,
          todaysBookings: bookingData.todaysBookings,
          revenue: bookingData.totalRevenue,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  // async getSalons() {
  //   try {
  //     const salonList = await this.salonInterface.findAllSalons();
  //     return {
  //       status: 200,
  //       data: {
  //         success: true,
  //         message: "Salon List Found",
  //         salonData: salonList,
  //       },
  //     };
  //   } catch (error) {
  //     return {
  //       status: 400,
  //       data: error,
  //     };
  //   }
  // }
}

export default SalonUsecase;
