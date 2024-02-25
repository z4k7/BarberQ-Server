import IAdmin from "../domain/admin";
import AdminInterface from "./interface/adminInterface";
import UserInterface from "./interface/userInterface";
import VendorInterface from "./interface/vendorInterface";
import Encrypt from "../infrastructure/utils/hashPassword";
import JwtToken from "../infrastructure/utils/jwtToken";

class AdminUsecase {
  constructor(
    private adminInterface: AdminInterface,
    private userInterface: UserInterface,
    private vendorInterface: VendorInterface,
    private Encrypt: Encrypt,
    private jwtToken: JwtToken
  ) {}

  async adminLogin(admin: IAdmin) {
    try {
      console.log(`admin:`, admin);
      const adminFound = await this.adminInterface.findByEmail(admin.email);
      console.log(`adminFound:`, adminFound);
      if (!adminFound) {
        return {
          status: 401,
          data: {
            message: "Admin not Found!",
            
          }
        };
      }

      const passwordMatch = await this.Encrypt.compare(
        admin.password,
        adminFound.password
      );

      if (!passwordMatch) {
        return {
          status: 401,
          data: {
            message: "Authentication Failed",
            
          }
        };
      }

      const accessToken = this.jwtToken.generateAccessToken(adminFound._id);
      const refreshToken = this.jwtToken.generateRefreshToken(adminFound._id);

      return {
        status: 200,
        data: {
          adminData: adminFound,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async getUsers() {
    try {
      const usersList = await this.userInterface.findAllUsers();
      return {
        status: 200,
        data: {
          adminData: usersList,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async getVendors() {
    try {
      const vendorsList = await this.vendorInterface.findAllVendors();
      return {
        status: 200,
        data: {
          adminData: vendorsList,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async blockUnblockUser(userId: string) {
    try {
      console.log(`inside Usecase`);
      const user = await this.userInterface.blockUnblockUser(userId);
      return {
        status: 200,
        data: {
          adminData: user,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async blockUnblockVendor(vendorId: string) {
    try {
      const vendor = await this.vendorInterface.blockUnblockVendor(vendorId);
      return {
        status: 200,
        data: {
          adminData: vendor,
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }
}

export default AdminUsecase;
