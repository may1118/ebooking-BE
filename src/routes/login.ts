import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

var router = express.Router();

import sendFormat from '../config/requestSendBack'
import { vertifyType, vertifyArrInterFace, isVertifyArr } from '../controllers/vertify'

import { emailVertify } from '../controllers/email'

import { query } from '../servers/mysql.server'
import { loginName_Pass, loginEmail_Code } from '../middlewares/sql'

enum LOGIN_TYPE {
  NAME_PASS,
  EMAIL_CODE
}

interface userBaseInfoInterface {
  user_id: number,
  user_name: string,
  user_password: string,
  user_phone: string,
  user_email: string,
  hotel_id: number | null
}

/**
 * 功能点：实现登陆功能
 * 登陆的两种形式
 * 1. 账号 + 密码
 * 2. 邮箱 + 验证码
 * 完成登陆
 * 1. 加入cookie，方便之后前后端拦截操作
 * 2. 返回用户基本信息（主要集中在是否上传酒店信息内容）
 */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  const { userName, userPassword, userEmail, emailVertifyCode } = req.body;
  let type = null
  try {
    if (userName && userPassword) {
      type = LOGIN_TYPE.NAME_PASS
      const vertify = isVertifyArr([{
        type: vertifyType.NAME,
        val: userName
      }, {
        type: vertifyType.PASSWORD,
        val: userPassword
      }])
      if (!vertify) throw '参数错误'
    }
    if (userEmail && emailVertifyCode) {
      type = LOGIN_TYPE.EMAIL_CODE
      const vertify = isVertifyArr([{
        type: vertifyType.EMAIL,
        val: userEmail
      }, {
        type: vertifyType.CODE,
        val: emailVertifyCode
      }])
      if (!vertify) throw '参数错误'
    }
    let userInfo: userBaseInfoInterface | null = null
    // 1. 如果是用户名 + 密码：和数据库进行匹配
    switch (type) {
      case LOGIN_TYPE.NAME_PASS:
        console.log('>>> username & password login.')
        userInfo = await query(loginName_Pass, [userName, userPassword + '-'], true)
        if (!userInfo) throw 'login error.'
        break;
    // 2. 如果是邮箱 + 验证码：验证验证码是否正确 & 邮箱进行匹配（需要保证邮箱唯一）
      case LOGIN_TYPE.EMAIL_CODE:
        console.log('>>> email & code login.')
        if (Number(emailVertify[userEmail]?.vertifyCode) !== Number(emailVertifyCode)) throw '邮箱验证码错误'
        userInfo = await query(loginEmail_Code, [userEmail], true)
        if (!userInfo) throw 'login error'
        break;
      default:
        throw 'type error.'
        break;
    }
    // login success
    // 需要验证是否上传酒店信息
    const { hotel_id, user_name, user_phone, user_email } = userInfo
    if (!hotel_id) {
      res.send(sendFormat({
        code: 0,
        data: {
          hasHotelInfo: false,
          login: 'success',
          msg: 'no hotel info'
        }
      }))
    } else {
      res.send(sendFormat({
        code: 0,
        data: {
          hasHotelInfo: true,
          user_name,
          user_phone,
          user_email,
          hotel_id,
          login: 'success',
          msg: 'no hotel info'
        }
      }))
    }

  } catch (error) {
    res.send(sendFormat({
      code: 1,
      message: error
    }))
  }
});

module.exports = router;
