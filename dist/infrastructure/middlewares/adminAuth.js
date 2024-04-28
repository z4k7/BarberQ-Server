"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const adminRepository_1 = __importDefault(require("../repository/adminRepository"));
const adminRepository = new adminRepository_1.default();
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (token) {
            try {
                const decoded = (0, jsonwebtoken_1.verify)(token.slice(7), process.env.JWT_KEY);
                const adminData = yield adminRepository.findAdminById(decoded.id);
                if (adminData !== null) {
                    next();
                }
                else {
                    res
                        .status(401)
                        .json({ data: { message: "Not authorized, invalid token" } });
                }
            }
            catch (verifyError) {
                console.log("JWT Verification Error:", verifyError);
                res
                    .status(500)
                    .json({ data: { message: "Not authorized, invalid token" } });
            }
        }
        else {
            res.status(401).json({ data: { message: "Token not available" } });
        }
    }
    catch (error) {
        console.log("Unexpected Error in admin auth:", error);
        res.status(500).json({ data: { message: "Internal Server Error" } });
    }
});
exports.adminAuth = adminAuth;
