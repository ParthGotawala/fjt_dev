const _ = require('lodash');
const { Op } = require('sequelize');
const models = require('./../../models');
const { COMMON, REQUEST, STATE } = require('./../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('./../../constant');
const { NotFound, InvalidPerameter } = require('./../errors');
const Socket_IO_Connection = require("./../socket_io_connection/socket_io_connection");
const TransferStockController = require("../transfer_stock/controllers/TransferStockController.js");
const Bson = require('bson');

module.exports = {

    /**
     * Send Request To Check Single Cart Status.
     * @param MessageType {String}	114 Check Tower HeartBeat 
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     * @param TowerID {String} Tower ID (Prefix Typical A1,A2,A,B etc …) 
     */
    sendRequestToCheckSingleCartStatus: (req) => {
        const {
            Settings
        } = models;
        if (req && req.TowerID) {
            return Settings.findOne({
                where: {
                    key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus
                }
            }).then((response) => {
                var exchange = global.inoAutoexchange;
                if (exchange && response && response.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                    req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Cart_Status;
                    req.TransactionID = req.TransactionID || COMMON.getGUID();
                    req.TimeStamp = COMMON.getCurrentUTC();
                    return TransferStockController.getWareHouseDepartmentName(req.TowerID).then((warehouse) => {
                        var objTrans = {
                            messageType: req.MessageType,
                            startDate: COMMON.getCurrentUTC(),
                            requestMessage: JSON.stringify(req),
                            createdBy: DATA_CONSTANT.ADMIN_ID,
                            updatedBy: DATA_CONSTANT.ADMIN_ID,
                            transactionID: req.TransactionID,
                            isfromSystem: true,
                            towareHouseID: warehouse.wareHouseID,
                            refDepartmentID: warehouse.deptID
                        };
                        return module.exports.createTransactionHistory(objTrans).then(() => {
                            var directive = COMMON.stringFormat('{0}.{1}', req.TowerID, req.MessageType);
                            exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                            return { state: STATE.SUCCESS };
                        });
                    });
                } else {
                   return module.exports.updateSmartCartDetail([req.TowerID]).then(() => {
                        return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.EMPTY, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) }
        }
    },

    /**
     * Send Request To Get Cart Slot Detail.
     * @param MessageType {String}	116 Get Tower Information
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     * @param Domains {String Array} Optional If passed then Filter TowerIDs by domains
     * @param Towers {String Array}	Optional if passed then only report on TowerIDs indicated
     */
    sendRequestToGetMultipleCartDetail: (req) => {
        const {
            Settings
        } = models;

        if (req) {
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });

                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverNameKeyDetail && serverNameKeyDetail.values && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {

                    req.TimeStamp = COMMON.getCurrentUTC();
                    req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Multiple_Cart_Status;
                    req.Towers = req.Towers || [];
                    var objTrans = {
                        messageType: req.MessageType,
                        startDate: COMMON.getCurrentUTC(),
                        requestMessage: JSON.stringify(req),
                        createdBy: DATA_CONSTANT.ADMIN_ID,
                        updatedBy: DATA_CONSTANT.ADMIN_ID,
                        transactionID: req.TransactionID,
                        isfromSystem: true
                    };
                    return module.exports.createTransactionHistory(objTrans).then(() => {
                        var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, req.MessageType);
                        exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                        return { state: STATE.SUCCESS };
                    });
                } else {
                    module.exports.updateSmartCartDetail(req.Towers);
                }
                return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };

            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.EMPTY, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) }
        }
    },

    /**
     * Send Request To Get Cart Slot Detail.
     * @param MessageType {String}	117 Get Slot Information
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     * @param Towers {String Array}	Optional if passed then only report on TowerIDs indicated
     */
    sendRequestToGetCartSlotDetail: (req) => {
        const { Settings } = models;
        if (req) {
            Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });

                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverNameKeyDetail && serverNameKeyDetail.values && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                    req = req || {};
                    req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Multiple_Cart_Slot_Detail;
                    req.TransactionID = req.TransactionID || COMMON.getGUID();
                    req.TimeStamp = COMMON.getCurrentUTC();
                    req.Towers = req.Towers || [];
                    var objTrans = {
                        messageType: req.MessageType,
                        startDate: COMMON.getCurrentUTC(),
                        requestMessage: JSON.stringify(req),
                        createdBy: DATA_CONSTANT.ADMIN_ID,
                        updatedBy: DATA_CONSTANT.ADMIN_ID,
                        transactionID: req.TransactionID,
                        isfromSystem: true
                    };
                    return module.exports.createTransactionHistory(objTrans).then(() => {
                        var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, req.MessageType);
                        exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                        return { state: STATE.SUCCESS };
                    });
                }
                return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.EMPTY, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) }
        }
    },

    responseReceived: (response) => {
        if (response) {
            if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Server_Heartbeat) {
                response.status = DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online;
                module.exports.updateServerHeartbeat(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Cart_Status) {
                module.exports.updateCartStatus(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Multiple_Cart_Status) {
                module.exports.updateAllCartStatus(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Multiple_Cart_Slot_Detail) {
                module.exports.updateSlotDetail(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckIn_Cart) {
                module.exports.updateCheckinDetail(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Cancel_Single_Cart_Request) {
                module.exports.updateCancelRequestDetail(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckOut_Cart_Request) {
                module.exports.updateCheckOutRequestDetail(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.SearchByUID_Request) {
                module.exports.updateUMIDRequest(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Checkin) {
                module.exports.updateUnAuthorizedRequest(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Deliver_Response) {
                module.exports.updateDeliverResponse(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Assign_Department) {
                module.exports.updateAssignDeptResponse(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.SearchByCartID_Request) {
                module.exports.updateSearchByCartIDResponse(response);
            } else if (response.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Clear_Response) {
                module.exports.updateUnauthorizeResponse(response);
            } else {
                console.log(response);
            }
        }
    },
    //update unauthorize response
    updateUnauthorizeResponse: (req) => {
        const { SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                transactionID: req.TransactionID,
                endDate: null,
                messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Clear_Request
            },
            fields: ['id', 'clearUnauthorizeRequstReason', 'clearedAt', 'isClearRequest', 'toBinID'],
        }).then((response) => {
            if (response) {
                var objTrans = {
                    responseMessage: JSON.stringify(req),
                    responseStatus: req.ReasonMessage,
                    endDate: COMMON.getCurrentUTC(),
                    isClearRequest: true
                };
                SmartCartTransaction.update(objTrans, {
                    where: { id: response.id },
                    fields: ['responseMessage', 'responseStatus', 'endDate', 'isClearRequest'],
                });
                if (req.Response == DATA_CONSTANT.INO_AUTO.StatusCode.Success || DATA_CONSTANT.INO_AUTO.MESSAGE.UnAuthorize == req.ResponseMessage) {
                    let stsUpadte = {
                        clearedAt: COMMON.getCurrentUTC(),
                        isClearRequest: true
                    };
                    SmartCartTransaction.update(stsUpadte, {
                        where: { toBinID: response.toBinID, messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Checkin },
                        fields: ['clearedAt', 'isClearRequest'],
                    });
                }
                var sockets = Socket_IO_Connection.findReceiverSocket();
                sockets.forEach(socket => {
                    socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateUnAuthorizeClearResponse, { response: req });
                });
            }
        });
    },
    //update transaction detail checkout
    updateSearchByCartIDResponse: (req) => {
        const { SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                transactionID: req.TransactionID,
                endDate: null,
                messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.SearchByCartID_Request
            },
            fields: ['id', 'transactionID'],
        }).then((response) => {
            if (response && response.id) {
                var objTrans = {
                    responseMessage: JSON.stringify(req),
                    responseStatus: DATA_CONSTANT.INO_AUTO.StatusCode.OK,
                };
                if (req.ChosenPackages.length == 0) {
                    objTrans.endDate = COMMON.getCurrentUTC();
                }
                SmartCartTransaction.update(objTrans, {
                    where: { id: response.id },
                    fields: ['responseMessage', 'responseStatus', 'endDate'],
                });
                var sockets = Socket_IO_Connection.findReceiverSocket();
                sockets.forEach(socket => {
                    socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateSearchCartIDRequest, { response: req });
                });
            }
        });
    },
    // Insert/Update server status (Online/Offline) and name
    updateServerHeartbeat: (req) => {
        module.exports.updateServerStatus(req.status);
        req.messageTypeName = DATA_CONSTANT.INO_AUTO.MESSAGE.ServerHearbeat;
        if (req.ServerName && req.status == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
            module.exports.updateServerName(req.ServerName);
        } else {
            req.TimeStamp = new Date();
            req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Server_Heartbeat;
        }
        if (global.mongodb) {
            var mongodb = global.mongodb;
            const ObjectID = new Bson.ObjectID(); // require('bson').ObjectID;
            req._id = ObjectID;
            mongodb.collection("InovaxeServerStatus").insertOne(req).then(function () { }).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },

    updateAssignDeptResponse: (response) => {
        const { SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                transactionID: response.TransactionID,
                endDate: null,
                messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Assign_Department
            },
            fields: ['id', 'transactionID'],
        }).then((res) => {
            if (res) {
                var objTrans = {
                    responseMessage: JSON.stringify(response),
                    responseStatus: response.ResponseMessage,
                    endDate: COMMON.getCurrentUTC()
                };
                SmartCartTransaction.update(objTrans, {
                    where: {
                        transactionID: response.TransactionID,
                        messageType: response.MessageType,
                        endDate: null
                    },
                    fields: ['responseMessage', 'responseStatus', 'endDate'],
                }).then(() => {
                    return TransferStockController.getWareHouseDepartmentName(response.TowerID).then((warehouse) => {
                        if (warehouse && warehouse.deptname != response.Department) {
                            var req = { TowerID: response.TowerID };
                            TransferStockController.sendRequestToAssignDepartment(req);
                        } else {
                            var sockets = Socket_IO_Connection.findReceiverSocket();
                            sockets.forEach(socket => {
                                socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateAssignDepartmentRequest, response);
                            });
                        }
                    });
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    updateServerStatus: (serverStatus) => {
        const { Settings, sequelize } = models;
        var updateServerStatusKeyDetail = {
            updatedAt: COMMON.getCurrentUTC(),
            //updatedBy: Need to confirm
            values: serverStatus
        };
        Settings.update(updateServerStatusKeyDetail, {
            where: {
                key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus,
                values: { [Op.ne]: serverStatus },
            },
            fields: ['values', 'updatedAt'],
        });
    },

    //Update server name
    updateServerName: (serverName) => {
        const { Settings, sequelize } = models;
        var updateServerNameKeyDetail = {
            updatedAt: COMMON.getCurrentUTC(),
            //updatedBy: Need to confirm
            values: serverName,
        };
        Settings.update(updateServerNameKeyDetail, {
            where: {
                key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName,
                values: { [Op.ne]: serverName },
            },
            fields: ['values', 'updatedAt'],
        });
    },
    //update checkin Request 101
    updateCheckinDetail: (req) => {
        const { SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                transactionID: req.TransactionID,
                endDate: null,
                messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckIn_Cart
            },
            fields: ['id', 'transactionID', 'smartCartLedColorID', 'messageType', 'requestMessage', 'createdBy', 'updatedBy', 'reelBarCode', 'towareHouseID', 'refUMIDId', 'refDepartmentID', 'isfromSystem'],
        }).then((response) => {
            if (response) {
                var objTrans = {
                    responseMessage: JSON.stringify(req),
                    responseStatus: req.ResponseMessage,
                };
                if (req.Response != DATA_CONSTANT.INO_AUTO.StatusCode.Success) {
                    objTrans.endDate = COMMON.getCurrentUTC();
                }
                SmartCartTransaction.update(objTrans, {
                    where: {
                        transactionID: req.TransactionID,
                        messageType: req.MessageType,
                        endDate: null
                    },
                    fields: ['responseMessage', 'responseStatus', 'endDate'],
                });
                var sockets = Socket_IO_Connection.findReceiverSocket();
                sockets.forEach(socket => {
                    socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateCheckinRequestStatus, req);
                });
            }
        });
    },

    //update transaction detail on cancel response
    updateCancelRequestDetail: (req) => {
        const { SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                transactionID: req.TransactionID,
                endDate: null,
            },
            fields: ['id', 'transactionID', 'messageType'],
        }).then((response) => {
            if (response) {
                if (req.ReasonMessage == DATA_CONSTANT.INO_AUTO.MESSAGE.Task_Complete && response.messageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.SearchByUID_Request) {
                    req.ReasonMessage = DATA_CONSTANT.INO_AUTO.MESSAGE.Task_Complete_SearchUID;
                }
                var objTrans = {
                    endDate: COMMON.getCurrentUTC(),
                };
                if (response.messageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckIn_Cart) {
                    objTrans.responseMessage = JSON.stringify(req);
                    objTrans.responseStatus = req.ReasonMessage;
                }
                var where = {
                    endDate: null,
                };
                if (response && response.id) {
                    where.id = response.id;
                }
                var sockets = Socket_IO_Connection.findReceiverSocket();
                sockets.forEach(socket => {
                    socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateCancelRequest, { allRequest: response && response.id ? false : true, transactionID: response && response.transactionID ? response.transactionID : null, message: req.ReasonMessage, code: req.ReasonCode });
                });
                SmartCartTransaction.update(objTrans, {
                    where: where,
                    fields: ['responseMessage', 'responseStatus', 'endDate'],
                });
                module.exports.sendCheckoutRequestResponse(req);
            } else {
                module.exports.sendCheckoutRequestResponse(req);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    //update transaction detail checkout
    updateUMIDRequest: (req) => {
        const { SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                transactionID: req.TransactionID,
                endDate: null,
                messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.SearchByUID_Request
            },
            fields: ['id', 'transactionID'],
        }).then((response) => {
            if (response && response.id) {
                var objTrans = {
                    responseMessage: JSON.stringify(req),
                    responseStatus: DATA_CONSTANT.INO_AUTO.StatusCode.OK,
                };
                if (req.ChosenPackages.length == 0) {
                    objTrans.endDate = COMMON.getCurrentUTC();
                }
                SmartCartTransaction.update(objTrans, {
                    where: { id: response.id },
                    fields: ['responseMessage', 'responseStatus', 'endDate'],
                });
                var sockets = Socket_IO_Connection.findReceiverSocket();
                sockets.forEach(socket => {
                    socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateUMIDRequest, { response: req });
                });
            }
        });
    },
    //update unauthorize request
    updateUnAuthorizedRequest: (req) => {
        TransferStockController.getWareHouseDepartmentName(req.TowerID).then((warehouse) => {
            if (warehouse && warehouse.deptID) {
                module.exports.getBinIDByName(req.Slot).then((bin) => {
                    let objTrans = {
                        transactionID: req.TransactionID,
                        messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Checkin,
                        startDate: COMMON.getCurrentUTC(),
                        endDate: COMMON.getCurrentUTC(),
                        requestMessage: JSON.stringify(req),
                        createdBy: DATA_CONSTANT.ADMIN_ID,
                        updatedBy: DATA_CONSTANT.ADMIN_ID,
                        isfromSystem: false,
                        towareHouseID: bin.wareHouseID,
                        refDepartmentID: warehouse.deptID,
                        illegalPick: req.UnauthorizedAction ? true : false,
                        toBinID: bin.binID,
                        unAuthorizeAction: req.UnauthorizedAction,
                        reelBarCode: req.UID,
                        isInTransit: req.UID ? true : false
                    }
                    module.exports.sendCheckoutRequestResponse(objTrans);
                });
            }
        });
    },
    //update pick Request of UMID request 104
    updateDeliverResponse: (req) => {
        const { SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                transactionID: req.OriginalTransactionID,
                endDate: null,
                messageType: { [Op.ne]: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Deliver_Response }
            },
            fields: ['id', 'transactionID', 'createdBy'],
        }).then((response) => {
            if (response) {
                req.createdBy = response.createdBy;
                return TransferStockController.getWareHouseDepartmentName(req.TowerID).then((warehouse) => {
                    if (warehouse && warehouse.warehouseName) {
                        req.warehouseName = warehouse.warehouseName;
                        req.deptName = warehouse.deptname;
                        module.exports.sendCheckoutRequestResponse(req);
                        var sockets = Socket_IO_Connection.findReceiverSocket();
                        sockets.forEach(socket => {
                            socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateForceDeliverRequest, req);
                        });
                    }
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });

    },
    //update transaction detail checkout 501
    updateCheckOutRequestDetail: (req) => {
        const { SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                reelBarCode: req.ReelBarCode,
                endDate: null,
                messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckIn_Cart
            },
            fields: ['id', 'transactionID', 'reelBarCode', 'towareHouseID', 'refUMIDId', 'clearUnauthorizeRequstReason'],
        }).then((response) => {
            if (response && response.id) {
                var objTrans = {
                    endDate: COMMON.getCurrentUTC(),
                    clearUnauthorizeRequstReason: null
                };
                SmartCartTransaction.update(objTrans, {
                    where: { id: response.id },
                    fields: ['endDate', 'clearUnauthorizeRequstReason'],
                });
                module.exports.sendCheckoutRequestResponse(req);
                module.exports.getBinIDByName(req.Slot).then((res) => {
                    if (res && res.wareHouseID == response.towareHouseID) {
                        var objTransfer = {
                            transferType: DATA_CONSTANT.STOCK_TRANSFER,
                            toBinID: res.binID,
                            uidID: response.refUMIDId,
                            userID: DATA_CONSTANT.ADMIN_ID,
                            transType: DATA_CONSTANT.UMID_History.Trasaction_Type.UMID_Bin_Transfer,
                            actionPerformed: DATA_CONSTANT.UMID_History.Action_Performed.UMID_TRANSFER_INOAUTO,
                        }
                        if (response.clearUnauthorizeRequstReason) {
                            let unallocatedXferHistoryData = {
                                reason: response.clearUnauthorizeRequstReason,
                                transactionType: DATA_CONSTANT.UMID_History.Trasaction_Type.UMID_Bin_Transfer,
                                category: DATA_CONSTANT.UMID_History.Action_Performed.TransferMaterial,
                                transferFrom: response.reelBarCode,
                                transferTo: req.Slot
                            }
                            objTransfer.unallocatedXferHistoryData = unallocatedXferHistoryData;
                        }
                        TransferStockController.tranferStockDetail(req, objTransfer, true);
                        var sockets = Socket_IO_Connection.findReceiverSocket();
                        sockets.forEach(socket => {
                            socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateCheckOutRequest, { reelBarCode: req.ReelBarCode, transactionID: response.transactionID, slot: req.Slot, Side: req.Side });
                        });
                    }
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    //send response 502 to check out request]
    sendCheckoutRequestResponse: (req) => {
        const {
            Settings
        } = models;
        if (req && (req.TransactionID || req.transactionID)) {
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });
                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                    var objTrans = {
                        MessageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckOut_Cart_Response,
                        TimeStamp: COMMON.getCurrentUTC(),
                        TransactionID: req.TransactionID || req.transactionID
                    }
                    var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, objTrans.MessageType);
                    exchange.publish(directive, Buffer.from(JSON.stringify(objTrans), null, null));
                    if (req.messageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Checkin) {
                        req.responseMessage = JSON.stringify(objTrans);
                        module.exports.createTransactionHistory(req);
                    } else {
                        var objTransaction = {
                            smartCartLedColorID: null, //default taken 
                            messageType: req.MessageType,
                            startDate: COMMON.getCurrentUTC(),
                            endDate: COMMON.getCurrentUTC(),
                            requestMessage: JSON.stringify(req),
                            responseMessage: JSON.stringify(objTrans),
                            createdBy: req.createdBy || DATA_CONSTANT.ADMIN_ID,
                            updatedBy: req.createdBy || DATA_CONSTANT.ADMIN_ID,
                            transactionID: req.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Deliver_Response ? req.OriginalTransactionID : req.TransactionID,
                            isfromSystem: false,
                            illegalPick: req.illegalPick ? req.illegalPick : false,
                            isInTransit: (req.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Deliver_Response && req.OriginalTransactionID) ? true : false,
                            reelBarCode: req.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Deliver_Response ? req.UID : req.MessageType == DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckOut_Cart_Request ? req.ReelBarCode : '',
                        };
                        module.exports.createTransactionHistory(objTransaction);
                    }
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },
    // Update cart status (Online/Offline)
    updateCartStatus: (req) => {
        const { WarehouseMst, SmartCartTransaction } = models;
        var updateWHDet = {
            isCartOnline: req.Status == DATA_CONSTANT.INO_AUTO.TOWER_STATUS.Online ? true : false,
            //updatedBy: Need to confirm
            updatedAt: COMMON.getCurrentUTC()
        };

        if (req.Status == DATA_CONSTANT.INO_AUTO.TOWER_STATUS.Online) {
            updateWHDet.isActive = true;
        }

        var sockets = Socket_IO_Connection.findReceiverSocket();
        sockets.forEach(socket => {
            socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateCartStatus, { requestForSingleCart: true, cartList: [{ uniqueCartID: req.TowerID, isCartOnline: updateWHDet.isCartOnline }] });
        });

        WarehouseMst.update(updateWHDet, {
            where: {
                uniqueCartID: req.TowerID,
                isCartOnline: { [Op.ne]: updateWHDet.isCartOnline },
                isDeleted: 0
            },
            fields: ['isCartOnline', 'isActive', 'updatedAt'],
        });
        var objTrans = {
            endDate: COMMON.getCurrentUTC(),
            responseMessage: JSON.stringify(req)
        };
        SmartCartTransaction.update(objTrans, {
            where: { endDate: null, transactionID: req.TransactionID, messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Cart_Status },
            fields: ['endDate', 'responseMessage'],
        });
        if (global.mongodb) {
            var mongodb = global.mongodb;
            const ObjectID = new Bson.ObjectID(); // require('bson').ObjectID;
            req._id = ObjectID;
            req.messageTypeName = DATA_CONSTANT.INO_AUTO.MESSAGE.CartHearbeat;
            mongodb.collection("InovaxeServerStatus").insertOne(req).then(function () { }).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },

    // Update all cart status (Online/Offline)
    updateAllCartStatus: (req) => {
        if (req && req.TowerInfo && req.TowerInfo.length > 0) {
            const { WarehouseMst, SmartCartTransaction } = models;
            SmartCartTransaction.findOne({
                where: {
                    endDate: null,
                    messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Multiple_Cart_Status,
                    transactionID: req.TransactionID
                },
                fields: ['id', 'transactionID'],
            }).then((response) => {
                var objTrans = {
                    endDate: COMMON.getCurrentUTC(),
                    responseMessage: JSON.stringify(req)
                };
                SmartCartTransaction.update(objTrans, {
                    where: { id: response.id },
                    fields: ['endDate', 'responseMessage'],
                });
                //Give response of only those carts which is online
                var cartStstus = _.map(req.TowerInfo, (item) => {
                    return {
                        uniqueCartID: item.TowerID,
                        isCartOnline: item.Status == DATA_CONSTANT.INO_AUTO.TOWER_STATUS.Online ? true : false
                    };
                });

                //Send response to UI through socket.io
                var sockets = Socket_IO_Connection.findReceiverSocket();
                sockets.forEach(socket => {
                    socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateCartStatus, { requestForSingleCart: false, cartList: cartStstus });
                });
                //Update status and slot count if carts in db which is online
                _.each(req.TowerInfo, (tower) => {
                    var updateWHDet = {
                        slotCount: tower.SlotCount,
                        isCartOnline: tower.Status == DATA_CONSTANT.INO_AUTO.TOWER_STATUS.Online ? true : false,
                        //updatedBy: Need to confirm
                        updatedAt: COMMON.getCurrentUTC()
                    };
                    if (tower.Status == DATA_CONSTANT.INO_AUTO.TOWER_STATUS.Online) {
                        updateWHDet.isActive = true;
                    }
                    WarehouseMst.findOne({
                        where: {
                            uniqueCartID: tower.TowerID,
                            isDeleted: 0
                        },
                        fields: ['ID', 'isCartOnline', 'slotCount', 'updatedAt'],
                    }).then((response) => {
                        if (response) {
                            var exchange = global.inoAutoexchange;
                            //Send request to get slot detail if slot count is mismatch
                            if (exchange && response) { //&& response.slotCount != updateWHDet.slotCount
                                module.exports.sendRequestToGetCartSlotDetail({ Towers: [tower.TowerID] });
                            }
                            //Update cart status
                            if (response.isCartOnline != updateWHDet.isCartOnline || response.slotCount != updateWHDet.slotCount || response.isActive != updateWHDet.isActive) {
                                WarehouseMst.update(updateWHDet, {
                                    where: {
                                        uniqueCartID: tower.TowerID,
                                        [Op.or]: {
                                            isCartOnline: { [Op.ne]: updateWHDet.isCartOnline },
                                            slotCount: { [Op.ne]: updateWHDet.slotCount },
                                            isActive: { [Op.ne]: updateWHDet.isActive }
                                        },
                                        isDeleted: 0
                                    },
                                    fields: ['isCartOnline', 'slotCount', 'isActive', 'updatedAt'],
                                })
                            }
                        }
                    });
                });
            });
        }
    },

    // Update slot detail
    updateSlotDetail: (req) => {
        const { sequelize, SmartCartTransaction } = models;
        SmartCartTransaction.findOne({
            where: {
                endDate: null,
                messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Check_Multiple_Cart_Slot_Detail,
                transactionID: req.TransactionID
            },
            fields: ['id', 'transactionID'],
        }).then((response) => {
            if (response && response.id) {
                var objTrans = {
                    endDate: COMMON.getCurrentUTC(),
                    responseMessage: JSON.stringify(req)
                };
                SmartCartTransaction.update(objTrans, {
                    where: { id: response.id },
                    fields: ['endDate', 'responseMessage'],
                });
                if (req && req.SlotInfo && req.SlotInfo.length > 0) {
                    var slotList = _.map(req.SlotInfo, (item) => { return { TowerID: item.TowerID, SlotID: item.SlotID, Side: item.Side } });
                    sequelize.query('CALL Sproc_SaveCartSlotDetail (:pSlotList, :pUpdatedBy)', {
                        replacements: {
                            pSlotList: JSON.stringify(slotList),
                            pUpdatedBy: 1
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                    });
                }
            }
        });
    },

    /**
     * Send Request To Checkin Request.
     * @param MessageType {String}	101 Check in Request
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     * @param PromptIndicator {String} PromptIndicator (Color code 1,2..11…) 
     */
    sendRequestToCheckInCart: (req, userID) => {
        const {
            Settings
        } = models;
        if (req && req.PromptIndicator) {
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName, DATA_CONSTANT.INO_AUTO.DATA_KEYS.CheckinRequestTimeout]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });
                var checkinTimeOut = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.CheckinRequestTimeout });
                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                    req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckIn_Cart;
                    req.TransactionID = req.TransactionID || COMMON.getGUID();
                    req.TimeStamp = COMMON.getCurrentUTC();
                    req.TimeOut = checkinTimeOut.values;
                    var objTrans = {
                        smartCartLedColorID: req.ledColorID,
                        messageType: req.MessageType,
                        startDate: COMMON.getCurrentUTC(),
                        requestMessage: JSON.stringify(req),
                        createdBy: userID,
                        updatedBy: userID,
                        reelBarCode: req.ReelBarCode,
                        transactionID: req.TransactionID,
                        towareHouseID: req.wareHouseID,
                        refUMIDId: req.refUMIDId,
                        isfromSystem: true,
                        refDepartmentID: req.departmentID,
                        clearUnauthorizeRequstReason: req.reason
                    };
                    return module.exports.createTransactionHistory(objTrans).then(() => {
                        delete req.wareHouseID;
                        delete req.refUMIDId;
                        delete req.departmentID;
                        delete req.reason;
                        var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, req.MessageType);
                        exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                        return { state: STATE.SUCCESS };
                    });
                }
                return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.EMPTY, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) }
        }
    },


    /**
     * Send Request To Search Part by UMID.
     * @param MessageType {String}	103 Search by UID
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     * @param PromptIndicator {String} PromptIndicator (Color code 1,2..11…) 
     */
    sendRequestToSearchPartByUMID: (req, userID) => {
        const {
            Settings
        } = models;
        if (req && req.PromptIndicator) {
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });
                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                    req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.SearchByUID_Request;
                    req.TransactionID = req.TransactionID || COMMON.getGUID();
                    req.TimeStamp = COMMON.getCurrentUTC();
                    var objTrans = {
                        smartCartLedColorID: req.ledColorID,
                        messageType: req.MessageType,
                        startDate: COMMON.getCurrentUTC(),
                        requestMessage: JSON.stringify(req),
                        createdBy: userID,
                        updatedBy: userID,
                        transactionID: req.TransactionID,
                        isfromSystem: true,
                        refDepartmentID: req.departmentID,
                        reelBarCode: req.ReelBarCode,
                    };
                    return module.exports.createTransactionHistory(objTrans).then(() => {
                        delete req.reelBarCode;
                        var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, req.MessageType);
                        exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                        return { state: STATE.SUCCESS };
                    });
                }
                return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.EMPTY, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) }
        }
    },

    /**
     * Send Request To Search Part by CartID.
     * @param MessageType {String}	106 Search by CartID
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     * @param PromptIndicator {String} PromptIndicator (Color code 1,2..11…) 
     */
    sendRequestToSearchPartByCartID: (req, userID) => {
        const {
            Settings
        } = models;
        if (req && req.PromptIndicator) {
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });
                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                    req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.SearchByCartID_Request;
                    req.TransactionID = req.TransactionID || COMMON.getGUID();
                    req.TimeStamp = COMMON.getCurrentUTC();
                    var objTrans = {
                        smartCartLedColorID: req.ledColorID,
                        messageType: req.MessageType,
                        startDate: COMMON.getCurrentUTC(),
                        requestMessage: JSON.stringify(req),
                        createdBy: userID,
                        updatedBy: userID,
                        transactionID: req.TransactionID,
                        isfromSystem: true,
                        refDepartmentID: req.departmentID,
                    };
                    return module.exports.createTransactionHistory(objTrans).then(() => {
                        var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, req.MessageType);
                        exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                        return { state: STATE.SUCCESS };
                    });
                }
                return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.EMPTY, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) }
        }
    },

    //maintain warehouse transaction history

    createTransactionHistory: (objTransaction) => {
        const { SmartCartTransaction } = models;
        return SmartCartTransaction.create(objTransaction, {
            fields: ['smartCartLedColorID', 'messageType', 'startDate', 'endDate', 'isfromSystem', 'requestMessage', 'responseMessage', 'createdBy', 'updatedBy', 'reelBarCode', 'transactionID', 'towareHouseID', 'refUMIDId', 'refDepartmentID', 'illegalPick', 'isInTransit', 'unAuthorizeAction', 'toBinID', 'clearUnauthorizeRequstReason'],
        }).then((trans) => {
            return STATE.SUCCESS;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        })

    },

    /**
     * Send Request To Cancel Single and Multiple Request 
     * @param MessageType {String}	108/110 Check in Request
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     */
    sendRequestToCancelCartRequest: (req) => {
        const {
            Settings
        } = models;
        if (req && req.ReasonCode) {
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });
                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online && !req.isManualCancel && !req.isRemove) {
                    req.MessageType = req.TransactionID ? DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Cancel_Single_Cart_Request : DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Cancel_All_Cart_Request;
                    req.TransactionID = req.TransactionID || COMMON.getGUID();
                    req.TimeStamp = COMMON.getCurrentUTC();
                    req.Source = DATA_CONSTANT.INO_AUTO.SOURCE.InoAutoSystem;
                    var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, req.MessageType);
                    exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                    return { state: STATE.SUCCESS };
                } else {
                    var cancelObj = {
                        TransactionID: req.TransactionID,
                        ReasonMessage: MESSAGE_CONSTANT.Ino_Auto_API.API_Auto_CANCEL,
                        ReasonCode: DATA_CONSTANT.INO_AUTO.StatusCode.ManualCancel,
                        MessageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Cancel_Single_Cart_Request
                    };
                    module.exports.updateCancelRequestDetail(cancelObj);
                    if (req.isManualCancel || req.isRemove) {
                        return { state: STATE.SUCCESS };
                    }
                }
                return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.EMPTY, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) }
        }
    },

    /**
     * Send Request To Clear Unauthorize Request
     * @param MessageType {String}	1004 Clear Request
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     */
    sendRequestToClearUnauthorize: (req, userID) => {
        const {
            Settings,
            SmartCartTransaction
        } = models;
        if (req) {
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });
                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                    let request = {
                        MessageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Clear_Request,
                        TransactionID: req.transactionID,
                        TimeStamp: COMMON.getCurrentUTC(),
                        Slot: req.slotName,
                        DeliverReel: req.illegalPick ? 1 : 0
                    }
                    let objTrans = {
                        messageType: request.MessageType,
                        startDate: COMMON.getCurrentUTC(),
                        requestMessage: JSON.stringify(request),
                        createdBy: userID,
                        updatedBy: userID,
                        transactionID: request.TransactionID,
                        isfromSystem: true,
                        refDepartmentID: req.refDepartmentID,
                        toBinID: req.toBinID,
                        towareHouseID: req.towareHouseID
                    };
                    return module.exports.createTransactionHistory(objTrans).then(() => {
                        var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, request.MessageType);
                        exchange.publish(directive, Buffer.from(JSON.stringify(request), null, null));
                        let updateObj = {
                            clearUnauthorizeRequstReason: req.clearUnauthorizeRequstReason,
                            clearBy: userID,
                            clearedAt: COMMON.getCurrentUTC()
                        };
                        SmartCartTransaction.update(updateObj, {
                            where: { id: req.id },
                            fields: ['clearUnauthorizeRequstReason', 'clearedAt', 'clearBy'],
                        });
                        return { state: STATE.SUCCESS };
                    });
                }
                return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.EMPTY, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) }
        }
    },


    /**
     * Send Request To Cancel Single and Multiple Request 
     * @param MessageType {String}	501 Check in Request
     * @param TransactionID {String} Unique Request ID from FJT 
     * @param TimeStamp	{DateTime}	Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     */
    sendRequestToCheckOutCart: (req) => {
        const {
            Settings
        } = models;
        return Settings.findAll({
            where: {
                key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
            }
        }).then((response) => {
            var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
            var serverNameKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName });
            var exchange = global.inoAutoexchangeSender;
            if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values == DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.CheckOut_Cart_Request;
                req.TimeStamp = COMMON.getCurrentUTC();
                var directive = COMMON.stringFormat("{0}.{1}", serverNameKeyDetail.values, req.MessageType);
                exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                return { state: STATE.SUCCESS };
            }
            return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { state: STATE.EMPTY, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
        });
    },

    // Retrive detail of bin by name
    // POST : /api/v1/binmst/getBinDetailByName/:name
    // @param {name} string
    // @return detail of bin by name
    getBinIDByName: (name) => {
        const { BinMst } = models;
        var objBin = {
            wareHouseID: null,
            binID: null
        }
        return BinMst.findOne({
            where: {
                isActive: true,
                Name: name,
                deletedAt: null
            },
            model: BinMst,
            attributes: ["id", "Name", "WarehouseID"],
            required: false,
        }).then((bin) => {
            if (bin) {
                objBin.wareHouseID = bin.WarehouseID;
                objBin.binID = bin.id;
            }
            return objBin;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return objBin;
        });
    },
    // updated smart cart detail status
    // POST : /api/v1/binmst/getBinDetailByName/:name
    // @param {name} string
    // @return detail of bin by name
    updateSmartCartDetail: (smartCartList) => {
        const { WarehouseMst } = models;
        var objWareHouse = {
            isCartOnline: false,
        }
        return WarehouseMst.update(objWareHouse, {
            where: {
                uniqueCartID: { [Op.in]: smartCartList },
                deletedAt: null
            },
            fields: ["isCartOnline"],
        }).then(() => {
            return STATE.SUCCESS;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

};