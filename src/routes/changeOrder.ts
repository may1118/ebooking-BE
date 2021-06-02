import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

import { query } from '../servers/mysql.server'
import { changeLiveStatus } from '../middlewares/sql'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const { live_id, status } = req.body
  try {
    await query(changeLiveStatus, [status, live_id])
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