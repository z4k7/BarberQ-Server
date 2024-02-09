import { Request, Response } from "express";
import UserUsecase from "../usecase/userUsecase";
import IUser from "../domain/user";

class UserController {
  constructor(private userUsecase: UserUsecase) {}

  async userSignUp(req: Request, res: Response) {
    try {
          
      const newUser = req.body;
      const userExistence = await this.userUsecase.isEmailExist(newUser.email);
  console.log(userExistence, 'userExistence');
  
      if (userExistence.data) {
        return res.status(401).json({ data: false, message: "Email already in use" });
      }
  
      const verificationResponse = await this.userUsecase.verifyMail(newUser.email);
  
      req.app.locals.user = newUser;
      req.app.locals.otp = verificationResponse.otp;
  
      return res.status(201).json({ response: verificationResponse });
    } catch (error) {
      console.error("Error in signUp:", error);
      return res.status(500).json({
        data: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }
  

  async userLogin(req: Request, res: Response) {
    try {
      console.log("Login controller");
      const user = req.body;
      const userData = await this.userUsecase.userLogin(user);
console.log(`userData:`,userData);
      return res.status(userData.status).json(userData);
      
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async userOtpVerification(req: Request, res: Response) {
    try {
      const userToSave: IUser = req.app.locals.user as IUser;
      const generatedOtp = req.app.locals.otp;
      const enteredOtp = req.body.otp;
  
      if (enteredOtp === generatedOtp) {
        const savedUser = await this.userUsecase.saveUser(userToSave);
        return res.status(201).json({ userSave: savedUser });
      } else {
        return res.status(401).json({ success: false, message: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error in otpVerification:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }
  
}

export default UserController;
