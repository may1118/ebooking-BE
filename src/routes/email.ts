import * as express from 'express'
var router = express.Router();

import { Request, Response, NextFunction } from 'express'
// 格式话返回数据
import sendFormat from '../config/requestSendBack'
// 发送邮件 & 存储验证码
import { sendEmail, emailVertify } from '../controllers/email'

/**
 * /getEmailVertify
 * @params email: 用户的邮箱
 */
router.post('/get', async function (req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  // 验证是否是email
  const isEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(email)

  try {
    if (!isEmail) throw '邮箱格式不正确'
    // 随机生成一个数字，并且发送相关邮件
    const vertifyCode = getRandom();
    const flag = await sendEmail(email, vertifyCode)
    if (!flag) throw 'error'

    emailVertify[email] = {
      vertifyCode,
      time: new Date().getTime()
    }
    res.send(sendFormat({
      code: 0
    }))
  } catch (error) {
    res.send(sendFormat({
      code: 1,
      message: error
    }))
  }
});

module.exports = router;

// 获得随机数
function getRandom(min = 100000, max = 999999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}