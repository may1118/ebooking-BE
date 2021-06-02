import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

import { query } from '../servers/mysql.server'
import { getOrderByHotelId, getRoomByRoomId } from '../middlewares/sql'

import { addMask, getLiveStatus } from '../config/commonFunc'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const hotel_id = req.cookies['hotel/hotel_id']
  const queryData = await query(getOrderByHotelId, [hotel_id])
  const data = Array.isArray(queryData) ? queryData : [queryData]
  const formatData = await Promise.all(data.map(async item => {
    const { live_time, leave_time, order_time, live_price } = item
    const { room_id } = item
    const { room_name } = await query(getRoomByRoomId, [room_id])
    const { user_name, user_id } = item
    const { is_tell_hotel_user, is_auto_order, is_reject, status, needNumber, live_id } = item

    return {
      user_name: addMask(user_name || '-', 'NAME') ,
      room_name: `${ room_name } * ${ needNumber }` || '-',
      live_price,
      live_time: new Date(live_time).getTime(),
      leave_time: new Date(leave_time).getTime(),
      order_time: new Date(order_time).getTime() || '-',
      is_tell_hotel_user,
      is_auto_order,
      is_reject,
      statusContent: getLiveStatus(status, 'HOTEL'),
      status,
      key: live_id,
      user_id,
    }
  }))
  res.send({
    code: 0,
    data: formatData
  })
});
module.exports = router;