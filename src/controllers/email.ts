const nodemailer = require("nodemailer");

import {receiveEmailFormat, emailConfig} from '../config/email';

/**
 * 发送邮件函数
 * @param to 发送的对象
 * @param vertifyCode 发送的信息（验证码）
 * @returns 成功与否
 */
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
  try {
    await transporter.sendMail(receiveEmailFormat(to, vertifyCode));
    return true
  } catch (error) {
    return false
  }
}
/**
 * 暂时存储邮箱 + 验证码的信息对象，并且一段时间轮训一次
 */
// todo 需要维护一个对象，用来存储验证信息
interface emailVertifyInterface {
  [key: string]: {
    vertifyCode: number,
    time: number
  }
}
// todo 设置过期事件：5min
const expiredTime = 5 * 60 * 1000;
const pollEmailVertifyObject = 30 * 60 * 1000;
const emailVertify: emailVertifyInterface = {};
export { sendEmail, emailVertify }

// 每半小时查询emailVertify的每一项是否有过期的内容，如果有则删除
setInterval(_ => {
  const now = new Date().getTime();
  Object.keys(emailVertify).forEach(key => {
    const { time } = emailVertify[key];
    if (now - time > expiredTime) {
      delete emailVertify[key]
    }
  })
  console.log('30min轮训一次邮箱存储列表：>>>', emailVertify)
}, pollEmailVertifyObject)

