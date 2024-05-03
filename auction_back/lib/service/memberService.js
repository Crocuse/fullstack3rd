const DB = require('../db/db');
const bcrypt = require('bcrypt');
const google = require('../config/google.json');
const naver = require('../config/naver.json');
const mailService = require('./gmailService');
const shortId = require('shortid');

const memberService = {
    sessionCheck: (req, res) => {
        let sessionId = req.body.sessionId;

        if (req.sessionID == sessionId) {
            res.json('session correct');
        } else {
            res.json('session incorrect');
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

            if (rst[0].count > 0) res.json('is_member');
            else res.json('not_member');
        });
    },

    isMail: (req, res) => {
        let m_mail = req.body.mail;

        DB.query('SELECT COUNT(*) as count FROM TBL_MEMBER WHERE M_MAIL = ?', [m_mail], (err, rst) => {
            if (err) {
                console.log(err);
                res.json('error');
                return;
            }

            if (rst[0].count > 0) res.json('is_mail');
            else res.json('not_mail');
        });
    },

    mailCodeSend: (req, res) => {
        let mail = req.body.mail;
        let subject = `[비드버드] 회원가입 이메일 인증 코드입니다.`;
        let code = shortId.generate();

        let html = `
            <div
                style="
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 5px;
                text-align: center;
            "
            >
                <img src="https://i.imgur.com/D3lJNvg.png" />
                <h3 style="font-size: 24px; margin-bottom: 20px">이메일 인증 안내</h3>
                <div style="font-size: 16px; line-height: 1.5; margin-bottom: 20px">
                    안녕하세요. 비드버드를 이용해주셔서 감사드립니다. <br />
                    회원가입 화면에서 다음 코드를 이용하여 메일 인증을 완료해주세요.
                </div>
                <div
                    style="
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    border-radius: 5px;
                    padding: 20px;
                    font-size: 20px;
                    font-weight: bold;
                "
                >
                    코드: <span style="color: #ff6600">${code}</span>
                </div>
            </div>
        `;
        mailService.sendGmail(mail, subject, html);

        res.json(code);
    },

    signupConfirm: (req, res) => {
        let post = req.body;

        DB.query(
            'INSERT INTO TBL_MEMBER(M_ID, M_PW, M_MAIL, M_PHONE, M_ADDR) VALUES(?, ?, ?, ?, ?)',
            [post.m_id, bcrypt.hashSync(post.m_pw, 10), post.m_mail, post.m_phone, post.m_addr],
            (err, rst) => {
                if (rst.affectedRows > 0) {
                    res.json('success');
                    return;
                }

                console.log(err);
                res.json('fail');
            }
        );
    },

    googleLogin: (req, res) => {
        const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${encodeURIComponent(
            'http://localhost:3000/auth/google/callback'
        )}&scope=https://www.googleapis.com/auth/plus.login email&client_id=${google.web.client_id}`;
        res.json({ url: googleAuthURL });
    },

    naverLogin: (req, res) => {
        const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
            naver.web.client_id
        }&redirect_uri=${encodeURIComponent(naver.web.redirect_uri)}`;
        res.json({ url: naverAuthURL });
    },

    loginSuccess: (req, res) => {
        if (req.user == 'super') {
            res.json({
                sessionID: req.sessionID,
                loginedId: req.user,
                loginedAdmin: 'super',
            });
            return;
        }

        DB.query('SELECT * FROM TBL_ADMIN WHERE A_ID = ?', [req.user], (err, admin) => {
            if (admin.length > 0) {
                res.json({
                    sessionID: req.sessionID,
                    loginedId: req.user,
                    loginedAdmin: 'admin',
                });
            } else {
                res.json({
                    sessionID: req.sessionID,
                    loginedId: req.user,
                });
            }
        });
    },

    loginFail: (req, res) => {
        res.json({
            error: req.flash('error'),
        });
    },

    getMyInfo: (req, res) => {
        let id = req.query.id;
        DB.query('SELECT * FROM TBL_MEMBER WHERE M_ID = ?', [id], (err, member) => {
            if (err || member.length == 0) {
                console.log(err);
                res.json('error');
                return;
            }

            DB.query(
                'SELECT P_CURRENT FROM TBL_POINT WHERE M_ID = ? ORDER BY P_REG_DATE DESC LIMIT 1',
                [id],
                (err, point) => {
                    if (err) {
                        console.log(err);
                        res.json('error');
                        return;
                    }

                    const selectedMember = {
                        ...member[0],
                        M_ADDR: member[0].M_ADDR.replace(/\//g, ' '),
                    };

                    let currentPoint = 0;
                    if (point.length != 0) currentPoint = point[0];

                    res.json({ selectedMember, currentPoint });
                }
            );
        });
    },

    modifyPhone: (req, res) => {
        let m_phone = req.body.m_phone;

        DB.query('UPDATE TBL_MEMBER SET M_PHONE = ?', [m_phone], (err, rst) => {
            if (err || rst.affectedRows == 0) {
                console.log(err);
                res.json('error');
                return;
            }

            res.json('modify success');
        });
    },

    modifyAddr: (req, res) => {
        let m_addr = req.body.m_addr;

        DB.query('UPDATE TBL_MEMBER SET M_ADDR = ?', [m_addr], (err, rst) => {
            if (err || rst.affectedRows == 0) {
                console.log(err);
                res.json('error');
                return;
            }

            res.json('modify success');
        });
    },

    checkPassword: (req, res) => {
        let id = req.body.id;
        let pw = req.body.pw;

        DB.query('SELECT M_PW FROM TBL_MEMBER WHERE M_ID = ?', [id], (err, member) => {
            if (err || member.affectedRows == 0) {
                console.log(err);
                res.json('error');
                return;
            }

            if (bcrypt.compareSync(pw, member[0].M_PW)) res.json('success');
            else res.json('fail');
        });
    },

    socialIdCheck: (req, res) => {
        let loginedId = req.query.loginedId;

        DB.query('SELECT M_SOCIAL_ID FROM TBL_MEMBER WHERE M_ID = ?', [loginedId], (err, rst) => {
            if (err) {
                console.log(err);
                res.json('error');
                return;
            }

            if (rst.length > 0) res.json(true);
            else res.json(false);
        });
    },

    modifyPassword: (req, res) => {
        let id = req.body.id;
        let pw = req.body.pw;

        DB.query('UPDATE TBL_MEMBER SET M_PW = ? WHERE M_ID = ?', [bcrypt.hashSync(pw, 10), id], (err, member) => {
            if (err || member.affectedRows == 0) {
                console.log('err: ', err);
                res.json('error');
                return;
            }

            res.json('modified');
        });
    },

    getMyRegistList: (req, res) => {
        let id = req.body.id;
        let page = req.body.page || 1;
        let limit = req.body.limit || 10;
        let offset = (page - 1) * limit;

        DB.query(
            `SELECT GR.GR_NO, GR_NAME, GR_PRICE, GR_INFO, GR_APPROVAL, GR_RECEIPT, AS_START_DATE  
                FROM TBL_GOODS_REGIST AS GR 
                LEFT JOIN TBL_AUCTION_SCHEDULE AS A ON GR.GR_NO = A.GR_NO 
                WHERE GR.M_ID = ? 
                ORDER BY GR.GR_NO DESC
                LIMIT ? OFFSET ?`,
            [id, limit, offset],
            (err, list) => {
                if (err) {
                    console.log(err);
                    res.json('error');
                    return;
                }

                DB.query(
                    `SELECT COUNT(*) AS total 
                    FROM TBL_GOODS_REGIST AS GR 
                    LEFT JOIN TBL_AUCTION_SCHEDULE AS A ON GR.GR_NO = A.GR_NO 
                    WHERE GR.M_ID = ? `,
                    [id],
                    (err, rst) => {
                        if (err) {
                            console.log(err);
                            res.json('error');
                            return;
                        }

                        let total = rst[0].total;
                        let totalPages = Math.ceil(total / limit);

                        res.json({ list, totalPages });
                    }
                );
            }
        );
    },

    getMySells: (req, res) => {
        let id = req.body.id;
        let page = req.body.page || 1;
        let limit = req.body.limit || 10;
        let offset = (page - 1) * limit;

        DB.query(
            `SELECT AR.AR_IS_BID, AR.AR_POINT, AR.AR_REG_DATE, GR.GR_NAME, GR.GR_PRICE, GI.GI_NAME
                FROM TBL_AUCTION_RESULT AS AR 
                LEFT JOIN TBL_GOODS_REGIST AS GR ON AR.GR_NO = GR.GR_NO 
                LEFT JOIN TBL_GOODS_IMG AS GI ON AR.GR_NO = GI.GR_NO
                WHERE AR.AR_SELL_ID = ?
                ORDER BY AR.AR_REG_DATE DESC 
                LIMIT ? OFFSET ?`,
            [id, limit, offset],
            (err, list) => {
                if (err) {
                    console.log(err);
                    res.json('error');
                    return;
                }

                DB.query(
                    `SELECT COUNT(*) AS total FROM TBL_AUCTION_RESULT AS AR 
                LEFT JOIN TBL_GOODS_REGIST AS GR ON AR.GR_NO = GR.GR_NO 
                LEFT JOIN TBL_GOODS_IMG AS GI ON AR.GR_NO = GI.GR_NO
                WHERE AR.AR_SELL_ID = ?`,
                    [id],
                    (err, rst) => {
                        if (err) {
                            console.log(err);
                            res.json('error');
                            return;
                        }

                        let total = rst[0].total;
                        let totalPages = Math.ceil(total / limit);
                        res.json({ list, totalPages });
                    }
                );
            }
        );
    },

    getMyWinnigs: (req, res) => {
        let id = req.body.id;
        let page = req.body.page || 1;
        let limit = req.body.limit || 10;
        let offset = (page - 1) * limit;

        DB.query(
            `SELECT AR.GR_NO, GR_NAME, GR_PRICE, AR_POINT, AR_REG_DATE
                    FROM TBL_AUCTION_RESULT AS AR
                    LEFT JOIN TBL_GOODS_REGIST AS GR ON AR.GR_NO = GR.GR_NO
                    WHERE AR.AR_BUY_ID = ? AND AR.AR_IS_BID = 1 
                    ORDER BY AR.AR_REG_DATE DESC 
                    LIMIT ? OFFSET ?`,
            [id, limit, offset],
            (err, winnigs) => {
                if (err) {
                    console.log(err);
                    res.json('error');
                    return;
                }

                DB.query(
                    `SELECT COUNT(*) as total
                    FROM TBL_AUCTION_RESULT AS AR
                    LEFT JOIN TBL_GOODS_REGIST AS GR ON AR.GR_NO = GR.GR_NO
                    WHERE AR.AR_BUY_ID = ? AND AR.AR_IS_BID = 1 `,
                    [id],
                    (err, rst) => {
                        if (err) {
                            console.log(err);
                            res.json('error');
                            return;
                        }

                        let total = rst[0].total;
                        let totalPages = Math.ceil(total / limit);

                        res.json({ winnigs, totalPages });
                    }
                );
            }
        );
    },

    getMyPointHistory: (req, res) => {
        let id = req.body.id;
        let page = req.body.page || 1;
        let limit = req.body.limit || 10;
        let offset = (page - 1) * limit;

        DB.query(
            'SELECT * FROM TBL_POINT WHERE M_ID = ? ORDER BY P_REG_DATE DESC LIMIT ? OFFSET ?',
            [id, limit, offset],
            (err, history) => {
                if (err) {
                    console.log(err);
                    res.json('error');
                    return;
                }

                DB.query('SELECT COUNT(*) AS total FROM TBL_POINT WHERE M_ID = ?', [id], (err, rst) => {
                    if (err) {
                        console.log(err);
                        res.json('error');
                        return;
                    }

                    let total = rst[0].total;
                    let totalPages = Math.ceil(total / limit);

                    res.json({ history, totalPages });
                });
            }
        );
    },

    logoutConfirm: (req, res) => {
        req.logout(() => {
            res.json('logout');
        });
    },

    findId: (req, res) => {
        let mail = req.query.mail;

        DB.query('SELECT M_ID FROM TBL_MEMBER WHERE M_MAIL = ?', [id], (err, m_id) => {
            if (err) {
                console.log(err);
                res.json('error');
                return;
            }

            if (m_id.length === 0) {
                res.json('not_found');
                return;
            }

            if (m_id[0].slice(0, 2) === 'G_') {
                res.json('google_id');
            } else if (m_id[0].slice(0, 2) === 'N_') {
                res.json('naver_id');
            }
        });
    },
};

module.exports = memberService;
