const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotCreate } = require('../../errors');
var NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const woModuleName = DATA_CONSTANT.WORKORDER.NAME;
const woEmpTransModuleName = DATA_CONSTANT.WORKORDER_TRANS_EMPINOUT.NAME;
const woOPModuleName = DATA_CONSTANT.WORKORDER_OPERATION.NAME;
const woTransferModuleName = DATA_CONSTANT.WORKORDER_TRANSFER.NAME;


const getWOTransferAttrs = ['woTransID', 'fromWOID', 'fromOPID', 'fromWOOPID', 'toWOID', 'toOPID', 'toWOOPID', 'transferDate', 'transferQty'];

module.exports = {
    // Get workorder detail and it's all operation details with production stock
    // GET : /api/v1/workordertransfer/getWorkorderQtyDetail
    // @param {woOPID} int
    // @param {woID} int
    // @return API response
    getWorkorderQtyDetail: (req, res) => {
        const { sequelize, WorkorderOperation, Workorder,
            Component, RFQRoHS } = req.app.locals.models;

        var workorderOperation = WorkorderOperation.findOne({
            where: {
                woOPID: req.params.woOPID
            },
            attributes: ['opName', 'opNumber', 'opVersion', 'opID', 'woID'],
            include: [{
                model: Workorder,
                as: 'workorder',
                attributes: ['woNumber', 'woVersion', 'woVersion', 'isOperationTrackBySerialNo', 'partID'],
                include: [
                    {
                        model: Component,
                        as: 'componentAssembly',
                        attributes: ['mfgPN', 'PIDCode', 'rev', 'nickName', 'RoHSStatusID']
                    }, {
                        model: RFQRoHS,
                        as: 'rohs',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'name', 'rohsIcon']
                    }
                ]
            }]
        });

        var sprocGetAllOperationQty = sequelize
            .query('CALL Sproc_GetAllOperationQty (:pWOID, :pwoOPID)',
                { replacements: { pWOID: req.params.woID, pwoOPID: req.params.woOPID }, type: sequelize.QueryTypes.SELECT });

        var promises = [workorderOperation, sprocGetAllOperationQty];

        Promise.all(promises).then((responses) => {
            var workorderOperationResp = responses[0];
            var sprocGetAllOperationQtyResp = responses[1][responses[1].length - 2];

            var model = {
                workorder: workorderOperationResp,
                workorderQty: _.values(sprocGetAllOperationQtyResp)
            };

            resHandler.successRes(res, 200, STATE.SUCCESS, model);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woModuleName)));
        });
    },
    // Get all workorder and it's all operation details
    // GET : /api/v1/workordertransfer/getWorkorderOperationDetail
    // @param {woID} int
    // @return all workorder operation list
    getWorkorderOperationDetail: (req, res) => {
        const { WorkorderOperation, Workorder } = req.app.locals.models;

        WorkorderOperation.findAll({
            attributes: ['woID', 'opID', 'woOPID', 'qtyControl', 'opNumber', 'opName'],
            include: [{
                model: Workorder,
                as: 'workorder',
                where: {
                    woID: req.params.woID
                },
                attributes: ['woNumber', 'partID', 'isOperationTrackBySerialNo']
            }]
        }).then((response) => {
            if (response.length) {
                WorkorderOperation.findAll({
                    attributes: ['woID', 'opID', 'woOPID', 'qtyControl', 'opNumber', 'opName'],
                    order: ['woID'],
                    include: [{
                        model: Workorder,
                        as: 'workorder',
                        where: {
                            [Op.or]: [
                                {
                                    isRevisedWO: true,
                                    woStatus: DATA_CONSTANT.WORKORDER.WOSTATUS.PUBLISHED, // removed condition due to draft work order can assign from add workorder popup
                                    terminateWOID: null,
                                    partID: response[0].workorder.partID
                                },
                                { terminateWOID: req.params.woID }
                            ]
                        },
                        attributes: ['woNumber', 'partID', 'isOperationTrackBySerialNo']
                    }]
                }).then((resp) => {
                    var workorderList = resp.concat(response);
                    resHandler.successRes(res, 200, STATE.SUCCESS, workorderList);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woModuleName)));
                });
            } else { resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woModuleName))); }
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woModuleName)));
        });
    },
    // Save all workorder transfer details
    // POST : /api/v1/workordertransfer/saveTransferWorkorderDetail
    // @param list
    // @return API response
    saveTransferWorkorderDetail: (req, res) => {
        const { sequelize } = req.app.locals.models;

        // var terminateWOID = req.body.terminateWOID;
        var terminateWOOPID = req.body.terminateWOOPID;
        // var terminateOPNumber = req.body.terminateOPNumber;
        var transferOperationList = req.body.transferOperationList;

        if (transferOperationList) {
            _.each(transferOperationList, (item) => {
                if (item && item.description) {
                    item.description = COMMON.setTextAngularValueForDB(item.description);
                }
            });
        }

        sequelize
            .query('CALL Sproc_WorkorderTransfer (:fromWOOPID, :toWOOPID, :transferQty, :description, :puserID, :puserRoleId, :ppageRoute)',
                {
                    replacements: {
                        fromWOOPID: terminateWOOPID,
                        toWOOPID: transferOperationList[0].toWOOPID,
                        transferQty: transferOperationList[0].transferQty,
                        description: transferOperationList[0].description || null,
                        puserID: COMMON.getRequestUserID(req),
                        puserRoleId: COMMON.getRequestUserLoginRoleID(req),
                        ppageRoute: req.body.travelerPageRoute
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((responses) => {
                    var successErrorObj = responses[0];
                    if (successErrorObj) {
                        if (successErrorObj[0] && successErrorObj[0].err) {
                            const errData = responses[1];
                            if (successErrorObj[0].err === 'operation') {
                                const model = {
                                    status: 'operation',
                                    data: _.values(errData).map(item => ({
                                        opNumber: item.opNumber,
                                        opName: item.opName,
                                        employee: item.fullName
                                    }))
                                };
                                return resHandler.successRes(res, 200, STATE.SUCCESS, model);
                            } else if (successErrorObj[0].err === 'serialcount') {
                                const modelDet = {
                                    status: 'serialcount',
                                    data: {
                                        serialCount: _.values(errData)[0].serialCount,
                                        transferCount: transferOperationList[0].transferQty
                                    }
                                };
                                return resHandler.successRes(res, 200, STATE.SUCCESS, modelDet);
                            } else if (successErrorObj[0].err === 'transferExists') {
                                const modelDet = {
                                    status: 'transferExists',
                                    data: {
                                        oldWoId: _.values(errData)[0].oldWoId
                                    }
                                };
                                return resHandler.successRes(res, 200, STATE.SUCCESS, modelDet);
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            }
                        } else if (_.values(successErrorObj)[0].status === 1) {
                            const isFromWOAutoTerminatedResp = responses[1];

                            // get all emp which has traveler page rights for socket call to move at work order details page
                            if (_.values(isFromWOAutoTerminatedResp)[0].is_from_wo_auto_terminated && req.body.travelerPageRoute) {
                                let empListOfPageRouteAccess = [];
                                if (responses[2]) {
                                    empListOfPageRouteAccess = _.values(responses[2]);
                                }
                                if (empListOfPageRouteAccess && empListOfPageRouteAccess.length > 0) {
                                    const socketCallData = {
                                        receiverEmpIDs: empListOfPageRouteAccess.map(x => x.employeeID),
                                        sendData: {
                                            autoTerminatedWOID: req.body.terminateWOID,
                                            revisedWOID: req.body.toWOID
                                        }
                                    };
                                    NotificationMstController.socketCallForAutoTerminateWOOnTransfer(req, socketCallData);
                                }
                            }
                            return resHandler.successRes(res, 200, STATE.SUCCESS, {
                                status: 'success',
                                isFromWOAutoTerminated: _.values(isFromWOAutoTerminatedResp)[0].is_from_wo_auto_terminated
                            }, MESSAGE_CONSTANT.WORKORDER_TRANSFER.TRANSFER);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
    },
    // Get terminate workorder operation detail by woID
    // POST : /api/v1/workordertransfer/getTerminatedWorkorderDetail
    // @param {woID} int
    // @return API response
    getTerminatedOperationDetail: (req, res) => {
        const { WorkorderOperation } = req.app.locals.models;

        module.exports.getWOTransEmpinoutList(req, req.params.woID).then((response) => {
            if (!response) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(woEmpTransModuleName), err: null, data: null });
            }

            if (response.length) {
                const model = {
                    status: 'operation',
                    data: response.map(item => ({
                        opNumber: item.operation.opNumber,
                        opName: item.operation.opName,
                        employee: item.employee.dataValues.fullName
                    }))
                };
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, model, null);
            } else {
                return WorkorderOperation.findOne({
                    where: {
                        isTerminated: true,
                        woID: req.params.woID
                    },
                    attributes: ['woOPID', 'opID', 'opNumber', 'opName']
                }).then((responseDet) => {
                    if (responseDet) {
                        const modelDet = {
                            status: 'workorder',
                            data: responseDet
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, modelDet, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get terminate workorder transfer detail
    // GET : /api/v1/workordertransfer/getWorkorderTransferDetail
    // @param {woID} int
    // @return API response
    getWorkorderTransferDetail: (req, res) => {
        const { WorkorderTransfer } = req.app.locals.models;
        WorkorderTransfer.findAll({
            where: {
                fromWOID: req.params.woID
            },
            attributes: getWOTransferAttrs
        }).then((response) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, response);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woTransferModuleName)));
        });
    },
    // Get terminate workorder transfer details for history
    // GET : /api/v1/workordertransfer/getWorkorderTransferHistory
    // @param {woOPID} int
    // @return API response
    getWorkorderTransferHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetWorkorderTransferHistoryByWOOPID (:woOPID)',
            { replacements: { woOPID: req.params.woOPID } })
            .then((response) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, response);
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woTransferModuleName)));
            });
    },
    // Get employee list with work order start/stop details
    // @param {req} Obj
    // @param {terminateWOID} int
    // @return API response
    getWOTransEmpinoutList: (req, terminateWOID) => {
        const { WorkorderTransEmpinout, Operation, Employee, sequelize } = req.app.locals.models;

        return WorkorderTransEmpinout.findAll({
            where: {
                woID: terminateWOID,
                checkoutTime: null
            },
            attributes: [],
            include: [{
                model: Operation,
                as: 'operation',
                attributes: ['opName', 'opNumber']
            }, {
                model: Employee,
                as: 'employee',
                attributes: [[sequelize.literal('CONCAT(employee.firstName , \' \' , employee.lastName)'), 'fullName']]
            }]
        }).then(response => response).catch((err) => {
            console.trace();
            console.error(err);
            return null;
        });
    },
    // get all employee list which has access rights to defined page route
    getEmpListOfPageRouteAccess: (req, data) => {
        const { sequelize } = req.app.locals.models;
        return sequelize
            .query('CALL Sproc_GetEmpListOfPageRouteAccess (:ppageRoute)',
                {
                    replacements: {
                        ppageRoute: data.pageRoute
                    }
                });
    }
};