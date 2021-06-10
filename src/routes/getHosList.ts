import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { query } from '../servers/mysql.server'
import { getHosList } from '../middlewares/sql'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const hotel_id = req.cookies['hotel/hotel_id']
  const data = await query(getHosList, [hotel_id], false, true)

  res.send({
    code: 0,
    data: {
      hosScore: 4.5,
      hosDetail: data
    },
  })
});
module.exports = router;