const socketIO = require('socket.io');
const overCountBidHandler = require('./overCountBidHandler');
const webSocketHandler = require('./webSocketHandler');
const os = require('os');

function initializeSocket(server) {
    
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });


    const overCountBidNameSpace = io.of("/overCountBid");
    overCountBidNameSpace.on('connection', socket => {
        console.log("OVER COUNT BID WEBSOCKET CONNECTED !");
        overCountBidHandler(socket, io);
    });

    io.on('connection', socket => {
        console.log("WEBSOCKET CONNECTED !!!! ");
        webSocketHandler(socket, io);
    });

}

module.exports = initializeSocket;