const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter, NotUpdate } = require('../../errors');

const timelineObjForTotalWoOp = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER;
const totalWorkorderOperationConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION;
const timelineObjForWoOpDataElement = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_DATAELEMENT;
const WoOpDataElementConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_DATAELEMENT;
const timelineObjForWoOpEmp = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_EMPLOYEE;
const WoOpEmpConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_EMPLOYEE;
const timelineObjForWoOpEquipment = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_EQUIPMENT;
const WoOpEquipmentConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_EQUIPMENT;
// const timelineObjForWoOpEquipmentDl = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_EQUIPMENT_DATAELEMENT;
// const WoOpEquipmentDlConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_EQUIPMENT_DATAELEMENT;
const timelineObjForWoOpParts = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_PART;
const WoOpPartsConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_PART;
const WoConstObj = DATA_CONSTANT.TIMLINE.WORKORDER;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const GenericFilesController = require('../../genericfiles/controllers/GenericFilesController');
const WorkorderTransOperationHoldUnholdController = require('../../workorder_trans_operation_hold_unhold/controllers/Workorder_Trans_Operation_Hold_UnholdController');
const GenericAuthenticationController = require('../../generic_authentication/controllers/GenericAuthenticationController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const operationModuleName = DATA_CONSTANT.OPERATION.NAME;
const woOPElemModuleName = DATA_CONSTANT.WORKORDER_OPERATION_DATAELEMENT.NAME;
const woOPEquiModuleName = DATA_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.NAME;
const woOPPartModuleName = DATA_CONSTANT.WORKORDER_OPERATION_PART.NAME;
const woOPEmpModuleName = DATA_CONSTANT.WORKORDER_OPERATION_EMPLOYEE.NAME;
const woOPModuleName = DATA_CONSTANT.WORKORDER_OPERATION.NAME;
const woModuleName = DATA_CONSTANT.WORKORDER.NAME;

const workorderOperationInputFields = [
    'woID',
    'opID',
    'opName',
    'opNumber',
    'opDescription',
    'opDoes',
    'opDonts',
    'opOrder',
    'isDeleted',
    'opStatus',
    'operationTypeID',
    'parentOPID',
    'processTime',
    'setupTime',
    'perPieceTime',
    'qtyControl',
    'opWorkingCondition',
    'opManagementInstruction',
    'opDeferredInstruction',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'woOPID',
    'isIssueQty',
    'isRework',
    'opVersion',
    'isTeamOperation',
    'tabLimitAtTraveler',
    'isStopOperation',
    'firstPcsModel',
    'firstPcsConclusion',
    'firstPcsStatus',
    'isMoveToStock',
    'isPlacementTracking',
    'isTrackBySerialNo',
    'isTrackBySerialFromWOOP',
    'isAllowFinalSerialMapping',
    'isLoopOperation',
    'refLoopWOOPID',
    'isPreProgrammingComponent',
    'colorCode',
    'cleaningType',
    'mountingTypeID',
    'documentPath',
    'isAllowMissingPartQty',
    'isAllowBypassQty',
    'isEnablePreProgrammingPart',
    'isWaterSoluble',
    'isNoClean',
    'isFluxNotApplicable',
    'addRefDesig',
    'isRequireMachineVerification',
    'doNotReqApprovalForScan',
    'isRequireRefDesWithUMID',
    'isStrictlyLimitRefDes',
    'shortDescription'
];

module.exports = {
    // Get list of operation by workorder operation ID
    // GET : /api/v1/workorderoperation/detail
    // @param {woOPID} int
    // @return list of operation by workorder operation
    retriveOperationbyWoOPID: (req, res) => {
        const { WorkorderOperation, Workorder, WorkorderCluster, WorkorderTransEmpinout,
            WorkorderTransOperationHoldUnhold, Component, RFQRoHS, WorkorderOperationCluster } = req.app.locals.models;
        WorkorderOperation.findOne({
            where: {
                woOPID: req.params.woOPID
            },
            include: [{
                model: Workorder,
                as: 'workorder',
                attributes: ['woNumber', 'excessQty', 'buildQty', 'buildQty',
                    'woVersion', 'isOperationTrackBySerialNo', 'woStatus', 'woSubStatus', 'partID', 'customerID', 'isOperationsVerified'],
                include: [{
                    model: Component,
                    as: 'componentAssembly',
                    attributes: ['id', 'mfgPN', 'PIDCode', 'nickName', 'rev', 'mfgPNDescription', 'isCustom']
                }, {
                    model: RFQRoHS,
                    as: 'rohs',
                    attributes: ['id', 'name', 'rohsIcon']
                }]
            },
            {
                model: WorkorderOperationCluster,
                as: 'workorderOperationCluster',
                attributes: ['woClusterID', 'clusterID', 'opID', 'woOPID'],
                include: [{
                    model: WorkorderCluster,
                    as: 'clusterWorkorder',
                    attributes: ['clusterID', 'clusterName', 'isParellelOperation']
                }]
            },
            {
                model: WorkorderTransEmpinout,
                as: 'workorderTransEmpinout',
                attributes: ['woTransinoutID', 'woID', 'employeeID', 'opID', 'equipmentID'],
                required: false
            }, {
                model: WorkorderTransOperationHoldUnhold,
                as: 'workorderTransOperationHoldUnhold',
                where: {
                    endDate: { [Op.eq]: null }
                },
                required: false,
                attributes: ['woTransOpHoldUnholdId']
            }]
        }).then((operation) => {
            if (operation.opDescription) { operation.opDescription = COMMON.getTextAngularValueFromDB(operation.opDescription); }
            if (operation.opDoes) { operation.opDoes = COMMON.getTextAngularValueFromDB(operation.opDoes); }
            if (operation.opDonts) { operation.opDonts = COMMON.getTextAngularValueFromDB(operation.opDonts); }
            if (operation.opDeferredInstruction) { operation.opDeferredInstruction = COMMON.getTextAngularValueFromDB(operation.opDeferredInstruction); }
            if (operation.opWorkingCondition) { operation.opWorkingCondition = COMMON.getTextAngularValueFromDB(operation.opWorkingCondition); }
            if (operation.opManagementInstruction) { operation.opManagementInstruction = COMMON.getTextAngularValueFromDB(operation.opManagementInstruction); }
            if (operation.firstPcsConclusion) { operation.firstPcsConclusion = COMMON.getTextAngularValueFromDB(operation.firstPcsConclusion); }

            const promises = [];
            promises.push(module.exports.getWorkOrderOperationProductionStatusDetails(req, res));
            return Promise.all(promises).then((response) => {
                var resObj = _.find(response, resDet => resDet.status === STATE.FAILED);
                if (resObj) {
                    if (resObj.message) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, resObj.message);
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }
                const operationObj = operation.dataValues;
                if (response.length > 0) {
                    if (response[0].data && response[0].data.operationProductionDetList) {
                        operationObj.operationProductionDetList = response[0].data.operationProductionDetList;
                    }
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operationObj, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Update operation by workorder operation ID
    // PUT : /api/v1/workorderoperation/update
    // @param {woOPID} int
    // @return API response
    updateWorkorderOperation: (req, res) => {
        // const { sequelize, WorkorderOperation } = req.app.locals.models;
        if (req.params.woOPID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return module.exports.UpdateWokorderOperationDetails(req, res);
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Update workorder operation details (this api called from traveler page too)
    UpdateWokorderOperationDetails: (req, res) => {
        const { sequelize, WorkorderOperation } = req.app.locals.models;
        return WorkorderOperation.findOne({
            where: {
                woOPID: req.params.woOPID
            },
            attributes: ['opNumber']
        }).then((woOPOldDbData) => {
            if (!woOPOldDbData) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            }

            if (req.body.opName) { req.body.opName = COMMON.TEXT_WORD_CAPITAL(req.body.opName, false); }
            if (req.body.opDescription) { req.body.opDescription = COMMON.setTextAngularValueForDB(req.body.opDescription); }
            if (req.body.opDoes) { req.body.opDoes = COMMON.setTextAngularValueForDB(req.body.opDoes); }
            if (req.body.opDonts) { req.body.opDonts = COMMON.setTextAngularValueForDB(req.body.opDonts); }
            if (req.body.opDeferredInstruction) { req.body.opDeferredInstruction = COMMON.setTextAngularValueForDB(req.body.opDeferredInstruction); }
            if (req.body.opManagementInstruction) { req.body.opManagementInstruction = COMMON.setTextAngularValueForDB(req.body.opManagementInstruction); }
            if (req.body.opWorkingCondition) { req.body.opWorkingCondition = COMMON.setTextAngularValueForDB(req.body.opWorkingCondition); }
            if (req.body.firstPcsConclusion) { req.body.firstPcsConclusion = COMMON.setTextAngularValueForDB(req.body.firstPcsConclusion); }

            return sequelize.transaction().then(t => WorkorderOperation.update(req.body, {
                where: {
                    woOPID: req.params.woOPID
                },
                fields: workorderOperationInputFields,
                transaction: t
            }).then(() => {
                // [S] add log of update work order operation for timeline users
                let titleSt = null;
                let descriptionSt = null;
                let eventTypeSt = null;
                let urlSt = null;
                const opTypeForWOOPTimeLineLog = req.body.opTypeForWOOPTimeLineLog ? req.body.opTypeForWOOPTimeLineLog : '';
                const operationsTypeForWOOPTimeLineLog = COMMON.Operations_Type_For_WOOPTimeLineLog;
                switch (opTypeForWOOPTimeLineLog) {
                    case operationsTypeForWOOPTimeLineLog.DosAndDonts:
                        titleSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_DOSANDDONTS.title, req.body.opName, req.body.woNumber);
                        descriptionSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_DOSANDDONTS.description, req.body.opName, req.body.woNumber, req.user.username);
                        eventTypeSt = timelineObjForTotalWoOp.WORKORDER_OPERATION_DOSANDDONTS.id;
                        urlSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_DOSANDDONTS.url, req.params.woOPID);
                        break;
                    case operationsTypeForWOOPTimeLineLog.firstPcsDet:
                        titleSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_FIRSTPCSDET.title, req.body.opName, req.body.woNumber);
                        descriptionSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_FIRSTPCSDET.description, req.body.opName, req.body.woNumber, req.user.username);
                        eventTypeSt = timelineObjForTotalWoOp.WORKORDER_OPERATION_FIRSTPCSDET.id;
                        urlSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_FIRSTPCSDET.url, req.params.woOPID);
                        break;
                    case operationsTypeForWOOPTimeLineLog.WoOpStatus:
                        titleSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_WOOPSTATUS.title, req.body.opName, req.body.woNumber);
                        descriptionSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_WOOPSTATUS.description, req.body.opName, req.body.woNumber, req.user.username);
                        eventTypeSt = timelineObjForTotalWoOp.WORKORDER_OPERATION_WOOPSTATUS.id;
                        urlSt = COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_WOOPSTATUS.url, req.params.woOPID);
                        break;
                    default:
                        titleSt = totalWorkorderOperationConstObj.UPDATE.title;
                        descriptionSt = COMMON.stringFormat(totalWorkorderOperationConstObj.UPDATE.description, req.body.opName, req.body.woNumber, req.user.username);
                        eventTypeSt = timelineObjForTotalWoOp.WORKORDER_OPERATION.id;
                        urlSt = COMMON.stringFormat(totalWorkorderOperationConstObj.UPDATE.url, req.params.woOPID);
                        break;
                }

                const woOPAfterUpdatePromises = [];
                if (req.params.woOPID) {
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: titleSt,
                        eventDescription: descriptionSt,
                        refTransTable: totalWorkorderOperationConstObj.refTransTableName,
                        refTransID: req.params.woOPID,
                        eventType: eventTypeSt,
                        url: urlSt,
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEvent;
                    woOPAfterUpdatePromises.push(TimelineController.createTimeline(req, res, t));
                }
                // [E] add log of update wo operation for timeline users

                // update doc path
                if (COMMON.convertToThreeDecimal(req.body.opNumber) !== COMMON.convertToThreeDecimal(woOPOldDbData.dataValues.opNumber)) {
                    const docData = {
                        gencFileOwnerType: COMMON.AllEntityIDS.Workorder_operation.Name,
                        refTransID: req.params.woOPID
                    };
                    woOPAfterUpdatePromises.push(GenericFilesController.manageDocumentPath(req, res, docData, t));
                }

                /* update WO NoClean WaterSoluble flag if any one contain in any one operation */
                if ((!_.isUndefined(req.body.isNoClean) && !_.isNull(req.body.isNoClean)) || (!_.isUndefined(req.body.isWaterSoluble) && !_.isNull(req.body.isWaterSoluble))) {
                    woOPAfterUpdatePromises.push(module.exports.updateWOOPCleaningTypeDet(req, t));
                }

                // update wo verification
                woOPAfterUpdatePromises.push(module.exports.UpdateWoVerification(req, res, t));

                // update ref. designator
                woOPAfterUpdatePromises.push(module.exports.saveWorkOrderOperationRefDesignator(req, t));

                return Promise.all(woOPAfterUpdatePromises).then(() => t.commit().then(() => {
                    // Add Work Order Operation detail into Elastic Search Engine for Enterprise Search
                    // Need to change timeout code due to trasaction not get updated record
                    EnterpriseSearchController.manageWorkOrderOperationDetailInElastic(req);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(operationModuleName));
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                t.rollback();
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // to update cleaning type for woop and wo
    updateWOOPCleaningTypeDet: (req, t) => {
        const { sequelize } = req.app.locals.models;
        // const allCleaningType = DATA_CONSTANT.Wo_Op_Cleaning_Type;
        return sequelize.query('CALL Sproc_UpdateWO_NoClean_WaterSoluble (:pWoID)',
            {
                replacements: {
                    pWoID: req.body.woID
                },
                transaction: t
            });
    },

    // Update work order verified status
    UpdateWoVerification: (req, res, t) => {
        const { sequelize } = req.app.locals.models;
        COMMON.setModelUpdatedByArrayFieldValue(req.body);
        if ((!_.isUndefined(req.body.isRework) && !_.isNull(req.body.isRework)) ||
            (!_.isUndefined(req.body.qtyControl) && !_.isNull(req.body.qtyControl)) ||
            (!_.isUndefined(req.body.isIssueQty) && !_.isNull(req.body.isIssueQty)) ||
            (!_.isUndefined(req.body.operationTypeID) && !_.isNull(req.body.operationTypeID)) ||
            (!_.isUndefined(req.body.opStatus) && !_.isNull(req.body.opStatus)) ||
            (!_.isUndefined(req.body.isMoveToStock) && !_.isNull(req.body.isMoveToStock)) ||
            (!_.isUndefined(req.body.isPlacementTracking) && !_.isNull(req.body.isPlacementTracking)) ||
            (!_.isUndefined(req.body.isTrackBySerialNo) && !_.isNull(req.body.isTrackBySerialNo)) ||
            (!_.isUndefined(req.body.isAllowFinalSerialMapping) && !_.isNull(req.body.isAllowFinalSerialMapping)) ||
            (!_.isUndefined(req.body.isLoopOperation) && !_.isNull(req.body.isLoopOperation)) ||
            (!_.isUndefined(req.body.isPreProgrammingComponent) && !_.isNull(req.body.isPreProgrammingComponent))) {
            return sequelize.query('CALL Sproc_Update_WO_Verification_WOOP_TrackBySerialNo (:pWOID,:pWOOPID,:pIsOperationsVerified, :pIsTrackBySerialNo, :pUpdatedBy, :pUpdateByRoleId)',
                {
                    replacements: {
                        pWOID: req.body.woID,
                        pWOOPID: req.body.woOPID,
                        pIsOperationsVerified: false,
                        pIsTrackBySerialNo: req.body.isTrackBySerialNo || null,
                        pUpdatedBy: req.body.updatedBy,
                        pUpdateByRoleId: req.body.updateByRoleId
                    },
                    transaction: t
                });
            // .then((woUpdated) => {
            //    return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(operationModuleName) });
            // }).catch((err) => {
            //    console.trace();
            //    console.error(err);
            //    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(operationModuleName)));
            // });
        } else {
            return {
                status: STATE.SUCCESS
            };
            // return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(operationModuleName) });
        }
    },

    // Retrive list of operation entity data elements
    // POST : /api/v1/workorderoperation/retrieveOperationEntityDataElements
    // @return list of operation entity data elements
    retrieveOperationEntityDataElements: (req, res) => {
        const { WorkorderOperationDataelement, DataElement } = req.app.locals.models;
        if (req.body.operationObj) {
            return WorkorderOperationDataelement.findAll({
                where: {
                    woOPID: req.body.operationObj.woOPID,
                    isDeleted: false
                },
                attributes: ['woOpDataElementID', 'woID', 'opID', 'dataElementID', 'displayOrder', 'woOPID']
            }).then(operationDataelement =>
                DataElement.findAll({
                    where: {
                        entityID: req.body.operationObj.id,
                        [Op.or]: [{
                            isDeleted: false
                        }, {
                            dataElementID: {
                                [Op.in]: _.map(operationDataelement, 'dataElementID')
                            }
                        }]
                    },
                    paranoid: false,
                    attributes: ['dataElementID', 'dataElementName', 'entityID', 'controlTypeID', 'parentDataElementID', 'dataelement_use_at']
                }).then(getEntityData => resHandler.successRes(res, 200, STATE.SUCCESS, { dataelements: getEntityData, operationElements: operationDataelement }))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPElemModuleName)));
        }
    },
    // Create workorder operation dataElements
    // POST : /api/v1/workorderoperation/createWorkorderOperationDataElements
    // @return API response
    createWorkorderOperationDataElements: (req, res) => {
        const { sequelize, WorkorderOperationDataelement } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction().then((t) => {
                const promises = [];
                _.each(req.body.listObj.dataElementList, (item) => {
                    /* update display_order of already exists */
                    if (item.woOpDataElementID) {
                        promises.push(WorkorderOperationDataelement.update({ displayOrder: item.displayOrder }, {
                            where: {
                                woOpDataElementID: item.woOpDataElementID
                            },
                            fields: ['displayOrder'],
                            transaction: t
                        }).then(response => Promise.resolve(response)));
                    } else {
                        /* add new data elements in operation */
                        promises.push(WorkorderOperationDataelement.create({
                            woID: item.woID,
                            opID: item.opID,
                            woOPID: req.body.listObj.woOPID,
                            dataElementID: item.dataElementID,
                            displayOrder: item.displayOrder,
                            createdBy: req.user.id
                        }, { transaction: t }).then(response => Promise.resolve(response)));
                    }
                });
                // return Promise.all(promises);
                return Promise.all(promises).then(result => t.commit().then(() => {
                    const woOpDataElementIDs = _.map(result, 'woOpDataElementID').toString();
                    if (woOpDataElementIDs) {
                        // [S] add log of adding data element to wo op for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoOpDataElementConstObj.CREATE.title,
                            eventDescription: COMMON.stringFormat(WoOpDataElementConstObj.CREATE.description, req.body.listObj.opName, req.body.listObj.woNumber, req.user.username),
                            refTransTable: WoOpDataElementConstObj.refTransTableName,
                            refTransID: woOpDataElementIDs,
                            eventType: timelineObjForWoOpDataElement.id,
                            url: COMMON.stringFormat(WoOpDataElementConstObj.CREATE.url, req.body.listObj.woOPID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                    }
                    // [E] add log of adding data element to wo op for timeline users
                    if (req.body.listObj.isInnerSortingOfElement) {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_DATAELEMENT.DATAELEMENT_ORDER_UPDATED });
                    } else {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_DATAELEMENT.DATAELEMENT_ADDED_TO_WORKORDER_OPERATION });
                    }
                })).catch((err) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_DATAELEMENT.DATAELEMENT_NOT_ADDED_TO_WORKORDER_OPERATION));
                    }
                });
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Retrive list of operation by woID
    // GET : /api/v1/workorderoperation/retriveOPListbyWoID
    // @param {woID} int
    // @return list of operation
    retriveOPListbyWoID: (req, res) => {
        const { WorkorderOperation } = req.app.locals.models;
        WorkorderOperation.findAll({
            where: {
                woID: req.params.woID
            },
            attributes: ['woOPID', 'woID', 'opID', 'opName', 'opNumber', 'isStopOperation', 'qtyControl', 'isFluxNotApplicable', 'isNoClean', 'isWaterSoluble'],
            order: [['opNumber', 'ASC']]
        }).then(operation => resHandler.successRes(res, 200, STATE.SUCCESS, operation)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
        });
    },


    // Retrive list of operation with transaction by woID
    // GET : /api/v1/workorderoperation/retriveOPListWithTransbyWoID
    // @param {woID} int
    // @return list of operation
    retriveOPListWithTransbyWoID: (req, res) => {
        const { VUWorkorderProductionStk } = req.app.locals.models;
        return VUWorkorderProductionStk.findAll({
            where: {
                woID: { [Op.eq]: req.params.woID }
            },
            paranoid: false,
            attributes: ['woOPID', 'woID', 'opID', 'opName', 'opNumber', 'isStopOperation', 'qtyControl', 'OPProdQty', 'isEnablePreProgrammingPart'],
            order: [['opNumber', 'ASC']]
        }).then(operation => resHandler.successRes(res, 200, STATE.SUCCESS, operation)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res,
                200,
                STATE.EMPTY,
                new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
        });
    },

    // Retrieve list of equipment operation details
    // POST : /api/v1/workorderoperation/retrieveEquipmentOperationDetails
    // @return list of equipment operation details
    retrieveEquipmentOperationDetails: (req, res) => {
        const { sequelize, WorkorderOperationEquipment, Equipment, GenericFiles } = req.app.locals.models;
        if (req.body.operationObj) {
            return WorkorderOperationEquipment.findAll({
                where: {
                    woOPID: req.body.operationObj.woOPID
                },
                attributes: ['woOpEqpID', 'woID', 'opID', 'eqpID', 'woOPID', 'qty', 'isOnline', 'createdBy',
                    [sequelize.literal('(SELECT count(1) FROM workorder_operation_equipment_feeder_details woefd WHERE woefd.woOpEqpID = WorkorderOperationEquipment.woOpEqpID AND woefd.deletedAt IS NULL)'), 'feederCount']
                ]
            }).then(operationEquipment =>
                Equipment.findAll({
                    where: {
                        [Op.or]: [{
                            isDeleted: false,
                            equipmentAs: DATA_CONSTANT.EQUIPMENT_TYPE_VALUE.EQUIPMENT
                        }, {
                            eqpID: {
                                [Op.in]: _.map(operationEquipment, 'eqpID')
                            }
                        }]
                    },
                    paranoid: false,
                    attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpModel', 'eqpYear', 'equipmentAs', 'isActive', 'equipmentSetupMethod']
                }).then(getEquipmentData => GenericFiles.findAll({
                    where:
                    {
                        refTransID: {
                            [Op.in]: _.map(getEquipmentData, 'eqpID')
                        },
                        gencFileOwnerType: COMMON.AllEntityIDS.Equipment.Name,
                        isRecycle: false,
                        gencFileName: {
                            [Op.like]: 'profile%'
                        }
                    },
                    raw: true,
                    attributes: ['gencFileName', 'refTransID']
                }).then((profileData) => {
                    if (getEquipmentData && getEquipmentData.length > 0
                        && profileData && profileData.length > 0) {
                        _.each(getEquipmentData, (eqpment) => {
                            _.each(profileData, (profile) => {
                                if (profile.refTransID === eqpment.eqpID) {
                                    eqpment.dataValues.genericFiles = profile;
                                }
                            });
                        });
                    }
                    return sequelize
                        .query('CALL Sproc_getSODetailfromWoOPID (:pWOOPID)',
                            {
                                replacements: {
                                    pWOOPID: req.body.operationObj.woOPID
                                }
                            }).then(salesorderDetail => resHandler.successRes(res, 200, STATE.SUCCESS, { equipments: getEquipmentData, operationEquipment: operationEquipment, salesOrderDet: salesorderDetail })).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                            });
                }))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEquiModuleName)));
        }
    },

    // Create workorder operation equipments
    // POST : /api/v1/workorderoperation
    // @return API response
    createWorkorderOperationEquipments: (req, res) => {
        const { sequelize, WorkorderOperationEquipment, EquipmentDataelement, DataElement,
            WorkorderOperationEquipmentDataelement } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.equipmentList) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.equipmentList);
            let insertedWoOpEqpIDs = null;

            return sequelize.transaction().then(t => WorkorderOperationEquipment.bulkCreate(req.body.listObj.equipmentList, {
                individualHooks: true,
                transaction: t
            }).then((resultData) => {
                insertedWoOpEqpIDs = _.map(resultData, 'woOpEqpID');
                req.params['pId'] = insertedWoOpEqpIDs;
                // EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationEquipmentInElastic);

                if (resultData.length > 0) {
                    const promises = [];
                    _.each(resultData, (woEquipment) => {
                        promises.push(EquipmentDataelement.findAll({
                            where: {
                                eqpID: woEquipment.eqpID,
                                isDeleted: false
                            },
                            include: [{
                                model: DataElement,
                                as: 'dataElement',
                                where: {
                                    dataelement_use_at: { [Op.ne]: COMMON.DATAELEMENT_USE_AT.Entity }
                                },
                                required: true
                            }],
                            attributes: ['eqpDataElementID', 'eqpID', 'dataElementID', 'displayOrder'],
                            transaction: t
                        }).then((equipmentData) => {
                            const woEquipmentDataElementList = [];
                            if (equipmentData.length > 0) {
                                _.each(equipmentData, (woEquipmentData) => {
                                    const obj = {};
                                    obj.woID = woEquipment.woID;
                                    obj.opID = woEquipment.opID;
                                    obj.eqpID = woEquipment.eqpID;
                                    obj.woOPID = woEquipment.woOPID;
                                    obj.dataElementID = woEquipmentData.dataElementID;
                                    obj.displayOrder = woEquipmentData.displayOrder;
                                    obj.createdBy = woEquipment.createdBy;
                                    woEquipmentDataElementList.push(obj);
                                });
                                return WorkorderOperationEquipmentDataelement.bulkCreate(woEquipmentDataElementList, {
                                    individualHooks: true,
                                    transaction: t
                                });
                            } else {
                                return STATE.SUCCESS;
                            }
                        }));
                    });

                    if (insertedWoOpEqpIDs) {
                        // [S] add log of adding equipment to wo op for timeline users
                        const objEventEqp = {
                            userID: req.user.id,
                            eventTitle: WoOpEquipmentConstObj.CREATE.title,
                            eventDescription: COMMON.stringFormat(WoOpEquipmentConstObj.CREATE.description, req.body.listObj.opName, req.body.listObj.woNumber, req.user.username),
                            refTransTable: WoOpEquipmentConstObj.refTransTableName,
                            refTransID: insertedWoOpEqpIDs.toString(),
                            eventType: timelineObjForWoOpEquipment.id,
                            url: COMMON.stringFormat(WoOpEquipmentConstObj.CREATE.url, req.body.listObj.woOPID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEventEqp;
                        promises.push(TimelineController.createTimeline(req, res, t));
                    }
                    // [E] add log of adding equipment to wo op for timeline users

                    // // [S] add log of adding equipment data element to wo op for timeline users
                    // let objEventEqpDl = {
                    //    userID: req.user.id,
                    //    eventTitle: WoOpEquipmentDlConstObj.CREATE.title,
                    //    eventDescription: COMMON.stringFormat(WoOpEquipmentDlConstObj.CREATE.description,req.body.listObj.opName, req.body.listObj.woNumber, req.user.username),
                    //    refTransTable: WoOpEquipmentDlConstObj.refTransTableName,
                    //    refTransID: null,
                    //    eventType: timelineObjForWoOpEquipmentDl.id,
                    //    url: null,
                    // };
                    // req.objEvent = objEventEqpDl;
                    // TimelineController.createTimeline(req);
                    // // [E] add log of adding equipment element to wo op for timeline users

                    return Promise.all(promises).then(() => t.commit().then(() => {
                        req.params['pId'] = insertedWoOpEqpIDs;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationEquipmentInElastic);
                        return resHandler.successRes(res, 200, STATE.SUCCESS,
                            { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_ADDED_TO_WORKORDER_OPERATION });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                t.rollback();
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_NOT_ADDED_TO_WORKORDER_OPERATION));
                }
            })).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_NOT_ADDED_TO_WORKORDER_OPERATION));
                }
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // get all Parts (SuppliesMaterialsAndTools) that not added For Wo Op
    // POST : /api/v1/workorderoperation/retrieveNotAddedPartsForWoOp
    // @return list of parts that not added as SuppliesMaterialsAndTools
    retrieveNotAddedPartsForWoOp: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.woOPID && req.query.partID) {
            const filter = COMMON.UiGridFilterSearch(req);
            // let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }

            return sequelize
                .query('CALL Sproc_GetSuppliesMaterialsAndToolsNotAddedInWoOp (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pwoOPID,:pAttributesSearch,:partID)',
                    {
                        replacements: {
                            ppageIndex: req.query.page,
                            precordPerPage: filter.limit,
                            pOrderBy: strOrderBy,
                            pWhereClause: null,
                            pwoOPID: req.params.woOPID,
                            pAttributesSearch: req.query.searchTextOfNoAddedPart ? JSON.parse(req.query.searchTextOfNoAddedPart) : null,
                            partID: JSON.parse(req.query.partID)
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const partMasterList = response[1] && _.values(response[1]).length > 0 ? _.values(response[1]) : [];
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { partMasterList: partMasterList, Count: response[0][0]['COUNT(*)'] });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPPartModuleName)));
                });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // get all Parts (SuppliesMaterialsAndTools) that already added  For Wo Op
    // POST : /api/v1/workorderoperation/retrieveAddedPartsForWoOp
    // @return list of parts that added as SuppliesMaterialsAndTools
    retrieveAddedPartsForWoOp: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.woOPID && req.body.partID) {
            return sequelize
                .query('CALL Sproc_GetSuppliesMaterialsAndToolsAddedInWoOp (:pwoOPID,:pAttributesSearch,:partID)',
                    {
                        replacements: {
                            pwoOPID: req.body.woOPID,
                            pAttributesSearch: req.body.searchText ? req.body.searchText : null,
                            partID: req.body.partID
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const operationPartList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { woOpPartList: operationPartList });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPPartModuleName)));
                });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Retrieve list of part operation details
    // POST : /api/v1/workorderoperation/retrievePartOperationDetails
    // @return list of part operation details
    retrievePartOperationDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.operationObj) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetWoOPComponentSuppliesMaterialsAndTools (:ppartID, :pwoID, :pwoOPID);',
                        {
                            replacements: {
                                ppartID: null,
                                pwoID: null,
                                pwoOPID: req.body.operationObj.woOPID ? req.body.operationObj.woOPID : null
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            // promises.push(
            //     WorkorderOperationPart.findAll({
            //         attributes: ['woOpPartID', 'woID', 'opID', 'partID', 'woOPID'],
            //         where: {
            //             woOPID: req.body.operationObj.woOPID
            //         },
            //     })
            // );
            return Promise.all(promises).then((response) => {
                if (!response.length > 0) {
                    return Promise.reject(new NotFound(operationModuleName));
                }
                const partData = _.values(response[0][0]);
                if (response[0][1] && _.values(response[0][1]).length > 0) {
                    const opPartData = _.values(response[0][1]);
                    _.each(partData, (partItem) => {
                        partItem.workorderOperationPart = undefined;
                        _.each(opPartData, (opPartItem) => {
                            if (opPartItem.partID === partItem.id) {
                                partItem.workorderOperationPart = opPartItem;
                            }
                        });
                    });
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, partData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPPartModuleName)));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPPartModuleName)));
        }
    },
    // Create workorder operation component
    // POST : /api/v1/workorderoperation/createWorkorderOperationParts
    // @return API response
    createWorkorderOperationParts: (req, res) => {
        if (req.body && req.body.listObj && req.body.listObj.partList) {
            const { WorkorderOperationPart, sequelize } = req.app.locals.models;

            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.partList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.listObj.partList);

            return sequelize.transaction().then(t => WorkorderOperationPart.bulkCreate(req.body.listObj.partList, {
                individualHooks: true,
                transaction: t
            }).then((result) => {
                const promises = [];
                req.params['pId'] = _.map(result, 'woOPPartID').toString();
                // EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationPartInElastic);

                /* added approval authentication details for part restriction access */
                if (result && req.body.listObj.restrictPartAuthenticationDet && req.body.listObj.partList.length === 1) {
                    req.body.authenticationApprovedDet = req.body.listObj.restrictPartAuthenticationDet;
                    req.body.authenticationApprovedDet.refID = _.first(result).woOPPartID;
                    promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonWithWorkingProcess(req, t));
                }

                const woOPPartIDs = _.map(result, 'woOPPartID').toString();

                if (woOPPartIDs) {
                    // [S] add log of adding component to wo op for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: WoOpPartsConstObj.CREATE.title,
                        eventDescription: COMMON.stringFormat(WoOpPartsConstObj.CREATE.description, req.body.listObj.opName, req.body.listObj.woNumber, req.user.username),
                        refTransTable: WoOpPartsConstObj.refTransTableName,
                        refTransID: woOPPartIDs,
                        eventType: timelineObjForWoOpParts.id,
                        url: COMMON.stringFormat(WoOpPartsConstObj.CREATE.url, req.body.listObj.woOPID),
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    promises.push(TimelineController.createTimeline(req, res, t));
                }
                // [E] add log of adding component to wo op for timeline users

                return Promise.all(promises).then(() => t.commit().then(() => {
                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationPartInElastic);
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_PART.PART_ADDED_TO_WORKORDER_OPERATION });
                })).catch((err) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_PART.PART_NOT_ADDED_TO_WORKORDER_OPERATION));
                    }
                });
            }).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_PART.PART_NOT_ADDED_TO_WORKORDER_OPERATION));
                }
            }));
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Retrieve list of employee operation details
    // POST : /api/v1/workorderoperation
    // @return list of employee operation details
    retrieveEmployeeOperationDetails: (req, res) => {
        const { WorkorderOperationEmployee, Employee, Department, EmployeeDepartment, GenericCategory } = req.app.locals.models;
        if (req.body.operationObj) {
            return WorkorderOperationEmployee.findAll({
                where: {
                    woOPID: req.body.operationObj.woOPID
                },
                attributes: ['woOpEmployeeID', 'woID', 'opID', 'employeeID', 'woOPID']
            }).then(operationEmployees => Employee.findAll({
                paranoid: false,
                attributes: ['id', 'firstName', 'lastName', 'profileImg', 'isActive', 'isDeleted', 'initialName'],
                where: {
                    isDeleted: false
                },
                include: [
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
            }).then(getEmployees => resHandler.successRes(res, 200, STATE.SUCCESS, { employees: getEmployees, operationEmployees: operationEmployees }))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName)));
        }
    },
    // Create workorder operation employees
    // POST : /api/v1/workorderoperation/createWorkorderOperationEmployees
    // @return API response
    createWorkorderOperationEmployees: (req, res) => {
        const { sequelize, WorkorderOperationEmployee } = req.app.locals.models;
        COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.employeeList);
        if (req.body && req.body.listObj && req.body.listObj.employeeList) {
            return sequelize.transaction().then(t => WorkorderOperationEmployee.bulkCreate(req.body.listObj.employeeList, {
                individualHooks: true,
                transaction: t
            }).then(result => t.commit().then(() => {
                req.params['pId'] = _.map(result, 'woOpEmployeeID').toString();
                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationEmployeeInElastic);
                const woOpEmployeeIDs = _.map(result, 'woOpEmployeeID').toString();
                if (woOpEmployeeIDs) {
                    // [S] add log of adding employees to wo op for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: WoOpEmpConstObj.CREATE.title,
                        eventDescription: COMMON.stringFormat(WoOpEmpConstObj.CREATE.description, req.body.listObj.opName, req.body.listObj.woNumber, req.user.username),
                        refTransTable: WoOpEmpConstObj.refTransTableName,
                        refTransID: woOpEmployeeIDs,
                        eventType: timelineObjForWoOpEmp.id,
                        url: COMMON.stringFormat(WoOpEmpConstObj.CREATE.url, req.body.listObj.woOPID),
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req, res);
                    // [E] add log of adding employees to wo op for timeline users
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_EMPLOYEE.EMPLOYEE_ADDED_TO_WORKORDER_OPERATION });
            })).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_EMPLOYEE.EMPLOYEE_NOT_ADDED_TO_WORKORDER_OPERATION));
                }
            }));
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get list o workorder operation detail by workorder operation id
    // GET : /api/v1/workorderoperation/getWOOPDetails
    // @param {woOPID} int
    // @return list of workorder operation detail
    getWOOPDetails: (req, res) => {
        var woOPID = req.params.woOPID;

        const { WorkorderOperation, Workorder } = req.app.locals.models;

        WorkorderOperation.findOne({
            where: {
                woOPID: woOPID
            },
            attributes: ['opName', 'opNumber', 'opVersion', 'opID', 'woID', 'isFluxNotApplicable', 'isWaterSoluble', 'isNoClean'],
            include: [{
                model: Workorder,
                as: 'workorder',
                attributes: ['woNumber', 'woVersion']
            }]
        }).then(result => resHandler.successRes(res, 200, STATE.SUCCESS, result)).catch(() => resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(woOPModuleName))));
    },
    // Save workorder operation version
    // POST : /api/v1/workorderoperation/saveWOOPVersion
    // @return API response
    saveWOOPVersion: (req, res) => {
        const { WorkorderOperation, Workorder, sequelize } = req.app.locals.models;
        COMMON.setModelUpdatedByFieldValue(req);

        const opModel = {
            woOPID: req.body.woOPID,
            opVersion: req.body.opVersion,
            updatedBy: req.body.updatedBy
        };
        return sequelize.transaction().then(t => WorkorderOperation.update(opModel, {
            where: {
                woOPID: opModel.woOPID
            },
            fields: ['opVersion', 'updatedBy', 'updatedAt'],
            transaction: t
        }).then(() => {
            var woModel = {
                woID: req.body.woID,
                woVersion: req.body.woVersion,
                updatedBy: req.body.updatedBy
            };
            return Workorder.update(woModel, {
                where: {
                    woID: woModel.woID
                },
                fields: ['woVersion', 'updatedBy', 'updatedAt'],
                transaction: t
            }).then(() => t.commit().then(() => {
                if (req.body.woOPID) {
                    // [S] add log of update work order operation version for timeline users
                    const objEventForWoOpVersion = {
                        userID: req.user.id,
                        eventTitle: totalWorkorderOperationConstObj.WORKORDER_OPERATION_VERSION.title,
                        eventDescription: COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_VERSION.description, req.body.timelineObj.fromOPVersion
                            , req.body.opVersion, req.body.timelineObj.opName, req.body.timelineObj.woNumber, req.user.username),
                        refTransTable: totalWorkorderOperationConstObj.refTransTableName,
                        refTransID: req.body.woOPID,
                        eventType: timelineObjForTotalWoOp.WORKORDER_OPERATION_VERSION.id,
                        url: COMMON.stringFormat(totalWorkorderOperationConstObj.WORKORDER_OPERATION_VERSION.url, req.body.woOPID),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEventForWoOpVersion;
                    TimelineController.createTimeline(req);
                    // [E] add log of update work order operation version for timeline users
                }
                if (req.body.woID) {
                    // [S] add log of update work order version for timeline users
                    const objEventForWoVersion = {
                        userID: req.user.id,
                        eventTitle: WoConstObj.WORKORDER_VERSION.title,
                        eventDescription: COMMON.stringFormat(WoConstObj.WORKORDER_VERSION.description, req.body.timelineObj.fromWOVersion
                            , req.body.woVersion, req.body.timelineObj.woNumber, req.user.username),
                        refTransTable: WoConstObj.refTransTableName,
                        refTransID: req.body.woID,
                        eventType: timelineObjForTotalWoOp.WORKORDER_VERSION.id,
                        url: COMMON.stringFormat(WoConstObj.url, req.body.woID),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEventForWoVersion;
                    TimelineController.createTimeline(req);
                    // [E] add log of update work order version for timeline users
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, req.body);
            })).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) { t.rollback(); }
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(woModuleName)));
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) { t.rollback(); }
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(woOPModuleName)));
        }));
    },
    // Stop workorder operation by workorder operation id
    // POST : /api/v1/workorderoperation/stopWOOperation
    // @param {woOPID} int
    // @return list of workorder cluster
    stopWOOperation: (req, res) => {
        const { sequelize, WorkorderOperation } = req.app.locals.models;
        if (req.params.woOPID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                WorkorderOperation.update(req.body, {
                    where: {
                        woOPID: req.params.woOPID
                    },
                    fields: ['isStopOperation', 'updatedBy'],
                    transaction: t
                }).then(() => WorkorderTransOperationHoldUnholdController.manageWorkorderTransOperationHoldUnhold(req, t).then((response) => {
                    if (response) {
                        const holdOperationValue = response.dataValues;
                        if (holdOperationValue) {
                            if (req.body.isStopOperation) {
                                holdOperationValue.holdBy = req.user.username;
                            }
                            // else{
                            //     holdOperationValue.unHoldBy = req.user.username;
                            // }
                        }
                        return t.commit().then(() => {
                            if (req.body.woOPID) {
                                // [S] add log of hold/resume work order operation for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: COMMON.stringFormat(totalWorkorderOperationConstObj.HALT_RESUME_WORKORDER_OPERATION.title, req.body.isStopOperation ? 'halt' : 'resume'),
                                    eventDescription: COMMON.stringFormat(totalWorkorderOperationConstObj.HALT_RESUME_WORKORDER_OPERATION.description, req.body.opName, req.body.isStopOperation ? 'halt' : 'resume', req.body.woNumber, req.user.username),
                                    refTransTable: totalWorkorderOperationConstObj.refTransTableName,
                                    refTransID: req.body.woOPID,
                                    eventType: timelineObjForTotalWoOp.WORKORDER_OPERATION.id,
                                    url: COMMON.stringFormat(totalWorkorderOperationConstObj.HALT_RESUME_WORKORDER_OPERATION.url, req.body.woOPID),
                                    eventAction: timelineEventActionConstObj.UPDATE
                                };
                                req.objEvent = objEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log of stop work order operation for timeline users
                            }
                            return resHandler.successRes(res, 200, STATE.SUCCESS, {
                                userMessage: req.body.isStopOperation ? MESSAGE_CONSTANT.WORKORDER_OPERATION.WORKORDER_OPERATION_STOPED : MESSAGE_CONSTANT.WORKORDER_OPERATION.WORKORDER_OPERATION_STARTED,
                                holdOperationValue: holdOperationValue
                            });
                        });
                    } else {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(operationModuleName)));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(operationModuleName)));
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(operationModuleName)));
                });
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Retrieve list of work order operation for accessing its workorder_trans_dataelement in report
    // POST : /api/v1/workorderoperationinfo/retrieveAllWorkorderOperationforTransDataElement/:woID
    // @return list of work orders
    retrieveAllWorkorderOperationforTransDataElement: (req, res) => {
        const { WorkorderOperation } = req.app.locals.models;
        if (req.params.woID) {
            return WorkorderOperation.findAll({
                where: {
                    woID: req.params.woID
                },
                attributes: ['woOPID', 'opName', 'opNumber']
            }).then(workorderOperationlist => resHandler.successRes(res, 200, STATE.SUCCESS, { workorderOperationlist: workorderOperationlist })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPModuleName)));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // validate equipment status change request across work orders
    // POST : /api/v1/workorderoperation/changeEquipmentStatusDetails
    // @return list of workorder with active equipment.
    changeEquipmentStatusDetails: (req, res) => {
        const { WorkorderOperationEquipment, Equipment, WorkorderOperation, Workorder } = req.app.locals.models;
        if (req.body.operationObj) {
            // check equipment online/offline
            // if equipment request for offline than check with current status,
            // if already offline than nothing to do with,
            // if online than make it offline
            // if equipment request for online than check with current status,
            // if offline than check with other all operation,
            // any operation having equipment online than not allow to do
            return WorkorderOperationEquipment.findAll({
                where: {
                    eqpID: req.body.operationObj.eqpID
                },
                attributes: ['woOpEqpID', 'woID', 'opID', 'eqpID', 'woOPID', 'qty', 'isOnline'],
                include: [{
                    model: WorkorderOperation,
                    as: 'workorderOperation',
                    attributes: ['woOPID', 'opID', 'woID', 'opName', 'opNumber', 'opVersion']
                }, {
                    model: Workorder,
                    as: 'workorder',
                    attributes: ['woID', 'woNumber', 'woVersion']
                }, {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpYear', 'assetNumber']
                }]
            }).then((woEquipmentArr) => {
                if (woEquipmentArr && woEquipmentArr.length > 0) {
                    const updateEquipmentStatus = {};
                    // if equipment request for offline than check with current status,
                    const findEquipmentOnline = _.find(woEquipmentArr, { woOPID: req.body.operationObj.woOPID });
                    if (findEquipmentOnline.isOnline && !req.body.operationObj.isOnline) {
                        // if already offline than nothing to do with,

                        // if online than make it offline
                        updateEquipmentStatus.woOpEqpID = findEquipmentOnline.woOpEqpID;
                        updateEquipmentStatus.equipment = findEquipmentOnline.equipment;
                        updateEquipmentStatus.isOnline = false;
                    } else if (req.body.operationObj.isOnline) {
                        const travelerUrl = DATA_CONSTANT.TRAVELER_URL;
                        // if equipment request for online than check with current status,
                        const findOnline = _.find(woEquipmentArr, { isOnline: true });

                        // if offline than check with other all operation,
                        if (findOnline) {
                            // any operation having equipment online than not allow to do
                            const opName = COMMON.operationDisplayFormat(MESSAGE_CONSTANT.OPERATION.OPERATION_DISPlAY_FORMAT, findOnline.workorderOperation.opName, findOnline.workorderOperation.opNumber);
                            const fullDetails = `<a target='blank' href='${COMMON.stringFormat(travelerUrl, findOnline.woOPID, req.body.operationObj.employeeId, req.body.operationObj.woOPID)}'> WO#: ${findOnline.workorder.woNumber} - ${opName}</a>`;
                            return resHandler.errorRes(res, 200, STATE.EMPTY,
                                new NotCreate(COMMON.stringFormat(MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_ALREADY_ONLINE_IN_ANOTHER_WORKORDER, fullDetails)));
                        } else {
                            const updateWOEqp = _.find(woEquipmentArr, { woOpEqpID: req.body.operationObj.woOpEqpID });
                            if (updateWOEqp) {
                                // no operation online than allow to update status
                                updateEquipmentStatus.woOpEqpID = updateWOEqp.woOpEqpID;
                                updateEquipmentStatus.equipment = updateWOEqp.equipment;
                                updateEquipmentStatus.isOnline = true;
                            }
                        }
                    }
                    if (updateEquipmentStatus.woOpEqpID) {
                        return WorkorderOperationEquipment.update(updateEquipmentStatus, {
                            where: {
                                woOpEqpID: updateEquipmentStatus.woOpEqpID
                            },
                            fields: ['woOpEqpID', 'isOnline']
                        }).then(() => {
                            NotificationMstController.getWOOPEmployees(req, req.body.operationObj.woOPID).then((employees) => {
                                var data = {
                                    woID: req.body.operationObj.woID,
                                    opID: req.body.operationObj.opID,
                                    woOPID: req.body.operationObj.woOPID,
                                    employeeID: req.user.employeeID,
                                    senderID: req.user.employeeID,
                                    receiver: employees,
                                    equipment: updateEquipmentStatus.equipment
                                };
                                if (updateEquipmentStatus.isOnline) {
                                    NotificationMstController.sendEquipmentOnline(req, data);
                                } else {
                                    NotificationMstController.sendEquipmentOffline(req, data);
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                /* Empty */
                            });
                            return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(woOPEquiModuleName) });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woOPEquiModuleName)));
                        });
                    } else {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woOPEquiModuleName)));
                    }
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEquiModuleName)));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEquiModuleName)));
        }
    },

    // Get previous workorder operation detail by workorder operation id
    // POST : /api/v1/workorderoperation/getPreviousWorkOrderOperationDetails
    // @param {woID} int
    // @param {woOPID} int
    // @return previous workorder operation detail
    getPreviousWorkOrderOperationDetails: (req, res) => {
        if (req.body && req.body.woOPID && req.body.woID) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('CALL Sproc_GetPreviousWorkOrderOperationDetails (:pwoID, :pwoOPID)',
                {
                    replacements: {
                        pwoID: req.body.woID,
                        pwoOPID: req.body.woOPID
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    let previousOperationDetList = [];
                    if (response && response.length > 0) {
                        previousOperationDetList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                        if (previousOperationDetList.length === 0) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MFG.INVALID_LOOP_OPERATION.message });
                        }
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { previousOperationDetList: previousOperationDetList }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get previous workorder operation production status details by workorder operation id
    // GET : /api/v1/workorderoperation/getWorkOrderOperationProductionStatusDetails
    // @param {woID} int
    // @param {woOPID} int
    // @return workorder operation production status details
    getWorkOrderOperationProductionStatusDetails: (req) => {
        if (req.params && req.params.woOPID) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('CALL Sproc_GetWorkOrderOperationProductionDetails (:pwoOPID)',
                {
                    replacements: {
                        pwoOPID: req.params.woOPID
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    let operationProductionDetList = [];
                    operationProductionDetList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                    return {
                        status: STATE.SUCCESS,
                        message: null,
                        data: { operationProductionDetList: operationProductionDetList }
                    };
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        message: { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }
                    };
                });
        } else {
            return {
                status: STATE.FAILED,
                message: { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null }
            };
        }
    },
    // Get workorder operation configuration list by workorder id
    // GET : /api/v1/workorderoperation/workorderOperationConfigurationList
    // @param {woID} int
    // @return workorder operation configuration list
    workorderOperationConfigurationList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.woID) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveWorkorderOperation (:pWOID,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pWOID: req.body.woID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { workOrderConfigurationList: _.values(response[1]), Count: response[0][0]['TotalRecord'], refDesignatorList: _.values(response[2]) }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrieve scanned Rack detail
    // POST : /api/v1/workorderoperation/retriveScannedRackdetail
    // @return scanned rack detail
    retriveScannedRackdetail: (req, res) => {
        if (req.body && req.body.woOPID && req.body.ptransactionType) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_IncomingOutgoingRackList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pwoOPID,:ptransactionType)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            pwoOPID: req.body.woOPID,
                            ptransactionType: req.body.ptransactionType
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { scanrack: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrieve empty rack List.
    // POST : /api/v1/workorderoperation/retriveEmptyRackList
    // @return empty rack List
    retriveEmptyRackList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_GetEmptyRackList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { emptyRack: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrieve available rack list.
    // POST : /api/v1/workorderoperation/retriveAvailableRackList
    // @return available rack list
    retriveAvailableRackList: (req, res) => {
        if (req.body && req.body.woOPID) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_GetAvailableRackList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pwoOPID)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            pwoOPID: req.body.woOPID
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { availableRack: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve clear rack List.
    // POST : /api/v1/workorderoperation/retriveClearRackList
    // @return clear rack List
    retriveClearRackList: (req, res) => {
        if (req.body && req.body.woOPID) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_GetClearRackHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pwoOPID)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            pwoOPID: req.body.woOPID
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { clearRack: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve rack history
    // POST : /api/v1/workorderoperation/retriveRackdetailHistory
    // @return rack detail history
    retriveRackdetailHistory: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize
                .query('CALL Sproc_GetRackHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pwoOPID,:pwoID,:prackID)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            pwoOPID: req.body.woOPID || null,
                            pwoID: req.body.woID || null,
                            prackID: req.body.rackID || null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rackHistory: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get work order operation passing fields data dynamically
    // POST : /api/v1/workorderoperation/getWOOPFieldDetailsByFieldName
    // @param {woOPID} int
    // @param {fieldNameForData} string
    // @return operation fields details
    getWOOPFieldDetailsByFieldName: (req, res) => {
        if (req.body.woOPID && req.body.fieldNameForData) {
            const { sequelize } = req.app.locals.models;

            return sequelize.query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)', {
                replacements: {
                    pfields: req.body.fieldNameForData,
                    ptablename: COMMON.DBTableName.WorkorderOperation,
                    pwherecluse: `\`woOPID\`=${req.body.woOPID}`,
                    pgroupby: '',
                    porderby: null
                }
            }).then((woOPFieldDetail) => {
                const woOPFieldData = woOPFieldDetail && woOPFieldDetail.length > 0 ? _.first(woOPFieldDetail) : null;
                if (woOPFieldData && woOPFieldData[req.body.fieldNameForData]) {
                    woOPFieldData[req.body.fieldNameForData] = COMMON.getTextAngularValueFromDB(woOPFieldData[req.body.fieldNameForData]);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, woOPFieldData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // add/update/delete workorder ref. designator
    // POST : /api/v1/workorderoperation/saveWorkOrderRefDesignatory
    // @param {woId} int, {opId} int , {woopid} int
    saveWorkOrderOperationRefDesignator: (req, t) => {
        const { sequelize } = req.app.locals.models;
        const desgList = [];
        _.each(req.body.refDesigList, (det) => {
            desgList.push({
                id: det.Id || {},
                refDesig: det.refDesig || {},
                isDeleted: det.isDeleted || 0
            });
        });

        return sequelize.query('call sproc_saveWorkorderOperationRefDesignator(:pWoID, :pOpID, :pWoOpID, :pDesigList, :pUserID, :pUserRoleID )', {
            replacements: {
                pWoID: req.body.woID || null,
                pOpID: req.body.opID || null,
                pWoOpID: req.body.woOPID || null,
                pDesigList: JSON.stringify(desgList),
                pUserID: req.user.id,
                pUserRoleID: COMMON.getRequestUserLoginRoleID(req)
            },
            transaction: t
        }).then(() => ({ status: STATE.SUCCESS }));
        // .catch((err) => {
        //     if (!t.finished) t.rollback();
        //     console.error();
        //     console.trace(err);
        //     return { status: STATE.FAILED, err: err };
        // });
    },

    // Retrive list of workorer operation ref. designator
    // GET : /api/v1/workorderoperation/retriveWorkOrderOperaionRefDesigList
    // @param {woOPID} int
    // @return list of ref. desig.
    retriveWorkOrderOperaionRefDesigList: (req, res) => {
        const { WorkorderOperationRefDesig } = req.app.locals.models;
        const whereClause = {
            woID: req.body.woID
        };
        if (req.body.woOPID) {
            whereClause.woOpId = req.body.woOPID;
        }
        return WorkorderOperationRefDesig.findAll({
            where: whereClause,
            attributes: ['woOPID', 'woID', 'opID', 'Id', 'refDesig', 'isDeleted'],
            order: [['woOPID', 'ASC']]
        }).then(refD => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, refD, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get line items by Assy PartID with Sub Assembly details
    // GET : /api/v1/rfqlineitems/getRFQLineItemsByID
    // @param {id} int
    // @return API response
    // Checked for Re factor
    getRFQLineItemsByIDWithSubAssembly: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetRFQLineItemsByIDWithSubAssembly (:ppageIndex, :precordPerPage,  :ppartID)', {
            replacements: {
                ppageIndex: req.body.page || 0,
                precordPerPage: req.body.pageSize || 0,
                ppartID: req.body.id || null
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
};