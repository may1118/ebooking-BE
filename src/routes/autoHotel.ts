import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

var router = express.Router();
import { query } from '../servers/mysql.server'
import { saveHotelAuto } from '../middlewares/sql'

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const { hotel_id, isAuto, ...config } = req.body
  try {
    await query(saveHotelAuto, [isAuto ? 1 : 0, JSON.stringify(config), hotel_id])
    res.send({
      code: 0,
      data: 'success'
    })
  } catch (error) {
    res.send({
      code: 1,
      data: 'fail' + error
    })
  }
});
module.exports = router;