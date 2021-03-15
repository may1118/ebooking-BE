import { MysqlError, PoolConnection, Pool } from 'mysql';

var mysql = require('mysql')
var mysqlBaseConfig = require('../config/mysql')

// init DBPool
const pool = mysql.createPool(mysqlBaseConfig);


export const query = function (sql: string, values: Array<string>) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err: MysqlError, connection: PoolConnection) {
      if (err) {
        reject(err)
      } else {
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
