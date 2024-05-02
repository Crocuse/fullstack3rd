const socketIO = require('socket.io');
const alarmService = require('../service/alarmService');

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

        socket.on('overbidding', ({ loginedId }) => {
            console.log("loginedId====>", loginedId);
            alarmService.getAcPointInfo(loginedId);

        });
    });


}

module.exports = AuctionAlarm;