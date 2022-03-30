const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter, NotUpdate } = require('../../errors');

const timelineObjForWoOpParts = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_PART;
const WoOpPartsConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_PART;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const GenericAuthenticationController = require('../../generic_authentication/controllers/GenericAuthenticationController');

const woOPPartModuleName = DATA_CONSTANT.WORKORDER_OPERATION_PART.NAME;

const inputFields = [
    'woOPPartID',
    'woID',
    'opID',
    'partID',
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
    // Retrive list of component by woID
    // GET : /api/v1/workorder_operation_part/retrivePartListbyWoID
    // @param {woID} int , {searchText} varchar
    // @return list of component
    retrivePartListbyWoID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        let partData;
        if (req.body.woID && req.body.woAssyID) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetSuppliesMaterialsAndToolsAddedInWO (:pwoID, :pAttributesSearch,:pwoAssyID);',
                        {
                            replacements: {
                                pwoID: req.body.woID ? req.body.woID : null,
                                pAttributesSearch: req.body.searchText ? req.body.searchText : null,
                                pwoAssyID: req.body.woAssyID
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            return Promise.all(promises).then((response) => {
                if (!response.length > 0) {
                    return resHandler.errorRes(res,
                        200,
                        STATE.EMPTY,
                        new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPPartModuleName)));
                }
                partData = _.values(response[0][0]);
                if (response[0][1] && _.values(response[0][1]).length > 0) {
                    const opPartData = _.values(response[0][1]);

                    const existsPart = _.map(partData, 'id');
                    // remove not exists part from workorder_operation_part list as search is from main part list
                    _.remove(opPartData, obj => !existsPart.includes(obj.partID));

                    _.each(partData, (partItem) => {
                        partItem.workorderOperationPart = [];
                        _.each(opPartData, (opPartItem) => {
                            if (opPartItem.partID === partItem.id) {
                                partItem.workorderOperationPart.push(opPartItem);
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
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Retrive list of component by woID
    // POST : /api/v1/workorder_operation_part/retrivePartDetailsbyPartID
    // @return list of component
    retrivePartDetailsbyPartID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetWoOPComponentSuppliesMaterialsAndTools (:ppartID, :pwoID, :pwoOPID);',
                        {
                            replacements: {
                                ppartID: req.body.listObj.partID ? req.body.listObj.partID : null,
                                pwoID: req.body.listObj.woID ? req.body.listObj.woID : null,
                                pwoOPID: null
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            // promises.push(
            //     WorkorderOperationPart.findAll({
            //         attributes: ['woOPPartID', 'woID', 'opID', 'partID','woOPID'],
            //         where: {
            //             woID: req.body.listObj.woID
            //         },
            //     })
            // );
            Promise.all(promises).then((response) => {
                if (!response.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(woOPPartModuleName), err: null, data: null });
                }
                const partData = _.values(response[0][0]);
                if (response[0][1] && _.values(response[0][1]).length > 0) {
                    const opPartData = _.values(response[0][1]);
                    _.each(partData, (partItem) => {
                        partItem.workorderOperationPart = [];
                        _.each(opPartData, (opPartItem) => {
                            if (opPartItem.partID === partItem.id) {
                                partItem.workorderOperationPart.push(opPartItem);
                            }
                        });
                    });
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, partData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Add workorder operation component
    // POST : /api/v1/workorder_operation_part/addPartToWorkOrder
    // @param {woID} int
    // @return API response
    addPartToWorkOrder: (req, res) => {
        if (req.body && req.body.listObj && req.body.listObj) {
            const { sequelize, WorkorderOperationPart } = req.app.locals.models;

            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.listObj);

            sequelize.transaction().then((t) => {
                WorkorderOperationPart.bulkCreate(req.body.listObj, {
                    individualHooks: true,
                    transaction: t
                }).then((woOpPartList) => {
                    const promises = [];
                    req.params['pId'] = _.map(woOpPartList, 'woOPPartID').toString();
                    /* added approval authentication details for part restriction access */
                    if (woOpPartList && req.body.restrictPartAuthenticationList && req.body.restrictPartAuthenticationList.length > 0) {
                        req.body.authenticationApprovedList = req.body.restrictPartAuthenticationList;
                        _.each(req.body.authenticationApprovedList, (authItem) => {
                            const woOpPartItemDet = _.find(woOpPartList, addedWoOpPartItem => authItem.woOPID === addedWoOpPartItem.woOPID);
                            if (woOpPartItemDet) {
                                authItem.refID = woOpPartItemDet.woOPPartID;
                            }
                        });

                        promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonListWithWorkingProcess(req, t));
                    }

                    // [S] add log of adding component to wo op (here adding op to part popup) for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: null,
                        eventDescription: null,
                        refTransTable: WoOpPartsConstObj.refTransTableName,
                        refTransID: _.map(woOpPartList, 'woOPPartID').toString(),
                        eventType: timelineObjForWoOpParts.id,
                        url: null,
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    promises.push(TimelineController.createTimeline(req, res, t));
                    // [E] add log of adding component to wo op (here adding op to part popup) for timeline users
                    return Promise.all(promises).then(() => t.commit().then(() => {
                        req.params['pId'] = _.map(woOpPartList, 'woOPPartID').toString();
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWOOperationPartInElastic);
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_PART.PART_ADDED_TO_WORKORDER_OPERATION });
                    })).catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_PART.PART_NOT_ADDED_TO_WORKORDER_OPERATION));
                        }
                    });
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_PART.PART_NOT_ADDED_TO_WORKORDER_OPERATION));
                    }
                });
            });
        } else {
            resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Delete list of component from workorder operation
    // GET : /api/v1/deleteWorkorderOperation_PartList
    // @param {woID} int
    // @return API response
    deleteWorkorderOperation_PartList: (req, res) => {
        const { WorkorderOperationPart } = req.app.locals.models;
        if (req.query && req.query.partIDs && req.query.opID && req.query.woID) {
            COMMON.setModelDeletedByFieldValue(req);
            WorkorderOperationPart.update(req.body, {
                where: {
                    woID: req.query.woID,
                    opID: req.query.opID,
                    partID: req.query.partIDs,
                    deletedAt: null
                },
                fields: inputFields
            }).then(() => {
                // [S] add log of removing component from wo op for timeline users
                const deleteObj = JSON.parse(req.query.listObj);
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: WoOpPartsConstObj.DELETE.title,
                    eventDescription: COMMON.stringFormat(WoOpPartsConstObj.DELETE.description, deleteObj.opName, deleteObj.woNumber, req.user.username),
                    refTransTable: WoOpPartsConstObj.refTransTableName,
                    refTransID: null,
                    eventType: timelineObjForWoOpParts.id,
                    url: COMMON.stringFormat(WoOpPartsConstObj.DELETE.url, req.query.woOPID),
                    eventAction: timelineEventActionConstObj.DELETE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req);
                // [E] add log of removing component from wo op for timeline users

                resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_PART.PART_DELETED_FROM_WORKORDER_OPERATION });
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_PART.PART_NOT_DELETED_FROM_WORKORDER_OPERATION));
            });
        } else {
            resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // save workorder operation part S.M.T.(supply,material,tools) QPA UOM details
    // POST : /api/v1/workorder_operation_part/saveSMTQPADetails
    // @param list  of part QPA UOM
    // @return API response
    saveSMTQPADetails: (req, res) => {
        const { WorkorderOperationPart } = req.app.locals.models;
        if (req.body && req.body.updateSMTQPAList && req.body.updateSMTQPAList.length > 0) {
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.updateSMTQPAList);

            const promises = [];
            _.each(req.body.updateSMTQPAList, (item) => {
                promises.push(WorkorderOperationPart.update(item, {
                    where: {
                        woOPPartID: item.woOPPartID
                    },
                    fields: ['qpa', 'actualQpa', 'uomID', 'updatedBy', 'updatedAt']
                })
                );
            });

            return Promise.all(promises).then(() => {
                // [S] add log of adding SMT component QPA details for timeline users
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: WoOpPartsConstObj.SAVE_QPA_DETAILS.title,
                    eventDescription: COMMON.stringFormat(WoOpPartsConstObj.SAVE_QPA_DETAILS.description, req.body.opName, req.body.woNumber, req.user.username),
                    refTransTable: WoOpPartsConstObj.refTransTableName,
                    refTransID: _.map(req.body.updateSMTQPAList, 'woOPPartID').toString(),
                    eventType: timelineObjForWoOpParts.id,
                    url: COMMON.stringFormat(WoOpPartsConstObj.SAVE_QPA_DETAILS.url, req.body.woOPID),
                    eventAction: timelineEventActionConstObj.UPDATE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req);
                // [E] add log of adding SMT component QPA details for timeline users

                return resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(woOPPartModuleName));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woOPPartModuleName)));
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Retrive list of component that not added in woID
    // GET : /api/v1/workorder_operation_part/getNotAddedSMTPartListInWO
    // @param {woID} int , {searchText} varchar , {partID} int
    // @return list of component
    getNotAddedSMTPartListInWO: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.woID && req.body.woAssyID) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetSuppliesMaterialsAndToolsNotAddedInWO (:pwoID, :pAttributesSearch,:pwoAssyID);',
                        {
                            replacements: {
                                pwoID: req.body.woID ? req.body.woID : null,
                                pAttributesSearch: req.body.searchText ? req.body.searchText : null,
                                pwoAssyID: req.body.woAssyID
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            return Promise.all(promises).then((response) => {
                if (!response.length > 0) {
                    return resHandler.errorRes(res,
                        200,
                        STATE.EMPTY,
                        new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPPartModuleName)));
                }
                const partData = _.values(response[0][0]);
                return resHandler.successRes(res, 200, STATE.SUCCESS, partData);
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
    }
};
