const userTable = 'user'
const chinaRegin = 'china_region'
const hotel = 'hotel'
const live_user = 'live_user'
const room = 'room'
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

// room
export const getRoom = `SELECT hotel_id, room_id, room_quantity room_number, room_price, room_name FROM ${ room } WHERE hotel_id = ?`