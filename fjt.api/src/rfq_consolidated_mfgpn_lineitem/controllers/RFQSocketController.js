
module.exports = {
    updateAssemblyAutoPricingStatus: (req, data) => {
        // console.error("socket: updateAssemblyAutoPricingStatus");
        var sockets = module.exports.findReceiverSocket();
        if (!req.body.isPurchaseApi) {
            // for part costing screen socket
            sockets.forEach((socket) => {
                socket.emit('assembly_autopricing_status:receive', data);
            });
        } else {
            // for purchase screen
            sockets.forEach((socket) => {
                socket.emit('purchase_SalesOrder_autopricing_status:receive', data);
            });
        }
    },
    updateLineItemAutoPricingStatus: (req, data) => {
        // console.error("socket: updateLineItemAutoPricingStatus");
        var sockets = module.exports.findReceiverSocket();
        // for part costing screen socket
        if (!req.body.isPurchaseApi) {
            sockets.forEach((socket) => {
                socket.emit('lineitem_autopricing_status:receive', data);
            });
        } else {
            // for purchase screen
            sockets.forEach((socket) => {
                socket.emit('Purchase_lineitem_autopricing_status:receive', data);
            });
        }
    },
    sendPartUpdatedNotificationToAllUsers: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        // for part list screen socket
        sockets.forEach((socket) => {
            socket.emit('componentlistrecords:receive', data);
        });
    },
    askDigikeyAuthentication: (req, data) => {
        // console.error("socket: askDigikeyAuthentication");
        var sockets = module.exports.findReceiverSocket();
        if (!req.body.isPurchaseApi) {
            // for part costing screen socket
            sockets.forEach((socket) => {
                socket.emit('askDigikeyAuthentication:receive', data);
            });
        } else {
            // for purchase screen
            sockets.forEach((socket) => {
                socket.emit('Purchase_askDigikeyAuthentication:receive', data);
            });
        }
    },
    logOutUserFromAllDevices: (req, data) => {
        // console.error("socket: logOutUserFromAllDevices");
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('logOutUserFromAllDevices:receive', data);
        });
    },
    reloadPageOnOverrideUser: (req, data) => {
        // console.error("socket: reloadPageOnOverrideUser");
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('reloadPageOnOverrideUser:receive', data);
        });
    },
    updateLoginuser: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('updateLoginuser:receive', data);
        });
    },
    logOutDeletedUserFromAllDevices: (req, data) => {
        // console.error("socket: logOutDeletedUserFromAllDevices");
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('logOutDeletedUserFromAllDevices:receive', data);
        });
    },
    sendNotificationOfRightChanges: (req, data) => {
        // console.error("socket: sendNotificationOfRightChanges");
        var sockets = module.exports.findReceiverSocketByID(parseInt(data));
        sockets.forEach((socket) => {
            socket.emit('sendNotificationOfRightChanges:receive', data);
        });
    },
    sendNotificationOfDefaultRoleChanges: (req, data) => {
        // console.error("socket: sendNotificationOfDefaultRoleChanges");
        var sockets = module.exports.findReceiverSocketByID(parseInt(data.employeeID));
        sockets.forEach((socket) => {
            socket.emit('sendNotificationOfDefaultRoleChanges:receive', data);
        });
    },
    sendBOMStatusVerification: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendBOMStatusVerification:receive', data);
        });
    },
    sendPartUpdateVerification: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendPartUpdateVerification:receive', data);
        });
    },
    sendBOMStatusProgressbarUpdate: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendBOMStatusProgressbarUpdate:receive', data);
        });
    },
    externalPartMasterUpdateProgressbar: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendPartMasterProgressbarUpdate:receive', data);
        });
    },
    sendBOMInternalVersionChanged: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendBOMInternalVersionChanged:receive', data);
        });
    },
    sendBOMSpecificPartRequirementChanged: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendBOMSpecificPartRequirementChanged:receive', data);
        });
    },
    sendHoldResumeTranNotification: (req, data, type) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit(type, data);
        });
    },
    sendBOMStartStopActivity: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendBOMStartStopActivity:receive', data);
        });
    },
    deleteBOMDetails: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('deleteBOMDetails:receive', data);
        });
    },
    updateBOMCPNDetails: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('updateBOMCPNDetails:receive', data);
        });
    },
    sendPartUpdatedNotification: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendPartUpdatedNotification:receive', data);
        });
    },
    sendrevisedQuote: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('revisedQuote:receive', data);
        });
    },
    sendSubmittedQuote: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendSubmittedQuote:receive', data);
        });
    },
    updateSummaryQuote: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('updateSummaryQuote:receive', data);
        });
    },
    sendSalesOrderKitMRPQtyChanged: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendSalesOrderKitMRPQtyChanged:receive', data);
        });
    },
    findReceiverSocket: () => {
        var receiverSocket = [];
        // console.error("socket: findReceiverSocket");
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
    },
    findReceiverSocketByID: (receiverID) => {
        var receiverSocket = [];
        // console.error("socket: findReceiverSocketByID");
        if (global.socketIO) {
            const io = global.socketIO;
            const allSockets = io.sockets.sockets;
            const allKeys = Object.keys(allSockets);
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
    sendNotificationOfCustomFormStatus: (req, data) => {
        // console.log("socket: sendNotificationOfCustomFormStatus" );
        var sockets = module.exports.findReceiverSocketByID(parseInt(data.recvID));
        sockets.forEach((socket) => {
            socket.emit('sendNotificationOfCustomFormStatus:receive', data);
        });
    },
    sendCostingStartStopActivity: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendCostingStartStopActivity:receive', data);
        });
    },
    sendSupplierQuotePartAttributeRemoved: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('sendSupplierQuotePartAttributeRemoved:receive', data);
        });
    },
    reGetOnChnagesOfPackingSlipLine: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        sockets.forEach((socket) => {
            socket.emit('reGetOnChnagesOfPackingSlipLine:receive', data);
        });
    },
    sendPartUpdateStopNotificationToAllUsers: (req) => {
        var sockets = module.exports.findReceiverSocket();
        // for part list screen socket
        sockets.forEach((socket) => {
            socket.emit('sendPartUpdateStopNotificationToAllUsers:receive', req.user);
        });
    },
    updateSOVersionConfirmFlag: (req, data) => {
        var sockets = module.exports.findReceiverSocket();
        // for Manage SO Page
        sockets.forEach((socket) => {
            socket.emit('updateSOVersionConfirmFlag:receive', data);
        });
    }
};