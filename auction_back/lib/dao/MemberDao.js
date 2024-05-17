const DB = require('../db/db');
const bcrypt = require('bcrypt');
const generateTemp = require('../util/uuidGenerator');

// dbSql.js

const MemberDao = {
    isMember: (id) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `
            SELECT COUNT(*) as count FROM (
              SELECT M_ID as ID FROM TBL_MEMBER
              UNION ALL
              SELECT A_ID as ID FROM TBL_ADMIN
            ) AS combined WHERE ID = ?
          `,
                [id],
                (err, rst) => {
                    if (err) {
                        console.log(err);
                        reject('error');
                    }
                    if (rst[0].count > 0) {
                        resolve('is_member');
                    } else {
                        resolve('not_member');
                    }
                }
            );
        });
    },

    isMail: (mail) => {
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
        });
    },

    signupConfirm: (member) => {
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
        });
    },

    loginSuccess: (req) => {
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
        });
    },

    getMyInfo: (req) => {
        let id = req.query.id;

        return new Promise((resolve, reject) => {
            DB.query('SELECT * FROM TBL_MEMBER WHERE M_ID = ?', [id], (err, member) => {
                if (err || member.length == 0) {
                    console.log(err);
                    resolve('error');
                    return;
                }
                DB.query(
                    'SELECT P_CURRENT FROM TBL_POINT WHERE M_ID = ? ORDER BY P_REG_DATE DESC LIMIT 1',
                    [id],
                    (err, point) => {
                        if (err) {
                            console.log(err);
                            resolve('error');
                            return;
                        }
                        resolve({ member, point });
                    }
                );
            });
        });
    },

    modifyPhone: (req) => {
        return new Promise((resolve, reject) => {
            let m_phone = req.body.m_phone;
            let m_id = req.body.id;

            DB.query(
                'UPDATE TBL_MEMBER SET M_PHONE = ?, M_MOD_DATE = NOW() WHERE M_ID = ?',
                [m_phone, m_id],
                (err, rst) => {
                    if (err || rst.affectedRows == 0) {
                        console.log(err);
                        resolve('error');
                        return;
                    }

                    resolve('modify success');
                }
            );
        });
    },

    modifyAddr: (req) => {
        return new Promise((resolve, reject) => {
            let m_addr = req.body.m_addr;
            let m_id = req.body.m_id;

            DB.query(
                'UPDATE TBL_MEMBER SET M_ADDR = ?, M_MOD_DATE = NOW() WHERE M_ID = ?',
                [m_addr, m_id],
                (err, rst) => {
                    if (err || rst.affectedRows == 0) {
                        console.log(err);
                        resolve('error');
                        return;
                    }

                    resolve('modify success');
                }
            );
        });
    },

    checkPassword: (req) => {
        return new Promise((resolve, reject) => {
            let id = req.body.id;
            let pw = req.body.pw;
            DB.query('SELECT M_PW FROM TBL_MEMBER WHERE M_ID = ?', [id], (err, member) => {
                if (err || member.affectedRows == 0) {
                    console.log(err);
                    resolve('error');
                    return;
                }
                if (bcrypt.compareSync(pw, member[0].M_PW)) resolve('success');
                else resolve('fail');
            });
        });
    },

    socialIdCheck: (req) => {
        return new Promise((resolve, reject) => {
            let loginedId = req.query.loginedId;

            DB.query('SELECT M_SOCIAL_ID FROM TBL_MEMBER WHERE M_ID = ?', [loginedId], (err, rst) => {
                if (err) {
                    console.log(err);
                    resolve('error');
                    return;
                }

                if (rst.length > 0) resolve(true);
                else resolve(false);
            });
        });
    },

    getMyRegistList: (req) => {
        return new Promise((resolve, reject) => {
            let id = req.body.id;
            let page = req.body.page || 1;
            let limit = req.body.limit || 10;
            let offset = (page - 1) * limit;

            DB.query(
                `SELECT GR.GR_NO, GR_NAME, GR_PRICE, GR_INFO, GR_APPROVAL, GR_RECEIPT, AS_START_DATE, GR_REJECTED_REASON  
                    FROM TBL_GOODS_REGIST AS GR 
                    LEFT JOIN TBL_AUCTION_SCHEDULE AS A ON GR.GR_NO = A.GR_NO 
                    WHERE GR.M_ID = ? 
                    ORDER BY GR.GR_NO DESC
                    LIMIT ? OFFSET ?`,
                [id, limit, offset],
                (err, list) => {
                    if (err) {
                        console.log(err);
                        resolve('error');
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
                                resolve('error');
                                return;
                            }

                            let total = rst[0].total;
                            let totalPages = Math.ceil(total / limit);

                            resolve({ list, totalPages });
                        }
                    );
                }
            );
        });
    },

    modifyPassword: (id, pw) => {
        return new Promise((resolve, reject) => {
            DB.query(
                'UPDATE TBL_MEMBER SET M_PW = ?, M_MOD_DATE = NOW() WHERE M_ID = ?',
                [bcrypt.hashSync(pw, 10), id],
                (err, member) => {
                    if (err || member.affectedRows == 0) {
                        console.log('err: ', err);
                        resolve('error');
                        return;
                    }

                    resolve('modified');
                }
            );
        });
    },

    cancelGoods: (req) => {
        return new Promise((resolve, reject) => {
            let gr_no = req.query.gr_no;

            DB.query('DELETE FROM TBL_GOODS_REGIST WHERE GR_NO = ?', [gr_no], (err, rst) => {
                if (err) {
                    console.log(err);
                    resolve('error');
                    return;
                }

                resolve('deleted');
            });
        });
    },

    getMySells: (req) => {
        return new Promise((resolve, reject) => {
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
                        resolve('error');
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
                                resolve('error');
                                return;
                            }

                            let total = rst[0].total;
                            let totalPages = Math.ceil(total / limit);
                            resolve({ list, totalPages });
                        }
                    );
                }
            );
        });
    },

    getMyWinnigs: (req) => {
        return new Promise((resolve, reject) => {
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
                        resolve('error');
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
                                resolve('error');
                                return;
                            }

                            let total = rst[0].total;
                            let totalPages = Math.ceil(total / limit);

                            resolve({ winnigs, totalPages });
                        }
                    );
                }
            );
        });
    },

    getMyPointHistory: (req) => {
        return new Promise((resolve, reject) => {
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
                        resolve('error');
                        return;
                    }

                    DB.query('SELECT COUNT(*) AS total FROM TBL_POINT WHERE M_ID = ?', [id], (err, rst) => {
                        if (err) {
                            console.log(err);
                            resolve('error');
                            return;
                        }

                        let total = rst[0].total;
                        let totalPages = Math.ceil(total / limit);

                        resolve({ history, totalPages });
                    });
                }
            );
        });
    },

    findId: (mail) => {
        return new Promise((resolve, reject) => {
            DB.query('SELECT M_ID FROM TBL_MEMBER WHERE M_MAIL = ?', [mail], (err, m_id) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                } else {
                    resolve(m_id);
                }
            });
        });
    },

    memberDelete: (req) => {
        return new Promise((resolve, reject) => {
            let id = req.query.id;
            let shortId = generateTemp(6);

            DB.query(
                `UPDATE TBL_MEMBER SET M_PW = 'Withdrawal member_${shortId}', M_MAIL = 'Withdrawal member_${shortId}', M_PHONE ='Withdrawal member_${shortId}', M_ADDR = 'Withdrawal member_${shortId}', M_STATUS = 1, M_MOD_DATE = NOW() WHERE M_ID = ?`,
                [id],
                (err, rst) => {
                    if (err) {
                        console.log(err);
                        resolve('error');
                        return;
                    }

                    req.logout(() => {
                        resolve('deleted');
                    });
                }
            );
        });
    },

    modifyGoodsSelect:(req)=>{
        return new Promise((resolve, reject) => {
            let gr_no = req.query.gr_no;

            DB.query(
                `SELECT * FROM TBL_GOODS_REGIST WHERE GR_NO = ?`,[gr_no],(err,goods)=>{
                    if(err){
                        console.log(err);
                        reject(err);
                        return;
                    } else {
                        DB.query(`
                            SELECT * FROM TBL_GOODS_IMG WHERE GR_NO = ?
                        `,[gr_no],(err,images)=>{
                            if(err){
                                console.log(err);
                                reject(err);
                                return;
                            } else {
                                resolve({ goods: goods[0], images });
                            }
                        })
                    }
                });
        })
    },

    
};

module.exports = MemberDao;
