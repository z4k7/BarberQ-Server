import { Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import SalonUsecase from "../usecase/salonUsecase";

class SalonController {
  constructor(private salonUsecase: SalonUsecase) {}

  async addSalon(req: Request, res: Response) {
    console.log(`Inside addSalon Controller`);
    try {
      const token = req.headers.authorization;
      if (token) {
        const decoded = verify(
          token.slice(7),
          process.env.JWT_KEY as string
        ) as JwtPayload;
        let vendorId = decoded.id;

        const banners = req.files;
          const facilities = JSON.parse(req.body.facilities)
          console.log('facilities',facilities)
        const {
          salonName,
          landmark,
          locality,
          location,
          district,
          openingTime,
          closingTime,
          contactNumber,
          chairCount,
          // facilities,
        } = req.body; 

        const salonData = {
          vendorId: vendorId,
          salonName,
          landmark,
          locality,
          location,
          district,
          openingTime,
          closingTime,
          contactNumber,
          chairCount,
          facilities,
          banners,
        };

        const salonAdd = await this.salonUsecase.addSalon(salonData);
        res.status(200).json(salonAdd);
      }
    } catch (error) {
      console.log(`Error`, error);
    }
  }

  async getSalons(req: Request, res: Response) {
    try {

      console.log(`Inside salon controller get salons`);

      const salonList = await this.salonUsecase.getSalons()
      console.log(`SalonList:`, salonList);
      return res.status(salonList.status).json(salonList)
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error:(error as Error).message
      })
    }
  }


}

export default SalonController;
