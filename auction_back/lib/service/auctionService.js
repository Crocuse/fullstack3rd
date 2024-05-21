const { json } = require('body-parser');
const DB = require('../db/db');

const auctionService = {
    goodsRegist: (req, res) => {
        let post = req.body;
        let files = req.files;
        let mId = req.user;

        DB.query(
            'INSERT INTO TBL_GOODS_REGIST(GR_NAME, GR_PRICE, GR_INFO, M_ID) VALUES(?, ?, ?, ?)',
            [post.grName, post.grPrice, post.grInfo, mId],
            (error, result) => {
                if (error) {
                    console.log(error);
                    for (let i = 0; i < files.length; i++) {
                        fs.unlink(`C:/auction/goodsImg/${req.file.filename}`, (error) => {
                            console.log('UPLOADED FILE DELETE COMPLETED!!');
                        });
                    }
                    res.json('fail');
                } else {
                    let grNo = result.insertId;

                    for (let i = 0; i < files.length; i++) {
                        DB.query(
                            'INSERT INTO TBL_GOODS_IMG(GI_NAME, GR_NO) VALUES(?, ?)',
                            [files[i].filename, grNo],
                            (error, result) => {
                                if (error) console.log(error);
                            }
                        );
                    }
                    res.json('success');
                }
            }
        );
    },
    currentList: (req, res) => {
        DB.query(
            //`SELECT * FROM TBL_AUCTION_SCHEDULE WHERE AS_START_DATE = '2024-05-18' ORDER BY AS_LOCATION_NUM ASC`,
            `SELECT * FROM TBL_AUCTION_SCHEDULE WHERE AS_START_DATE = DATE_ADD(CURDATE(), INTERVAL 1 DAY) ORDER BY AS_LOCATION_NUM ASC`,
            [],
            (error, list) => {
                if (error) {
                    console.log(error);
                } else {
                    if (list.length > 0) {
                        res.json(list);
                    } else {
                        res.json('nolist');
                    }
                }
            }
        );
    },
    listProduct: (req, res) => {
        let grNo = req.query.grNo;
        DB.query(`SELECT * FROM TBL_GOODS_REGIST WHERE GR_NO = ?`, [grNo], (error, product) => {
            if (error) {
                console.log(error);
            } else {
                DB.query(`SELECT GI_NAME FROM TBL_GOODS_IMG WHERE GR_NO = ?`, [grNo], (error, imgs) => {
                    if (error) {
                        console.log(error);
                    }
                    const data = {
                        ...product[0],
                        imgs: imgs.map((item) => item.GI_NAME),
                    };
                    res.json(data);
                });
            }
        });
    },
    bidingInfo: (req, res) => {
        let grNo = req.query.grNo;

        DB.query(
            `SELECT * FROM TBL_AUCTION_CURRENT WHERE GR_NO = ? ORDER BY AC_REG_DATE ASC`,
            [grNo],
            (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json(result);
                }
            }
        );
    },
    biding: (req, res) => {
        let grNo = req.query.grNo;
        let asPrice = req.query.asPrice;
        let extendLevel = req.query.extendLevel;
        let mId = req.user;

        if (typeof mId === 'object') {
            mId = mId.id;
        }

        console.log(mId);

        DB.query(
            `SELECT MAX(AC_POINT) AS max_price FROM TBL_AUCTION_CURRENT WHERE GR_NO = ?`,
            [grNo],
            (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    let maxPrice = result[0].max_price;
                    if (asPrice > maxPrice) {
                        DB.query(
                            `INSERT INTO TBL_AUCTION_CURRENT(M_ID, AC_POINT, GR_NO, AC_EXTENDLEVEL) VALUES(?, ?, ?, ?)`,
                            [mId, asPrice, grNo, extendLevel], // 수정된 부분
                            (error, result) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    res.json(result);
                                }
                            }
                        );
                    } else {
                        res.json('fail');
                    }
                }
            }
        );
    },
    asBiding: (req, res) => {
        let grNo = req.query.grNo;
        let asPrice = req.query.asPrice;
        let mId = req.user;
        let extendLevel = req.query.extendLevel;
        asPrice = asPrice.replaceAll(',', '');

        DB.query(
            `SELECT MAX(AC_POINT) AS max_price FROM TBL_AUCTION_CURRENT WHERE GR_NO = ?`,
            [grNo],
            (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    let maxPrice = result[0].max_price;
                    if (asPrice > maxPrice || extendLevel > 6) {
                        DB.query(
                            `INSERT INTO TBL_AUCTION_CURRENT(M_ID, AC_POINT, GR_NO, AC_EXTENDLEVEL) VALUES(?, ?, ?, ?)`,
                            [mId, asPrice, grNo, extendLevel],
                            (error, result) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    res.json(result);
                                }
                            }
                        );
                    } else {
                        res.json('fail');
                    }
                }
            }
        );
    },
    extendLevel: (req, res) => {
        let grNo = req.query.grNo;

        DB.query(
            `SELECT AC_EXTENDLEVEL FROM TBL_AUCTION_CURRENT WHERE GR_NO = ? ORDER BY AC_EXTENDLEVEL DESC LIMIT 1;`,
            [grNo],
            (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('>>>>>>>>>>>', result);
                    res.json(result);
                }
            }
        );
    },
    maxLevelIdList: (req, res) => {
        let grNo = req.query.grNo;

        DB.query(
            `SELECT M_ID FROM TBL_AUCTION_CURRENT WHERE GR_NO = ? AND AC_EXTENDLEVEL = 7;`,
            [grNo],
            (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(result);
                    res.json(result);
                }
            }
        );
    },
    endedAuction: (req, res) => {
        let post = req.body;

        if (post.isBid === 0) post.buyId = null;

        DB.query(`SELECT GR_NO FROM TBL_AUCTION_RESULT WHERE GR_NO = ?`, [post.grNo], (error, result) => {
            if (error) {
                console.log(error);
            } else {
                if (result.length < 1) {
                    DB.query(
                        `INSERT INTO TBL_AUCTION_RESULT(GR_NO, AR_IS_BID, AR_SELL_ID, AR_BUY_ID, AR_POINT) VALUES(?, ?, ?, ?, ?)`,
                        [post.grNo, post.isBid, post.sellId, post.buyId, post.point],
                        (error, result) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log(result);
                                res.json('success');
                            }
                        }
                    );
                }
            }
        });
    },
    getUserPoint: (req, res) => {
        let mId = req.user;

        DB.query(`SELECT P_CURRENT FROM TBL_POINT WHERE M_ID = ?`, [mId], (error, result) => {
            if (error) {
                console.log(error);
            } else {
                res.json(result);
            }
        });
    },
    bidmsg: async (socketData, socket) => {
        let loglist = [];
        if (socketData.grNo !== '') {
            try {
                const result = await new Promise((resolve, reject) => {
                    DB.query(
                        `SELECT * FROM TBL_AUCTION_CURRENT WHERE GR_NO = ? ORDER BY AC_REG_DATE ASC`,
                        [socketData.grNo],
                        (error, rows) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(rows);
                            }
                        }
                    );
                });
                loglist = result;
            } catch (error) {
                console.log(error);
            }
        }
        socket.broadcast.emit('bidmsg', {
            id: socketData.loginedId,
            bid: socketData.nextBid,
            price: socketData.nowPrice,
            asPrice: socketData.asPrice,
            log: loglist,
            bidType: socketData.isBidType,
        });
    },
    modifyGoodsConfirm: (req, res) => {
        let post = req.body;
        let files = req.files;

        DB.query(
            `UPDATE 
                        TBL_GOODS_REGIST 
                    SET 
                        GR_NAME =?,
                        GR_PRICE =?,
                        GR_INFO =?,
                        GR_MOD_DATE = NOW()
                    WHERE 
                        GR_NO = ?
                        `,
            [post.grName, post.grPrice, post.grInfo, post.grNo],
            (error, result) => {
                if (error) {
                    console.log(error);
                    for (let i = 0; i < files.length; i++) {
                        fs.unlink(`C:/auction/goodsImg/${req.file.filename}`, (error) => {
                            console.log('UPLOADED FILE DELETE COMPLETED!!');
                        });
                    }
                    res.json('fail');
                } else {
                    DB.query(`DELETE FROM TBL_GOODS_IMG WHERE GR_NO = ?`, [post.grNo], (err, rst) => {
                        if (err) {
                            console.log(err);
                        } else {
                            for (let i = 0; i < files.length; i++) {
                                DB.query(
                                    'INSERT INTO TBL_GOODS_IMG(GI_NAME, GR_NO) VALUES(?, ?)',
                                    [files[i].filename, post.grNo],
                                    (error, result) => {
                                        if (error) console.log(error);
                                    }
                                );
                            }
                            res.json('success');
                        }
                    });
                }
            }
        );
    },
};

module.exports = auctionService;
