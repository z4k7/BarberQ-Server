import IAdmin from "../domain/admin";
import AdminInterface from "./interface/adminInterface";
import UserInterface from "./interface/userInterface";
import Encrypt from "../infrastructure/utils/hashPassword";
import JwtCreate from "../infrastructure/utils/jwtCreate";


class AdminUsecase{
    constructor(
        private adminInterface: AdminInterface,
        private userInterface : UserInterface,
        private Encrypt: Encrypt,
        private jwtCreate : JwtCreate
    ) { }
    
    async adminLogin(admin: IAdmin) {
        try {
            console.log(`admin:`, admin);
            const adminFound = await this.adminInterface.findByEmail(admin.email)
            console.log(`adminFound:`,adminFound);
            if (!adminFound) {
                return {
                    status: 401,
                    data: {
                        success: false,
                        message:'Admin not Found!'
                    }
                }
            }

            const passwordMatch = await this.Encrypt.compare(admin.password, adminFound.password);

            if (!passwordMatch) {
                return {
                    status: 401,
                    data: {
                        success: false,
                        message:'Authentication Failed'
                    }
                }
            }

            const token = await this.jwtCreate.createJwt(adminFound._id, 'admin')
            
            return {
                status: 200,
                data: {
                    success: true,
                    message: "Authentication Successful",
                    adminData: adminFound,
                    token:token
                }
            }

        } catch (error) {
            return {
                status: 400,
                data:error
            }
        }
    }



    async getUsers() {
        try {
            const usersList = await this.userInterface.findAllUsers()
            return {
                status :200,
                data: {
                    success: true,
                    message: "Users List Found",
                    adminData: usersList
                }
            }
        } catch (error) {
            return{
                status: 400,
                data:error
            }
        }
    }

    async blockUnblockUser(userId:string) {
        try {
            console.log(`inside Usecase`);
            const user = await this.userInterface.blockUnblockUser(userId)
            return {
                status: 200,
                data: {
                    success: true,
                    message: "User Found",
                    adminData: user
                }
            }
        } catch (error) { 
            return{
                status: 400,
                data:error
            }
        }
    }



}

export default AdminUsecase