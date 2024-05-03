const socketIO = require('socket.io');
const alarmService = require('../service/alarmService');

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });
    return io;

}

module.exports = initializeSocket;