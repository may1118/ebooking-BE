import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

var router = express.Router();

import { getHotelBaseInfo } from '../middlewares/sql'
import { query } from '../servers/mysql.server'

/**
 * 根据用户传入的hotel_id，返回酒店基本信息
 */
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const hotel_id = req.body.hotel_id
    const info = await query(getHotelBaseInfo, [hotel_id])
    res.send({
      code: 0,
      data: info || '-'
    })
  } catch (error) {
    res.send({ 
      code:1,
      data: 'error'
    })
  }

});

module.exports = router;
