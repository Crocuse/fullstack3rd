const alarmService = require('../service/alarmService');

function webSocketHandler(socket, io) {
    console.log('[WEBSOCKETHANDLER]');

    socket.on('message', ({ name, message }) => {
        io.emit('message', ({ name, message }));
    });

    socket.on('overbidding', ({ loginedId }) => {
        alarmService.getAcPointInfo(loginedId, socket, io);

    });

    socket.on('auctionRefresh', (socketData) => {
        console.log('socketData>>>>>>>>>>>>>>>>>>>>>',socketData);
        socket.broadcast.emit('bidmsg', {
            id : socketData.loginedId,
            bid : socketData.nextBid
        });
    })


}

module.exports = webSocketHandler;