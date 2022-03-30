const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const moduleName = DATA_CONSTANT.RFQ_LINEITEMS_ERRORCODE.DISPLAYNAME;
const inputFields = [
    'id',
    'logicID',
    'errorCode',
    'errorColor',
    'description',
    'systemVariable',
    'displayName',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'narrative',
    'isExternalIssue',
    'isResearchStatus',
    'isAssemblyLevelError',
    'isAllowToEngrApproved',
    'displayOrder',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
module.exports = {

    // Retrive list of ErrorCode
    // POST : /api/v1/rfqlineitemerrorcode/retriveErrorCode
    // @return list of ErrorCode
    retriveErrorCode: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieverfqlineitemsErrorcode (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pCategoryIDs)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pCategoryIDs: req.body.pCategoryIDs ? req.body.pCategoryIDs : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rfq_lineitems_errorcode: _.values(response[1]), Count: response[0][0].TotalRecord }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Save Error code
    // Post : /api/v1/saveErrorCode
    // @param Error code
    // @return API response
    saverfqlineErrorCode: (req, res) => {
        const { RFQLineitemsErrorcode, sequelize } = req.app.locals.models;
        if (req.body) {
            const regex = /(<% .*? %>)/g;
            const matches = req.body.description.match(regex);
            req.body.narrative = COMMON.setTextAngularValueForDB(req.body.narrative);
            if (matches) {
                req.body.systemVariable = matches.join(',');
            }

            return RFQLineitemsErrorcode.count({
                attributes: ['errorColor'],
                where: {
                    errorColor: req.body.errorColor,
                    id: { [Op.ne]: req.body.id }
                }
            }).then((count) => {
                if (count === 0) {
                    return RFQLineitemsErrorcode.findOne({
                        attributes: ['errorCode', 'logicID', 'displayOrder'],
                        where: {
                            [Op.or]: {
                                errorCode: req.body.errorCode,
                                logicID: req.body.logicID,
                                displayOrder: req.body.displayOrder
                            },
                            id: { [Op.ne]: req.body.id || null }
                        }
                    }).then((response) => {
                        if (response) {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                            if (response.errorCode === req.body.errorCode) {
                                messageContent.message = COMMON.stringFormat(messageContent.message, 'Error Code');
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                            } else if (response.logicID === req.body.logicID) {
                                messageContent.message = COMMON.stringFormat(messageContent.message, 'Logic category');
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                            } else if (response.displayOrder === req.body.displayOrder) {
                                messageContent.message = COMMON.stringFormat(messageContent.message, 'Priority');
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                            }
                        }
                        if (req.body.id) {
                            COMMON.setModelUpdatedByFieldValue(req);
                            return RFQLineitemsErrorcode.update(req.body, {
                                where: {
                                    id: req.body.id
                                },
                                fields: inputFields
                            }).then((updateErrorcode) => {
                                var promises = [
                                    module.exports.saveErrorCodeRestrictMapping(req)
                                ];
                                return Promise.all(promises).then((resp) => {
                                    if (resp[0] && resp[0].status === STATE.SUCCESS && req.body.selectedErrorCodeList && req.body.selectedErrorCodeList.length) {
                                        return sequelize.query('CALL Sproc_CopyErrorCode (:pFromErrorCodeID,:pToErrorCodeIDs,:puserID)', {
                                            replacements: {
                                                pFromErrorCodeID: req.body.id,
                                                pToErrorCodeIDs: req.body.selectedErrorCodeList.join(),
                                                puserID: COMMON.getRequestUserID(req)
                                            }
                                        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, updateErrorcode, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    } else {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, updateErrorcode, MESSAGE_CONSTANT.UPDATED(moduleName));
                                    }
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
                        } else {
                            COMMON.setModelCreatedByFieldValue(req);
                            return RFQLineitemsErrorcode.create(req.body, {
                                fields: inputFields
                            }).then(RfqLineitemsErrorCode => resHandler.successRes(res, 200, STATE.SUCCESS, RfqLineitemsErrorCode, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Error Color');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
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

    // Retrive list of ErrorCode
    // GET : /api/v1/rfqlineitemerrorcode/getErrorCode
    // @return list of ErrorCode
    getErrorCode: (req, res) => {
        const { RFQLineitemsErrorcode } = req.app.locals.models;

        RFQLineitemsErrorcode.findAll({
            attributes: ['id', 'logicID', 'errorCode', 'errorColor', 'description', 'org_description', 'systemVariable', 'displayName', 'narrative', 'displayOrder', 'isExternalIssue', 'isResearchStatus', 'isAssemblyLevelError', 'isAllowToEngrApproved'],
            order: [['displayOrder', 'ASC'], ['displayName', 'ASC']]
        }).then((response) => {
            _.map(response, (item) => {
                item.narrative = COMMON.getTextAngularValueFromDB(item.narrative);
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Save Error code Priority
    // Post : /api/v1/saverfqlineErrorCodePriority
    // @param Error code
    // @return API response
    saverfqlineErrorCodePriority: (req, res) => {
        const { RFQLineitemsErrorcode } = req.app.locals.models;
        if (req.body.id) {
            const whereClause = {
                id: { [Op.notIn]: [req.body.id] },
                [Op.or]: [{ displayOrder: { [Op.eq]: req.body.displayOrder } }]
            };

            RFQLineitemsErrorcode.findOne({
                where: whereClause
            }).then((isExists) => {
                if (isExists) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Priority');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return RFQLineitemsErrorcode.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then((rowsUpdated) => {
                        if (rowsUpdated[0] === 1) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(moduleName), err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                        } else {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        }
    },

    // Retrive list of ErrorCode
    // GET : /api/v1/rfqlineitemerrorcode/getErrorCode
    // @return list of ErrorCode
    getErrorCodeByLogicID: (req, res) => {
        if (req.body.logicID) {
            const { RFQLineitemsErrorcode } = req.app.locals.models;
            return RFQLineitemsErrorcode.findOne({
                where: {
                    logicID: req.body.logicID
                },
                attributes: ['errorColor']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Save Error code Mapping
    // @return API response
    saveErrorCodeRestrictMapping: (req) => {
        const { RFQErrorCodeCategoryMapping } = req.app.locals.models;
        if (req.body) {
            const categoryMappingList = req.body.categoryMappingList;
            const categoryMapping = _.partition(categoryMappingList, item => !item.id);
            const newMappingList = categoryMapping[0];
            const modifiedMappingList = categoryMapping[1];
            const deletedCategoryMapping = _.partition(modifiedMappingList, item => item.isDeleted);
            const deletedCategoryMappingList = _.map(deletedCategoryMapping[0], 'id');
            const userID = COMMON.getRequestUserID(req);
            const currDate = COMMON.getCurrentUTC();
            const promises = [];

            // Delete Mapping deatils
            if (deletedCategoryMappingList && deletedCategoryMappingList.length > 0) {
                promises.push(RFQErrorCodeCategoryMapping.update({
                    isDeleted: true,
                    deletedBy: userID,
                    deletedAt: currDate,
                    deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                }, {
                    where: {
                        id: { [Op.in]: deletedCategoryMappingList },
                        isDeleted: false
                    },
                    fields: ['isDeleted', 'deletedBy', 'deletedAt', 'deleteByRoleId']
                }));
            }
            if (newMappingList && newMappingList.length > 0) {
                newMappingList.forEach((item) => {
                    item.createdBy = userID;
                    item.updateBy = userID;
                    item.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                    item.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                });
                promises.push(RFQErrorCodeCategoryMapping.bulkCreate(newMappingList, {
                    fields: ['errorCodeId', 'categoryID', 'createdBy', 'updateBy', 'createByRoleId', 'updateByRoleId']
                }));
            }
            if (promises && promises.length > 0) {
                return Promise.all(promises).then(() => ({
                    status: STATE.SUCCESS,
                    data: null
                })).catch(err => ({
                    status: STATE.FAILED,
                    error: err
                }));
            } else {
                return {
                    status: STATE.SUCCESS,
                    data: null
                };
            }
        } else {
            return {
                status: STATE.SUCCESS,
                data: null
            };
        }
    }
};