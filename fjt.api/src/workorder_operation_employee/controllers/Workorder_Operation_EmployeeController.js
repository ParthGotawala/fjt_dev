const _ = require('lodash');
const { Op } = require('sequelize');
const fs = require('fs');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter, NotDelete } = require('../../errors');

const timelineObjForTotalWoOp = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION;
const totalWorkorderOperationConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION;
const timelineObjForWoOpEmp = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_EMPLOYEE;
const WoOpEmpConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_EMPLOYEE;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const WorkorderController = require('../../workorder/controllers/WorkorderController');

const operationModuleName = DATA_CONSTANT.OPERATION.NAME;
const woOPClusModuleName = DATA_CONSTANT.WORKORDER_OPERATION_CLUSTER.NAME;
const woOPEquiModuleName = DATA_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.NAME;
const woOPPartModuleName = DATA_CONSTANT.WORKORDER_OPERATION_PART.NAME;
const woOPEmpModuleName = DATA_CONSTANT.WORKORDER_OPERATION_EMPLOYEE.NAME;
const woOPModuleName = DATA_CONSTANT.WORKORDER_OPERATION.NAME;
const woSerialModuleName = DATA_CONSTANT.WORKORDER.SERIAL_NUMBER;

const ADD_REMOVE_OP_ERROR_CODE = {
    EC51: { CODE: 'EC51' }/* already added ready to ship qty - move to stock from last op done
                             so not allowed to add operation */
};

const inputFields = [
    'woOpEmployeeID',
    'woID',
    'opID',
    'employeeID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Save workorder operation employee
    // POST : /api/v1/workorder_operation_employee/saveWorkorderOperation_Employee
    // @return API response
    saveWorkorderOperation_Employee: (req, res) => {
        if (req.body && req.body.listObj && req.body.listObj.opIDs) {
            const { sequelize, Operation, WorkorderOperation, Workorder } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            const opIDstr = req.body.listObj.opIDs.toString();

            /* all these opIDs are new to adding as woOPID and not available in wo op */
            return Operation.findAll({
                where: {
                    [Op.and]: [
                        { opID: req.body.listObj.opIDs },
                        { opID: { [Op.notIn]: sequelize.literal(` ( select opID from workorder_operation WHERE deletedAt IS NULL and woID = ${req.body.listObj.woID})`) } }
                    ]
                },
                attributes: ['opID']
            }).then(newAddingOpList => sequelize.transaction().then(t => sequelize
                .query('CALL Sproc_AddOperationInWorkOrder (:pwoID, :popID, :puserID, :puserRoleId)',
                    {
                        replacements: {
                            pwoID: req.body.listObj.woID,
                            popID: opIDstr,
                            puserID: req.body.createdBy,
                            puserRoleId: req.body.createByRoleId
                        },
                        transaction: t
                    })
                .then((addDeleteOpResp) => {
                    if (addDeleteOpResp && addDeleteOpResp.length > 0 && addDeleteOpResp[0].errorCode) {
                        if (!t.finished) { t.rollback(); }
                        let errMsg = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                        switch (addDeleteOpResp[0].errorCode) {
                            case ADD_REMOVE_OP_ERROR_CODE.EC51.CODE: {
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.WO_PRODUCTION_STARTED_NOT_ALLOW_TO_CHANGE);
                                messageContent.message = COMMON.stringFormat(messageContent.message, 'operation details');
                                errMsg = messageContent;
                                break;
                            }
                            default:
                                break;
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: errMsg, err: null, data: null });
                    }
                    // return sequelize
                    // .query('CALL Sproc_GetWoOpFolderAndDocForRemove (:pwoID, :popIDs)',
                    //     {
                    //         replacements: {
                    //             pwoID: req.body.listObj.woID,
                    //             popIDs: opIDstr,
                    //         }
                    //     })
                    // .then((removingDocFolderList) => {

                    // if(removingDocFolderList && removingDocFolderList.length > 0){

                    //    let removingDocList = _.values(removingDocFolderList[0]);
                    //    let removingFolderList = _.values(removingDocFolderList[1]);

                    //    // remove document and folder for removed work order operation
                    //    let woOpEntity = COMMON.AllEntityIDS.Workorder_operation;
                    //    let dir = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${woOpEntity.Name}/`;
                    //    _.each(removingDocList, (removeItem) => {
                    //        let docpath = `${dir}${itemData.gencFileName}`;
                    //        fs.unlink(docpath, () => { });
                    //    });

                    //    _.each(removingFolderList, (removeItem) => {
                    //        let folderpath = `${dir}${itemData.gencFolderName}`;
                    //        fs.unlink(folderpath, () => { });
                    //    });
                    // }

                    /* copy all op master files to new created woOP (copy files only for new added operation) */
                    if (!newAddingOpList || newAddingOpList.length === 0) {
                        return t.commit().then(() => resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.ADDED(woOPModuleName) }));
                    }

                    /* get newly created work order operation */
                    return WorkorderOperation.findAll({
                        where: {
                            woID: req.body.listObj.woID,
                            opID: { [Op.in]: _.map(newAddingOpList, 'opID') }
                        },
                        attributes: ['woOPID', 'opID', 'woID'],
                        transaction: t
                    }).then((newlyAddedWoOPIDList) => {
                        const newAddedWoOPIdList = newlyAddedWoOPIDList;
                        // get doc folder path for newly created work order operations
                        return sequelize.query('CALL Sproc_GetWOOPDocumentPathByWOOPIDs (:pwoOPIDs)',
                            {
                                replacements: {
                                    pwoOPIDs: _.map(newlyAddedWoOPIDList, 'woOPID').toString()
                                },
                                transaction: t,
                                type: sequelize.QueryTypes.SELECT
                            }).then((respOfWOOPDocumentPathList) => {
                                if (!respOfWOOPDocumentPathList || respOfWOOPDocumentPathList.length === 0) {
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }

                                const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                                const WOOPDocumentPathList = [];
                                _.each(respOfWOOPDocumentPathList, (pathItem) => {
                                    if (pathItem && !_.isEmpty(pathItem[0])) {
                                        WOOPDocumentPathList.push(pathItem[0]);
                                    }
                                });

                                // create physical folder path
                                _.each(WOOPDocumentPathList, (woOPItem) => {
                                    let genWOOPFilePath = gencFileUploadPathConst;
                                    const woOPFolders = woOPItem.newDocumentPath.split('/');
                                    _.each(woOPFolders, (folderItem) => {
                                        genWOOPFilePath = `${genWOOPFilePath}${folderItem}/`;
                                        if (!fs.existsSync(genWOOPFilePath)) {
                                            fs.mkdirSync(genWOOPFilePath);
                                        }
                                    });
                                });

                                const requiredDet = {
                                    model: {
                                        isCopyOPFrom: null,
                                        newAddedOpMstList: _.map(newAddingOpList, 'opID'),
                                        reqComeFrom: 'selected_op_add'
                                    },
                                    newWorkOrderDet: {
                                        woID: req.body.listObj.woID
                                    },
                                    newCreatedWOOPDocPathList: WOOPDocumentPathList
                                };

                                const opMasterCopyDocPromises = [];
                                opMasterCopyDocPromises.push(WorkorderController.copyOpMasterDocToWOOPFolderPath(req, t, requiredDet));
                                return Promise.all(opMasterCopyDocPromises).then(() => {
                                    // [S] add log of adding operation in work order for timeline users
                                    const objEvent = {
                                        userID: req.user.id,
                                        eventTitle: totalWorkorderOperationConstObj.CHANGED.title,
                                        eventDescription: COMMON.stringFormat(totalWorkorderOperationConstObj.CHANGED.description, req.body.listObj.woNumber, req.user.username),
                                        refTransTable: totalWorkorderOperationConstObj.refTransTableName,
                                        refTransID: opIDstr,
                                        eventType: timelineObjForTotalWoOp.id,
                                        url: COMMON.stringFormat(totalWorkorderOperationConstObj.CHANGED.url, req.body.listObj.woID),
                                        eventAction: timelineEventActionConstObj.UPDATE
                                    };
                                    req.objEvent = objEvent;
                                    TimelineController.createTimeline(req, res, t);
                                    // [E] add log of adding operation in work order for timeline users

                                    const woDetChangePromises = [];
                                    if (req.body.listObj.masterTemplateMasterID) {
                                        const updateMasterTemplateObj = {
                                            masterTemplateID: req.body.listObj.masterTemplateMasterID,
                                            updatedBy: req.user.id
                                        };
                                        woDetChangePromises.push(
                                            Workorder.update(updateMasterTemplateObj, {
                                                where: {
                                                    woID: req.body.listObj.woID
                                                },
                                                fields: ['masterTemplateID', 'updatedBy', 'updatedAt'],
                                                transaction: t
                                            }));
                                    }
                                    return Promise.all(woDetChangePromises).then(() => t.commit().then(() => {
                                        newAddedWoOPIdList.forEach((objectDetail) => {
                                            // Add Work Order Operation detail into Elastic Search Engine for Enterprise Search
                                            req.params = {
                                                woOPID: objectDetail.woOPID
                                            };
                                            // Add Work Order Operation detail into Elastic Search Engine for Enterprise Search
                                            // Need to change timeout code due to trasaction not get updated record
                                            EnterpriseSearchController.manageWorkOrderOperationDetailInElastic(req);
                                        });
                                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.ADDED(woOPModuleName) });
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPModuleName)));
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPModuleName)));
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPModuleName)));
                            });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPModuleName)));
                    });
                    // }).catch((err) => {
                    //    console.trace();
                    //    console.error(err);
                    //    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPModuleName)));
                    // });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPModuleName)));
                }))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPModuleName)));
                });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get workorder employee by OpID
    // POST : /api/v1/workorder_operation_employee/getWorkorderEmployeeByOpID
    // @return orkorder employee detail
    getWorkorderEmployeeByOpID: (req, res) => {
        const { WorkorderOperationEmployee, Employee } = req.app.locals.models;
        if (req.body) {
            return Employee.findAll({
                attributes: ['id', 'firstName', 'lastName', 'profileImg'],
                include: [{
                    model: WorkorderOperationEmployee,
                    as: 'workorderOperationEmployee',
                    where: {
                        woID: req.body.listObj.woID,
                        opID: req.body.listObj.opID
                    },
                    attributes: ['woOpEmployeeID', 'woID', 'opID', 'employeeID', 'woOPID'],
                    required: true
                }]
            }).then((getEmployeeData) => {
                if (!getEmployeeData) {
                    return resHandler.errorRes(res,
                        200,
                        STATE.EMPTY,
                        new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, getEmployeeData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Delete operation from workorder
    // POST : /api/v1/workorder_operation_employee/deleteOperationFromWorkOrder
    // @return API response
    deleteOperationFromWorkOrder: (req, res) => {
        const { sequelize, GenericFiles, Workorder } = req.app.locals.models;
        if (req.body) {
            let operationDetail;
            COMMON.setModelDeletedByFieldValue(req);
            const Entityname = COMMON.AllEntityIDS.Workorder_operation.Name;
            let tableName;
            let IDs;
            let referenceIDs;
            let ModuleName;
            const promises = [];
            const woOpIdArray = _.flatten(req.body.listObj.woOPID);
            if (req.body.listObj.employeeID) {
                tableName = 'workorder_operation_employee';
                IDs = req.body.listObj.employeeID.toString();
                referenceIDs = req.body.listObj.woOPID.toString();
                ModuleName = woOPEmpModuleName;
            } else if (req.body.listObj.eqpID) {
                tableName = 'workorder_operation_equipment';
                IDs = req.body.listObj.eqpID.toString();
                referenceIDs = req.body.listObj.woOPID.toString();
                ModuleName = woOPEquiModuleName;
            } else if (req.body.listObj.partID) {
                tableName = 'workorder_operation_part';
                IDs = req.body.listObj.partID.toString();
                referenceIDs = req.body.listObj.woOPID.toString();
                ModuleName = woOPPartModuleName;
            } else if (req.body.listObj.clusterID) {
                tableName = 'workorder_operation_cluster';
                IDs = req.body.listObj.clusterID.toString();
                referenceIDs = req.body.listObj.woOPID;
                ModuleName = woOPClusModuleName;
            } else {
                tableName = 'workorder_operation';
                IDs = req.body.listObj.woOPID.toString();
                referenceIDs = null;
                ModuleName = woOPModuleName;
            }
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: IDs,
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: referenceIDs,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((operation) => {
                    if (operation) {
                        operationDetail = operation[0];
                        if (operationDetail && operationDetail.TotalCount === 0) {
                            if (tableName === 'workorder_operation') {
                                let genericList = [];
                                promises.push(GenericFiles.findAll({
                                    where: {
                                        refTransID: { [Op.in]: req.body.listObj.woOPID },
                                        gencFileOwnerType: Entityname
                                    }
                                }).then((genericFilesDetail) => {
                                    genericList = genericFilesDetail;
                                    return GenericFiles.update(req.body, {
                                        where: {
                                            refTransID: { [Op.in]: woOpIdArray },
                                            gencFileOwnerType: Entityname,
                                            deletedAt: null
                                        },
                                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                                    }).then(() => {
                                        // dir = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${Entityname}/`;
                                        if (req.body.listObj.isPermanentDelete === 'true' || req.body.listObj.isPermanentDelete === true) {
                                            _.each(genericList, (itemData) => {
                                                const docpath = `.${itemData.genFilePath}`;
                                                fs.unlink(docpath, () => { });
                                            });
                                        }
                                        return Promise.resolve(genericList);
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                }));
                            }
                            if (Array.isArray(req.body.listObj.woOPID) && req.body.listObj.woOPID.length > 0) {
                                // Delete Workorder Operation Detail into Elastic Search Engine for Enterprise Search
                                // Need to change timeout code due to trasaction not get updated record
                                setTimeout(() => {
                                    EnterpriseSearchController.deleteWorkOrderOperationDetailInElastic(req.body.listObj.woOPID.toString());
                                }, 2000);
                            }
                            if (Array.isArray(req.body.listObj.eqpID) && req.body.listObj.eqpID.length > 0) {
                                req.params['eqpID'] = req.body.listObj.eqpID;
                                req.params['woOPID'] = req.body.listObj.woOPID;
                                // Delete [Workorder/Workorder Operation] Equipment Detail into Elastic Search Engine for Enterprise Search
                                EnterpriseSearchController.deleteWOOperationEquipmentDetailInElastic(req);
                            }
                            if (Array.isArray(req.body.listObj.employeeID) && req.body.listObj.employeeID.length > 0) {
                                req.params['employeeID'] = req.body.listObj.employeeID;
                                req.params['woOPID'] = req.body.listObj.woOPID;
                                // Delete [Workorder/Workorder Operation] Employee Detail into Elastic Search Engine for Enterprise Search
                                EnterpriseSearchController.deleteWOOperationEmployeeDetailInElastic(req);
                            }
                            if (Array.isArray(req.body.listObj.partID) && req.body.listObj.partID.length > 0) {
                                req.params['partId'] = req.body.listObj.partId;
                                req.params['woOPID'] = req.body.listObj.woOPID;
                                // Delete [Workorder/Workorder Operation] [Supplier/Materials/Tools] Detail into Elastic Search Engine for Enterprise Search
                                EnterpriseSearchController.deleteWOOperationPartDetailInElastic(req);
                            }
                            // const woDetChangePromises = [];
                            if (req.body.listObj.isRequiredToRemovedMasterTemplate) {
                                const updateMasterTemplateObj = {
                                    masterTemplateID: null,
                                    updatedBy: req.user.id
                                };
                                promises.push(
                                    Workorder.update(updateMasterTemplateObj, {
                                        where: {
                                            woID: req.body.listObj.woID
                                        },
                                        fields: ['masterTemplateID', 'updatedBy', 'updatedAt']
                                    }));
                            }
                            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operationDetail, MESSAGE_CONSTANT.REMOVED(ModuleName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, operationDetail, null);
                        }
                    } else {
                        if (Array.isArray(req.body.listObj.woOPID) && req.body.listObj.woOPID.length > 0) {
                            // Delete Workorder Operation Detail into Elastic Search Engine for Enterprise Search
                            // Need to change timeout code due to trasaction not get updated record
                            setTimeout(() => {
                                EnterpriseSearchController.deleteWorkOrderOperationDetailInElastic(req.body.listObj.woOPID.toString());
                            }, 2000);
                        }
                        if (Array.isArray(req.body.listObj.eqpID) && req.body.listObj.eqpID.length > 0) {
                            req.params['eqpID'] = req.body.listObj.eqpID;
                            req.params['woOPID'] = req.body.listObj.woOPID;
                            // Delete [Workorder/Workorder Operation] Equipment Detail into Elastic Search Engine for Enterprise Search
                            EnterpriseSearchController.deleteWOOperationEquipmentDetailInElastic(req);
                        }
                        if (Array.isArray(req.body.listObj.employeeID) && req.body.listObj.employeeID.length > 0) {
                            req.params['employeeID'] = req.body.listObj.employeeID;
                            req.params['woOPID'] = req.body.listObj.woOPID;
                            // Delete [Workorder/Workorder Operation] Employee Detail into Elastic Search Engine for Enterprise Search
                            EnterpriseSearchController.deleteWOOperationEmployeeDetailInElastic(req);
                        }
                        if (Array.isArray(req.body.listObj.partID) && req.body.listObj.partID.length > 0) {
                            req.params['partId'] = req.body.listObj.partId;
                            req.params['woOPID'] = req.body.listObj.woOPID;
                            // Delete [Workorder/Workorder Operation] [Supplier/Materials/Tools] Detail into Elastic Search Engine for Enterprise Search
                            EnterpriseSearchController.deleteWOOperationPartDetailInElastic(req);
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operationDetail, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Add employee to workorder
    // POST : /api/v1/workorder_operation_employee/addEmployeeToWorkOrder
    // @return API response
    addEmployeeToWorkOrder: (req, res) => {
        const { sequelize, WorkorderOperationEmployee } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj);
            return sequelize.transaction().then(t => WorkorderOperationEmployee.bulkCreate(req.body.listObj, {
                individualHooks: true,
                transaction: t
            }).then(woOpEmployee => t.commit().then(() => {
                req.params['pId'] = _.map(woOpEmployee, 'woOpEmployeeID').toString();
                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationEmployeeInElastic);

                // [S] add log of adding employee to wo op (here adding op to equipment - popup) for timeline users
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: null,
                    eventDescription: null,
                    refTransTable: WoOpEmpConstObj.refTransTableName,
                    refTransID: _.map(woOpEmployee, 'woOpEmployeeID').toString(),
                    eventType: timelineObjForWoOpEmp.id,
                    url: null,
                    eventAction: timelineEventActionConstObj.CREATE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req, res, t);
                // [E] add log of adding employee to wo op (here adding op to equipment - popup) for timeline users

                return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_EMPLOYEE.EMPLOYEE_ADDED_TO_WORKORDER_OPERATION });
            })).catch((err) => {
                if (!t.finished) { t.rollback(); }
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotDelete(MESSAGE_CONSTANT.NOT_ADDED(woOPEmpModuleName)));
                }
            }));
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Retrive list of operation by woID
    // GET : /api/v1/workorder_operation_employee/retriveOperationListbyWoID
    // @param {woID} int
    // @return list of operation
    retriveOperationListbyWoID: (req, res) => {
        const { WorkorderOperation, WorkorderOperationCluster, WorkorderCluster, WorkorderTransOperationHoldUnhold, GenericCategory } = req.app.locals.models;
        WorkorderOperation.findAll({
            where: {
                woID: req.params.woID
            },
            attributes: ['woOPID', 'woID', 'opID', 'opName', 'opNumber', 'isStopOperation', 'opStatus', 'operationTypeID', 'isRework',
                'isIssueQty', 'qtyControl', 'isMoveToStock', 'isPlacementTracking', 'isTrackBySerialNo', 'isAllowFinalSerialMapping', 'isLoopOperation', 'refLoopWOOPID', 'isPreProgrammingComponent', 'isTeamOperation', 'tabLimitAtTraveler',
                'isFluxNotApplicable', 'isWaterSoluble', 'isNoClean', 'opVersion', 'shortDescription'],
            include: [{
                model: WorkorderOperationCluster,
                as: 'workorderOperationCluster',
                attributes: ['woClusterID', 'clusterID', 'opID'],
                required: false,
                include: [{
                    model: WorkorderCluster,
                    as: 'clusterWorkorder',
                    attributes: ['woID', 'isParellelOperation'],
                    where: {
                        woID: req.params.woID
                    },
                    required: false
                }]
            }, {
                model: WorkorderTransOperationHoldUnhold,
                as: 'workorderTransOperationHoldUnhold',
                where: {
                    endDate: { [Op.eq]: null }
                },
                required: false,
                attributes: ['woTransOpHoldUnholdId']
            }, {
                model: GenericCategory,
                as: 'operationType',
                required: false,
                attributes: ['gencCategoryID', 'gencCategoryCode', 'gencCategoryName']
            }]
        }).then((operation) => {
            const operationData = operation;
            _.each(operationData, (op) => {
                // op.dataValues.workorderOperationEmployee = _.first(_.uniqBy(op.dataValues.workorderOperationEmployee, 'opID'));
                op.dataValues.workorderOperationCluster = _.filter(op.dataValues.workorderOperationCluster, cluster => cluster.dataValues.clusterWorkorder != null);
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operationData, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of employee by woID
    // GET : /api/v1/workorder_operation_employee/retriveEmployeeListbyWoID
    // @param {woID} int
    // @return list of employee
    retriveEmployeeListbyWoID: (req, res) => {
        const { WorkorderOperationEmployee, Employee, Department, EmployeeDepartment, GenericCategory } = req.app.locals.models;
        Employee.findAll({
            attributes: ['id', 'firstName', 'lastName', 'profileImg', 'isActive', 'initialName'],
            where: {
                isDeleted: false
            },
            include: [{
                model: WorkorderOperationEmployee,
                as: 'workorderOperationEmployee',
                where: {
                    woID: req.params.woID
                },
                attributes: ['woOpEmployeeID', 'woID', 'opID', 'employeeID', 'woOPID'],
                required: false
            },
            {
                model: EmployeeDepartment,
                as: 'employeeDepartment',
                attributes: ['departmentID', 'titleID'],
                required: false,
                where: {
                    isDefault: true
                },
                include: [{
                    model: Department,
                    as: 'department',
                    attributes: ['deptName']
                },
                {
                    model: GenericCategory,
                    as: 'genericCategory',
                    attributes: ['gencCategoryName']
                }]
            }
            ]
        }).then((employee) => {
            var employeeData = employee;
            return resHandler.successRes(res, 200, STATE.SUCCESS, employeeData);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
        });
    },
    // Retrive kist employee details by EmpID
    // POST : /api/v1/workorder_operation_employee/retriveEmployeeDetailsbyEmpID
    // @return list of employee details
    retriveEmployeeDetailsbyEmpID: (req, res) => {
        const { WorkorderOperationEmployee, Employee } = req.app.locals.models;
        if (req.body) {
            Employee.findAll({
                attributes: ['id', 'firstName', 'lastName', 'profileImg'], // , 'designation', 'deptID'
                where: {
                    id: req.body.listObj.employeeID
                },
                include: [{
                    model: WorkorderOperationEmployee,
                    as: 'workorderOperationEmployee',
                    where: {
                        woID: req.body.listObj.woID
                    },
                    attributes: ['woOpEmployeeID', 'woID', 'opID', 'employeeID'],
                    required: false
                }]
            }).then((employee) => {
                var employeeData = employee;
                return resHandler.successRes(res, 200, STATE.SUCCESS, employeeData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
            });
        }
    },

    // Get list of workorder employee details by EmpCode
    // POST : /api/v1/workorder_operation_employee/getWorkorderEmployeeDetailsByEmpCode
    // @return list of workorder employee details
    getWorkorderEmployeeDetailsByEmpCode: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetWorkorderEmployeeDetailsByEmpCode (:pcodeDigest, :pisUserAdmin);',
                        {
                            replacements: {
                                pcodeDigest: COMMON.ENCRYPT((req.body.listObj.employeeCode).toUpperCase()),
                                pisUserAdmin: req.body.listObj.isUserAdmin ? req.body.listObj.isUserAdmin : null
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            return Promise.all(promises).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, {
                employeeDetails: _.values(response[0][0]),
                workorderDetails: _.values(response[0][1]),
                activeOperations: _.values(response[0][2])
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get list of operation by woID
    // POST : /api/v1/workorder_operation_employee/getOperationListByWoID
    // @return list of operation
    getOperationListByWoID: (req, res) => {
        const { WorkorderOperationEmployee, WorkorderOperation } = req.app.locals.models;
        if (req.body) {
            const whereStatement = {};
            // Added for admin user if admin than show all operation added in workorder
            if (req.body.listObj.isUserAdmin) {
                whereStatement.woID = req.body.listObj.woID;
                whereStatement.opStatus = [DATA_CONSTANT.WORKORDER_OPERATION.OPSTATUS.PUBLISHED,
                DATA_CONSTANT.WORKORDER_OPERATION.OPSTATUS.TERMINATED];

                return WorkorderOperation.findAll({
                    where: whereStatement,
                    attributes: ['woOPID', 'opNumber', 'opName', 'opVersion', 'opStatus', 'isStopOperation', 'qtyControl', 'isIssueQty']
                }).then((getOperationData) => {
                    const resOperationList = [];
                    if (!getOperationData || getOperationData.length === 0) {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(operationModuleName)));
                    }
                    _.each(getOperationData, (opData) => {
                        const objItem = {};
                        objItem.employeeID = req.body.listObj.employeeID;
                        objItem.opID = opData.opID;
                        objItem.woID = req.body.listObj.woID;
                        objItem.woOpEmployeeID = null;
                        objItem.woOPID = opData.woOPID;
                        objItem.workorderOperation = opData;
                        resOperationList.push(objItem);
                    });
                    // // Added condition to allow click to admin user for workorder operation details
                    // let operationList = getOperationData;
                    // let operationEmployeeList = _.remove(operationList, function (data) {
                    //    return data.dataValues.employeeID == req.body.listObj.employeeID;
                    // });
                    // if (req.body.listObj.isUserAdmin) {
                    //    _.each(operationList, (opData) => {
                    //        let findOP = _.find(operationEmployeeList, (employeeData) => { return opData.dataValues.workorderOperation.dataValues.opNumber == employeeData.dataValues.workorderOperation.dataValues.opNumber });
                    //        if (!findOP) {
                    //            operationEmployeeList.push(opData);
                    //        }
                    //    });
                    // }
                    // // Added condition to allow click to admin user for workorder operation details
                    // resOperationList = operationEmployeeList;
                    return resHandler.successRes(res, 200, STATE.SUCCESS, resOperationList);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                });
            } else {
                whereStatement.woID = req.body.listObj.woID;
                whereStatement.employeeID = req.body.listObj.employeeID;
                return WorkorderOperationEmployee.findAll({
                    attributes: ['woOpEmployeeID', 'woID', 'opID', 'employeeID', 'woOPID'],
                    where: whereStatement,
                    include: [{
                        model: WorkorderOperation,
                        as: 'workorderOperation',
                        attributes: ['woOPID', 'opID', 'opNumber', 'opVersion', 'opName', 'opStatus', 'isStopOperation', 'qtyControl', 'isIssueQty'],
                        where: {
                            opStatus: [DATA_CONSTANT.WORKORDER_OPERATION.OPSTATUS.PUBLISHED,
                            DATA_CONSTANT.WORKORDER_OPERATION.OPSTATUS.TERMINATED]
                        }
                    }]
                }).then((getOperationData) => {
                    if (!getOperationData || getOperationData.length === 0) {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(operationModuleName)));
                    }
                    const operationList = getOperationData;
                    let resOperationList = [];
                    const operationEmployeeList = _.remove(operationList, data => data.dataValues.employeeID === req.body.listObj.employeeID);
                    resOperationList = operationEmployeeList;
                    return resHandler.successRes(res, 200, STATE.SUCCESS, resOperationList);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                });
            }
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },


    // Get list of operation by woID
    // POST : /api/v1/workorder_operation_employee/getWorkorderEmployeeOperationByWoID
    // @return list of operation
    getWorkorderEmployeeOperationByWoID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetWorkorderEmployeeOperationByWoID (:pwoID, :pemployeeID, :pisUserAdmin);',
                        {
                            replacements: {
                                pwoID: req.body.listObj.woID,
                                pemployeeID: req.body.listObj.employeeID,
                                pisUserAdmin: req.body.listObj.isUserAdmin ? req.body.listObj.isUserAdmin : null
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            return Promise.all(promises).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, {
                operationDetails: _.values(response[0][0])
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get list of workorder certificate by woID
    // POST : /api/v1/workorder_operation_employee/getWorkorderCertificateByWoID
    // @return list of workorder certificate
    getWorkorderCertificateByWoID: (req, res) => {
        const { WorkorderCertification, CertificateStandards, StandardClass } = req.app.locals.models;
        if (req.body) {
            return WorkorderCertification.findAll({
                where: {
                    woID: req.body.listObj.woID
                },
                attributes: ['woID', 'certificateStandardID', 'classIDs'],
                include: [{
                    model: CertificateStandards,
                    as: 'certificateStandards',
                    attributes: ['certificateStandardID', 'fullName', 'shortName', 'standardTypeID', 'priority', 'standardInfo'],
                    required: false
                }, {
                    model: StandardClass,
                    as: 'standardsClass',
                    attributes: ['certificateStandardID', 'classID', 'className', 'colorCode', 'displayOrder'],
                    required: false
                }]
            }).then((getCertificateData) => {
                const newList = getCertificateData;
                // _.each(newList, (stand) => {
                //    // let classIDs = stand.classIDs;
                //     //let classArr = classIDs ? classIDs.split(',') : [];
                //     if (stand.dataValues && stand.dataValues.certificateStandards && stand.dataValues.certificateStandards.dataValues) {
                //         let filterData = _.filter(stand.dataValues.certificateStandards.dataValues.CertificateStandard_Class, (std_class) => {
                //             return stand.classIDs == std_class.dataValues.classID ? true : false;
                //         });
                //         stand.dataValues.certificateStandards.dataValues.CertificateStandard_Class = filterData;
                //     }
                // });
                return resHandler.successRes(res, 200, STATE.SUCCESS, newList);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get list of workorder equipment by woID
    // POST : /api/v1/workorder_operation_employee/getWorkorderEquipmentByWoID
    // @return list of workorder equipment
    getWorkorderEquipmentByWoID: (req, res) => {
        const { sequelize, WorkorderOperationEquipment, Equipment, GenericFiles } = req.app.locals.models;
        if (req.body) {
            const equipmentEntityID = COMMON.AllEntityIDS.Equipment.ID;
            return WorkorderOperationEquipment.findAll({
                where: {
                    woOPID: req.body.listObj.woOPID
                },
                attributes: ['woOpEqpID', 'woID', 'opID', 'eqpID', 'woOPID', 'qty', 'isOnline',
                    [sequelize.literal('(SELECT count(1) FROM workorder_operation_equipment_feeder_details woefd WHERE woefd.woOpEqpID = WorkorderOperationEquipment.woOpEqpID AND woefd.deletedAt IS NULL)'), 'feederCount']
                ],
                include: [{
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['eqpID', 'assetName', 'assetNumber', 'eqpMake', 'eqpModel', 'eqpYear', 'equipmentSetupMethod'],
                    include: [{
                        model: GenericFiles,
                        as: 'genericDocument',
                        where: {
                            entityID: equipmentEntityID,
                            isRecycle: false,
                            gencFileName: { [Op.like]: 'profile%' }
                        },
                        required: false
                    }],
                    required: true
                }]
            }).then(getEquipmentData => resHandler.successRes(res, 200, STATE.SUCCESS, getEquipmentData)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get list of workorder part by woID
    // POST : /api/v1/workorder_operation_employee/getWorkorderPartByWoID
    // @return list of workorder part
    getWorkorderPartByWoID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetWOSuppliesMaterialsAndTools (:ppartID, :pwoOPID,:pwoAssyID);',
                        {
                            replacements: {
                                ppartID: null,
                                pwoOPID: req.body.listObj ? (req.body.listObj.woOPID ? req.body.listObj.woOPID : null) : null,
                                pwoAssyID: req.body.listObj.woAssyID
                            }
                        })
            );
            return Promise.all(promises).then((response) => {
                if (!response.length > 0) {
                    return Promise.reject(new NotFound(DATA_CONSTANT.OPERATION_PART.NOT_FOUND));
                }
                const partData = response[0];
                return resHandler.successRes(res, 200, STATE.SUCCESS, partData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get list of workorder documents by woID
    // POST : /api/v1/workorder_operation_employee/getWorkorderDocumentsByWoID
    // @return list of workorder documents
    getWorkorderDocumentsByWoID: (req, res) => {
        const { WorkorderOperation,
            Operation } = req.app.locals.models;
        if (req.body) {
            return WorkorderOperation.findAll({
                where: {
                    woID: req.body.listObj.woID,
                    opID: req.body.listObj.opID
                },
                attributes: ['woID', 'opID'],
                include: [{
                    model: Operation,
                    as: 'operation',
                    attributes: ['opID']

                }]
            }).then(getDocumentData => resHandler.successRes(res, 200, STATE.SUCCESS, getDocumentData)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Delete list of workorder operation employee
    // DELETE : /api/v1/deleteWorkorderOperation_EmployeeList
    // @return API response
    deleteWorkorderOperation_EmployeeList: (req, res) => {
        const { WorkorderOperationEmployee } = req.app.locals.models;
        if (req.query && req.query.employeeIDs && req.query.opID && req.query.woID) {
            COMMON.setModelDeletedByFieldValue(req);
            return WorkorderOperationEmployee.update(req.body, {
                where: {
                    woID: req.query.woID,
                    opID: req.query.opID,
                    employeeID: req.query.employeeIDs,
                    deletedAt: null
                },
                fields: inputFields
            }).then(() => {
                if (req.query.listObj) {
                    const deleteObj = JSON.parse(req.query.listObj);
                    // [S] add log of removing employees from wo op for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: WoOpEmpConstObj.DELETE.title,
                        eventDescription: COMMON.stringFormat(WoOpEmpConstObj.DELETE.description, deleteObj.opName, deleteObj.woNumber, req.user.username),
                        refTransTable: WoOpEmpConstObj.refTransTableName,
                        refTransID: null,
                        eventType: timelineObjForWoOpEmp.id,
                        url: COMMON.stringFormat(WoOpEmpConstObj.DELETE.url, req.query.woOPID),
                        eventAction: timelineEventActionConstObj.DELETE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of removing employees from wo op for timeline users
                }

                return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_EMPLOYEE.EMPLOYEE_DELETED_FROM_WORKORDER_OPERATION });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_EMPLOYEE.EMPLOYEE_NOT_DELETED_FROM_WORKORDER_OPERATION));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get list of employee for audit log by woOPEmployeeID
    // GET : /api/v1/getEmployeeForAuditLogByWoOpEmployeeID
    // @param {woOpEmployeeID} int
    // @return list of employee
    getEmployeeForAuditLogByWoOpEmployeeID: (req, res) => {
        if (req.params.woOpEmployeeID) {
            const { WorkorderOperationEmployee, Employee, WorkorderOperation } = req.app.locals.models;
            return WorkorderOperationEmployee.findOne({
                where: {
                    woOpEmployeeID: req.params.woOpEmployeeID
                },
                paranoid: false,
                attributes: ['woOpEmployeeID', 'employeeID'],
                include: [{
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    paranoid: false
                },
                {
                    model: WorkorderOperation,
                    as: 'workorderOperation',
                    attributes: ['woOPID', 'opID', 'woID', 'opName', 'opNumber'],
                    paranoid: false
                }
                ]
            }).then(woOpEmpDetails => resHandler.successRes(res, 200, STATE.SUCCESS, woOpEmpDetails)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    getAllWorkorderSerials: (req, res) => {
        if (req.params.woID) {
            const { WorkorderOperationFirstPiece, WorkorderTransFirstPcsDet } = req.app.locals.models;
            return WorkorderOperationFirstPiece.findAll({
                where: {
                    woID: req.params.woID
                },
                include: [
                    {
                        model: WorkorderTransFirstPcsDet,
                        as: 'workorderTransFirstPcsDet',
                        required: false,
                        attributes: ['woTransFirstpcsDetID', 'issue', 'resolution', 'remark', 'updatedAt']
                    }]
            }).then((workorderTransFirstPieceDetList) => {
                if (workorderTransFirstPieceDetList) {
                    _.each(workorderTransFirstPieceDetList, (item) => {
                        if (item && item.workorderTransFirstPcsDet) {
                            if (item.workorderTransFirstPcsDet.issue) { item.workorderTransFirstPcsDet.issue = COMMON.getTextAngularValueFromDB(item.workorderTransFirstPcsDet.issue); }
                            if (item.workorderTransFirstPcsDet.resolution) { item.workorderTransFirstPcsDet.resolution = COMMON.getTextAngularValueFromDB(item.workorderTransFirstPcsDet.resolution); }
                        }
                    });
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, { workorderTransFirstPieceDetList: workorderTransFirstPieceDetList });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woSerialModuleName)));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // get all employees (personnel) For Wo Op Master that not added in work order operation
    retrieveNotAddedEmployeeListForWoOp: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && (req.body.woID || req.body.woOPID)) {
            return sequelize
                .query('CALL Sproc_getEmployeesNotAddedInWoOp (:pwoID,:pwoOPID,:pAttributesSearch)',
                    {
                        replacements: {
                            pwoID: req.body.woID ? req.body.woID : null,
                            pwoOPID: req.body.woOPID ? req.body.woOPID : null,
                            pAttributesSearch: req.body.searchText ? req.body.searchText : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const empMasterList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { empMasterList: empMasterList });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
                });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // get all employees (personnel) For Wo Op Master that added in work order operation
    retrieveAddedEmployeeListForWoOp: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.woOPID) {
            return sequelize
                .query('CALL Sproc_getEmployeesAddedInWoOp (:pwoID,:pwoOPID,:pAttributesSearch,:pgetDataAtWorkOrderLevel)',
                    {
                        replacements: {
                            pwoID: null,
                            pwoOPID: req.body.woOPID,
                            pAttributesSearch: req.body.searchText ? req.body.searchText : null,
                            pgetDataAtWorkOrderLevel: false  // here getting at work order operation level so
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const woOpEmpList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { woOpEmpList: woOpEmpList });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
                });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // get all employees (personnel) For WO Master that added in work order
    retrieveAddedEmployeeListForWO: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.woID) {
            return sequelize
                .query('CALL Sproc_getEmployeesAddedInWoOp (:pwoID,:pwoOPID,:pAttributesSearch,:pgetDataAtWorkOrderLevel)',
                    {
                        replacements: {
                            pwoID: req.body.woID,
                            pwoOPID: null,
                            pAttributesSearch: req.body.searchText ? req.body.searchText : null,
                            pgetDataAtWorkOrderLevel: true
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const EmpListForWO = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                    _.each(EmpListForWO, (empItem) => {
                        empItem.workorderOperationEmployee = [];
                    });

                    if (response[1] && _.values(response[1]).length > 0) {
                        const woOPEmpData = _.values(response[1]);
                        _.each(EmpListForWO, (empItem) => {
                            _.each(woOPEmpData, (woOPEmpItem) => {
                                if (woOPEmpItem.employeeID === empItem.id) {
                                    empItem.workorderOperationEmployee.push(woOPEmpItem);
                                }
                            });
                        });
                    }
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { woOpEmpList: EmpListForWO });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
                });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }
};
