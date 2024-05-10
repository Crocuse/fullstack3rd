// dbSql.js
const DB = require("./db");

const dbSql = {
  select: (table, param, etc) => {
    return new Promise((resolve, reject) => {
      let paramSql = '';
      param.map((item) => {
        paramSql += `${item}, `;
      });
      paramSql = paramSql.slice(0, -2); // Remove the last comma and space

      let sql = `SELECT ${paramSql} FROM ${table} `;
      if (etc != null) {
        sql += `${etc}`;
      }

      DB.query(sql, (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
};

module.exports = dbSql;