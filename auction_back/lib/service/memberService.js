const DB = require("../db/db");
const bcrypt = require('bcrypt');

const memberService = {
    
    isMember: (req, res) => {
        let m_id = req.query.id;

        DB.query('SELECT COUNT(*) as count FROM TBL_MEMBER WHERE M_ID = ?', [m_id], (err, rst) => {
            if (err) {
                console.log(err);
                res.json('error');
                return;
            }

            if (rst[0].count > 0) 
                res.json('is_member');
            else 
                res.json('not_member');
        })
    },

    isMail: (req, res) => {
        let m_mail = req.body.mail;

        DB.query('SELECT COUNT(*) as count FROM TBL_MEMBER WHERE M_MAIL = ?', [m_mail], (err, rst) => {
            if (err) {
                console.log(err);
                res.json('error');
                return;
            }

            if (rst[0].count > 0) 
                res.json('is_mail');
            else 
                res.json('not_mail');
        })
    },

    signupConfirm: (req, res) => {
        let post = req.body;

        DB.query('INSERT INTO TBL_MEMBER(M_ID, M_PW, M_MAIL, M_PHONE, M_ADDR) VALUES(?, ?, ?, ?, ?)',
        [post.m_mail, bcrypt.hashSync(post.m_pw, 10), post.m_mail, post.m_phone, post.m_addr],
        (err, rst) => {
            if (rst.affectedRows > 0) {
                res.json('success');
                return;
            }

            console.log(err);
            res.json('fail');
        })
    }

}

module.exports = memberService;