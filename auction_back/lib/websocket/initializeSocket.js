const socketIO = require('socket.io');
const webSocketHandler = require('./webSocketHandler');
const os = require('os');

function initializeSocket(server) {
    let corsOrigin;

    if (os.version().includes('Windows')) {
        corsOrigin = 'http://localhost:3000';
    } else {
        corsOrigin = 'https://3.37.1.14:443';
    }

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
