const socketIO = require('socket.io');
const webSocketHandler = require('./webSocketHandler');

function initializeSocket(server, corsOrigin, options) {
    const io = socketIO(server, {
        cors: {
            origin: corsOrigin,
            credentials: true,
        },
        key: options.key,
        cert: options.cert,
        ca: options.ca,
    });

    io.on('connection', (socket) => {
        console.log('WEBSOCKET CONNECTED!! ');
        webSocketHandler(socket, io);
    });
}

module.exports = initializeSocket;
