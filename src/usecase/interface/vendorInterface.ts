import IVendor from "../../domain/vendor";

interface VendorInterface{
    saveVendor(vendor: IVendor): Promise<any>
    findByEmail(email: string): Promise<any>
    findVendorById(vendor: string): Promise<any>
    findAllVendors(): Promise<any>
    blockUnblockVendor(vendorId:string):Promise<any>
}

export default VendorInterface