"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const tokenRoute = express_1.default.Router();
const jwtToken = new jwtToken_1.default();
tokenRoute.get('/', (req, res) => {
    try {
        const refreshToken = req.headers.authorization;
        if (refreshToken) {
            const decoded = (0, jsonwebtoken_1.verify)(refreshToken.slice(7), process.env.JWT_KEY);
            const accessToken = jwtToken.generateAccessToken(decoded.id);
            res.status(200).json({
                status: 200,
                message: 'New Access Token Generated',
                accessToken
            });
        }
        else {
            res.status(401).json({
                status: 401,
                message: "Unauthorized",
                accessToken: ''
            });
        }
    }
    catch (error) {
        console.log(`Error while generating access token`, error);
        res.status(500).json({
            status: 500,
            message: error.message,
            accessToken: ''
        });
    }
});
exports.default = tokenRoute;
