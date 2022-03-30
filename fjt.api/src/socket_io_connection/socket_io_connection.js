const _ = require('lodash');

module.exports = {
    findReceiverSocket: () => {
        var receiverSocket = [];
        //console.error("socket: findReceiverSocket");
        if (global.socketIO) {
            var io = global.socketIO;
            var allSockets = io.sockets.sockets;
            var allKeys = Object.keys(allSockets);
            // search receiver socket
            allKeys.find((x) => {
                var socket = allSockets[x];
                receiverSocket.push(socket);
                return false;
            });
        }
        return receiverSocket;
    },
    findReceiverSocketByID: (receiverID) => {
        var receiverSocket = [];
        //console.error("socket: findReceiverSocketByID");
        if (global.socketIO) {
            var io = global.socketIO;
            var allSockets = io.sockets.sockets;
            var allKeys = Object.keys(allSockets);
            // search receiver socket
            allKeys.find((x) => {
                var socket = allSockets[x];
                if (socket.employeeID === receiverID) {
                    receiverSocket.push(socket);
                }
                return false;
            });
        }
        return receiverSocket;
    },
};