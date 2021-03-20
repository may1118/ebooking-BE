const userTable = 'user'


export const registerUser = `INSERT INTO ${userTable}(user_name, user_password, user_phone, user_email) VALUES (?, ?, ?, ?)`
export const registerBefore = `SELECT * FROM ${userTable} WHERE user_phone=?`
// 'INSERT INTO user(uname,schoolNum,tel,password) VALUES(?,?,?,?)'