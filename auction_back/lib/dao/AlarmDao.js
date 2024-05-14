const DB = require("../db/db");
const bcrypt = require('bcrypt');

module.exports = {
    alarmOverBid: (grNo) => {
        return new Promise((resolve, reject) => {
            DB.query( // GR_NO로 두번째로 높은 입찰가와 해당 M_ID, 테이블 조인해서 GR_NAME 얻고, 최고가 갱신된 시간 얻기
                `SELECT TAC.GR_NO, TGR.GR_NAME, TAC.M_ID, TAC.AC_POINT, TAC2.AC_REG_DATE AS highestBidDate
                FROM TBL_AUCTION_CURRENT TAC
                JOIN TBL_GOODS_REGIST TGR ON TAC.GR_NO = TGR.GR_NO
                JOIN (
                    SELECT GR_NO, MAX(AC_POINT) AS max_point
                    FROM TBL_AUCTION_CURRENT
                    WHERE GR_NO = ?
                    GROUP BY GR_NO
                ) AS max_points ON TAC.GR_NO = max_points.GR_NO
                JOIN TBL_AUCTION_CURRENT TAC2 ON TAC.GR_NO = TAC2.GR_NO AND TAC2.AC_POINT = max_points.max_point
                WHERE TAC.GR_NO = ?
                AND TAC.AC_POINT = (
                    SELECT MAX(AC_POINT)
                    FROM TBL_AUCTION_CURRENT
                    WHERE GR_NO = TAC.GR_NO
                    AND AC_POINT < max_points.max_point
                )
             `,
                [grNo, grNo],
                (err, overBidInfo) => {
                    console.log('디비 뭐 나오는지 확인 ====================>', overBidInfo)
                    if (err) {
                        reject(err);
                    }

                    if (overBidInfo.length > 0) {
                        let id = overBidInfo[0].M_ID;
                        let name = overBidInfo[0].GR_NAME;
                        let occurDate = overBidInfo[0].highestBidDate;
                        let message = '상회 입찰이 발생하였습니다.'
                        DB.query(`
                        INSERT INTO TBL_ALARM_OVER_BID (M_ID, GR_NAME, AOB_TXT, AOB_OCCUR_DATE) 
                        VALUES (?, ?, ?, ?)`,
                            [id, name, message, occurDate],
                            (err, result) => {
                                console.log("결과 확인 ----------->  ", result);
                            })
                        resolve(overBidInfo);
                    }
                })
        })
    },


    getMyAlarm: (id) => {
        return new Promise((resolve, reject) => {
            DB.query(`
            SELECT 
                TBL_ALARM_OVER_BID.*, 
                TBL_GOODS_REGIST.GR_NO
            FROM 
                TBL_ALARM_OVER_BID
            JOIN 
                TBL_GOODS_REGIST 
            ON 
                TBL_ALARM_OVER_BID.GR_NAME = TBL_GOODS_REGIST.GR_NAME
            WHERE 
                TBL_ALARM_OVER_BID.M_ID = ? 
            ORDER BY 
                TBL_ALARM_OVER_BID.AOB_REG_DATE DESC
            `,
                [id],
                (err, myAlarmInfo) => {
                    console.log("내 알람정보 ---->>>", myAlarmInfo);
                    if (err) {
                        reject(err);
                    }

                    if (myAlarmInfo.length > 0) {
                        resolve(myAlarmInfo);

                    } else {
                        resolve('null');
                    }
                }
            )
        });

    },

}