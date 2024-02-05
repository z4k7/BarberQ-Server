import express from 'express'
const route = express.Router()


import UserController from '../../adapter/userController'
import UserRepository from '../repository/userRepository'
import UserUsecase from '../../usecase/userUsecase'
import SendOtp from '../utils/sendMail'
import GenerateOtp from '../utils/generateOtp'
import Encrypt from '../utils/hashPassword'
import JwtCreate from '../utils/jwtCreate'


const sendOtp = new SendOtp()
const encrypt = new Encrypt()
const jwtCreate = new JwtCreate()
const genOtp = new GenerateOtp()

const repository = new UserRepository()
const useCase = new UserUsecase(repository,encrypt,  genOtp, sendOtp,  jwtCreate)
const controller = new UserController(useCase)

route.post('/api/users/signup', (req, res) => controller.signUp(req, res))
route.post('/api/users/verifyOtp',(req,res)=> controller.otpVerification(req,res))
route.post('/api/users/login',(req,res)=> controller.login(req,res))


export default route