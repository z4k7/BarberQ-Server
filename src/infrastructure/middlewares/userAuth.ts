import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import UserRepository from "../repository/userRepository";

const userRepository = new UserRepository()

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization

        if (token) {
            const decoded = verify(token.slice(7), process.env.JWT_KEY as string) as JwtPayload
            const userData = await userRepository.findUserById(decoded.id)
            if (userData !== null) {
                if(userData.isBlocked){
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