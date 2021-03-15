import * as express from 'express'
var router = express.Router();

import { Request, Response, NextFunction } from 'express'

import sendFormat from '../config/requestSendBack'

import { sendEmail, emailVertify, expiredTime } from '../controllers/email'

import { query } from '../servers/mysql.server'

/**
 * /getEmailVertify
 * @params email: 用户的邮箱
 */
router.post('/get', async function (req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  // 验证是否是email
  const isEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(email)
  if (!isEmail) {
    res.send(sendFormat('', false, '邮箱格式不正确'));
  }
  // 随机生成一个数字，并且发送相关邮件
  const vertifyCode = getRandom();
  const flag = await sendEmail(email, vertifyCode)
  if (flag) {
    emailVertify[email] = {
      vertifyCode,
      time: new Date().getTime()
    }
    res.send(sendFormat({
      code: 0
    }))
  } else {
    res.send(sendFormat({
      code: 1
    }))
  }
});

router.post('/vertify', function (req: Request, res: Response, next: NextFunction) {
  const { email, vertify: remoteCode } = req.body
  // 验证是否在对象中有这个条目，并且没有超过事件限制
  const isEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(email)
  if (!isEmail) {
    res.send(sendFormat('', false, '邮箱格式不正确'));
  }
  // 验证是否正确，并且没有过期
  if (emailVertify[email]) {
    const { vertifyCode: localCode, time } = emailVertify[email]
    if (Number(remoteCode) === Number(localCode)) {
      // 验证是否过期
      if (new Date().getTime() - time < expiredTime) {
        // todo 需要存入数据库中

        res.send(sendFormat('success'))
      } else {
        res.send(sendFormat('验证码已过期，请重新获取'))
      }
    } else {
      res.send(sendFormat('验证码不正确'))
    }
  } else {
    res.send(sendFormat('请先获取验证码'))
  }
});

module.exports = router;

// 获得随机数
function getRandom(min = 100000, max = 999999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}