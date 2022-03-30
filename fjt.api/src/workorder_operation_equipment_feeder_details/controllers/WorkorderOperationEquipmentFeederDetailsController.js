/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');

const currentModuleName = DATA_CONSTANT.WORKORDER_EQUIPMENT_FEEDER_DETAILS.DISPLAYNAME;

const inputFields = [
    'id',
    'woID',
    'eqpID',
    'woOPID',
    'woOpEqpID',
    'mfgPNID',
    'partID',
    'feederLocation',
    'feederDescription',
    'qty',
    'col1',
    'col2',
    'col3',
    'col4',
    'supply',
    'usedon',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'isApprovelineItems',
    'recommendedLineItem',
    'systemrecommended',
    'lineItemSelectReason',
    'placementType',
    'setupComment',
    'isActive',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {

    // Retrive list of workorder operation equipment feeder
    // GET : /api/v1/feeder
    // @return list of feeder
    retriveFeeder: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        let strOrderBy = null;
        if (filter.order[0]) {
            strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }

        sequelize
            .query('CALL Sproc_RetrieveWorkorderOperationEquipmentFeederDetails (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pWoOpEqpID)',
                {
                    replacements: {
                        ppageIndex: req.query.page,
                        precordPerPage: filter.limit,
                        pOrderBy: strOrderBy,
                        pWhereClause: strWhere,
                        pWoOpEqpID: req.query.woOpEqpID ? req.query.woOpEqpID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { feeder: _.values(response[1]), Count: response[0][0]['TotalRecord'], lineItems: response[2] ? _.values(response[2]) : null }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Update feeder
    // PUT : /api/v1/feeder
    // @return API response
    updateFeeder: (req, res) => {
        const { WorkorderOperationEquipmentFeederDetails, WorkorderOperationFeederLineitemDetails, sequelize } = req.app.locals.models;
        if (req.params.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction().then(t => WorkorderOperationEquipmentFeederDetails.update(req.body, {
                where: {
                    id: req.params.id
                },
                fields: inputFields,
                transaction: t
            }).then((response) => {
                var feederPromise = [];
                if (!req.body.feederList || req.body.feederList.length === 0) {
                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(currentModuleName)));
                } else {
                    return WorkorderOperationFeederLineitemDetails.findAll({
                        where: { eqpFeederID: req.params.id, isDeleted: false },
                        attributes: ['rfqLineItemID', 'lineID', 'eqpFeederID'],
                        transaction: t
                    }).then((feederList) => {
                        const updatefeeder = [];
                        _.each(feederList, (feed) => {
                            var objfeeder = {
                                rfqLineItemID: feed.rfqLineItemID,
                                lineID: feed.lineID,
                                eqpFeederID: parseInt(req.params.id)
                            };
                            updatefeeder.push(objfeeder);
                        });
                        const updatedfeeder = _.intersectionWith(updatefeeder, req.body.feederList, _.isEqual);
                        const removefeeder = _.differenceWith(updatefeeder, req.body.feederList, _.isEqual);
                        const createfeeder = _.differenceWith(req.body.feederList, updatedfeeder, _.isEqual);

                        _.each(removefeeder, (remove) => {
                            COMMON.setModelDeletedByObjectFieldValue(req.user, remove);
                            // remove.deletedBy = req.user.id;
                            // remove.deletedByRoleId = req.user.defaultLoginRoleID;
                            // remove.deletedAt = COMMON.getCurrentUTC();
                            // remove.isDeleted = true;
                            feederPromise.push(WorkorderOperationFeederLineitemDetails.update(remove, {
                                where: {
                                    rfqLineItemID: remove.rfqLineItemID,
                                    lineID: remove.lineID,
                                    eqpFeederID: req.params.id
                                },
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                t.rollback();
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            })
                            );
                        });
                        _.each(createfeeder, (feeder) => {
                            COMMON.setModelCreatedObjectFieldValue(req.user, feeder);
                            // feeder.createdBy = req.user.id;
                            // feeder.updatedBy = req.user.id;
                            feederPromise.push(WorkorderOperationFeederLineitemDetails.create(feeder, {
                                fields: ['rfqLineItemID', 'lineID', 'eqpFeederID', 'createdBy', 'updatedBy'],
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                t.rollback();
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            }));
                        });
                        return Promise.all(feederPromise).then((resp) => {
                            if (_.find(resp, sts => sts === STATE.FAILED)) {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            } else {
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(currentModuleName)));
                            }
                        });
                    });
                }
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Create feeder
    // POST : /api/v1/feeder
    // @return new created feeder
    createFeeder: (req, res) => {
        const { WorkorderOperationEquipmentFeederDetails, WorkorderOperationFeederLineitemDetails, sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then(t => WorkorderOperationEquipmentFeederDetails.create(req.body, {
                fields: inputFields,
                transaction: t
            }).then((feederdet) => {
                var feederPromise = [];
                _.each(req.body.feederList, (feeder) => {
                    COMMON.setModelCreatedObjectFieldValue(req.user, feeder);
                    feeder.eqpFeederID = feederdet.id;
                    feederPromise.push(WorkorderOperationFeederLineitemDetails.create(feeder, {
                        fields: ['rfqLineItemID', 'lineID', 'eqpFeederID', 'createdBy', 'updatedBy'],
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
                return Promise.all(feederPromise).then((resp) => {
                    if (_.find(resp, sts => sts === STATE.FAILED)) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, feederdet, MESSAGE_CONSTANT.CREATED(currentModuleName)));
                    }
                });
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            })
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Remove feeder
    // POST : /api/v1/feeder/deleteFeederDetails
    // @return list of feeder by ID
    deleteFeederDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: COMMON.AllEntityIDS.WORKORDER_OPERATION_EQUIPMENT_FEEDER_DETAILS.Name,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: COMMON.getRequestUserID(req),
                        entityID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((response) => {
                    if (response.length === 0) {
                        const objMessage = req.body.objIDs.isImportAndDelete ? null : MESSAGE_CONSTANT.DELETED(currentModuleName);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, objMessage);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.id }, null);
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

    // Update feeder
    // PUT : /api/v1/feeder
    // @return API response
    updateFeederMergedDetails: (req, res) => {
        const { WorkorderOperationEquipmentFeederDetails, WorkorderOperationFeederLineitemDetails, sequelize } = req.app.locals.models;
        if (req.body) {
            const feederloc = req.body.objLineitem;
            // feederloc.updatedBy = req.user.id;
            COMMON.setModelCreatedObjectFieldValue(req.user, feederloc);
            return sequelize.transaction().then(t => WorkorderOperationEquipmentFeederDetails.update(feederloc, {
                where: {
                    id: feederloc.id
                },
                fields: ['recommendedLineItem', 'isApprovelineItems', 'updatedBy', 'systemrecommended', 'lineItemSelectReason', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                transaction: t
            }).then(() => {
                var feederPromise = [];
                _.each(feederloc.feederlineItems, (flineitems) => {
                    COMMON.setModelDeletedByObjectFieldValue(req.user, flineitems);
                    flineitems.isDeleted = true;
                    feederPromise.push(
                        WorkorderOperationFeederLineitemDetails.update(flineitems, {
                            where: {
                                id: flineitems.id
                            },
                            fields: ['isDeleted', 'deletedAt', 'deletedBy', 'deleteByRoleId'],
                            transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        })
                    );
                });
                return Promise.all(feederPromise).then((resp) => {
                    if (_.find(resp, sts => sts === STATE.FAILED)) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(currentModuleName)));
                    }
                });
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // check duplicate feeder
    // post /api/v1/feeder/checkDuplicateFeeder
    // @return API response
    checkDuplicateFeeder: (req, res) => {
        const { WorkorderOperationEquipmentFeederDetails } = req.app.locals.models;
        if (req.body) {
            const objFeeder = req.body.objFeeder;
            return WorkorderOperationEquipmentFeederDetails.findOne({
                where: {
                    feederLocation: objFeeder.feederLocation,
                    isDeleted: false,
                    woOpEqpID: objFeeder.woOpEqpID
                },
                model: WorkorderOperationEquipmentFeederDetails,
                attributes: ['id', 'feederLocation']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};