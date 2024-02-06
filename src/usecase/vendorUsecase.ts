import IVendor from "../domain/vendor";
import Encrypt from "../infrastructure/utils/hashPassword";
import GenerateOtp from "../infrastructure/utils/generateOtp";
import SendOtp from "../infrastructure/utils/sendMail";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import VendorInterface from "./interface/vendorInterface";

class VendorUsecase {
    constructor(
        private vendorInterface: VendorInterface,
        private Encrypt: Encrypt,
        private generateOtp : GenerateOtp,
        private sendOtp: SendOtp,
        private jwtCreate:JwtCreate
    ) { }
    

    async saveVendor(vendor: IVendor) {
        try {
          console.log("inside save vendor");
      
          const hashedPassword = await this.Encrypt.createHash(vendor.password);
          vendor.password = hashedPassword;
      
          const vendorData = await this.vendorInterface.save(vendor);
      
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
              status: 200,
              data: {
                success: false,
                message: "Vendor Not Found",
              },
            };
          }
      
          const passwordMatch = await this.Encrypt.compare(vendor.password, vendorFound.password);
      
          if (!passwordMatch) {
            return {
              status: 200,
              data: {
                success: false,
                message: "Authentication Failed",
              },
            };
          }
      
          const token = this.jwtCreate.createJwt(vendorFound._id, "vendor");
      
          return {
            status: 200,
            data: {
              success: true,
              message: "Authentication Successful",
              vendorData: vendorFound,
            },
            token: token,
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
          const verify = await this.sendOtp.sendVerificationMail(email, otp);
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

export default VendorUsecase