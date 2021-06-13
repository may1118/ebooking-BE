import * as express from 'express'
import * as URL from 'url'
import { Request, Response, NextFunction } from 'express'
import { getHotelByPosition, getRoom, addLiveRoom } from '../middlewares/sql'
import { query } from '../servers/mysql.server'
import { hasEnoughRoom } from '../middlewares/buy'
import { autoOrder } from '../middlewares/autoOrder'

var router = express.Router();
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  const params = URL.parse(req.url, true).query;
  const position = params.position?.toString() || ''
  const data = await query(getHotelByPosition, [`%${position}%`])
  res.send({
    code: 0,
    data: {
      hotel: Array.isArray(data) ? data : [data]
    }
  })
});

router.post('/getRoom', async function (req: Request, res: Response) {
  try {
    const hotel_id = req.body.hotel_id
    const data = await query(getRoom, [hotel_id])
    res.send({
      code: 0,
      data: data
    })
  } catch (error) {
    res.send({
      code: 0,
      data: 'fail'
    })
  }
});

router.post('/buy', async function (req: Request, res: Response) {
  // return start
  const ret: {
    code: number,
    data: any
  } = {
    code: 0,
    data: 0
  }
  // end
  const hotelObj = JSON.parse(req.body.hotel)
  const { hotel_base_config, userPhone, userId, userName, hotel_id } = hotelObj
  const roomArr = []
  let flag = false
  // todo 查询该酒店在这天是否有足够的房源，存储形式
  for (const item of hotel_base_config) {
    const hasEnough = await hasEnoughRoom(item)
    if (!hasEnough) { flag = true }
    // todo 是否有足够房源
    roomArr.push({
      room: item,
      canBuy: hasEnough,
    })
  }
  if (!flag) {
    try {
      // 循环执行sql语句
      for (const item of roomArr) {
        const { room_id, needNumber, room_price, timeRange, hotel_id } = item.room
        // status： -1 商家还未接单的状态
        await query(addLiveRoom, [hotel_id, room_id, room_price, needNumber, timeRange[0], timeRange[1], userId, userName, userPhone, 0, 0, new Date().getTime(), -1])
      }
      // auto 接单操作
      autoOrder(hotel_id)
    } catch (error) {
      ret.code = 1
      ret.data = '写入失败'
    }
  } else {
    // 返回房态信息
    const errorRoom = roomArr.filter(item => !item.canBuy)
    ret.data = {
      code: 1,
      room: errorRoom
    }
  }
  res.send(ret)
});
module.exports = router;