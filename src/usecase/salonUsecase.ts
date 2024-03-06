import SalonInterface from "./interface/salonInterface";
import ISalon from "../domain/salon";
import Cloudinary from "../infrastructure/utils/cloudinary";

class SalonUsecase {
  constructor(
    private salonInterface: SalonInterface,
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


  async getSalons() {
    try {
      const salonList = await this.salonInterface.findAllSalons()
      return {
        status: 200,
        data: {
          success: true,
          message: "Salon List Found",
          salonData: salonList
        }
      }
    } catch (error) {
      return{
        status: 400,
        data:error,
      }
    }
  }



}

export default SalonUsecase;
