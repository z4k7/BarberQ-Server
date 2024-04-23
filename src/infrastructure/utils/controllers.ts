import AdminRepository from "../repository/adminRepository";
import UserRepository from "../repository/userRepository";
import VendorRepository from "../repository/vendorRepository";
import ServiceRepository from "../repository/serviceRepository";
import SalonRepository from "../repository/salonRepository";
import BookingRepository from "../repository/bookingRepository";
import ConversationRepository from "../repository/conversationRepository";
import MessageRepository from "../repository/messageRepository";
import ReviewRepository from "../repository/reviewRepository";

import Encrypt from "./hashPassword";
import GenerateOtp from "./generateOtp";
import SendOtp from "./nodemailer";
import JwtToken from "./jwtToken";
import Cloudinary from "./cloudinary";
import NotificationService from "./notificationService";

import AdminUsecase from "../../usecase/adminUsecase";
import VendorUsecase from "../../usecase/vendorUsecase";
import UserUsecase from "../../usecase/userUsecase";
import ServiceUsecase from "../../usecase/serviceUsecase";
import SalonUsecase from "../../usecase/salonUsecase";
import BookingUsecase from "../../usecase/bookingUsecase";
import ChatUsecase from "../../usecase/chatUsecase";
import ReviewUsecase from "../../usecase/reviewUsecase";

import AdminController from "../../adapter/adminController";
import VendorController from "../../adapter/vendorController";
import UserController from "../../adapter/userController";
import ServiceController from "../../adapter/serviceController";
import SalonController from "../../adapter/salonController";
import BookingController from "../../adapter/bookingController";
import ChatController from "../../adapter/chatController";
import ReviewController from "../../adapter/reviewController";

const adminRepository = new AdminRepository();
const vendorRepository = new VendorRepository();
const userRepository = new UserRepository();
const serviceRepository = new ServiceRepository();
const salonRepository = new SalonRepository();
const bookingRepository = new BookingRepository();
const messageRepository = new MessageRepository();
const conversationRepository = new ConversationRepository();
const reviewRepository = new ReviewRepository();

const encrypt = new Encrypt();
const genOtp = new GenerateOtp();
const sendOtp = new SendOtp();
const jwtToken = new JwtToken();
const cloudinary = new Cloudinary();
const notificationService = new NotificationService();

const adminUsecase = new AdminUsecase(
  adminRepository,
  userRepository,
  vendorRepository,
  salonRepository,
  bookingRepository,
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
  encrypt,
  genOtp,
  sendOtp,
  jwtToken
);
const serviceUsecase = new ServiceUsecase(serviceRepository);
const salonUsecase = new SalonUsecase(
  salonRepository,
  bookingRepository,
  cloudinary
);

const bookingUsecase = new BookingUsecase(
  bookingRepository,
  salonRepository,
  userRepository,
  notificationService
);

const chatUsecase = new ChatUsecase(conversationRepository, messageRepository);

const reviewUsecase = new ReviewUsecase(reviewRepository);

export const adminController = new AdminController(adminUsecase);
export const vendorController = new VendorController(vendorUsecase);
export const userController = new UserController(userUsecase, chatUsecase);
export const serviceController = new ServiceController(serviceUsecase);
export const salonController = new SalonController(
  salonUsecase,
  serviceUsecase
);
export const bookingController = new BookingController(bookingUsecase);
export const chatController = new ChatController(chatUsecase);
export const reviewController = new ReviewController(reviewUsecase);
