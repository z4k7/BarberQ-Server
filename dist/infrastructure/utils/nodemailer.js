"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SendOtp {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "barberq47@gmail.com",
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    sendVerificationMail(email, verif_code) {
        const mailOptions = {
            from: "barberq47@gmail.com",
            to: email,
            subject: "BarberQ Email Verification",
            text: `${email}, your verification code is: ${verif_code}`,
        };
        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log(`Verification Code Sent Successfully!`);
            }
        });
    }
}
exports.default = SendOtp;
