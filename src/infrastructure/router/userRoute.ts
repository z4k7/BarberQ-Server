import UserRepository from '../repository/userRepository'
import Encrypt from '../utils/hashPassword'
import GenerateOtp from '../utils/generateOtp'
import SendOtp from '../utils/sendMail'
import JwtCreate from '../utils/jwtCreate'
import UserUsecase from '../../usecase/userUsecase'
import UserController from '../../adapter/userController'

import express from 'express'
const route = express.Router()

const repository = new UserRepository()
const encrypt = new Encrypt()
const genOtp = new GenerateOtp()
const sendOtp = new SendOtp()
const jwtCreate = new JwtCreate()

const useCase = new UserUsecase(repository, encrypt, genOtp, sendOtp, jwtCreate)

const controller = new UserController(useCase)

route.post('/register', (req, res) => controller.userSignUp(req, res));
route.post('/verifyOtp', (req, res) => controller.userOtpVerification(req, res));
route.post('/login', (req, res) => controller.userLogin(req, res));


export default route