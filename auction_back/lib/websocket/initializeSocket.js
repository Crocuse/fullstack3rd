const socketIO = require('socket.io');
const overCountBidHandler = require('./overCountBidHandler');
const webSocketHandler = require('./webSocketHandler');

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://14.42.124.87:3000",
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
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        // console.log('socket>>>>', socket);
        // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
        // console.log('io>>>>', io);
        // console.log('-------------------------------------------------------------------------')
        webSocketHandler(socket, io);




    });

}

module.exports = initializeSocket;