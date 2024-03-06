import SalonModel from "../database/salonModel";
import SalonInterface from "../../usecase/interface/salonInterface";
import ISalon from "../../domain/salon";

class SalonRepository implements SalonInterface {
  async addSalon(salonData: ISalon): Promise<any> {
    console.log(`Inside salon Repository addSalon`);
    const salon = new SalonModel(salonData);
    const salonRequest = await salon.save();
    return salonRequest;
  }

  async findAllSalons(): Promise<any> {
    const allSalons = await SalonModel.find();
    return allSalons;
  }
}

export default SalonRepository;
