const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'fieldName',
    'dataType',
    'costingType',
    'displayPercentage',
    'displayMargin',
    'displayOrder',
    'createdBy',
    'toolingQty',
    'toolingPrice',
    'updatedBy',
    'deletedBy',
    'isDaysRequire',
    'deletedAt',
    'isDeleted',
    'defaultMarginValue',
    'marginApplicableType',
    'defaultuomValue',
    'selectionType',
    'affectType',
    'defaultuomType',
    'isActive',
    'applyToAll',
    'isCommission',
    'isIncludeInOtherAttribute',
    'refAttributeID',
    'quoteAttributeType',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const quoteDynamicFieldsModuleName = DATA_CONSTANT.Quote_Dynamic_Fields.DISPLAYNAME;

module.exports = {
    // Create Quote Dynamic Fields
    // POST : /api/v1/rfqsetting/createQuoteDynamicFields
    // @return created QuoteDynamicFields
    createQuoteDynamicFields: (req, res) => {
        const { QuoteDynamicFields, sequelize } = req.app.locals.models;
        if (req.body) {
            let where = {};
            if (req.body.fieldName) { req.body.fieldName = COMMON.TEXT_WORD_CAPITAL(req.body.fieldName, false); }
            if (!req.body.id) {
                where = {
                    [Op.or]: [{ fieldName: { [Op.eq]: req.body.fieldName } }],
                    quoteAttributeType: { [Op.eq]: req.body.quoteAttributeType }
                };
            }
            if (req.body.id) {
                if (!req.body.displayOrder) {
                    where = {
                        fieldName: { [Op.eq]: req.body.fieldName },
                        id: { [Op.ne]: req.body.id },
                        quoteAttributeType: { [Op.eq]: req.body.quoteAttributeType }
                    };
                }
                if (req.body.displayOrder && req.body.fieldName) {
                    where = {
                        [Op.or]: [
                            { fieldName: { [Op.eq]: req.body.fieldName } },
                            { displayOrder: { [Op.eq]: req.body.displayOrder } }
                        ],
                        id: { [Op.ne]: req.body.id },
                        quoteAttributeType: { [Op.eq]: req.body.quoteAttributeType }
                    };
                }
            }
            return QuoteDynamicFields.findOne({
                where: where
            }).then((response) => {
                if (response && (req.body.displayOrder || response.fieldName.toUpperCase() === req.body.fieldName.toUpperCase())) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = (response.fieldName.toUpperCase() === req.body.fieldName.toUpperCase()) ? COMMON.stringFormat(messageContent.message, 'Quote attribute name') : COMMON.stringFormat(messageContent.message, 'Display order');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else if (req.body.id) {
                    return sequelize.query('CALL Sproc_validateParentAttribute (:pAttributeID,:pRefAttributeID)', {
                        replacements: {
                            pAttributeID: req.body.id,
                            pRefAttributeID: req.body.refAttributeID || null
                        }
                    }).then((responses) => {
                        if (responses[0].itemCount > 0) {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_PARENT_ATTRIBUTE);
                            messageContent.message = COMMON.stringFormat(messageContent.message, req.body.refAttributeName);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                        } else {
                            COMMON.setModelUpdatedByFieldValue(req);
                            req.body.defaultMarginValue = req.body.defaultMarginValue ? req.body.defaultMarginValue : 0;
                            req.body.defaultuomValue = req.body.defaultuomValue ? req.body.defaultuomValue : null;
                            return QuoteDynamicFields.update(req.body, {
                                where: {
                                    id: req.body.id
                                },
                                fields: inputFields
                            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(quoteDynamicFieldsModuleName))).catch((err) => {
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
                    COMMON.setModelCreatedByFieldValue(req);
                    req.body.defaultMarginValue = req.body.defaultMarginValue ? req.body.defaultMarginValue : 0;
                    req.body.defaultuomValue = req.body.defaultuomValue ? req.body.defaultuomValue : null;
                    return QuoteDynamicFields.create(req.body, {
                        fields: inputFields
                    }).then(quoteDynamicFields => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, quoteDynamicFields, MESSAGE_CONSTANT.CREATED(quoteDynamicFieldsModuleName))).catch((err) => {
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Quote Dynamic Fields
    // POST : /api/v1/rfqsetting/retriveQuoteDynamicFieldsList
    // @return list of quoteDynamicFields
    retriveQuoteDynamicFieldsList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveQuoteDynamicFields (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pAttributeType)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pAttributeType: req.body.type
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { QuoteDynamicFields: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Quote Dynamic Fields
    // GET : /api/v1/rfqsetting/retriveQuoteDynamicFields
    // @return list of quoteDynamicFields
    retriveQuoteDynamicFields: (req, res) => {
        const { QuoteDynamicFields, RFQAssyQuotationsAdditionalCost } = req.app.locals.models;
        if (req.params.id) {
            return QuoteDynamicFields.findOne({
                where: { id: req.params.id },
                include: [{
                    model: RFQAssyQuotationsAdditionalCost,
                    as: 'rfqAssyQuotationsAdditionalCost',
                    attributes: ['id'],
                    required: false
                }]
            }).then((quoteDynamicFields) => {
                if (!quoteDynamicFields) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(quoteDynamicFieldsModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, quoteDynamicFields, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Remove QuoteDynamicFields
    // POST : /api/v1/rfqsetting/deleteQuoteDynamicFields
    // @return list of QuoteDynamicFields by ID
    deleteQuoteDynamicFields: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.QuoteDynamicFields.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(quoteDynamicFieldsModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.id }, null);
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

    // check unique for dynamic fields
    // POST : /api/v1/rfqsetting/checkUniqueDynamicField
    // @return unique QuoteDynamicFields
    checkUniqueDynamicField: (req, res) => {
        const { QuoteDynamicFields } = req.app.locals.models;
        if (req.body) {
            const dynamicObj = req.body.dynamicObj;
            let where = {};
            if (dynamicObj.fieldName) { dynamicObj.fieldName = COMMON.TEXT_WORD_CAPITAL(dynamicObj.fieldName, false); }
            if (!dynamicObj.id) {
                where = {
                    fieldName: { [Op.eq]: dynamicObj.fieldName },
                    quoteAttributeType: dynamicObj.quoteAttributeType
                };
            }
            if (dynamicObj.id) {
                where = {
                    fieldName: { [Op.eq]: dynamicObj.fieldName },
                    id: { [Op.ne]: dynamicObj.id }
                };
            }
            return QuoteDynamicFields.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Quote attribute name');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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

    // Retrive list of Quote Dynamic Fields by Costing Type
    // GET : /api/v1/rfqsetting/retriveQuoteDynamicFieldsListByCostingType
    // @return list of quoteDynamicFields
    retriveQuoteDynamicFieldsListByCostingType: (req, res) => {
        const { QuoteDynamicFields } = req.app.locals.models;
        if (req.query.CostingType) {
            return QuoteDynamicFields.findAll({
                where: {
                    costingType: req.query.CostingType,
                    quoteAttributeType: 'R',
                    isActive: true,
                    applyToAll: false
                }
            }).then((quoteDynamicFields) => {
                if (!quoteDynamicFields) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(quoteDynamicFieldsModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, quoteDynamicFields, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of Quote Dynamic Fields by Costing Type
    // GET : /api/v1/quotedynamicfield/retriveRFQQuoteAttributeList
    // @return list of quoteDynamicFields
    retriveRFQQuoteAttributeList: (req, res) => {
        const { QuoteDynamicFields } = req.app.locals.models;
        QuoteDynamicFields.findAll({
            where: {
                quoteAttributeType: 'R'
            }
        }).then((quoteDynamicFields) => {
            if (!quoteDynamicFields) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(quoteDynamicFieldsModuleName), err: null, data: null });
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, quoteDynamicFields, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
