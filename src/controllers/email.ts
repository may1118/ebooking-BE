"use strict";
const nodemailer = require("nodemailer");

import {receiveEmailFormat, emailConfig} from '../config/email';

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(to: string, vertifyCode: number) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  
  // let testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

  // send mail with defined transport object
  let info = await transporter.sendMail(receiveEmailFormat(to, vertifyCode));

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export default sendEmail;
