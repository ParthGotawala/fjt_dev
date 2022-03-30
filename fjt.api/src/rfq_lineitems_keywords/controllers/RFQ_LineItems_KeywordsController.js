const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'keyword',
    'isActive',
    'displayOrder',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const keywordModuleName = DATA_CONSTANT.KEYWORD.NAME;
module.exports = {
    // Retrive list of Keywords
    // POST : /api/v1/keywords/retriveKeywordList
    // @return list of Keywords
    retriveKeywordList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetKeywords (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { Keyword: _.values(response[1]), Count: response[0][0]['COUNT(*)'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Keywords
    // GET : /api/v1/keywords/retriveKeyword
    // @return list of Keywords
    retriveKeyword: (req, res) => {
        const { RFQLineItemsKeywords } = req.app.locals.models;
        if (req.params.id) {
            return RFQLineItemsKeywords.findOne({
                where: { id: req.params.id }
            }).then((keyword) => {
                if (!keyword) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(keywordModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, keyword, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },

    // Create and Update Keyword
    // POST : /api/v1/keywords/createKeyword
    // @return created Keyword
    createKeyword: (req, res) => {
        const { RFQLineItemsKeywords } = req.app.locals.models;
        if (req.body) {
            if (req.body.keyword) {
                req.body.keyword = req.body.keyword.toUpperCase();
            }
            let where = {
                [Op.or]: [{ keyword: req.body.keyword }]
            };
            if (req.body.id) {
                if (!req.body.displayOrder) {
                    where = {
                        keyword: { [Op.eq]: req.body.keyword },
                        id: { [Op.ne]: req.body.id }
                    };
                }
                if (req.body.displayOrder && req.body.keyword) {
                    where = {
                        [Op.or]: [
                            { keyword: { [Op.eq]: req.body.keyword } },
                            { displayOrder: { [Op.eq]: req.body.displayOrder } }
                        ],
                        id: { [Op.ne]: req.body.id }
                    };
                }
            }
            return RFQLineItemsKeywords.findOne({
                where: where
            }).then((response) => {
                if (response && (req.body.displayOrder || response.keyword === req.body.keyword)) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = (response.keyword === req.body.keyword) ? COMMON.stringFormat(messageContent.message, 'Keyword') : COMMON.stringFormat(messageContent.message, 'Display order');
                    // var msg = (response.keyword == req.body.keyword) ? MESSAGE_CONSTANT.KEYWORD.KEYWORD_UNIQUE : MESSAGE_CONSTANT.KEYWORD.KEYWORD_ORDER_UNIQUE;
                    // return resHandler.errorRes(res, 200, STATE.FAILED, { message: msg, unique: true });
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: { unique: true } });
                } else if (req.body.id) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return RFQLineItemsKeywords.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(keywordModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return RFQLineItemsKeywords.create(req.body, {
                        fields: inputFields
                    }).then(keyword => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, keyword, MESSAGE_CONSTANT.CREATED(keywordModuleName))).catch((err) => {
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

    // Remove Keywords
    // POST : /api/v1/keywords/deleteKeywords
    // @return list of Keywords by ID
    deleteKeywords: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.RFQ_Lineitems_Keywords.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(keywordModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Check Unique Keyword
    // GET : /api/v1/keywords/findSameKeyWord
    // @return find Unique validation
    findSameKeyWord: (req, res) => {
        const { RFQLineItemsKeywords } = req.app.locals.models;
        const where = {};
        if (req.body.keyword) {
            where.keyword = req.body.keyword.toUpperCase();
        }
        if (req.body.id) {
            where.id = { [Op.ne]: req.body.id };
        }
        return RFQLineItemsKeywords.findOne({
            where: where,
            attributes: ['id', 'keyword']
        }).then((keyword) => {
            if (keyword) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'Keyword');
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
