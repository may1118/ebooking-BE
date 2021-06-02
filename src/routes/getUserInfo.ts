import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

import { query } from '../servers/mysql.server'
import { getUserInfo } from '../middlewares/sql'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const { user_id } = req.body;
  try {
    const data = await query(getUserInfo, [user_id])
    res.send({ 
      code: 0,
      data: data
    })
  } catch (error) {
    res.send({ 
      code: 1,
      data: 'fail'
    })
  }
});
module.exports = router;