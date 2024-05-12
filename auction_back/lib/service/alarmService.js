const DB = require('../db/db');

module.exports = {
    notificataionOverBid: async (socketData, socket, io) => {
        console.log("[ALARMSERVICE] notificataionOverBid()");
        try {
            let grNo = socketData.grNo;
            console.log(socketData.grNo);
            DB.query(
                `SELECT TAC.M_ID, TGR.GR_NAME, MAX(TAC.AC_REG_DATE) AS highestBidDate
                FROM TBL_AUCTION_CURRENT TAC
                JOIN TBL_GOODS_REGIST TGR ON TAC.GR_NO = TGR.GR_NO
                WHERE TAC.GR_NO = ?
                GROUP BY TAC.M_ID, TGR.GR_NAME
                ORDER BY TAC.AC_POINT DESC
                LIMIT 1 OFFSET 1;
                `,
                [grNo],
                (err, id) => {
                    if (err) {
                        socket.emit("notificationOverBidErr", { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678" });
                    } else {
                        console.log(id);
                        if (id.length > 0) {
                            console.log("-------------------->>>>>>>", id[0].GR_NAME);
                            socket.emit('notificationOverBid', { message: '상회 입찰이 발생하였습니다.', id: id[0].M_ID, name: id[0].GR_NAME, date: id[0].highestBidDate } );
                        }
                    }
                }
            );
        } catch (error) {
            console.error("Error in notificationOverBid:", error);
        }
    },


}