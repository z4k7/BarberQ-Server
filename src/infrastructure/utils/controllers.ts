import AdminRepository from "../repository/adminRepository";
import UserRepository from "../repository/userRepository";
import VendorRepository from "../repository/vendorRepository";
import ServiceRepository from "../repository/serviceRepository";
import SalonRepository from "../repository/salonRepository";

import Encrypt from "./hashPassword";
import GenerateOtp from "./generateOtp";
import SendOtp from "./nodemailer";
import JwtToken from "./jwtToken";
import Cloudinary from "./cloudinary";

import AdminUsecase from "../../usecase/adminUsecase";
import VendorUsecase from "../../usecase/vendorUsecase";
import UserUsecase from "../../usecase/userUsecase";
import ServiceUsecase from "../../usecase/serviceUsecase";
import SalonUsecase from "../../usecase/salonUsecase";

import AdminController from "../../adapter/adminController";
import VendorController from "../../adapter/vendorController";
import UserController from "../../adapter/userController";
import ServiceController from "../../adapter/serviceController";
import SalonController from "../../adapter/salonController";

const adminRepository = new AdminRepository();
const vendorRepository = new VendorRepository();
const userRepository = new UserRepository();
const serviceRepository = new ServiceRepository();
const salonRepository = new SalonRepository();

const encrypt = new Encrypt();
const genOtp = new GenerateOtp();
const sendOtp = new SendOtp();
const jwtToken = new JwtToken();
const cloudinary = new Cloudinary();

const adminUsecase = new AdminUsecase(
  adminRepository,
  userRepository,
  vendorRepository,
  encrypt,
  jwtToken
);
const userUsecase = new UserUsecase(
  userRepository,
  encrypt,
  genOtp,
  sendOtp,
  jwtToken
);
const vendorUsecase = new VendorUsecase(
  vendorRepository,
  serviceRepository,
  encrypt,
  genOtp,
  sendOtp,
  jwtToken
);
const serviceUsecase = new ServiceUsecase(serviceRepository);
const salonUsecase = new SalonUsecase(
  salonRepository,
  serviceRepository,
  cloudinary
);

export const adminController = new AdminController(adminUsecase);
export const vendorController = new VendorController(vendorUsecase);
export const userController = new UserController(userUsecase);
export const serviceController = new ServiceController(serviceUsecase);
export const salonController = new SalonController(
  salonUsecase,
  serviceUsecase
);
