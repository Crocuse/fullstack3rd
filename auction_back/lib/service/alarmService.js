const DB = require('../db/db');
const AlarmDao = require('../dao/AlarmDao');

module.exports = {
    notificataionOverBid: async (socketData, socket, io) => {
        console.log("[ALARMSERVICE] notificataionOverBid()");

        try {
            let grNo = socketData.grNo;
            let result = await AlarmDao.alarmOverBid(grNo);
            if (result && result.length > 0) {
                io.emit('notificationOverBid', { message: '상회 입찰이 발생하였습니다.', id: result[0].M_ID, name: result[0].GR_NAME, date: result[0].highestBidDate, grNo: result[0].GR_NO });
                socket.disconnect();
            }

        } catch (error) {
            socket.emit("notificationOverBidErr", { message: "ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678", id: '', name: '', date: '', grNo: ''});
            socket.disconnect();
        }
    },

    alarmInfo: async (req, res) => {
        console.log("[ALARMSERVICE] alarmInfo()");
        
        let id = req.body.loginedId;
        let result = await AlarmDao.getMyAlarm(id);
        console.log("!!!!!!!!!!!!----->>>", result)
        res.json(result);
    },
    
    putAlarmReadState: async (req, res) => {
        console.log("[ALARMSERVICE] putAlarmReadState()");

        let no = req.body.no;
        let id = req.body.id;
        let result = await AlarmDao.updateReadState(no, id);
        console.log("여기 결과가 뭐냐면 --------",result);
        res.json(result);
    }

}
