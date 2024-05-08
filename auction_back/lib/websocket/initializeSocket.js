const socketIO = require('socket.io');
const overCountBidHandler = require('./overCountBidHandler');

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

}

module.exports = initializeSocket;