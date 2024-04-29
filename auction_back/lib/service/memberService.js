const DB = require("../db/db");
const bcrypt = require('bcrypt');

const memberService = {
    
    sessionCheck: (req, res) => {
        let sessionId = req.body.sessionId;
        console.log("🚀 ~ req.sessionID:", req.sessionID)
        console.log("🚀 ~ sessionID:", sessionId)
        
        if(req.sessionID == sessionId) {
            res.json('session correct')
        }
        else {
            res.json('session incorrect')
        }

    },
    
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
        [post.m_id, bcrypt.hashSync(post.m_pw, 10), post.m_mail, post.m_phone, post.m_addr],
        (err, rst) => {
            if (rst.affectedRows > 0) {
                res.json('success');
                return;
            }

            console.log(err);
            res.json('fail');
        })
    },

    loginSuccess: (req, res) => {
        if (req.user == 'super') {
            res.json({
                'sessionID': req.sessionID,
                'loginedId': req.user,
                'loginedAdmin': 'super'
            })
        }

        DB.query('SELECT * FROM TBL_ADMIN WHERE A_ID = ?', [req.user], (err, admin) => {
            if (admin.length > 0) {
                res.json({
                    'sessionID': req.sessionID,
                    'loginedId': req.user,
                    'loginedAdmin': 'admin'
                })
            }

            else {
                res.json({
                    'sessionID': req.sessionID,
                    'loginedId': req.user,
                })
            }
        })
    },

    loginFail: (req, res) => {
        res.json({
            'error': req.flash('error')
        })
    },

    logoutConfirm: (req, res) => {
        req.logout(() => {
            res.json('logout');
        });
    }
}

module.exports = memberService;