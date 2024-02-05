import { Request, Response } from 'express'
import UserUsecase from '../usecase/userUsecase'
import IUser from '../domain/user'
import jwt, {JwtPayload} from 'jsonwebtoken'


class UserController{
    constructor(private userUsecase: UserUsecase) { }
    
    async signUp(req: Request, res: Response) {
        try {
          const user = req.body;
          console.log('User from req.body inside user controller', user);
    
          const userFound = await this.userUsecase.isEmailExist(user.email);
    
          if (user.isGoogle) {
            if (userFound.data) {
              return res.status(200).json({ data: false, message: 'Email Id already in use' });
            }
    
            const userSave = await this.userUsecase.saveUser(user);
            return res.status(200).json({ data: true, userSave });
          } else {
            if (userFound.data) {
              return res.status(200).json({ data: false, message: 'Email Id already in use' });
            }
    
            const userDetails = await this.userUsecase.verifyMail(user.email);
            req.app.locals.user = user;
            req.app.locals.otp = userDetails.otp;
    
            return res.status(200).json({ userDetails });
          }
        } catch (error) {
          console.error('Error in signUp:', error);
          res.status(500).json({ data: false, message: 'Internal Server Error' });
        }
      }

    
    async otpVerification(req: Request, res: Response) {
        try {
            const user: IUser = req.app.locals.user as IUser
            const generatedOtp = req.app.locals.otp
            const otp = req.body.otp

            if (otp == generatedOtp) {
                const userSave = await this.userUsecase.saveUser(user)
                res.status(200).json({userSave})
            }
            else {
                res.status(200).json({false:false,
                message:"Invalid Otp"})
            }

        } catch (error) {
            
        }
    }


    async login(req: Request, res: Response) {
        try {
            console.log('login controller')
            const user = req.body
            const loginStatus = await this.userUsecase.userLogin(user)
            if(loginStatus){
                res.status(loginStatus.status).json(loginStatus)
            }
        } catch (error) {
            console.log(error)
        }
    }


}

export default UserController