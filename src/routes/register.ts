var express = require('express');
var router = express.Router();

import { Request, Response,NextFunction } from 'express'

// email
import sendFormat from '../config/requestSendBack'
import { emailVertify } from '../controllers/email'

// sql
import { query } from '../servers/mysql.server'
import { registerUser, registerEmailBefore } from '../middlewares/sql'


interface UserInterface {
  userEmail: string,
  userName: string,
  userPassword: string,
  userPhone: string,
  emailVertifyCode: string,
  phoneVertifyCode: string,
}

/* GET users listing. */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  const { userEmail, userName, userPassword, userPhone, emailVertifyCode, phoneVertifyCode } = req.body;
  try {
    /**
     * 验证email 和 手机 验证码是否符合要求
     * ! 因为没有买手机验证码，所以暂时将手机验证码统一为111111（6个1）
     */
    if (!vertifyUserInfo(req.body)) throw '格式错误，请重试'
    if (Number(phoneVertifyCode) !== 111111) throw '手机验证码错误'
    if(!emailVertify[userEmail]) throw '邮箱验证码不存在或失效'
    if (Number(emailVertify[userEmail].vertifyCode) !== Number(emailVertifyCode)) throw '邮箱验证码错误'

    const [{ num }] = await query(registerEmailBefore, [userEmail], true)
    if (num) throw '该邮箱已注册'

    await query(registerUser, [userName, userPassword, userPhone, userEmail], true)
    res.send(sendFormat({
      code: 0,
      message: '注册成功'
    }))
  } catch (error) {
    res.send(sendFormat({
      code: 1,
      message: error
    }))
  }
});

function vertifyUserInfo(userInfo: UserInterface) {
  const { userEmail, userName, userPassword, userPhone, emailVertifyCode, phoneVertifyCode } = userInfo
  const isUserName = /^([0-9a-zA-Z]|_){5,20}$/.test(userName)
  const isUserPassword = /(?![0-9]+$)(?![a-zA-Z]+$)^[0-9a-zA-Z]{6,20}$/.test(userPassword)
  const isUserPhone = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(userPhone)
  const isEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(userEmail)
  const isEmailVertifyCode = /^[0-9]{1,}$/.test(emailVertifyCode)
  const isPhoneVertifyCode = /^[0-9]{1,}$/.test(phoneVertifyCode)

  return isUserName && isUserPassword && isUserPhone && isEmail && isEmailVertifyCode && isPhoneVertifyCode
}

module.exports = router;
