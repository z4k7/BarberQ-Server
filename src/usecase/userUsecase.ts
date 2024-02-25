import IUser from "../domain/user";
import Encrypt from "../infrastructure/utils/hashPassword";
import GenerateOtp from "../infrastructure/utils/generateOtp";
import SendOtp from "../infrastructure/utils/nodemailer";
import UserInterface from "./interface/userInterface";
import Ijwt from "./interface/jwtInterface";

class UserUsecase {
  constructor(
    private userInterface: UserInterface,
    private Encrypt: Encrypt,
    private generateOtp: GenerateOtp,
    private sendOtp: SendOtp,
    private jwt: Ijwt
  ) {}

  // *Saving user to db
  async saveUser(user: IUser) {
    try {
      console.log("inside save user");

      const hashedPassword = await this.Encrypt.createHash(user.password);
      user.password = hashedPassword;

      const userData = await this.userInterface.saveUser(user);

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
            message: "User Not Found",
          },
        };
      }
      if (userFound.isBlocked) { 
        return {
          status: 401,
          data: { message: "Sorry! You are blocked by admin." },
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
            message: "Authentication Failed",
          },
        };
      }

      const accessToken = this.jwt.generateAccessToken(userFound._id);
      const refreshToken = this.jwt.generateRefreshToken(userFound._id);
      return {
        status: 200,
        data: {
          userData: userFound,
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

export default UserUsecase;
