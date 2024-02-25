import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import VendorRepository from "../repository/vendorRepository";

const vendorRepository = new VendorRepository()

export const vendorAuth = async (req: Request, res: Response, next: NextFunction) => {
    
    
    try {
        const token = req.headers.authorization

        if (token) {
            const decoded = verify(token.slice(7), process.env.JWT_KEY as string) as JwtPayload
            const vendorData = await vendorRepository.findVendorById(decoded.id)
            if (vendorData !== null) {
                if(vendorData.isBlocked){
                    res.status(403).json({data:{message:'You are blocked'}})
                } else {
                    next()
                }
            } else {
                res.status(401).json({data:{message:'Not authorized, invalid token'}})
            }
        } else {
            res.status(401).json({data:{message:'Token not available'}})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({data:{message:'Not authorized, invalid token'}})
    }
}