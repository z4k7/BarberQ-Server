"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
class JwtToken {
    //? To generate access token
    generateAccessToken(id) {
        const jwtKey = process.env.JWT_KEY;
        if (jwtKey !== undefined) {
            const exp = Math.floor(Date.now() / 1000) + constants_1.accessTokenExp;
            return jsonwebtoken_1.default.sign({ id, exp, iat: Date.now() / 1000 }, jwtKey);
        }
        throw new Error("JWT Key is not defined");
    }
    // ? To generate refresh token
    generateRefreshToken(id) {
        const jwtKey = process.env.JWT_KEY;
        if (jwtKey !== undefined) {
            const exp = Math.floor(Date.now() / 1000) + constants_1.refreshTokenExp;
            return jsonwebtoken_1.default.sign({ id, exp, iat: Date.now() / 1000 }, jwtKey);
        }
        throw new Error("JWT Key is not defined");
    }
}
exports.default = JwtToken;
