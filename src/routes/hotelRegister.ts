import * as express from 'express'
var router = express.Router();

// 加密算法
import { encrypt } from '../controllers/encryption'

import { Request, Response, NextFunction } from 'express'
import { query, queryNoParams } from '../servers/mysql.server'
import { isRegistByEmail, setHotelInfo, getInsertId, setUserHotelId, registerUser } from '../middlewares/sql'

/**
 * 用户注册酒店信息
 * 1. 用户手机
 * 2. 邮箱
 * 3. 位置（省 -> 市 -> 区）
 * 4. 酒店名称
 * 5. 酒店描述
 * 6. 酒店房屋类型
 * 过程
 * 1. 数据库中查以下之前是否用邮箱注册过
 * 2. 存入酒店基本信息（两张表通过 hotelId 关联上）
 */
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const { phone, email, provice, city, district, hotelName, des, config } = req.body;
  try {
    const pos = [provice, city, district].join('-')
    // 1. 查询邮箱是否注册过 -》 加密存储的信息
    const { num } = await query(isRegistByEmail, [email], true)
    // 2. 存入酒店基本信息，获取id
    await query(setHotelInfo, [hotelName, pos, des, config])
    const { hotel_id } = await queryNoParams(getInsertId)
    // 注册
    if (!num) query(registerUser, ['酒店商家', '123456', phone, email], true)
    // 关联表格
    query(setUserHotelId, [hotel_id, encrypt(email)])

    res.send({
      code: 0,
      data: 'success',
    })

  } catch (error) {
    res.send({
      code: 1,
      data: 'fail',
    })
  }

});

module.exports = router;
