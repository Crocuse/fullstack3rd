const DB = require('../db/db');

module.exports = {
    getAcPointInfo: (loginedId, socket, io) => {
        console.log("[ALARMSERVICE] getAcPointInfo()");

        DB.query(`SELECT AC_POINT FROM TBL_AUCTION_CURRENT WHERE M_ID = ?`,
            [loginedId],
            (err, result) => {
                if (err) {
                    console.error("[ALARMSERVICE] DB error:", err);
                    socket.emit('acPointInfoErrorInDB', { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678" });
                }

                if (result.length > 0) {
                    const acPoint = result[0].AC_POINT;
                    DB.query(`SELECT GR_NO, MAX(AC_POINT) AS MAX_BID
                    FROM TBL_AUCTION_CURRENT
                    WHERE GR_NO IN (
                        SELECT GR_NO
                        FROM TBL_AUCTION_CURRENT 
                        WHERE M_ID = ? 
                        GROUP BY GR_NO
                    )
                    GROUP BY GR_NO;                  
                    `,
                        [loginedId],
                        (err, maxAcPoint) => {
                            console.log("여기 뭐로 나오나 ---->>", maxAcPoint);
                            if (err) {
                                socket.emit('maxAcPointError', { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678" });
                            }
                            if (maxAcPoint.length > 0) {
                                const products = [];
                                const promises = [];

                                maxAcPoint.forEach(item => {
                                    const gr_no = item.GR_NO;

                                    const promise = new Promise((resolve, reject) => {
                                        DB.query(`SELECT GR_NAME 
                                        FROM TBL_GOODS_REGIST 
                                        WHERE GR_NO = ?;
                                        `,
                                            [gr_no],
                                            (err, grName) => {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    const productName = grName[0].GR_NAME;
                                                    products.push({ productName });
                                                    resolve();
                                                }
                                            });
                                    });

                                    promises.push(promise);
                                });

                                Promise.all(promises)
                                    .then(() => {
                                        socket.emit('alarm', { maxAcPoint, products });
                                    })
                                    .catch(err => {
                                        socket.emit('maxAcPointError', { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678" });
                                    });
                            } else {
                                socket.emit('notFoundMaxAcPoint', { message: "상회입찰자가 없습니다." });
                            }
                        });

                } else {
                    socket.emit('acPointInfoError', { message: "입찰한 경매건이 없습니다." });
                }
            });
    },
};
