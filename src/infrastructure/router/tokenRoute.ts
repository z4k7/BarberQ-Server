import express, { Response, Request } from "express";
import {verify, JwtPayload} from 'jsonwebtoken'
import JwtToken from "../utils/jwtToken";

const tokenRoute = express.Router()
const jwtToken = new JwtToken()

tokenRoute.get('/', (req: Request, res: Response) => {
    try {
        const refreshToken = req.headers.authorization

        if (refreshToken) {
            const decoded = verify(refreshToken.slice(7), process.env.JWT_KEY as string) as JwtPayload
            const accessToken = jwtToken.generateAccessToken(decoded.id)
            res.status(200).json({
                status:200,
                message: 'New Access Token Generated',
                accessToken
            })
        } else {
            res.status(401).json({
                status: 401,
                message: "Unauthorized",
                accessToken:''
            })
        }
    } catch (error) {
        console.log(`Error while generating access token`, error);
        res.status(500).json({
            status: 500,
            message: (error as Error).message,
            accessToken:''
        })
    }
})
export default tokenRoute

