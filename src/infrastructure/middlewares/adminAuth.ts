import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import AdminRepository from "../repository/adminRepository";

const adminRepository = new AdminRepository();

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      try {
        const decoded = verify(
          token.slice(7),
          process.env.JWT_KEY as string
        ) as JwtPayload;
        const adminData = await adminRepository.findAdminById(decoded.id);

        if (adminData !== null) {
          next();
        } else {
          res
            .status(401)
            .json({ data: { message: "Not authorized, invalid token" } });
        }
      } catch (verifyError) {
        console.log("JWT Verification Error:", verifyError);
        res
          .status(500)
          .json({ data: { message: "Not authorized, invalid token" } });
      }
    } else {
      res.status(401).json({ data: { message: "Token not available" } });
    }
  } catch (error) {
    console.log("Unexpected Error:", error);
    res.status(500).json({ data: { message: "Internal Server Error" } });
  }
};
