var express = require('express');
var router = express.Router();

import { Request, Response,NextFunction } from 'express'

import sendFormat from '../config/requestSendBack'
import { emailVertify } from '../controllers/email'

var setCookie = require('../servers/cookie.serve')

interface UserInterface {
  userEmail: string,
  userName: string,
  userPassword: string,
  userPhone: string,
  emailVertifyCode: string,
  phoneVertifyCode: string,
}

/* GET users listing. */
router.post('/', function(req: Request, res: Response, next: NextFunction) {
  const { userEmail, userName, userPassword, userPhone, emailVertifyCode, phoneVertifyCode } = req.body;
  if (vertifyUserInfo(req.body)) {
    /**
     * 验证email 和 手机 验证码是否符合要求
     * 因为没有买手机验证码，所以暂时将手机验证码统一为111111（6个1）
     */
    if ( Number(phoneVertifyCode) === 111111 && Number(emailVertify[userEmail].vertifyCode) === Number(emailVertifyCode)) {
      // todo 将个人信息写入数据库，并且对于某些字段需要加密存储
      res.send(sendFormat({
        code: 0,
        message: '注册成功'
      }))
    } else {
      res.send(sendFormat({
        code: 1,
        message: '验证码错误'
      }))
    }
  } else {
    // 格式正确
    res.send(sendFormat({
      code: 1,
      message: '格式错误，请重试'
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
