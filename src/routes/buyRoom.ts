import * as express from 'express'
import * as URL from 'url'
import { Request, Response, NextFunction } from 'express'
import { getHotelByPosition, getRoom } from '../middlewares/sql'
import { query } from '../servers/mysql.server'

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
  const hotelObj = JSON.parse(req.body.hotel)
  const { hotel_id, hotel_base_config, userPhone, userId, userName } = hotelObj
  // todo 查询该酒店在这天是否有足够的房源，存储形式
  /**
   * 1. 查询该酒店房源基本信息
   */

  res.send({
    code: 0,
    data: 'success'
  })
});
module.exports = router;