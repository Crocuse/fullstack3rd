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
    });

    io.on('connection', socket => {
        console.log("WEBSOCKET CONNECTED !!!! ");
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        // console.log('socket>>>>', socket);
        // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
        // console.log('io>>>>', io);
        // console.log('-------------------------------------------------------------------------')
        webSocketHandler(socket, io);



        overCountBidHandler(socket, io);
    });

}

module.exports = initializeSocket;