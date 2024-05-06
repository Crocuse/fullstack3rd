const alarmService = require('../service/alarmService');

function auctionAlarmHandler(socket, io) {
    console.log('[AUCTIONALARMHANDLER]');

    socket.on('message', ({ name, message }) => {
        io.emit('message', ({ name, message }));
    });

    socket.on('overbidding', ({ loginedId }) => {
        console.log("loginedId====>", loginedId);
        alarmService.getAcPointInfo(loginedId, socket,io);

    });


}

module.exports = auctionAlarmHandler;