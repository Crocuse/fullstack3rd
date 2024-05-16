const DB = require('../db/db');
const AlarmDao = require('../dao/AlarmDao');

module.exports = {
    notificataionOverBid: async (socketData, socket, io) => {
        console.log("[ALARMSERVICE] notificataionOverBid()");

        try {
            let grNo = socketData.grNo;
            let result = await AlarmDao.alarmOverBid(grNo);
            if (result && result.length > 0) {
                io.emit('notificationOverBid');
                socket.disconnect();
            }

        } catch (error) {
            socket.emit("notificationOverBidErr");
            socket.disconnect();
        }
    },

    alarmInfo: async (req, res) => {
        console.log("[ALARMSERVICE] alarmInfo()");

        let id = req.body.loginedId;
        let result = await AlarmDao.getMyAlarm(id);
        res.json(result);
    },

    putAlarmReadState: async (req, res) => {
        console.log("[ALARMSERVICE] putAlarmReadState()");

        let date = req.body.date;
        let id = req.body.id;
        let result = await AlarmDao.updateReadState(date, id);
        res.json(result);
    }

}
