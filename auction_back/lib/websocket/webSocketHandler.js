const alarmService = require('../service/alarmService');

function webSocketHandler(socket, io) {
    console.log('[WEBSOCKETHANDLER]');

    socket.on('message', ({ name, message }) => {
        io.emit('message', ({ name, message }));
    });

    socket.on('overbidding', ({ loginedId }) => {
        alarmService.getAcPointInfo(loginedId, socket, io);

    });


}

module.exports = webSocketHandler;