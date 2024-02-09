import IAdmin from "../../domain/admin";
import AdminInterface from "../../usecase/interface/adminInterface";
import AdminModel from "../database/adminModel";

class AdminRepository implements AdminInterface{


     async findByEmail(email: string): Promise<any> {
        const adminFound = await AdminModel.findOne({ email })
        return adminFound
    }
}

export default AdminRepository