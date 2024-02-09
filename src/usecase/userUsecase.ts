import IUser from "../domain/user";
import Encrypt from "../infrastructure/utils/hashPassword";
import GenerateOtp from "../infrastructure/utils/generateOtp";
import SendOtp from "../infrastructure/utils/sendMail";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import UserInterface from "./interface/userInterface";

class UserUsecase {
  constructor(
    private userInterface: UserInterface,
    private Encrypt: Encrypt,
    private generateOtp: GenerateOtp,
    private sendOtp: SendOtp,
    private jwtCreate: JwtCreate
  ) { }
  
  // *Saving user to db
  async saveUser(user: IUser) {
    try {
      console.log("inside save user");

      const hashedPassword = await this.Encrypt.createHash(user.password);
      user.password = hashedPassword;

      const userData = await this.userInterface.save(user);

      return {
        status: 200,
        data: userData || { message: "Internal error" },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async userLogin(user: IUser) {
    try {
      console.log(`inside usecase`);

      const userFound = await this.userInterface.findByEmail(user.email);
      
      if (!userFound) {
        return {
          status: 401,
          data: {
            success: false,
            message: "User Not Found",
          },
        };
      }

      const passwordMatch = await this.Encrypt.compare(
        user.password,
        userFound.password
      );

      if (!passwordMatch) {
        return {
          status: 401,
          data: {
            success: false,
            message: "Authentication Failed",
          },
        };
      }

      const token = this.jwtCreate.createJwt(userFound._id, "user");

      return {
        status: 200,
        data: {
          success: true,
          message: "Authentication Successful",
          userData: userFound,
        token: token
        },
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  // *Checking if the email is already registered in db
  async isEmailExist(email: string) {
    try {
      const userFound = await this.userInterface.findByEmail(email);
      return {
        status: 200,
        data: userFound,
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

export default UserUsecase;
