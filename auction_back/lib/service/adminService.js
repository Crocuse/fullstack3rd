const DB = require("../db/db");
const bcrypt = require('bcrypt');

const adminService = {
    
    isMember: (req, res) => {
        let id = req.query.id;
        DB.query(`
          SELECT COUNT(*) as count FROM (
            SELECT M_ID as ID FROM TBL_MEMBER
            UNION ALL
            SELECT A_ID as ID FROM TBL_ADMIN
          ) AS combined WHERE ID = ?
        `, [id], (err, rst) => {
          if (err) {
            console.log(err);
            res.json('error');
            return;
          }
          if (rst[0].count > 0) {
            res.json('is_member');
          } else {
            res.json('not_member');
          }
        });
      },

      isMail: (req, res) => {
        let mail = req.body.mail;
        DB.query(`
          SELECT COUNT(*) as count FROM (
            SELECT M_MAIL as MAIL FROM TBL_MEMBER
            UNION ALL
            SELECT A_MAIL as MAIL FROM TBL_ADMIN
          ) AS combined WHERE MAIL = ?
        `, [mail], (err, rst) => {
          if (err) {
            console.log(err);
            res.json('error');
            return;
          }
          if (rst[0].count > 0) {
            res.json('is_mail');
          } else {
            res.json('not_mail');
          }
        });
      },

    adminRegistConfirm: (req, res) => {
        let post = req.body;

        DB.query('INSERT INTO TBL_ADMIN(A_ID, A_PW, A_NAME, A_MAIL, A_PHONE) VALUES(?, ?, ?, ?, ?)',
        [post.a_id, bcrypt.hashSync(post.a_pw, 10), post.a_name, post.a_mail,post.a_phone],
        (err, rst) => {
            if (rst.affectedRows > 0) {
                res.json('success');
                return;
            }

            console.log(err);
            res.json('fail');
        })
    },
    admin_list:(req,res)=>{
        
        DB.query(`SELECT * FROM TBL_ADMIN`,(err,admins)=>{
            if(err){
                res.json(null);
            } else {
                res.json(admins);
            }
        })
    }

}

module.exports = adminService;