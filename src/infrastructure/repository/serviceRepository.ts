import IService from "../../domain/services";
import ServiceModel from "../database/serviceModel";
import ServiceInterface from "../../usecase/interface/serviceInterface";

class ServiceRepository implements ServiceInterface {



  async save(service: IService): Promise<any> {
    const Service = new ServiceModel(service);
    const savedService = await Service.save()
      .then((res) => {
        console.log(`success`, res);
        return res;
      })
      .catch((error) => {
        console.log(error);
      });
    return savedService;
  }

     async findServiceByName(serviceName: string): Promise<any> {
       const serviceFound = await ServiceModel.findOne({ serviceName })
       return serviceFound
    }
    
    
  async findServiceById(serviceId: string): Promise<any> {
    const serviceFound = await ServiceModel.findById(serviceId);
    return serviceFound;
  }

  async findAllServices(): Promise<any> {
    const allServices = await ServiceModel.find();
    return allServices;
  }

  async hideService(serviceId: string): Promise<any> {
    console.log(`Inside Repository`);
    const serviceFound = await ServiceModel.findById(serviceId);
    if (serviceFound) {
      serviceFound.isVisible = !serviceFound.isVisible;
      return serviceFound.save();
    } else {
      throw Error("Service not found");
    }
    }
    

     async findByIdAndUpdate(service: IService): Promise<any> {
         const serviceFound = await ServiceModel.findByIdAndUpdate({ _id: service._id }, {
             $set:service
         }, { new: true })  
         console.log(`service:`, serviceFound);
    return serviceFound     
    }
}

export default ServiceRepository;
