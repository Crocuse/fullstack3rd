const alarmService = require('../service/alarmService');

function overCountBidHandler(socket, io) {
    console.log('[OVER COUNT BID HANDLER]');

    const loginedId = socket.handshake.query.loginedId;
    // socket.on('message', ({ name, message }) => {
    //     io.emit('message', ({ name, message }));
    // });

    alarmService.getAcPointInfo(loginedId, socket, io);
    // socket.on('overbidding', () => {

    // });


}

module.exports = overCountBidHandler;