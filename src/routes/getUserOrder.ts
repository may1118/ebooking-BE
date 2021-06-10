import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { query } from '../servers/mysql.server'
import { getUserOrder, getRoomByRoomId, getHotelBaseInfo, getComment } from '../middlewares/sql'

import { getLiveStatus } from '../config/commonFunc'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const user_id = req.cookies['live_user/id']
  try {
    const data = await query(getUserOrder, [user_id], false, true)
    const formatData = await Promise.all(data.map(async (item: any) => {
      const { live_time, leave_time, order_time, live_price, hotel_id } = item
      const { room_id } = item
      const { room_name } = await query(getRoomByRoomId, [room_id])
      const { hotel_name } = await query(getHotelBaseInfo, [hotel_id])
      const { status, needNumber, live_id } = item

      const data = await query(getComment, [live_id], false, true)
      // 商家已回复的情况下
      // 需要对data进行组合，组合成前端直接可以使用的形式
      let userComment = JSON.parse(JSON.stringify(data))
      if (data.length === 2) {
        let hotelComment = data.find((item: any) => item.comment_type === 'HOTEL')
        userComment = data.find((item: any) => item.comment_type === 'USER')

        userComment = [{
          ...userComment,
          hotelComment: hotelComment.content,
          hotelCommentTime: hotelComment.comment_time
        }]
      }

      return {
        comment: userComment,
        hotel_name,
        room_name: `${room_name} * ${needNumber}` || '-',
        live_price,
        live_time: new Date(live_time).getTime(),
        leave_time: new Date(leave_time).getTime(),
        order_time: new Date(order_time).getTime() || '-',
        statusContent: getLiveStatus(status, 'USER'),
        status,
        key: live_id,
        hotel_id,
      }
    }))
    res.send({
      code: 0,
      data: formatData,
    })
  } catch (error) {
    res.send({
      code: 1,
      data: 'fail',
    })
  }
});
module.exports = router;