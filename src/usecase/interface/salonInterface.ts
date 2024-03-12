import ISalon from "../../domain/salon";

interface SalonInterface {
  addSalon(salonData: ISalon): Promise<any>;
  findAllSalons(): Promise<any>;
  findAllSalonsWithCount(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<any>;
}

export default SalonInterface;
