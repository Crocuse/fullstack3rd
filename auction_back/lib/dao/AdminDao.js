// dbSql.js
const DB = require("./db");

const AdminDao = {
    isMember:(id)=>{

        DB.query(`
          SELECT COUNT(*) as count FROM (
            SELECT M_ID as ID FROM TBL_MEMBER
            UNION ALL
            SELECT A_ID as ID FROM TBL_ADMIN
          ) AS combined WHERE ID = ?
        `, [id], (err, rst) => {
          if (err) {
            return 'error';
          } else if (rst[0].count > 0) {
            return 'is_member';
          } else {
            return 'not_member';
          }
          
        });
    }
};

module.exports = AdminDao;