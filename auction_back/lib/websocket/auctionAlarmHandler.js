const auctionAlarmHandler = require('./initializeSocket');
const alarmService = require('../service/alarmService');

function auctionAlarmHandler(io) {

    io.on('connection', socket => {
        console.log("websocket connected !!!! ");
        socket.on('message', ({ name, message }) => {
            io.emit('message', ({ name, message }));
        });

        socket.on('overbidding', ({ loginedId }) => {
            console.log("loginedId====>", loginedId);
            alarmService.getAcPointInfo(loginedId);

        });
    });

}

module.exports = auctionAlarmHandler;