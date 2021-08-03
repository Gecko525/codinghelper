const mysql = require('mysql')
const MYSQL_CONFIG = require('./config')

const pool = mysql.createPool(MYSQL_CONFIG)
console.log('数据库已连接');
const query = (sql, arg) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) reject(err);
      else {
        connection.query(sql, arg, (error, results, fields) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(results)
          }
          // 结束会话
          connection.release();
        })
      }
    })
  })
}

module.exports = { query };