import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { query } from '../servers/mysql.server'
import { addComment } from '../middlewares/sql'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const nowTime = new Date().getTime()
  const { live_id, from_id, to_id, content, comment_type } = req.body
  await query(addComment, [live_id, from_id, to_id, comment_type, content, nowTime])
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