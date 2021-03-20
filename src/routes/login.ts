import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

var router = express.Router();

import { query } from '../servers/mysql.server'

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
  res.send('respond with a resource');
});

module.exports = router;
