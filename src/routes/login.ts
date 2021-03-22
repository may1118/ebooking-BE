import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

var router = express.Router();

import sendFormat from '../config/requestSendBack'
import { vertifyType, vertifyArrInterFace, isVertifyArr } from '../controllers/vertify'

import { query } from '../servers/mysql.server'

enum LOGIN_TYPE {
  NAME_PASS,
  EMAIL_CODE
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

    // 1. 如果是用户名 + 密码：和数据库进行匹配
    
    // 2. 如果是邮箱 + 验证码：验证验证码是否正确 & 邮箱进行匹配（需要保证邮箱唯一）

    res.send('success')
  } catch (error) {
    res.send(sendFormat({
      code: 1,
      message: error
    }))
  }
});

module.exports = router;
