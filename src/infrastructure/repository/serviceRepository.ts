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
    const serviceFound = await ServiceModel.findOne({ serviceName });
    return serviceFound;
  }

  async findServiceById(serviceId: string): Promise<any> {
    const serviceFound = await ServiceModel.findById(serviceId);
    return serviceFound;
  }

  async findServicesByIds(serviceIds: string[]): Promise<any[]> {
    const servicesFound = await ServiceModel.find({ _id: { $in: serviceIds } });
    return servicesFound;
  }

  async findAllServices(): Promise<any> {
    const allServices = await ServiceModel.find();
    return allServices;
  }

  async findAllServicesWithCount(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<any> {
    try {
      const regex = new RegExp(searchQuery, "i");

      const pipeline = [
        {
          $match: {
            $or: [
              { serviceName: { $regex: regex } },
              { category: { $regex: regex } },
            ],
          },
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            paginatedResults: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $project: { password: 0 } },
            ],
          },
        },
      ];
      const [result] = await ServiceModel.aggregate(pipeline).exec();

      const services = result.paginatedResults;
      const serviceCount =
        result.totalCount.length > 0 ? result.totalCount[0].count : 0;

      return {
        services,
        serviceCount,
      };
    } catch (error) {}
  }

  async hideService(serviceId: string): Promise<any> {
    const serviceFound = await ServiceModel.findById(serviceId);
    if (serviceFound) {
      serviceFound.isVisible = !serviceFound.isVisible;
      return serviceFound.save();
    } else {
      throw Error("Service not found");
    }
  }

  async findByIdAndUpdate(service: IService): Promise<any> {
    const serviceFound = await ServiceModel.findByIdAndUpdate(
      { _id: service._id },
      {
        $set: service,
      },
      { new: true }
    );
    console.log(`service:`, serviceFound);
    return serviceFound;
  }
}

export default ServiceRepository;
