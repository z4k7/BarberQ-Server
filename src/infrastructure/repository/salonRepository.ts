import salonModel from "../database/salonModel";
import SalonInterface from "../../usecase/interface/salonInterface";
import ISalon from "../../domain/salon";

class SalonRepository implements SalonInterface {
  async addSalon(salonData: ISalon): Promise<any> {

    console.log(`Inside salon Repository`);
    const salon = new salonModel(salonData);
    const salonRequest = await salon.save();
    return salonRequest;
  }
}

export default SalonRepository