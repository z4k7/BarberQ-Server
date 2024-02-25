import IAdmin from "../../domain/admin";
import AdminInterface from "../../usecase/interface/adminInterface";
import AdminModel from "../database/adminModel";

class AdminRepository implements AdminInterface{


    async findByEmail(email: string): Promise<any> {
         
        const adminFound = await AdminModel.findOne({ email })
        console.log(`from admin repository:`,adminFound);
        return adminFound
    }

    async findAdminById(admin: string): Promise<any> {
        const adminFound = await AdminModel.findById(admin);
        return adminFound;
      }
}

export default AdminRepository