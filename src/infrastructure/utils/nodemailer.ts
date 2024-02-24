import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

class SendOtp  {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "barberq47@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  sendVerificationMail( email: string, verif_code: string): void {
    const mailOptions: nodemailer.SendMailOptions = {
      from: "barberq47@gmail.com",
      to: email,
      subject: "BarberQ Email Verification",
      text: `${email}, your verification code is: ${verif_code}`,
    };
    
     
        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err);
                
            } else {
                console.log(`Verification Code Sent Successfully!`);
            }
          });
      
  }
}

export default SendOtp;
