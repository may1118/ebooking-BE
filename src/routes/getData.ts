import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { query, queryNoParams } from '../servers/mysql.server'
import { getOneYearData, getOrderByHotelId } from '../middlewares/sql'

import { formatTime } from '../config/commonFunc'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const hotel_id = req.cookies['hotel/hotel_id'] || 9
  const type = req.body.type
  const year = req.body.year
  const data = await queryNoParams(getOneYearData(year, hotel_id), true)
  
  // get this year data
  const orderByYear: any = {}
  data.forEach((item: any) => {
    const { orderTime } = item
    const month = new Date(Number(orderTime)).getMonth() + 1
    !!orderByYear[month] === true ? orderByYear[month].push(item) : orderByYear[month] = [item]
  })

  switch (type) {
    case 'year-income':
      const incomeYear: any= {}
      // 初始化
      for(let i = 1; i <= 12; i++) incomeYear[i] = 0
      Object.keys(orderByYear).forEach((item: any) => {
        const month = item
        orderByYear[item].forEach((monthOrder: any) => {
          incomeYear[month] += monthOrder.live_price
        })
      })
      res.send({
        code: 0,
        data: incomeYear
      })
      break;
    case 'sell-hotel':
      const sellYear: any = {}
      for(let i = 1; i <= 12; i++) sellYear[i] = 0
      Object.keys(orderByYear).forEach((item: any) => {
        const month = item
        orderByYear[item].forEach((monthOrder: any) => {
          sellYear[month] += monthOrder.needNumber
        })
      })
      res.send({
        code: 0,
        data: sellYear
      })
      break;
  }
});
module.exports = router;