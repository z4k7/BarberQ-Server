import IService from "../../domain/services";

interface ServiceInterface {
  save(service: IService): Promise<any>;
  findServiceByName(service: string): Promise<any>;
  findServiceById(service: string): Promise<any>;
  findAllServices(): Promise<any>;
  hideService(serviceId: string): Promise<any>;
  findByIdAndUpdate(service: IService): Promise<any>;
}
export default ServiceInterface;
