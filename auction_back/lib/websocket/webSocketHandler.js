const alarmService = require('../service/alarmService');
const auctionService = require('../service/auctionService')

function webSocketHandler(socket, io) {
    console.log('[WEBSOCKET HANDLER]');

    socket.on('message', ({ name, message }) => {
        io.emit('message', ({ name, message }));
    });

    socket.on('overbidding', ({ loginedId }) => {
        alarmService.getAcPointInfo(loginedId, socket, io);

    });

    socket.on('overBid', (socketData) => {
        console.log('여ㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕㅕ기 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        alarmService.notificataionOverBid(socketData, socket, io);
    });

    socket.on('auctionRefresh', (socketData) => {
        console.log('auctionRefresh');
        auctionService.bidmsg(socketData, socket);
    })
}

module.exports = webSocketHandler;