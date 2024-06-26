import SalonModel from "../database/salonModel";
import SalonInterface from "../../usecase/interface/salonInterface";
import ISalon from "../../domain/salon";
import mongoose from "mongoose";
import IService from "../../domain/services";

class SalonRepository implements SalonInterface {
  async addSalon(salonData: ISalon): Promise<any> {
    const salon = new SalonModel(salonData);
    const salonRequest = await salon.save();
    return salonRequest;
  }

  async activeSalons(): Promise<ISalon[]> {
    const allSalons = await SalonModel.find()
      .populate({
        path: "vendorId",
        model: "Vendor",
        match: { isBlocked: false },
      })
      .exec();
    const salonsWithUnblockedVendors = allSalons.filter(
      (salon) => salon.vendorId !== null
    );
    return salonsWithUnblockedVendors;
  }

  async findActiveSalonCount(): Promise<number> {
    const activeSalonCount = await SalonModel.countDocuments({
      status: "active",
    });
    console.log(`Salon Count`, activeSalonCount);
    return activeSalonCount;
  }

  async findAllSalons(): Promise<any> {
    const allSalons = await SalonModel.find();
    return allSalons;
  }
  async findSalonById(salonId: string): Promise<any> {
    const salonDetails = await SalonModel.findById(salonId);
    return salonDetails;
  }

  async findActiveSalons(
    _page_: number,
    _limit_: number,
    _searchQuery_: string
  ): Promise<any> {
    try {
      const regex = new RegExp(_searchQuery_, "i");
      const matchStage: any = {
        $or: [
          { salonName: { $regex: regex } },
          { locality: { $regex: regex } },
          { district: { $regex: regex } },
        ],
        status: "active",
      };

      const lookupStage = {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      };

      const unblockedVendorMatchStage = {
        $match: {
          "vendor.isBlocked": { $ne: true },
        },
      };

      const sortStage: any = { $sort: { isPremium: -1 } };

      const pipeline = [
        sortStage,
        lookupStage,
        unblockedVendorMatchStage,
        { $match: matchStage },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            paginatedResults: [
              { $skip: (_page_ - 1) * _limit_ },
              { $limit: _limit_ },
              { $project: { password: 0 } },
            ],
          },
        },
      ];

      const result: any[] = await SalonModel.aggregate(pipeline).exec();
      const salons = result[0].paginatedResults;
      const salonCount =
        result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;

      return {
        salons,
        salonCount,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error while getting active salon data");
    }
  }

  async findAllSalonsWithCount(
    page: number,
    limit: number,
    vendorId: string,
    searchQuery: string
  ): Promise<any> {
    try {
      const regex = new RegExp(searchQuery, "i");
      const matchStage: any = {
        $or: [
          { salonName: { $regex: regex } },
          { locality: { $regex: regex } },
          { district: { $regex: regex } },
        ],
      };

      if (vendorId !== "") {
        matchStage["vendorId"] = new mongoose.Types.ObjectId(vendorId);
      }

      const lookupStage = {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      };

      const unblockedVendorMatchStage = {
        $match: {
          "vendor.isBlocked": { $ne: true },
        },
      };

      const paginationStage = [
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { password: 0 } },
      ];

      const pipeline = [
        lookupStage,
        unblockedVendorMatchStage,
        { $match: matchStage },

        {
          $facet: {
            totalCount: [{ $count: "count" }],
            paginatedResults: paginationStage,
          },
        },
      ];

      const [result] = await SalonModel.aggregate(pipeline)
        .sort({ isPremium: -1 })
        .exec();
      const salons = result.paginatedResults;
      const salonCount =
        result.totalCount.length > 0 ? result.totalCount[0].count : 0;

      return { salons, salonCount };
    } catch (error) {
      console.log(error);
      throw new Error("Error while getting salon data");
    }
  }

  async updateSalonServices(
    salonId: string,
    services: IService[]
  ): Promise<any> {
    try {
      const salon = await SalonModel.findById(salonId);
      if (!salon) {
        throw new Error("Salon not found");
      }
      const newServices = services.filter((service) => {
        return !salon.services.some(
          (existingService) => existingService._id === service._id
        );
      });

      if (newServices.length > 0) {
        const updatedSalon = await SalonModel.findByIdAndUpdate(
          salonId,
          { $addToSet: { services: { $each: newServices } } },
          { new: true }
        );
        return updatedSalon;
      } else {
        return salon;
      }
    } catch (error) {
      console.error("Error updating salon services in repository:", error);
      throw new Error("Failed to update salon services");
    }
  }

  async editSalonServices(
    salonId: string,
    servicesToEdit: IService[]
  ): Promise<any> {
    try {
      const salon = await SalonModel.findById(salonId);
      if (!salon) {
        throw new Error("Salon not found");
      }

      for (const serviceToEdit of servicesToEdit) {
        const serviceIndex = salon.services.findIndex(
          (service) => service._id.toString() === serviceToEdit._id
        );

        if (serviceIndex !== -1) {
          if (serviceToEdit.price !== undefined) {
            salon.services[serviceIndex].price = serviceToEdit.price;
          }
          if (serviceToEdit.duration !== undefined) {
            salon.services[serviceIndex].duration = serviceToEdit.duration;
          }
        } else {
          throw new Error(
            `Service with ID ${serviceToEdit._id} not found in salon`
          );
        }
      }
      const editedSalon = new SalonModel(salon);
      const updatedSalon = await editedSalon.save();

      return updatedSalon;
    } catch (error) {
      console.error("Error editing salon services in repository", error);
      throw new Error("Failed to edit salon services");
    }
  }

  async deleteSalonServices(
    salonId: string,
    serviceIds: string[]
  ): Promise<any> {
    try {
      const salon = await SalonModel.findById(salonId);

      if (!salon) {
        throw new Error("Salon not found");
      }

      const updatedSalon = await SalonModel.findByIdAndUpdate(
        salonId,
        { $pull: { services: { _id: { $in: serviceIds } } } },
        { new: true }
      );

      if (!updatedSalon) {
        throw new Error("Failed to update salon");
      }

      return updatedSalon;
    } catch (error) {
      console.error("Error deleting salon services in repository", error);
      throw new Error("Failed to delete salon services");
    }
  }

  async updateSalon(salonId: string, update: any): Promise<any> {
    try {
      const salon = await SalonModel.findById(salonId);
      if (!salon) {
        throw new Error("Salon not found");
      }
      salon.salonName = update.salonName || salon.salonName;
      salon.contactNumber = update.contactNumber || salon.contactNumber;
      salon.chairCount = update.chairCount || salon.chairCount;
      salon.facilities = update.facilities || salon.facilities;
      salon.openingTime = update.openingTime || salon.openingTime;
      salon.closingTime = update.closingTime || salon.closingTime;

      const updatedSalon = await salon.save();
      return updatedSalon;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error("Invalid salon ID");
      }
      throw error;
    }
  }

  async updateSalonStatus(salonId: string, status: string): Promise<any> {
    try {
      const salon = await SalonModel.findById(salonId);
      if (!salon) {
        throw new Error("Salon not found");
      }
      salon.status = status;

      const updatedSalon = await salon.save();

      return updatedSalon;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error("Invalid salon ID");
      }
      throw error;
    }
  }
  async upgradeToPremium(salonId: string): Promise<any> {
    try {
      const salon = await SalonModel.findById(salonId);
      if (!salon) {
        throw new Error("Salon not found");
      }
      salon.isPremium = 1;

      const updatedSalon = await salon.save();

      return updatedSalon;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error("Invalid salon ID");
      }
      throw error;
    }
  }

  async findActiveSalonsByVendorId(vendorId: string): Promise<number> {
    try {
      const ObjectId = new mongoose.Types.ObjectId(vendorId);
      const count = await SalonModel.countDocuments({
        vendorId: ObjectId,
        status: "active",
      });
      return count;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error("Invalid salon ID");
      }
      throw error;
    }
  }

  async findNearbySalons(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<any> {
    try {
      const nearbySalons = await SalonModel.find({
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 6378.1],
          },
        },
      });
      console.log(`Nearby Salons`, nearbySalons);

      return nearbySalons;
    } catch (error) {
      return { status: 400, data: (error as Error).message };
    }
  }
}

export default SalonRepository;
