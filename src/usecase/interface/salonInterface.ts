import ISalon from "../../domain/salon";

interface SalonInterface {
  addSalon(salonData: ISalon): Promise<any>;
  findAllSalons(): Promise<any>;
}

export default SalonInterface;
