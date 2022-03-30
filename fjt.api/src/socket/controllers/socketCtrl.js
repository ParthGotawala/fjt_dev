module.exports = function (io, app) {

    io.on('connection', function (socket) {
        //console.error("socket: connected");
        // get data from query string and bind to socket on connection
        var query = socket.request._query;
        if (query) {
            socket.keyId = (query.uid && !isNaN(parseInt(query.uid))) ? parseInt(query.uid) : null;
            socket.employeeID = (query.eid && !isNaN(parseInt(query.eid))) ? parseInt(query.eid) : null;
        }
        joinGroup(socket);

        // generate log into DB
        // var model = {
        //     message: 'Socket connect',
        //     userID: socket.keyId,
        //     employeeID: socket.employeeID,
        //     messageType: 'socket_connect',
        //     createdBy: socket.keyId
        // };
        // generateLog(model);

        // socket.emit("onSsh",szSsh);
        socket.on("disconnect", function () {
            var socket = this;
            //console.error("socket: disconnected");

            // generate log into DB
            // var model = {
            //     message: 'Socket disconnect',
            //     userID: socket.keyId,
            //     employeeID: socket.employeeID,
            //     messageType: 'socket_disconnect',
            //     createdBy: socket.keyId
            // };
            // generateLog(model);

        });

        socket.on('send:message', function (message) {
            //console.error("socket: send:message");
            var receiverSocket = findReceiverSocket(message.receiverID);
            if (receiverSocket.length) {
                receiverSocket.forEach((x) => {
                    x.emit('receive:message', message);

                    // generate log into DB
                    // var model = {
                    //     message: JSON.stringify(message),
                    //     userID: x.keyId,
                    //     employeeID: x.employeeID,
                    //     messageType: 'socket_send_message',
                    //     createdBy: x.keyId
                    // };
                    // generateLog(model);
                });
            }
        });

        socket.on('send:group_message', function (message) {
            //console.error("socket: send:group_message");
            var groupID = message.groupID;
            io.to(groupID).emit('receive:message', message);

            // generate log into DB
            var userIDs = [];
            var allRoomMember = io.sockets.adapter.rooms[groupID];
            if (allRoomMember) {
                for (var sid in allRoomMember.sockets) {
                    var socket = io.sockets.connected[sid];
                    if (socket) {
                        userIDs.push({ userID: socket.keyId, employeeID: socket.employeeID });
                    }
                }
            }

            // var model = {
            //     message: '[' + JSON.stringify(userIDs) + '] ' + JSON.stringify(message),
            //     userID: groupID,
            //     employeeID: groupID,
            //     messageType: 'socket_send_group_message',
            //     createdBy: groupID
            // };
            // generateLog(model);

        });

        // when new user connected to socket, bind userid to socket
        socket.on('user:new', function (postdata, callback) {
            //console.error("socket: user:new");
            socket.keyId = postdata.userid;
            socket.employeeID = postdata.employee ? postdata.employee.id : null;

            joinGroup(socket);

            // generate log into DB
            // var model = {
            //     message: 'Socket user:new',
            //     userID: socket.keyId,
            //     employeeID: socket.employeeID,
            //     messageType: 'socket_user_assign',
            //     createdBy: socket.keyId
            // };
            // generateLog(model);
        });

        socket.on('user:status', function (postdata, callback) {
            //console.error("socket: user:status");
            io.sockets.emit('user:status', postdata);
        });

        socket.on('user:logout', function (postdata, callback) {
            //console.error("socket: user:logout");
            var receiverSocket = findReceiverSocket(postdata.userID);
            // Comment By Bhavik: Manage logout from other identity server apps instead of UI project like Designer and Viewer.
            // if (receiverSocket.length == 1) {
            if (receiverSocket.length > 0) {
                const User = app.locals.models.User;
                User.update(postdata, {
                    fields: ['onlineStatus',
                        'updatedBy'],
                    where: { id: postdata.userID }
                }).then(() => {
                    io.sockets.emit('user:status', postdata);
                }).catch(function (err) {
                    console.trace();
                    console.error(err);
                });
            }
            socket.disconnect(0);
        });

        socket.on('create:group', function (postdata, callback) {
            //console.error("socket: create:group");
            postdata.groupParticipantDetails.forEach(element => {
                var receiverSocket = findReceiverSocket(element.participantID);
                if (receiverSocket.length) {
                    receiverSocket.forEach((x) => {
                        x.join(postdata.groupID);
                    });
                }
            });
            io.to(postdata.groupID).emit('create:group', postdata);
        });

        socket.on('join:group', function (postdata, callback) {
            //console.error("socket: join:group");
            postdata.forEach(element => {
                var receiverSocket = findReceiverSocket(element.participantID);
                if (receiverSocket.length) {
                    receiverSocket.forEach((x) => {
                        x.join(element.groupID);
                    });
                }
            });
        });

        socket.on('change:group_name', function (postdata, callback) {
            //console.error("socket: change:group_name");
            io.to(postdata.groupID).emit('change:group_name', postdata);
        });

        socket.on('remove:group_member', function (postdata, callback) {
            //console.error("socket: remove:group_member");
            io.to(postdata.groupID).emit('remove:group_member', postdata);
            var receiverSocket = findReceiverSocket(postdata.participantID);
            if (receiverSocket.length) {
                receiverSocket.forEach((x) => {
                    x.leave(postdata.groupID);
                });
            }
        });

        function findReceiverSocket(receiverID) {
            var allSockets = io.sockets.sockets;
            var allKeys = Object.keys(allSockets);
            var receiverSocket = [];
            // search receiver socket
            allKeys.find((x) => {
                var socket = allSockets[x];
                if (socket.keyId === receiverID) {
                    receiverSocket.push(socket);
                }
                return false;
            });
            return receiverSocket;
        }
    });

    function joinGroup(socket) {

        if (!socket.keyId || isNaN(socket.keyId))
            return;

        // Get all groups of user and add into room
        const GroupParticipantDetails = app.locals.models.GroupParticipantDetails;
        GroupParticipantDetails.findAll({
            attributes: ['groupID'],
            where: {
                participantID: socket.keyId
            }
        }).then((response) => {
            response.forEach((x) => {
                socket.join(x.groupID);
            });
        }).catch(function (err) {
            console.trace();
            console.error(err);
            return null;
        });
    }

    // generate log into DB
    function generateLog(data) {
        const { LogMst } = app.locals.models;
        data.createAt = new Date().toUTCString();

        return LogMst.create(data, {
            fields: [
                'message', 'userID', 'employeeID', 'woID', 'opID',
                'woOPID', 'messageType', 'createdBy', 'createdAt'
            ],
            define: {
                timestamps: false
            }
        }).then((response) => {
            /* empty */
        }).catch(function (err) {
            console.trace();
            console.error(err);
            /* empty */
        });
    }
};