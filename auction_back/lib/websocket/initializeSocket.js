const socketIO = require('socket.io');
const webSocketHandler = require('./webSocketHandler');

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    io.on('connection', socket => {
        console.log("WEBSOCKET CONNECTED !!!! ");

        webSocketHandler(socket, io);

    });
}

module.exports = initializeSocket;