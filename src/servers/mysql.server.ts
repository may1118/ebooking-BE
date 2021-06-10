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
export const query = function (sql: string, values: Array<string>, isEncrypt?: Boolean, notSingle2Obj?: boolean): Promise<any> {
  isEncrypt = isEncrypt ? true : false
  notSingle2Obj = notSingle2Obj ? true : false

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
            // 优化，加入返回的数组长度为1，则直接返回那一个obj即可
            const stringifyRes = JSON.parse(JSON.stringify(rows))
            if (stringifyRes.length === 1 && !notSingle2Obj) {
              const [singleObj] = stringifyRes
              resolve(singleObj)
            } else {
              resolve(stringifyRes)
            }
          }
          connection.release()
        })
      }
    })
  })
}

export const queryNoParams = function (sql: string, notSingle2Obj?: boolean): Promise<any> {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err: MysqlError, connection: PoolConnection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, (err, rows) => {
          if (err) {
            throw 'error'
          } else {
            // 优化，加入返回的数组长度为1，则直接返回那一个obj即可
            const stringifyRes = JSON.parse(JSON.stringify(rows))
            if (stringifyRes.length === 1 && !notSingle2Obj) {
              const [singleObj] = stringifyRes
              resolve(singleObj)
            } else {
              resolve(stringifyRes)
            }
          }
          connection.release()
        })
      }
    })
  })
}
