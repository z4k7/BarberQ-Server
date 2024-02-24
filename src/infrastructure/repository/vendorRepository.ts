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
