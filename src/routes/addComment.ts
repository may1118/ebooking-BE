import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { query } from '../servers/mysql.server'
import { addComment } from '../middlewares/sql'
import { addHos, hosDes } from '../middlewares/addHos'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const hotel_id = req.cookies['hotel/hotel_id']
  const nowTime = new Date().getTime()
  const { live_id, from_id, to_id, content, comment_type } = req.body
  await query(addComment, [live_id, from_id, to_id, comment_type, content, nowTime])
  if (comment_type === 'HOTEL') {
    addHos({
      hotel_id: hotel_id,
      hos_score: 0.01,
      hos_type: hosDes.finishComment
    })
  }
  try {
    res.send({
      code: 0,
      data: 'success'
    })
  } catch (err) {
    res.send({
      code: 1,
      data: 'fail'
    })
  }

});
module.exports = router;