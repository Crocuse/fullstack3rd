const socketIO = require('socket.io');
const auctionAlarmHandler = require('./auctionAlarmHandler');

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    io.on('connection', socket => {
        console.log("WEBSOCKET CONNECTED !!!! ");

        auctionAlarmHandler(socket, io);

    });
}

module.exports = initializeSocket;