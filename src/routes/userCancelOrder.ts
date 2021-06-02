import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { query } from '../servers/mysql.server'
import { changeLiveStatus } from '../middlewares/sql'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const live_id = req.body.live_id
  try {
    await query(changeLiveStatus, [3, live_id])
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