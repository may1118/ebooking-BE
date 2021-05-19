import * as express from 'express'
import * as URL from 'url'
import { Request, Response, NextFunction } from 'express'
import { getHotelByPosition } from '../middlewares/sql'
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
router.post('/buy', async function (req: Request, res: Response) {
  const { hotel } = req.body
  const hotelObj = JSON.parse(hotel)
  const { hotel_id, hotel_base_config } = hotelObj
  res.send({
    code: 0,
    data: 'success'
  })
});
module.exports = router;