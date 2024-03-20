import SalonInterface from "./interface/salonInterface";
import ServiceInterface from "./interface/serviceInterface";
import ISalon from "../domain/salon";
import Cloudinary from "../infrastructure/utils/cloudinary";
import IService from "../domain/services";

class SalonUsecase {
  constructor(
    private salonInterface: SalonInterface,
    private serviceInterface: ServiceInterface,
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
