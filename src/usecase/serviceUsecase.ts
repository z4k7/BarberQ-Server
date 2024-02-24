import IService from "../domain/services";
import ServiceInterface from "./interface/serviceInterface";

class ServiceUsecase {
  constructor(private serviceInterface: ServiceInterface) {}

  async saveService(service: IService) {
    try {
      console.log(`inside saveService`);

      const serviceData = await this.serviceInterface.save(service);

      return {
        status: 200,
        data: serviceData || { message: "Internal Error" },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async editService(service: IService) {
    try {
      console.log(`Inside Service Usecase`);
      const serviceData = await this.serviceInterface.findByIdAndUpdate(
        service
      );
      return {
        status: 200,
        data: serviceData || { message: "Internal Error" },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async isServiceExist(serviceName: string) {
    try {
      console.log(`Inside isServiceExist usecase`);
      const serviceFound = await this.serviceInterface.findServiceByName(
        serviceName
      );
      console.log(`serviceFound`,serviceFound);
      return {
        status: 200,
        data: serviceFound,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async getServices() {
    try {
      const serviceList = await this.serviceInterface.findAllServices();
      return {
        status: 200,
        data: {
          success: true,
          message: "Service list found",
          serviceData: serviceList,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async hideService(serviceId: string) {
    try {
      console.log(`Inside Usecase`);
      const serviceFound = await this.serviceInterface.hideService(serviceId);
      return {
        status: 200,
        data: serviceFound,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }
}

export default ServiceUsecase;
