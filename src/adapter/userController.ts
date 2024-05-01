import { Request, Response } from "express";
import UserUsecase from "../usecase/userUsecase";
import IUser from "../domain/user";
import ChatUsecase from "../usecase/chatUsecase";

class UserController {
  constructor(
    private userUsecase: UserUsecase,
    private chatUsecase: ChatUsecase
  ) {}

  async userSignUp(req: Request, res: Response) {
    try {
      const newUser = req.body;
      const userExistence = await this.userUsecase.isEmailExist(newUser.email);

      if (userExistence.data) {
        return res
          .status(401)
          .json({ data: { message: "Email already in use" } });
      }

      const verificationResponse = await this.userUsecase.verifyMail(
        newUser.email
      );

      req.app.locals.user = newUser;
      req.app.locals.otp = verificationResponse.otp;

      return res.status(201).json({ data: { message: "OTP Sent" } });
    } catch (error) {
      console.error("Error in signUp:", error);
      return res.status(500).json({
        data: {
          message: "Internal Server Error",
          error: (error as Error).message,
        },
      });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const user = req.app.locals.user;
      const emailResponse = await this.userUsecase.verifyMail(user.email);

      req.app.locals.otp = emailResponse.otp;

      setTimeout(() => {
        req.app.locals.otp = undefined;
        console.log(`Otp Expired in resend otp`);
      }, 1000 * 30);

      return res.status(200).json({ response: emailResponse });
    } catch (error) {
      console.log(`Error in resendOtp:`, error);
      return res.status(500).json({
        data: {
          message: "Internal Server Error",
          error: (error as Error).message,
        },
      });
    }
  }

  async userLogin(req: Request, res: Response) {
    try {
      const user = req.body;
      const userData = await this.userUsecase.userLogin(user);
      return res.status(userData.status).json(userData);
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({
        data: {
          status: 500,
          message: "Internal Server Error",
          error: (error as Error).message,
        },
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
        return res.status(401).json({ data: { message: "Invalid OTP" } });
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
