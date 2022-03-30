const _ = require('lodash');

const resHandler = require('../../resHandler');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { STATE, COMMON } = require('../../constant');
const GenericAuthenticationController = require('../../generic_authentication/controllers/GenericAuthenticationController');

const inputFields = [
    'opPartID',
    'opID',
    'partID',
    'isDeleted',
    'createdBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];


module.exports = {
    // get all Parts (SuppliesMaterialsAndTools) For Op Master that not added
    retrievePartsForOpMaster: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.opID) {
            const filter = COMMON.UiGridFilterSearch(req);
            // let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }

            return sequelize
                .query('CALL Sproc_GetSuppliesMaterialsAndToolsNotAddedInOp (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:popID,:pAttributesSearch)',
                    {
                        replacements: {
                            ppageIndex: req.query.page,
                            precordPerPage: filter.limit,
                            pOrderBy: strOrderBy,
                            pWhereClause: null,
                            popID: req.params.opID,
                            pAttributesSearch: req.query.searchTextOfNoAddedPart ? JSON.parse(req.query.searchTextOfNoAddedPart) : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const partMasterList = response[1] && _.values(response[1]).length > 0 ? _.values(response[1]) : [];
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { partMasterList: partMasterList, Count: response[0][0]['COUNT(*)'] }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODEI.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get all Parts (SuppliesMaterialsAndTools) For Op Master that already added
    retrieveOperationPartDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.opID) {
            return sequelize
                .query('CALL Sproc_GetSuppliesMaterialsAndToolsAddedInOp (:popID,:pAttributesSearch)',
                    {
                        replacements: {
                            popID: req.body.opID,
                            pAttributesSearch: req.body.searchText ? req.body.searchText : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const operationPartList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { operationPartList: operationPartList }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    createOperation_PartList: (req, res) => {
        if (req.body && req.body.listObj && req.body.listObj.partList) {
            const { sequelize, OperationPart } = req.app.locals.models;
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.partList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.listObj.partList);

            return sequelize.transaction().then(t => OperationPart.bulkCreate(req.body.listObj.partList, {
                individualHooks: (req.body.listObj.restrictPartAuthenticationDet && req.body.listObj.partList.length === 1) ? true : false,
                transaction: t
            }).then((result) => {
                const promises = [];
                /* added approval authentication details for part restriction access */
                if (result && req.body.listObj.restrictPartAuthenticationDet && req.body.listObj.partList.length === 1) {
                    req.body.authenticationApprovedDet = req.body.listObj.restrictPartAuthenticationDet;
                    req.body.authenticationApprovedDet.refID = _.first(result).opPartID;
                    promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonWithWorkingProcess(req, t));
                }

                return Promise.all(promises).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.PARTS_ADDED_TO_OPERATION))).catch((err) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    deleteOperation_PartList: (req, res) => {
        const { sequelize, OperationPart } = req.app.locals.models;
        if (req.query && req.query.partIDs && req.query.opID) {
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then(t => OperationPart.update(req.body, {
                where: {
                    opID: req.query.opID,
                    partID: req.query.partIDs,
                    deletedAt: null
                },
                fields: inputFields,
                transaction: t
            }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.PARTS_DELETED_FROM_OPERATION))).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};
