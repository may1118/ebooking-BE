import { query } from '../servers/mysql.server'
import { getHotelAuto } from './sql'
/**
 * 1. 判断是否在自动接单范围内
 * 2. 如果在范围内，判断是否建立了websocket连接
 */
export const autoOrder = async (hotel_id: any) => {
  const { hotel_is_auto, hotel_auto_base_obj } = await query(getHotelAuto, [hotel_id])
  if (!hotel_is_auto) {
    return;
  }
  const inRange = nowInAutoRange(JSON.parse(hotel_auto_base_obj))
  if (!inRange) return;
  // 在自动接单范围内
  // 查询是否有订单需要接单
}

const inTime = (autoTime: any) => {
  const timeRange = autoTime.split('-')

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const start = `${ year }-${ month }-${ day } ${ timeRange[0] }`
  const end = `${ year }-${ month }-${ day } ${ timeRange[1] }`

  const startDate = new Date(start).getTime()
  const endDate = new Date(end).getTime()

  return now.getTime() >= startDate && now.getTime() <= endDate
}

const nowInAutoRange = (hotel_auto_base: any) => {
  const autoTime = hotel_auto_base.autoTime
  const autoDay = JSON.parse(hotel_auto_base.autoDay)
  
  const now = new Date()
  const nowDate = now.getDay() + 1
  return autoDay.includes(nowDate) && inTime(autoTime)
}

autoOrder(9)