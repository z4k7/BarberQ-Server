import { Request, Response } from "express";
import VendorUsecase from "../usecase/vendorUsecase";
import IVendor from "../domain/vendor";

class VendorController {
  constructor(private vendorUsecase: VendorUsecase) {}

  async vendorSignUp(req: Request, res: Response) {
    try {
      const newVendor = req.body;
      const vendorExistence = await this.vendorUsecase.isEmailExist(
        newVendor.email
      );

      if (vendorExistence.data) {
        return res
          .status(401)
          .json({ data: { message: "Email already in use" } });
      }

      const verificationResponse = await this.vendorUsecase.verifyMail(
        newVendor.email
      );

      req.app.locals.vendor = newVendor;
      req.app.locals.otp = verificationResponse.otp;

      setTimeout(() => {
        req.app.locals.otp = undefined;
        console.log(`Otp Expired`);
      }, 1000 * 30);

      return res.status(201).json({ response: verificationResponse });
    } catch (error) {
      console.log(`Error in signup:`, error);
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
      const vendor = req.app.locals.vendor;
      const emailResponse = await this.vendorUsecase.verifyMail(vendor.email);

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

  async vendorLogin(req: Request, res: Response) {
    try {
      const vendor = req.body;
      const vendorData = await this.vendorUsecase.vendorLogin(vendor);
      return res.status(vendorData.status).json(vendorData);
    } catch (error) {
      console.log(`Error in login`, error);
      return res.status(500).json({
        data: {
          status: 500,
          success: false,
          message: "Internal Server Error",
          error: (error as Error).message,
        },
      });
    }
  }

  async vendorOtpVerification(req: Request, res: Response) {
    try {
      const vendorToSave: IVendor = req.app.locals.vendor as IVendor;
      const generatedOtp = req.app.locals.otp;
      const enteredOtp = req.body.otp;

      if (enteredOtp === generatedOtp) {
        const savedVendor = await this.vendorUsecase.saveVendor(vendorToSave);
        return res.status(201).json({ vendorSave: savedVendor });
      } else {
        return res.status(401).json({ data: { message: "Invalid OTP" } });
      }
    } catch (error) {
      console.log(`Error in OtpVerification:`, error);
      return res.status(500).json({
        data: {
          message: "Internal server error",
          error: (error as Error).message,
        },
      });
    }
  }
}

export default VendorController;
