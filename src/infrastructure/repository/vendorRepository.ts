import IVendor from "../../domain/vendor";
import VendorModel from "../database/vendorModel";
import VendorInterface from "../../usecase/interface/vendorInterface";

class VendorRepository implements VendorInterface {

  async saveVendor(vendor: IVendor): Promise<any> {
    const Vendor = new VendorModel(vendor);
    const savedVendor = await Vendor.save()
      .then((res) => {
        console.log(`success`, res);
        return res;
      })
      .catch((error) => {
        console.log(error);
      });
    return savedVendor;
  }

  async findByEmail(email: string): Promise<any> {
    const vendorFound = await VendorModel.findOne({ email });
    console.log("vendorFound", vendorFound);
    return vendorFound;
  }

  async findVendorById(vendor: string): Promise<any> {
    const vendorFound = await VendorModel.findById(vendor);
    return vendorFound;
  }

  async findAllVendors(): Promise<any> {
    const vendorsList = await VendorModel.find();
    return vendorsList;
  }
  

   async findAllVendorsWithCount(page: number, limit: number, searchQuery: string): Promise<any> {
     try {
       const regex = new RegExp(searchQuery, 'i')
       
       const pipeline = [
         {
           $match: {
             $or: [
             {name:{$regex:regex}},
             {email:{$regex:regex}},
             {mobile:{$regex:regex}},
           ]
           }
         },
         {
           $facet: {
             totalCount: [{ $count: 'count' }],
             paginatedResults: [
               { $skip: (page - 1) * limit },
               { $limit: limit },
               { $project: { password: 0 } },
               
             ]
           }
         }
       ]
       const [result] = await VendorModel.aggregate(pipeline).exec()

       const vendors = result.paginatedResults
       const vendorCount = (result.totalCount.length > 0) ? result.totalCount[0].count : 0
       return {
         vendors,
         vendorCount
       }
        
      } catch (error) {
        console.log(error);
      throw Error('Error while getting vendor data')
      }
  }

  async blockUnblockVendor(vendorId: string): Promise<any> {
    const vendorFound = await VendorModel.findById(vendorId);
    console.log(`id`,vendorId);
    console.log(`inside repository`, vendorFound);
    if (vendorFound) {
      vendorFound.isBlocked = !vendorFound.isBlocked;
      return vendorFound.save();
    } else {
      throw Error("Vendor not Found");
    }
  }
}

export default VendorRepository;
