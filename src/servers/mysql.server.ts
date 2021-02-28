import { MysqlError, PoolConnection } from 'mysql';

var mysql = require('mysql')
var mysqlBaseConfig = require('../config/mysql')

var pool = mysql.createPool(mysqlBaseConfig);

pool.getConnection((err: MysqlError, connect: PoolConnection) => {
  if(err) throw err;
  connect.query('select * from user', (err: any, res: any, fields: any) => {
    connect.release();

    if(err) throw err;
    // console.log(res, fields)
  })
})


pool.on('connection', (connection: any) => {
  console.log('connection')
})
