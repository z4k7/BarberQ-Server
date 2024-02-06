import IVendor from "../../domain/vendor";

interface VendorInterface{
    save(vendor: IVendor): Promise<any>
    findByEmail(email: string): Promise<any>
    findVendorById(vendor: string): Promise<any>
}

export default VendorInterface