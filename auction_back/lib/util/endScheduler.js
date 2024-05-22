const DB = require('../db/db');

const endAuction = async () => {
    try {
        const now = new Date();
        // 종료 시간이 지난 경매 조회
        const auctions = await new Promise((resolve, reject) => {
            DB.query(
                `SELECT A.*, G.M_ID
                FROM TBL_AUCTION_SCHEDULE A
                JOIN TBL_GOODS_REGIST G ON A.GR_NO = G.GR_NO
                WHERE A.AS_START_DATE = CURDATE()`,
                [now],
                (error, rows) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

        for (let auction of auctions) {        
            
            const highestBid = await new Promise((resolve, reject) => {
                DB.query(
                    `SELECT M_ID, MAX(AC_POINT) AS AC_POINT
                    FROM TBL_AUCTION_CURRENT
                    WHERE GR_NO = ?
                    GROUP BY M_ID
                    ORDER BY AC_POINT DESC
                    LIMIT 1`,
                    [auction.GR_NO],
                    (error, rows) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(rows[0]);
                        }
                    }
                );
            });

            let isBid;
            let finalBid;

            console.log(highestBid);
            if(highestBid === undefined) {
                finalBid = {M_ID: null, AC_POINT: auction.AC_POINT};
                isBid = 0;
            } else {
                finalBid = highestBid;
                isBid = 1;
            }

            const existingResult = await new Promise((resolve, reject) => {
                DB.query(
                    `SELECT GR_NO FROM TBL_AUCTION_RESULT WHERE GR_NO = ?`,
                    [auction.GR_NO],
                    (error, rows) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(rows);
                        }
                    }
                );
            });

            console.log(existingResult.length);

            // 경매 결과를 TBL_AUCTION_RESULT에 저장
            if (existingResult.length === 0) {
                // 동일한 GR_NO가 없을 때만 INSERT 수행
                await new Promise((resolve, reject) => {
                    DB.query(
                        `INSERT INTO TBL_AUCTION_RESULT(GR_NO, AR_IS_BID, AR_SELL_ID, AR_BUY_ID, AR_POINT) VALUES(?, ?, ?, ?, ?)`,
                        [auction.GR_NO, isBid, auction.M_ID, finalBid.M_ID, finalBid.AC_POINT],
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                });
            }
        }
    } catch (error) {
        console.error('경매 종료 처리 중 오류 발생:', error);
    }
}

module.exports = {endAuction};