import jwt from "jsonwebtoken";
import Ijwt from "../../usecase/interface/jwtInterface";
import { ID } from "../database/common";
import { accessTokenExp, refreshTokenExp, tempTokenExp } from "./constants";

class JwtToken implements Ijwt {
  //? To generate access token
  generateAccessToken(id: ID): string {
    const jwtKey = process.env.JWT_KEY;
    if (jwtKey !== undefined) {
      const exp = Math.floor(Date.now() / 1000) + accessTokenExp;
      return jwt.sign({ id, exp, iat: Date.now() / 1000 }, jwtKey);
    }
    throw new Error("JWT Key is not defined");
  }

  // ? To generate refresh token
  generateRefreshToken(id: ID): string {
    const jwtKey = process.env.JWT_KEY;
    if (jwtKey !== undefined) {
      const exp = Math.floor(Date.now() / 1000) + refreshTokenExp;
      return jwt.sign({ id, exp, iat: Date.now() / 1000 }, jwtKey);
    }
    throw new Error("JWT Key is not defined");
  }

}

export default JwtToken;
