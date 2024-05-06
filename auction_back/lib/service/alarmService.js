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
                    console.log('여기');
                    const acPoint = result[0].AC_POINT;
                    DB.query(`SELECT MAX(AC_POINT) AS max_bid
                    FROM TBL_AUCTION_CURRENT
                    WHERE AC_POINT > (
                        SELECT AC_POINT 
                        FROM TBL_AUCTION_CURRENT 
                        WHERE M_ID = ? 
                        ORDER BY AC_POINT DESC 
                        LIMIT 1
                    )
                    GROUP BY GR_NO;
                    `,
                        [loginedId],
                        (err, maxAcPoint) => {
                            if (err) {
                                socket.emit('maxAcPointError', { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678" });
                            }
                            if (maxAcPoint.length > 0) {
                                console.log('이쪽');
                                io.emit('maxAcPoint', { maxAcPoint });

                            } else {
                                socket.emit('maxAcPointError', { message: "상회입찰자가 없습니다." });
                            }
                        })
                    io.emit('acPointInfo', { acPoint });

                } else {
                    socket.emit('acPointInfoError', { message: "입찰한 경매건이 없습니다." });
                }
            });
    },
};
