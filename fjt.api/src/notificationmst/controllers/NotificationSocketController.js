module.exports = {
    sendNotification: (req, data) => {
        // console.error("socket: sendNotification");
        data.forEach((notification) => {
            var receiverID = notification.receiverID;
            var sockets = module.exports.findReceiverSocket(receiverID);
            sockets.forEach((socket) => {
                socket.emit('notification:receive', notification);
            });
        });
    },
    send: (req, model) => {
        // console.error("socket: send");
        model.receiver.forEach((receiverID) => {
            var sockets = module.exports.findReceiverSocket(receiverID);
            sockets.forEach((socket) => {
                socket.emit('message:receive', model.data);
            });
        });
    },
    sendChat: (req, model) => {
        // console.error("socket: sendChat");
        var chatObj = model.data.data;
        if (chatObj.groupID) {
            const sockets = module.exports.findReceiverSocketByRoom(chatObj.groupID);
            sockets.forEach((socket) => {
                chatObj.receiverID = socket.keyId;
                socket.emit('message:receive', model.data);
            });
        } else {
            const sockets = module.exports.findReceiverSocketByUserID(chatObj.receiverID);
            sockets.forEach((socket) => {
                socket.emit('message:receive', model.data);
            });
        }
    },
    sendUpdateChat: (req, model) => {
        // console.error("socket: sendUpdateChat");
        var chatObj = model.data.data;
        if (chatObj.groupID) {
            const sockets = module.exports.findReceiverSocketByRoom(chatObj.groupID);
            sockets.forEach((socket) => {
                chatObj.receiverID = socket.keyId;
                socket.emit('updatemessage:receive');
            });
        } else {
            const sockets = module.exports.findReceiverSocketByUserID(chatObj.receiverID);
            sockets.forEach((socket) => {
                socket.emit('updatemessage:receive');
            });
        }
    },
    findReceiverSocket: (receiverID) => {
        var receiverSocket = [];
        // console.error("socket: findReceiverSocket");
        if (global.socketIO) {
            const io = global.socketIO;
            const allSockets = io.sockets.sockets;
            const allKeys = Object.keys(allSockets);
            // search receiver socket
            allKeys.find((x) => {
                const socket = allSockets[x];
                if (socket.employeeID === receiverID) {
                    receiverSocket.push(socket);
                }
                return false;
            });
        }
        return receiverSocket;
    },
    findReceiverSocketByUserID: (receiverID) => {
        var receiverSocket = [];
        // console.error("socket: findReceiverSocketByUserID");
        if (global.socketIO) {
            const io = global.socketIO;
            const allSockets = io.sockets.sockets;
            const allKeys = Object.keys(allSockets);
            // search receiver socket
            allKeys.find((x) => {
                var socket = allSockets[x];
                if (socket.keyId === receiverID) {
                    receiverSocket.push(socket);
                }
                return false;
            });
        }
        return receiverSocket;
    },
    findReceiverSocketByRoom: (roomName) => {
        var sockets = [];
        // console.error("socket: findReceiverSocketByRoom");
        if (global.socketIO) {
            const io = global.socketIO;

            const allRoomMember = io.sockets.adapter.rooms[roomName];
            if (allRoomMember) {
                Object.keys(allRoomMember.sockets).forEach((sid) => {
                    const socket = io.sockets.connected[sid];
                    if (socket) {
                        sockets.push(socket);
                    }
                });
            }
        }
        return sockets;
    },
    sendByType: (type, model) => {
        // console.error("socket: send");
        model.receiverEmpIDs.forEach((employeeID) => {
            var sockets = module.exports.findReceiverSocket(employeeID);
            sockets.forEach((socket) => {
                socket.emit(type, model.sendData);
            });
        });
    }
};