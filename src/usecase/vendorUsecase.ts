import IVendor from "../domain/vendor";
import Encrypt from "../infrastructure/utils/hashPassword";
import GenerateOtp from "../infrastructure/utils/generateOtp";
import SendOtp from "../infrastructure/utils/nodemailer";
import VendorInterface from "./interface/vendorInterface";
import Ijwt from "./interface/jwtInterface";

class VendorUsecase {
  constructor(
    private vendorInterface: VendorInterface,
    private Encrypt: Encrypt,
    private generateOtp: GenerateOtp,
    private sendOtp: SendOtp,
    private jwt: Ijwt,
  ) {}

  async saveVendor(vendor: IVendor) {
    try {
      console.log("inside save vendor");

      const hashedPassword = await this.Encrypt.createHash(vendor.password);
      vendor.password = hashedPassword;

      const vendorData = await this.vendorInterface.saveVendor(vendor);
      return {
        status: 200,
        data: vendorData || { message: "Internal error" },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async vendorLogin(vendor: IVendor) {
    try {
      console.log(`inside usecase`);

      const vendorFound = await this.vendorInterface.findByEmail(vendor.email);

      if (!vendorFound) {
        return {
          status: 401,
          data: {
            message: "Vendor Not Found",
          },
        };
      }
      if (vendorFound.isBlocked) {
        return {
          status: 401,
          data: { message: "Sorry! You are blocked by admin." },
        };
      }

      const passwordMatch = await this.Encrypt.compare(
        vendor.password,
        vendorFound.password
      );

      if (!passwordMatch) {
        return {
          status: 401,
          data: {
            message: "Authentication Failed",
          },
        };
      }

      const accessToken = this.jwt.generateAccessToken(vendorFound._id);
      const refreshToken = this.jwt.generateRefreshToken(vendorFound._id);

      return {
        status: 200,
        data: {
          vendorData: vendorFound,
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

  async isEmailExist(email: string) {
    try {
      const vendorFound = await this.vendorInterface.findByEmail(email);
      return {
        status: 200,
        data: vendorFound,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async verifyMail(email: string) {
    try {
      const otp = await this.generateOtp.genOtp(6);
      console.log(otp);
      const verify = this.sendOtp.sendVerificationMail(email, otp);
      return {
        status: 200,
        otp,
        data: verify,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }


 



}

export default VendorUsecase;
