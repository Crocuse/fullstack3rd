const socketIO = require('socket.io');

function AuctionAlarm(server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    io.on('connection', socket => {
        console.log("websocket connected !!!! ");
        socket.on('message', ({ name, message }) => {
            io.emit('message', ({ name, message }));
        });
    });
}

module.exports = AuctionAlarm;