import { MysqlError, PoolConnection, Pool } from 'mysql';

var mysql = require('mysql')
var mysqlBaseConfig = require('../config/mysql')

// init DBPool
const pool: Pool = mysql.createPool(mysqlBaseConfig);

// 加密算法
import { encrypt } from '../controllers/encryption'

/**
 * 
 * @param sql 需要执行的SQL语句
 * @param values SQL字段中需要添加的信息
 * @param isEncrypt 可选字段 是否加密 默认是false
 * @returns 执行结果 & 状态
 */
export const query = function (sql: string, values: Array<string>, isEncrypt?: Boolean) {
  isEncrypt = isEncrypt ? true : false

  return new Promise((resolve, reject) => {
    pool.getConnection(function (err: MysqlError, connection: PoolConnection) {
      if (err) {
        reject(err)
      } else {
        if (isEncrypt) values = values.map(item => encrypt(item))
        connection.query(sql, values, (err, rows) => {

          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}
