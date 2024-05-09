const DB = require('../db/db');

module.exports = {
    getAcPointInfo: (loginedId, socket, io) => {
        console.log("[ALARMSERVICE] getAcPointInfo()");

        DB.query(`SELECT AC_POINT FROM TBL_AUCTION_CURRENT WHERE M_ID = ?`,
            [loginedId],
            (err, result) => {
                if (err) {
                    console.error("[ALARMSERVICE] DB error:", err);
                    socket.emit('acPointInfoErrorInDB', { BidStatus: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678", GR_NAME: '' });
                }

                if (result.length > 0) {
                    const acPoint = result[0].AC_POINT;
                    DB.query(`SELECT 
                    TBL_AUCTION_CURRENT.GR_NO,
                    TBL_AUCTION_CURRENT.M_ID,
                    TBL_AUCTION_CURRENT.AC_POINT,
                    TBL_GOODS_REGIST.GR_NAME,
                    CASE
                        WHEN TBL_AUCTION_CURRENT.AC_POINT = MaxBid.MAX_AC_POINT THEN '상회 입찰건이 없습니다.'
                        ELSE '최고가 아닌 입찰'
                    END AS BidStatus
                FROM 
                    TBL_AUCTION_CURRENT
                LEFT JOIN (
                    SELECT 
                        GR_NO,
                        MAX(AC_POINT) AS MAX_AC_POINT
                    FROM 
                        TBL_AUCTION_CURRENT
                    GROUP BY 
                        GR_NO
                ) AS MaxBid ON TBL_AUCTION_CURRENT.GR_NO = MaxBid.GR_NO
                LEFT JOIN TBL_GOODS_REGIST ON TBL_AUCTION_CURRENT.GR_NO = TBL_GOODS_REGIST.GR_NO
                WHERE 
                    TBL_AUCTION_CURRENT.M_ID = ?;
                
                           
                        `,
                        [loginedId],
                        (err, highPrice) => {
                            console.log("여기 뭐로 나오나 ---->>", highPrice);
                            if (err) {
                                socket.emit('maxAcPointError', { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678" });
                            }
                            if (highPrice.length > 0) {
                                console.log("여기기기기기기-----------");
                                highPrice.forEach(item => {
                                    if (item.BidStatus === '상회 입찰자가 없습니다.') {
                                        console.log("여여여영여여-----------");
                                        socket.emit("highPrice", item);
                                    }
                                    if (item.BidStatus === '최고가 아닌 입찰') {
                                        let grNo = item.GR_NO;
                                        let acPoint = item.AC_POINT;
                                        console.log("최고가 아닌 입찰------------------");

                                        DB.query(`SELECT 
                                        TBL_AUCTION_CURRENT.GR_NO,
                                        TBL_AUCTION_CURRENT.AC_POINT,
                                        TBL_GOODS_REGIST.GR_NAME,
                                        CASE
                                        WHEN TBL_AUCTION_CURRENT.AC_POINT = (
                                            SELECT MAX(AC_POINT) 
                                            FROM TBL_AUCTION_CURRENT AS T2 
                                            WHERE T2.GR_NO = ?
                                            ORDER BY AC_POINT DESC
                                            LIMIT 1 OFFSET 1
                                        ) THEN '상회 입찰 발생'
                                        ELSE '알림 없음'
                                    END AS BidStatus                                    
                                    FROM 
                                        TBL_AUCTION_CURRENT
                                    LEFT JOIN TBL_GOODS_REGIST ON TBL_AUCTION_CURRENT.GR_NO = TBL_GOODS_REGIST.GR_NO
                                    WHERE 
                                        TBL_AUCTION_CURRENT.GR_NO = ? 
                                        AND TBL_AUCTION_CURRENT.M_ID = ?
                                    ORDER BY 
                                        TBL_AUCTION_CURRENT.AC_POINT DESC
                                    LIMIT 1;
                                    
                                    
                                        `,
                                            [grNo, grNo, loginedId],
                                            (err, overBidInfo) => {
                                                console.log("오버비드 정보 ", overBidInfo);
                                                if (err) {
                                                    socket.emit('overBidInfoError', { BidStatus: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678", GR_NAME: '' });
                                                }

                                                if (overBidInfo.length > 0) {
                                                    console.log("어디로 들어와ㅏㅏㅏㅏㅏㅏㅏ ");

                                                    overBidInfo.forEach((bidInfo) => {
                                                        if (bidInfo.BidStatus === '상회 입찰 발생') {

                                                            socket.emit("overBidInfo", bidInfo);
                                                        }
                                                        if (bidInfo.BidStatus === '알림 없음') {
                                                            bidInfo.GR_NAME = '';
                                                            console.log("여기야??? ", bidInfo);
                                                            socket.emit('nonOverBidInfo', bidInfo);
                                                        }
                                                    });

                                                }
                                            })
                                    }
                                });
                            }
                            // if (overBidInfo.length > 0) {
                            //     socket.emit("overBidInfo", { overBidInfo });
                            // }
                            // if (maxAcPoint.length > 0) {
                            //     const products = [];
                            //     const promises = [];

                            //     maxAcPoint.forEach(item => {
                            //         const gr_no = item.GR_NO;

                            //         const promise = new Promise((resolve, reject) => {
                            //             DB.query(`SELECT GR_NAME 
                            //             FROM TBL_GOODS_REGIST 
                            //             WHERE GR_NO = ?;
                            //             `,
                            //                 [gr_no],
                            //                 (err, grName) => {
                            //                     if (err) {
                            //                         reject(err);
                            //                     } else {
                            //                         const productName = grName[0].GR_NAME;
                            //                         products.push({ productName });
                            //                         resolve();
                            //                     }
                            //                 });
                            //         });

                            //         promises.push(promise);
                            //     });

                            //     Promise.all(promises)
                            //         .then(() => {
                            //             socket.emit('alarm', { maxAcPoint, products });
                            //         })
                            //         .catch(err => {
                            //             socket.emit('maxAcPointError', { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678" });
                            //         });
                            // } else {
                            //     socket.emit('notFoundMaxAcPoint', { message: "상회입찰자가 없습니다." });
                            // }
                        });

                } else {
                    socket.emit('acPointInfoError', { BidStatus: "입찰한 경매건이 없습니다.", GR_NAME: '' });
                }
            });
    },
};