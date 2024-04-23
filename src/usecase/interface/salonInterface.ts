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
  findActiveSalons(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<any>;
  findSalonById(salonId: string): Promise<any>;
  updateSalonServices(salonId: string, services: IService[]): Promise<any>;
  editSalonServices(salonId: string, servicesToEdit: IService[]): Promise<any>;
  deleteSalonServices(salonId: string, serviceIds: string[]): Promise<any>;
  updateSalon(salonId: string, update: any): Promise<any>;
  updateSalonStatus(salonId: string, status: string): Promise<any>;
  upgradeToPremium(salonId: string): Promise<any>;
  findActiveSalonCount(): Promise<number>;
  findActiveSalonsByVendorId(vendorId: string): Promise<number>;
  findNearbySalons(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<any>;
}

export default SalonInterface;
