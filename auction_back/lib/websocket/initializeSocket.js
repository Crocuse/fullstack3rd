const socketIO = require('socket.io');
const webSocketHandler = require('./webSocketHandler');

function initializeSocket(server, corsOrigin) {
    const io = socketIO(server, {
        cors: {
            origin: corsOrigin,
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('WEBSOCKET CONNECTED!! ');
        webSocketHandler(socket, io);
    });
}

module.exports = initializeSocket;
