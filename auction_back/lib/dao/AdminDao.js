// dbSql.js
const DB = require('../db/db');
const bcrypt = require('bcrypt');

const AdminDao = {
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

    adminRegistConfirm: (post) => {
        return new Promise((resolve, reject) => {
            DB.query(
                'INSERT INTO TBL_ADMIN(A_ID, A_PW, A_NAME, A_MAIL, A_PHONE) VALUES(?, ?, ?, ?, ?)',
                [post.a_id, bcrypt.hashSync(post.a_pw, 10), post.a_name, post.a_mail, post.a_phone],
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

    adminList: () => {
        return new Promise((resolve, reject) => {
            DB.query(`SELECT * FROM TBL_ADMIN ORDER BY A_REG_DATE ASC`, (err, admins) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(admins);
                }
            });
        });
    },

    memberList: () => {
        return new Promise((resolve, reject) => {
            DB.query(`SELECT * FROM TBL_MEMBER ORDER BY M_REG_DATE DESC`, (err, members) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(members);
                }
            });
        });
    },

    adminDelete: (id) => {
        return new Promise((resolve, reject) => {
            DB.query(`DELETE FROM TBL_ADMIN WHERE A_ID =?`, [id], (err, result) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });
    },

    memberDelete: (id, uuId) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `UPDATE TBL_MEMBER SET M_STATUS = 1,
                      M_PW = 'Withdrawal member_${uuId}',
                      M_MAIL='Withdrawal member_${uuId}',
                      M_PHONE='Withdrawal member_${uuId}',
                      M_ADDR='Withdrawal member_${uuId}', 
                      M_MOD_DATE = NOW() 
                      WHERE M_ID =?`,
                [id],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(null);
                    } else {
                        resolve(result.affectedRows);
                    }
                }
            );
        });
    },

    adminModifyConfirm: (post) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `UPDATE TBL_ADMIN SET A_NAME =?,A_PHONE=?,A_MAIL=?,A_MOD_DATE = NOW() WHERE A_ID =?`,
                [post.a_name, post.a_phone, post.a_mail, post.a_id],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(result.affectedRows);
                    }
                }
            );
        });
    },

    memberModifyConfirm: (post) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `UPDATE TBL_MEMBER SET M_MAIL =?,M_PHONE=?,M_ADDR=?, M_MOD_DATE = NOW() WHERE M_ID =?`,
                [post.M_MAIL, post.M_PHONE, post.M_ADDR, post.M_ID],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(result.affectedRows);
                    }
                }
            );
        });
    },

    goodsList: () => {
        return new Promise((resolve, reject) => {
            DB.query(
                `SELECT 
                          GR.*
                      FROM 
                          TBL_GOODS_REGIST AS GR
                      WHERE 
                          GR.GR_NO 
                      NOT IN (
                      SELECT 
                          GR_NO
                      FROM 
                          TBL_AUCTION_SCHEDULE
                      WHERE 
                          AS_STATUS = 2
                      )
                      ORDER BY 
                          GR.GR_APPROVAL ASC;`,
                (err, goods) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(goods);
                    }
                }
            );
        });
    },

    goodsStateChange: (post) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `UPDATE TBL_GOODS_REGIST SET GR_APPROVAL=?, GR_RECEIPT=? ,GR_MOD_DATE=NOW() WHERE GR_NO = ?`,
                [post.approval, post.receipt, post.gr_no],
                (err1, result1) => {
                    if (err1) {
                        console.log(err1);
                        resolve(null);
                    } else if (post.approval == 1 && post.receipt == 1 && result1.affectedRows == 1) {
                        DB.query(
                            `INSERT INTO TBL_AUCTION_SCHEDULE(GR_NO) VALUES (?)`,
                            [post.gr_no],
                            (err2, result2) => {
                                if (err2) {
                                    console.log(err2);
                                    resolve(null);
                                } else {
                                    resolve('success');
                                }
                            }
                        );
                    } else if (post.approval == 2 || post.approval == 0) {
                        DB.query(`DELETE FROM TBL_AUCTION_SCHEDULE WHERE GR_NO =?`, [post.gr_no], (err3, result3) => {
                            if (err3) {
                                console.log(err3);
                                resolve(null);
                            } else {
                                resolve('success');
                            }
                        });
                    } else {
                        resolve('success');
                    }
                }
            );
        });
    },

    goodsRegList: () => {
        return new Promise((resolve, reject) => {
            DB.query(
                `SELECT 
                          * 
                      FROM 
                          TBL_AUCTION_SCHEDULE AS A 
                      JOIN 
                          TBL_GOODS_REGIST AS GR 
                      ON 
                          A.GR_NO = GR.GR_NO 
                      WHERE 
                          AS_START_DATE > NOW() 
                      OR 
                          AS_START_DATE IS NULL
                      ORDER BY 
                          AS_STATUS`,
                (err, goods) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(goods);
                    }
                }
            );
        });
    },

    checkAuctionSchedule: (as_start_date, as_location_num) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `SELECT COUNT(*) FROM TBL_AUCTION_SCHEDULE WHERE AS_START_DATE = ? AND AS_LOCATION_NUM = ?`,
                [as_start_date, as_location_num],
                (err, count) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(count[0]['COUNT(*)']);
                    }
                }
            );
        });
    },

    updateAuctionSchedule: (as_state, as_start_date, as_location_num, gr_no) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `UPDATE TBL_AUCTION_SCHEDULE SET AS_STATUS = ?, AS_START_DATE = ?, AS_LOCATION_NUM = ?, AS_MOD_DATE = NOW() WHERE GR_NO = ?`,
                [as_state, as_start_date, as_location_num, gr_no],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },

    auctionResultList: () => {
        return new Promise((resolve, reject) => {
            DB.query(
                `
                    SELECT 
                    AR.GR_NO,
                    AR.AR_IS_BID,
                    AR.AR_SELL_ID,
                    AR.AR_BUY_ID,
                    AR.AR_POINT,
                    AR.AR_REG_DATE,
                    AR.AR_MOD_DATE,
                    GR.GR_NAME
                    FROM 
                    TBL_AUCTION_RESULT AS AR
                    JOIN TBL_GOODS_REGIST AS GR ON AR.GR_NO = GR.GR_NO
                    ORDER BY
                    AR.AR_REG_DATE DESC
                `,
                (err, results) => {
                    if (err) {
                        console.log(err);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    },

    deliveryGoods: (gr_no) => {
        return new Promise((resolve, reject) => {
            DB.query(`UPDATE TBL_DELIVERY_GOODS SET DG_STATUS = 1 WHERE GR_NO = ?`, [gr_no], (err, result) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });
    },

    getSalesData: () => {
        return new Promise((resolve, reject) => {
            DB.query(
                `
            SELECT 
            AR.GR_NO,
            AR.AR_IS_BID,
            AR.AR_SELL_ID,
            AR.AR_BUY_ID,
            AR.AR_POINT,
            AR.AR_REG_DATE,
            AR.AR_MOD_DATE,
            TAS.AS_LOCATION_NUM,
            GR.GR_NAME
            FROM
            TBL_AUCTION_RESULT AR
                JOIN
            TBL_AUCTION_SCHEDULE TAS ON AR.GR_NO = TAS.GR_NO
                JOIN
            TBL_GOODS_REGIST GR ON AR.GR_NO = GR.GR_NO
            ORDER BY AR_REG_DATE DESC`,
                (err, datas) => {
                    if (err) {
                        console.log(err);
                        resolve(null);
                    } else {
                        resolve(datas);
                    }
                }
            );
        });
    },

    goodsRejectReason: (post) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `UPDATE TBL_GOODS_REGIST SET GR_REJECTED_REASON =?, GR_APPROVAL = 2 WHERE GR_NO =?`,
                [post.reject_reason, post.gr_no],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        resolve('fail');
                    } else {
                        resolve('success');
                    }
                }
            );
        });
    },

    getQnaList: (limit, offset, sortColumn, sortOrder) => {
        return new Promise((resolve, reject) => {
            DB.query('SELECT COUNT(*) AS total FROM TBL_QNA', (err, countResult) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                } else {
                    let total = countResult[0].total;
                    let totalPages = Math.ceil(total / limit);
                    let orderByClause = '';

                    // 정렬 기준과 순서에 따라 ORDER BY 절 생성
                    if (sortColumn && sortOrder) {
                        orderByClause = `ORDER BY ${sortColumn} ${sortOrder.toUpperCase()}`;
                    } else {
                        orderByClause = 'ORDER BY Q_NO DESC'; // 기본 정렬 기준
                    }

                    DB.query(
                        `SELECT * FROM TBL_QNA ${orderByClause} LIMIT ? OFFSET ?`,
                        [limit, offset],
                        (err, list) => {
                            if (err) {
                                console.log(err);
                                resolve(false);
                            } else {
                                resolve({ list, totalPages });
                            }
                        }
                    );
                }
            });
        });
    },

    updateQna: (answer, q_no) => {
        return new Promise((resolve, reject) => {
            DB.query(
                `UPDATE TBL_QNA SET Q_ANSWER = ?, Q_ANSWER_DATE = NOW(), Q_MOD_DATE = NOW() WHERE Q_NO = ?`,
                [answer, q_no],
                (err, rst) => {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    },

    deleteQna: (q_no) => {
        return new Promise((resolve, reject) => {
            DB.query(`DELETE FROM TBL_QNA WHERE Q_NO = ?`, [q_no], (err, rst) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },
    goodsImg: (gr_no) => {
        return new Promise((resolve, reject) => {
            DB.query(`SELECT * FROM TBL_GOODS_IMG WHERE GR_NO =?`, [gr_no], (err, imgs) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                } else {
                    resolve(imgs);
                }
            });
        });
    },
};

module.exports = AdminDao;
