import SalonModel from "../database/salonModel";
import SalonInterface from "../../usecase/interface/salonInterface";
import ISalon from "../../domain/salon";

class SalonRepository implements SalonInterface {
  async addSalon(salonData: ISalon): Promise<any> {
    console.log(`Inside salon Repository addSalon`);
    const salon = new SalonModel(salonData);
    const salonRequest = await salon.save();
    return salonRequest;
  }

  async findAllSalons(): Promise<any> {
    const allSalons = await SalonModel.find();
    return allSalons;
  }

  async findAllSalonsWithCount(
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
              { salonName: { $regex: regex } },
              { locality: { $regex: regex } },
              { district: { $regex: regex } },
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

      const [result] = await SalonModel.aggregate(pipeline).exec();

      const salons = result.paginatedResults;
      const salonCount =
        result.totalCount.length > 0 ? result.totalCount[0].count : 0;

      return {
        salons,
        salonCount,
      };
    } catch (error) {
      console.log(error);
      throw Error("Error while getting salon data");
    }
  }
}

export default SalonRepository;
