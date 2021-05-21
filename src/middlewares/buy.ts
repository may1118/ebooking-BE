import { queryNoParams, query } from '../servers/mysql.server'
import { getSoldRoomByTimeRange, getRoomQuantity } from '../middlewares/sql'

export const hasEnoughRoom = async (room: any): Promise<boolean> => {
  const { hotel_id, room_id, timeRange, needNumber = 0 } = room
  // 查询在timeRange范围内 已经销售出房态数量

  let data = await queryNoParams(getSoldRoomByTimeRange(room_id, timeRange[0], timeRange[1]))
  data = Array.isArray(data) ? data : [data]
  const soldNumber = data.reduce((pre: any, cur: any) => {
    return pre + cur.soldNumber
  }, 0)
  const { room_quantity = 0 } = await query(getRoomQuantity, [room_id])
  return room_quantity - soldNumber >= needNumber;
}
