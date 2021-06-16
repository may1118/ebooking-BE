const userTable = 'user'
const chinaRegin = 'china_region'
const hotel = 'hotel'
const live_user = 'live_user'
const room = 'room'
const live = 'live'
const hotel_study = 'hotel_study'
const comment = 'comment'
const hos = 'hos_detail'
/**
 * 规定返回形式
 * 1. 如果是查询数量，需要返回的格式是：{ num: Number }
 */

export const registerUser = `INSERT INTO ${userTable}(user_name, user_password, user_phone, user_email) VALUES (?, ?, ?, ?)`
export const registerEmailBefore = `SELECT COUNT(*) num FROM ${userTable} WHERE user_email=?`

// login
export const loginName_Pass = `SELECT * FROM ${userTable} WHERE user_name = ? AND user_password = ?`
export const loginEmail_Code = `SELECT * FROM ${userTable} WHERE user_email = ?`

// get position
export const positionByParent_id = `SELECT * FROM ${chinaRegin} WHERE parent_id = ?`
export const positionByName = `SELECT * FROM ${chinaRegin} where parent_id = (SELECT code FROM ${chinaRegin} where name=?)`

// hotel register
export const isRegistByEmail = `SELECT COUNT(*) num FROM ${userTable} where user_email = ?`

export const setHotelInfo = `INSERT INTO ${hotel}(hotel_name, hotel_position, hotel_is_open, hotel_des) VALUES (?, ?, 0, ?);`
export const getInsertId = `SELECT max(hotel_id) hotel_id from ${hotel};`
// - 修改user表，增加hotel_id
export const setUserHotelId = `UPDATE ${userTable} SET hotel_id = ? WHERE user_email = ?`
export const addRoomInfo = `INSERT INTO ${ room }(hotel_id, room_name, room_quantity, room_price) VALUES (?, ?, ?, ?)`;

// hotel
export const getHotelBaseInfo = `SELECT * FROM ${hotel} WHERE hotel_id = ?`
export const saveHotelAuto = `UPDATE ${hotel} SET hotel_is_auto = ?, hotel_auto_base = ? WHERE hotel_id = ?`
export const getHotelByPosition = `SELECT hotel_id, hotel_name, hotel_position, hotel_des FROM ${hotel} where hotel_position like ? AND hotel_is_open=0`

// to c 居住用户
export const register = `INSERT INTO ${ live_user }(name, phone) values (?, ?)`
export const isRegister = `SELECT COUNT(*) num FROM ${ live_user } where name = ? AND phone = ?`
export const getRegisterId = `select id from ${ live_user } where phone = ?`
export const getUserInfo = `SELECT * FROM ${ live_user } WHERE id = ?`
export const getUserOrder = `SELECT * FROM ${ live } WHERE user_id = ? ORDER BY order_time DESC`

// room
export const getRoom = `SELECT hotel_id, room_id, room_quantity room_number, room_price, room_name FROM ${ room } WHERE hotel_id = ?`
export const addLiveRoom = `INSERT INTO ${ live }(hotel_id, room_id, live_price, needNumber, live_time, leave_time, user_id, user_name, user_phone, is_tell_hotel_user, is_reject, order_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
export const getRoomByRoomId = `SELECT room_name FROM ${ room } WHERE room_id = ?`
export const changeLiveStatus = `UPDATE ${ live } SET status = ? WHERE live_id = ?`

export const getSoldRoomByTimeRange = (room_id: any, live_time: any, leave_time: any) => {
  return `SELECT needNumber soldNumber FROM ${ live } WHERE room_id = ${ room_id } AND (live_time <= '${ live_time }' AND leave_time >= '${ leave_time }') OR (live_time <= '${ live_time }' AND leave_time <= '${ leave_time }' AND leave_time >= '${ live_time }') OR (live_time >= '${ live_time }' AND leave_time >= '${ leave_time }' AND live_time <= '${ leave_time }') OR (live_time >= '${ live_time }' AND leave_time <= '${ leave_time }')`
}
export const getRoomQuantity = `SELECT room_quantity FROM ${ room } WHERE room_id = ?`

// 自动接单
export const getHotelAuto = `SELECT hotel_is_auto, hotel_auto_base hotel_auto_base_obj FROM ${ hotel } WHERE hotel_id = ?`
export const getUnOrder = `SELECT * FROM ${ live } WHERE hotel_id = ? AND status = -1`
export const updateAutoOrder = `UPDATE ${ live } SET status = 0, is_auto_order = 1 WHERE hotel_id = ? AND live_id = ?`

// hotel_study
export const getHotelStudyVideo = `SELECT * FROM ${  hotel_study }`

// get live order info
export const getOrderByHotelId = `SELECT * FROM ${ live } WHERE hotel_id = ? ORDER BY order_time DESC`

// comment
export const getComment = `SELECT * FROM ${ comment } WHERE live_id = ?`
export const addComment = `INSERT INTO ${ comment }(live_id, from_id, to_id, comment_type, content, comment_time) VALUES (?,?,?,?,?,?)`
export const getAllCommentByHotelId = (hotel_id: string) => {
  return `SELECT * FROM ${ comment } WHERE (to_id = ${ hotel_id } AND comment_type = 'USER') OR (from_id = ${ hotel_id } AND comment_type = 'HOTEL') ORDER BY comment_time DESC`
}

// hos
export const addHotelHos = `INSERT INTO ${ hos }(hotel_id, hos_score, hos_des, hosTime) VALUES (?,?,?, ?)`
export const getHosList = `SELECT * from ${ hos } WHERE hotel_id = ? ORDER BY hosTime DESC`

// live data analysis

export const getOneYearData = (year: number, hotel_id: string) => {
  const startYear = new Date(`${ year }/1/1`).getTime()
  const endYear = new Date(`${ year + 1 }/1/1`).getTime()
  return `SELECT * FROM ${ live } WHERE hotel_id = ${ hotel_id } AND order_time >= ${ startYear } AND order_time <= ${ endYear }`
}