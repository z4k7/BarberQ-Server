import VendorRepository from "../repository/vendorRepository";
import Encrypt from "../utils/hashPassword";
import GenerateOtp from "../utils/generateOtp";
import SendOtp from "../utils/sendMail";
import JwtCreate from "../utils/jwtCreate";
import VendorUsecase from "../../usecase/vendorUsecase";
import VendorController from "../../adapter/vendorController";

import express from 'express';
const route = express.Router();

const repository = new VendorRepository();
const encrypt = new Encrypt();
const genOtp = new GenerateOtp();
const sendOtp = new SendOtp();
const jwtCreate = new JwtCreate();

const useCase = new VendorUsecase(repository, encrypt, genOtp, sendOtp, jwtCreate);

const controller = new VendorController(useCase);

route.post('/register', (req, res) => controller.signUp(req, res));
route.post('/verifyOtp', (req, res) => controller.otpVerification(req, res));
route.post('/login', (req, res) => controller.login(req, res));


export default route