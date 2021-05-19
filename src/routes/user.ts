import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
var setCookie = require('../servers/cookie.serve')
import { query } from '../servers/mysql.server'
import { isRegister as isRegisterSql, register } from '../middlewares/sql'

var router = express.Router();
router.post('/login', async function (req: Request, res: Response, next: NextFunction) {
  const { name, phone } = req.body
  const { num } = await query(isRegisterSql, [phone])
  if (!num) {
    try {
      await query(register, [name, phone])
    } catch (error) {
      res.send({
        code: 1,
        data: 'register fail'
      })
    }
  }
  setCookie(res, 'live_user/name', name)
  setCookie(res, 'live_user/phone', phone)
  setCookie(res, 'live_user/login', true)
  res.send({
    code: 0,
    data: 'success'
  })
});
module.exports = router;