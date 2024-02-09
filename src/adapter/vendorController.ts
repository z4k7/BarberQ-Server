import { Request, Response } from "express";
import VendorUsecase from "../usecase/vendorUsecase";
import IVendor from "../domain/vendor";

class VendorController{

    constructor(private vendorUsecase: VendorUsecase){}

    async vendorSignUp(req:Request, res: Response) {
        try {
            const newVendor = req.body;
            const vendorExistence = await this.vendorUsecase.isEmailExist(newVendor.email);

            if (vendorExistence.data) {
                return res.status(401).json({ data: false, message: "Email already in use" });
            }

            const verificationResponse = await this.vendorUsecase.verifyMail(newVendor.email);

            req.app.locals.vendor = newVendor;
            req.app.locals.otp = verificationResponse.otp;

            return res.status(201).json({ response: verificationResponse });

        } catch (error) {
            console.log(`Error in signup:`, error);
            return res.status(500).json({
                data: false,
                message: "Internal Server Error",
                error: (error as Error).message,
            })
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
                status: 500,
                success: false,
                message: "Internal Server Error",
                error: (error as Error).message,
            })
        }
    }


    async vendorOtpVerification(req: Request, res: Response) {
        try {
            const vendorToSave: IVendor = req.app.locals.vendor as IVendor;
            const generatedOtp = req.app.locals.otp;
            const enteredOtp = req.body.otp

            if (enteredOtp === generatedOtp) {
                const savedVendor = await this.vendorUsecase.saveVendor(vendorToSave)
                return res.status(201).json({vendorSave : savedVendor})
            } else {
                return res.status(401).json({success:false, message:'Invalid OTP'})
            }
            
        } catch (error) {
            console.log(`Error in OtpVerification:`, error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: (error as Error).message
            })
        }
    }


}


export default VendorController