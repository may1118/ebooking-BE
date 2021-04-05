const userTable = 'user'
const chinaRegin = 'china_region'
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