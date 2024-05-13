const DB = require('../db/db');

module.exports = {
    notificataionOverBid: async (socketData, socket, io) => {
        console.log("[ALARMSERVICE] notificataionOverBid()");
        try {
            let grNo = socketData.grNo;
            console.log(socketData.grNo);
            DB.query( // GR_NO로 두번째로 높은 입찰가와 해당 M_ID, 테이블 조인해서 GR_NAME 얻고, 최고가 갱신된 시간 얻기
                `SELECT TGR.GR_NAME, TAC.M_ID, TAC.AC_POINT, TAC2.AC_REG_DATE AS highestBidDate
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
                (err, id) => {

                    if (err) {
                        socket.emit("notificationOverBidErr", { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678" });
                    } else {
                        console.log(id);
                        if (id.length > 0) {
                            console.log("-------------------->>>>>>>", id[0].GR_NAME);
                            socket.emit('notificationOverBid', { message: '상회 입찰이 발생하였습니다.', id: id[0].M_ID, name: id[0].GR_NAME, date: id[0].highestBidDate });
                        }
                    }
                }
            );
        } catch (error) {
            console.error("Error in notificationOverBid:", error);
        }
    },


}