import { query } from '../servers/mysql.server'
import { addHotelHos } from '../middlewares/sql'

export const hosDes = {
  finishComment: "回复用户评论",
  finishOrder: "完成订单",
}

export const addHos = async ({ hotel_id, hos_score, hos_type = '' }: {
  hotel_id: number, hos_score: number, hos_type?: string
}) => {
  await query(addHotelHos, [hotel_id.toString(), hos_score.toString(), hos_type.toString()])
}