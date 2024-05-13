const DB = require("../db/db");
const bcrypt = require('bcrypt');

// dbSql.js

const MemberDao = {
    
    isMember:(id)=>{
          return new Promise((resolve, reject) => {
            DB.query(`
            SELECT COUNT(*) as count FROM (
              SELECT M_ID as ID FROM TBL_MEMBER
              UNION ALL
              SELECT A_ID as ID FROM TBL_ADMIN
            ) AS combined WHERE ID = ?
          `, [id],(err, rst) => {
                if (err) {
                    console.log(err);
                    reject('error');
                }
                if (rst[0].count > 0) {resolve('is_member');}
                else {resolve('not_member');}
            });
          })  
    },
    isMail:(mail)=>{
        return new Promise((resolve, reject) => {
            DB.query('SELECT COUNT(*) as count FROM TBL_MEMBER WHERE M_MAIL = ?', [mail], (err, rst) => {
                if (err) {
                    console.log(err);
                    resolve('error');
                    return;
                }
                if (rst[0].count > 0) resolve('is_mail');
                else resolve('not_mail');
            });
        })
    },
    signupConfirm:(member)=>{
        return new Promise((resolve, reject) => {
            DB.query(
                'INSERT INTO TBL_MEMBER(M_ID, M_PW, M_MAIL, M_PHONE, M_ADDR) VALUES(?, ?, ?, ?, ?)',
                [member.m_id, bcrypt.hashSync(member.m_pw, 10), member.m_mail, member.m_phone, member.m_addr],
                (err, rst) => {
                    
                    if (rst.affectedRows > 0) {
                        resolve('success');
                        return;
                    }
    
                    console.log(err);
                    resolve('fail');
                }
            );
        })
    },
    loginSuccess:(req)=>{
        return new Promise((resolve, reject) => {
            DB.query('SELECT * FROM TBL_ADMIN WHERE A_ID = ?', [req.user], (err, admin) => {
                if (admin.length > 0) {
                    resolve({
                        sessionID: req.sessionID,
                        loginedId: req.user,
                        loginedAdmin: 'admin',
                    });
                } else {
                    resolve({
                        sessionID: req.sessionID,
                        loginedId: req.user,
                    });
                }
            });
        })
    }

};

module.exports = MemberDao;