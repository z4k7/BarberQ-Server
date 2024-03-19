import ISalon from "../../domain/salon";
import IService from "../../domain/services";

interface SalonInterface {
  addSalon(salonData: ISalon): Promise<any>;
  findAllSalons(): Promise<any>;
  findAllSalonsWithCount(
    page: number,
    limit: number,
    vendorId: string,
    searchQuery: string
  ): Promise<any>;

  findSalonById(salonId: string): Promise<any>;
  updateSalonServices(salonId: string, services: IService[]): Promise<any>;
  editSalonServices(salonId: string, servicesToEdit: IService[]): Promise<any>;
  deleteSalonServices(salonId: string, serviceIds: string[]): Promise<any>;
}

export default SalonInterface;