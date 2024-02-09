import AdminRepository from "../repository/adminRepository";
import UserRepository from "../repository/userRepository";
import Encrypt from "../utils/hashPassword";
import JwtCreate from "../utils/jwtCreate";
import AdminUsecase from "../../usecase/adminUsecase";
import AdminController from "../../adapter/adminController";

import express from "express";
const route = express.Router();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository()
const encrypt = new Encrypt();
const jwtCreate = new JwtCreate();

const useCase = new AdminUsecase(adminRepository,userRepository, encrypt, jwtCreate);

const controller = new AdminController(useCase);

route.post("/login", (req, res) => controller.adminLogin(req, res));
route.get("/users", (req, res) => controller.getUsers(req, res))
route.patch("/users/block/:id", (req, res) => controller.blockUnblockUser(req, res));

export default route;
