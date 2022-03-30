module.exports = {
    getFileUploadStatus: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendPartPictureSave:receive', data);
        });
    },

    findReceiverSocket: () => {
        var receiverSocket = [];
        if (global.socketIO) {
            const io = global.socketIO;
            const allSockets = io.sockets.sockets;
            const allKeys = Object.keys(allSockets);
            // search receiver socket
            allKeys.find((x) => {
                var socket = allSockets[x];
                receiverSocket.push(socket);
                return false;
            });
        }
        return receiverSocket;
    }
};