import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { query, queryNoParams } from '../servers/mysql.server'
import { getAllCommentByHotelId, getUserInfo } from '../middlewares/sql'
import { addMask } from '../config/commonFunc'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const hotel_id = req.cookies['hotel/hotel_id']
  const data = await queryNoParams(getAllCommentByHotelId(hotel_id), true)
  for (const item of data) {
    const { comment_type, from_id, live_id } = item
    if (comment_type === 'USER') {
      const { name } = await query(getUserInfo, [from_id])
      item.userName = addMask(name, 'NAME')

      // 判断是否有用户回复评论
      const hotelComment = data.find((item: any) => {
        return item.comment_type === 'HOTEL' && item.live_id === live_id
      })
      item.hasHotelComment = hotelComment ? true : false
      item.hotelComment = hotelComment
    }
  }
  res.send({
    code: 0,
    data: data.filter((item: any) =>item.comment_type === 'USER'),
  })
});
module.exports = router;