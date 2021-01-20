"use strict";
const nodemailer = require("nodemailer");

import emailBaseInfo from '../config/bindEmail';

// async..await is not allowed in global scope, must use a wrapper
async function main(to: string, vertifyCode: number) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '517537976@qq.com',
        pass: 'ansaawweixpibjea'
    }
});

  // send mail with defined transport object
  let info = await transporter.sendMail(emailBaseInfo(to, vertifyCode));

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// use
main('1422073266@qq.com', 123412423).catch(console.error);
