import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

import { query } from '../servers/mysql.server'
import { changeLiveStatus } from '../middlewares/sql'
import { addHos, hosDes } from '../middlewares/addHos'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const { live_id, status } = req.body
  const hotel_id = req.cookies['hotel/hotel_id']
  try {
    await query(changeLiveStatus, [status, live_id])
    if (status === 2) {
      await addHos({
        hotel_id: hotel_id,
        hos_score: 0.01,
        hos_type: hosDes.finishOrder
      })
    } else if (status === 4) {
      await addHos({
        hotel_id: hotel_id,
        hos_score: -0.01,
        hos_type: hosDes.rejectOrder
      })
    }
    res.send({
      code: 0,
      data: 'success'
    })
  } catch (error) {
    res.send({
      code: 1,
      data: 'fail'
    })
  }
});
module.exports = router;