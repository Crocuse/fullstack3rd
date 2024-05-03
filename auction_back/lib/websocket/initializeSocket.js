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


    // io.on('connection', socket => {
    //     console.log("websocket connected !!!! ");
    //     socket.on('message', ({ name, message }) => {
    //         io.emit('message', ({ name, message }));
    //     });

    //     socket.on('overbidding', ({ loginedId }) => {
    //         console.log("loginedId====>", loginedId);
    //         alarmService.getAcPointInfo(loginedId);

    //     });
    // });


}

module.exports = initializeSocket;