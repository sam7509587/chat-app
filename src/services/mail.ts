/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import * as nodemailer from 'nodemailer';
import { USER_MAIL, USER_PASSWORD } from '../config';
import template from '../views/otptemp';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: USER_MAIL,
    pass: USER_PASSWORD,
  },
});

export const sendOtpMail = async (email: string, otp: number) => {
  const htmlToSend = template(otp);
  const mailOptions: object = {
    from: USER_MAIL,
    to: email,
    subject: 'Verify your mail',
    text: 'Hey , is your otp',
    html: htmlToSend,
  };
  const result = await transport.sendMail(mailOptions, (error, info: any) => {
    if (error) {
      return 'error';
    }
    return info;
  });
  return result;
};
