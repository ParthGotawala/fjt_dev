const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON, GENERICCATEGORY } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter, NotDelete } = require('../../errors');

const timelineObjForWoOpEquipment = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_EQUIPMENT;
const WoOpEquipmentConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_EQUIPMENT;
// const timelineObjForWoOpEquipmentDl = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_EQUIPMENT_DATAELEMENT;
// const WoOpEquipmentDlConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_EQUIPMENT_DATAELEMENT;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const woOPEquiModuleName = DATA_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.NAME;
const fs = require('fs');

const inputFields = [
    'woOpEqpID',
    'woID',
    'opID',
    'eqpID',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'qty',
    'isOnline',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const inputWorkOrderOperationEquipmentFeederFields = [
    'id',
    'woID',
    'eqpID',
    'woOPID',
    'woOpEqpID',
    'feederLocation',
    'supply',
    'usedon',
    'mfgPNID',
    'partID',
    'feederDescription',
    'placementType',
    'setupComment',
    'recommendedLineItem',
    'isApprovelineItems',
    'qty',
    'col1',
    'col2',
    'col3',
    'col4',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive list of equipment
    // GET : /api/v1/workorder_operation_equipment/retriveEquipmentListbyWoID
    // @param {woID} int
    // @return list of equipment
    retriveEquipmentListbyWoID: (req, res) => {
        const { WorkorderOperationEquipment, Equipment, GenericFiles, sequelize } = req.app.locals.models;
        let equipmentData;
        if (req.params.woID) {
            return sequelize.transaction(() => Equipment.findAll({
                where: {
                    equipmentAs: DATA_CONSTANT.EQUIPMENT_TYPE_VALUE.EQUIPMENT
                },
                attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpModel', 'eqpYear', 'isActive'],
                include: [{
                    model: WorkorderOperationEquipment,
                    as: 'workorderOperationEquipment',
                    where: {
                        woID: req.params.woID
                    },
                    attributes: ['woOpEqpID', 'woID', 'opID', 'eqpID', 'woOPID', 'qty', 'isOnline'],
                    required: false
                }]
            }).then((getEquipmentData) => {
                equipmentData = getEquipmentData;
                let eqpIds = _.map(getEquipmentData, 'eqpID');
                eqpIds = eqpIds ? eqpIds : [];
                return GenericFiles.findAll({
                    where: {
                        refTransID: { [Op.in]: eqpIds },
                        gencFileOwnerType: COMMON.AllEntityIDS.Equipment.Name,
                        isRecycle: false,
                        gencFileName: {
                            [Op.like]: 'profile%'
                        }
                    },
                    raw: true,
                    attributes: ['gencFileName', 'refTransID']
                }).then((profileData) => {
                    if (equipmentData && equipmentData.length > 0
                        && profileData && profileData.length > 0) {
                        _.each(equipmentData, (eqpment) => {
                            _.each(profileData, (profile) => {
                                if (profile.refTransID === eqpment.eqpID) {
                                    eqpment.dataValues.genericFiles = profile;
                                }
                            });
                        });
                    }
                });
            })).then(() => {
                if (!equipmentData) {
                    return resHandler.errorRes(res,
                        200,
                        STATE.EMPTY,
                        new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEquiModuleName)));
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, equipmentData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEquiModuleName)));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of equipment
    // POST : /api/v1/workorder_operation_equipment/retriveEquipmentDetailsbyEqpID
    // @return list of equipment
    retriveEquipmentDetailsbyEqpID: (req, res) => {
        const { WorkorderOperationEquipment, Equipment } = req.app.locals.models;
        if (req.body) {
            return Equipment.findAll({
                attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpModel', 'eqpYear'],
                where: {
                    eqpID: req.body.listObj.eqpID,
                    equipmentAs: DATA_CONSTANT.EQUIPMENT_TYPE_VALUE.EQUIPMENT
                },
                include: [{
                    model: WorkorderOperationEquipment,
                    as: 'workorderOperationEquipment',
                    where: {
                        woID: req.body.listObj.woID
                    },
                    attributes: ['woOpEqpID', 'woID', 'opID', 'eqpID', 'qty', 'isOnline'],
                    required: false
                }]
            }).then((equipment) => {
                var equipmentData = equipment;
                return resHandler.successRes(res, 200, STATE.SUCCESS, equipmentData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPEquiModuleName)));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Add equipment to workOrder
    // POST : /api/v1/workorder_operation_equipment/addEquipmentToWorkOrder
    // @return API response
    addEquipmentToWorkOrder: (req, res) => {
        const { sequelize, WorkorderOperationEquipment, EquipmentDataelement, DataElement,
            WorkorderOperationEquipmentDataelement } = req.app.locals.models;
        if (req.body) {
            let addedWoOpEquipmentIDs = null;
            return sequelize.transaction().then((t) => {
                const promises = [];
                COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj);
                return WorkorderOperationEquipment.bulkCreate(req.body.listObj, {
                    individualHooks: true,
                    transaction: t
                }).then((woOpEquipment) => {
                    if (woOpEquipment.length > 0) {
                        addedWoOpEquipmentIDs = _.map(woOpEquipment, 'woOpEqpID').toString();
                        req.params['pId'] = addedWoOpEquipmentIDs;
                        // EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationEquipmentInElastic);

                        _.each(woOpEquipment, (woEquipment) => {
                            EquipmentDataelement.findAll({
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
                                    promises.push(WorkorderOperationEquipmentDataelement.bulkCreate(
                                        woEquipmentDataElementList, {
                                        individualHooks: true
                                    }, { transaction: t }).then(response => Promise.resolve(response)));
                                }
                            });
                        });
                    }
                    // [S] add log of adding equipment to wo op (here adding op to equipment - popup) for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: null,
                        eventDescription: null,
                        refTransTable: WoOpEquipmentConstObj.refTransTableName,
                        refTransID: addedWoOpEquipmentIDs,
                        eventType: timelineObjForWoOpEquipment.id,
                        url: null,
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    promises.push(TimelineController.createTimeline(req, res, t));
                    // [E] add log of adding equipment to wo op (here adding op to equipment - popup) for timeline users
                    return Promise.all(promises).then(() => t.commit().then(() => {
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationEquipmentInElastic);
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_ADDED_TO_WORKORDER_OPERATION });
                    })).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPEquiModuleName)));
                        }
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotDelete(MESSAGE_CONSTANT.NOT_ADDED(woOPEquiModuleName)));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPEquiModuleName)));
                }
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Delete list of workorder operation equipment
    // POST : /api/v1/deleteWorkorderOperation_EquipmentList
    // @return API response
    deleteWorkorderOperation_EquipmentList: (req, res) => {
        const { sequelize, WorkorderOperationEquipment, WorkorderOperationEquipmentDataelement } = req.app.locals.models;
        if (req.query && req.query.eqpIDs && req.query.opID && req.query.woID) {
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                const promises = [];
                promises.push(WorkorderOperationEquipment.update(req.body, {
                    where: {
                        woID: req.query.woID,
                        opID: req.query.opID,
                        eqpID: req.query.eqpIDs,
                        deletedAt: null
                    },
                    fields: inputFields
                }, { transaction: t }));
                promises.push(WorkorderOperationEquipmentDataelement.update(req.body, {
                    where: {
                        woID: req.query.woID,
                        opID: req.query.opID,
                        eqpID: req.query.eqpIDs,
                        deletedAt: null
                    },
                    fields: inputFields
                }, { transaction: t }));
                Promise.all(promises).then(() => t.commit().then(() => {
                    if (req.query.listObj) {
                        const deleteObj = JSON.parse(req.query.listObj);
                        // [S] add log of removing equipment from wo op for timeline users
                        const objEventEqp = {
                            userID: req.user.id,
                            eventTitle: WoOpEquipmentConstObj.DELETE.title,
                            eventDescription: COMMON.stringFormat(WoOpEquipmentConstObj.DELETE.description, deleteObj.opName, deleteObj.woNumber, req.user.username),
                            refTransTable: WoOpEquipmentConstObj.refTransTableName,
                            refTransID: null,
                            eventType: timelineObjForWoOpEquipment.id,
                            url: COMMON.stringFormat(WoOpEquipmentConstObj.DELETE.url, req.query.woOPID),
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        req.objEvent = objEventEqp;
                        TimelineController.createTimeline(req);
                        // [E] add log of removing equipment from wo op for timeline users
                    }
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_DELETED_FROM_WORKORDER_OPERATION });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_NOT_DELETED_FROM_WORKORDER_OPERATION);
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_ADDED(woOPEquiModuleName)));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update workorder operation equipment qty
    // POST : /api/v1/workorder_operation_equipment/updateWOEquipmentQty
    // @return API response
    updateWOEquipmentQty: (req, res) => {
        const { WorkorderOperationEquipment } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelUpdatedByFieldValue(req.body);
            return WorkorderOperationEquipment.update(req.body, {
                where: {
                    woOpEqpID: req.body.woOpEqpID
                },
                fields: ['qty']
            }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_QUANTITY_UPDATED_FOR_WORKORDER_OPERATION })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(woOPEquiModuleName)),
                    err.errors, err.fields);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update workorder operation equipment qty
    // POST : /api/v1/workorder_operation_equipment/updateAllWOEquipmentQty
    // @return API response
    updateAllWOEquipmentQty: (req, res) => {
        const { WorkorderOperationEquipment } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.listObj);
            _.map(req.body.listObj, (obj) => { obj.createdBy = obj.createdBy ? obj.createdBy : obj.updatedBy; });
            return WorkorderOperationEquipment.bulkCreate(req.body.listObj, {
                updateOnDuplicate: inputFields
            }).then((woOpEquipment) => {
                if (woOpEquipment.length > 0) {
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.EQUIPMENT_QUANTITY_UPDATED_FOR_WORKORDER_OPERATION });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(woOPEquiModuleName)));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(woOPEquiModuleName)),
                    err.errors, err.fields);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // Retrieve list of parts from assembly by assyID
    // POST : /api/v1/workorder_operation_equipment/getAssemblyPartListByAssyID
    // @return list of parts from assembly by assyID
    getAssemblyPartListByAssyID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.obj) {
            return sequelize.query('CALL Sproc_GetAssemblyPartList (:ppartID)',
                {
                    replacements: {
                        ppartID: req.body.obj.partID ? req.body.obj.partID : null
                    }
                }).then((response) => {
                    if (!response) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, null);
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // Save Feeder Details While Import After Validate
    // POST : /api/v1/workorder_operation_equipment/saveImportFeeder
    // @return save feeder details after validated import
    saveImportFeeder: (req, res) => {
        const { WorkorderOperationEquipmentFeederDetails, sequelize, WorkorderOperationFeederLineitemDetails } = req.app.locals.models;
        if (req.body && !req.body.objFeeder) {
            req.body.objFeeder = [];
        }
        const promisefeeder = [];
        return sequelize.transaction().then((t) => {
            _.each(req.body.objFeeder, (item) => {
                // item.createdBy = req.user.id;
                // item.updatedBy = req.user.id;
                COMMON.setModelCreatedObjectFieldValue(req.user, item);
                item.isDeleted = false;
                promisefeeder.push(WorkorderOperationEquipmentFeederDetails.create(item, { fields: inputWorkOrderOperationEquipmentFeederFields, transaction: t }).then((response) => {
                    var promiseLineItemFeeder = [];
                    _.each(item.feederLineItemList, (feeder) => {
                        var objFeeder = {
                            eqpFeederID: response.id,
                            rfqLineItemID: feeder.rfqLineItemsID,
                            lineID: feeder.LineID,
                            createdBy: req.user.id,
                            updatedBy: req.user.id,
                            isDeleted: false
                        };
                        promiseLineItemFeeder.push(WorkorderOperationFeederLineitemDetails.create(objFeeder,
                            {
                                fields: ['eqpFeederID', 'rfqLineItemID', 'lineID', 'createdBy', 'updatedBy', 'isDeleted'],
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            }));
                    });
                    return Promise.all(promiseLineItemFeeder).then((promiseresponse) => {
                        var status = _.find(promiseresponse, statusDet => statusDet === STATE.FAILED);
                        if (status) {
                            return STATE.FAILED;
                        } else {
                            return STATE.SUCCESS;
                        }
                    });
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            });
            return Promise.all(promisefeeder).then((responsespromise) => {
                // this case added if user import file without data
                if (promisefeeder.length === 0) {
                    // if (!t.finished) { t.rollback(); }
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.IMPORT_EXCEL_DATA_VALIDATION);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Feeder');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else {
                    const status = _.find(responsespromise, statusDet => statusDet === STATE.FAILED);
                    if (status) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, null);
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MFG.FEEDER_ADDED_TO_WORKORDER_OPERATION_EQUIPMENT));
                    }
                }
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // Download Feeder File Sample
    // GET : /api/v1/workorder_operation_equipment/downloadEquipmentFeederTemplate
    // @return API response
    downloadEquipmentFeederTemplate: (req, res) => {
        const TemplateName = `${req.params.fileType}.xlsx`;
        var path = GENERICCATEGORY.DOWNLOAD_PATH + TemplateName;

        return fs.readFile(path, (err) => {
            if (err) {
                if (err.code === COMMON.FileErrorMessage.NotFound) {
                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.DOCUMENT_NOT_FOUND, err: null, data: null });
                } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                }
            } else {
                const file = path;
                // var mimetype = mime.lookup(file+ "." + "application/vnd.ms-excel");
                res.setHeader('Content-disposition', `attachment; filename=${TemplateName}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        });
    }
};
