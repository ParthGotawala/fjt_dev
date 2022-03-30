const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'reasonCategory',
    'reason',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'reason_type',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const reasonModuleName = DATA_CONSTANT.REASONS.DISPLAYNAME;
const rfqReasonModuleName = DATA_CONSTANT.REASONS.DISPLAY_RFQ_REASON_NAME;
const reasonDeleteModuleName = DATA_CONSTANT.REASONS.DELETEDISPLAYNAME;
const rfqReasonDeleteModuleName = DATA_CONSTANT.REASONS.DELETEDISPLAY_RFQ_REASON_NAME;
const invoiceapprovalModuleName = DATA_CONSTANT.REASONS.INVOICEAPPROVENAME;
module.exports = {
    // Create Reason
    // POST : /api/v1/reason/saveReason
    // @return created reason
    createReason: (req, res) => {
        const { ReasonMst } = req.app.locals.models;
        if (req.body) {
            const where = {
                reasonCategory: req.body.reasonCategory,
                reason_type: req.body.reason_type
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            req.body.reason = COMMON.setTextAngularValueForDB(req.body.reason);
            return ReasonMst.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Reason category');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: { unique: true } });
                } else if (req.body.id) {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return ReasonMst.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(parseInt(req.body.reason_type) === 1 ? rfqReasonModuleName : parseInt(req.body.reason_type) === 2 ? reasonModuleName : invoiceapprovalModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return ReasonMst.create(req.body, {
                        fields: inputFields
                    }).then(reason => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reason, MESSAGE_CONSTANT.CREATED(parseInt(req.body.reason_type) === 1 ? rfqReasonModuleName : parseInt(req.body.reason_type) === 2 ? reasonModuleName : invoiceapprovalModuleName))).catch((err) => {
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
    // Retrive list of Reason
    // POST : /api/v1/reason/retriveReasonList
    // @return list of reason
    retriveReasonList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveReasonList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { Reason: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Reason
    // GET : /api/v1/reason/retriveReason
    // @return list of reason
    retriveReason: (req, res) => {
        const { ReasonMst } = req.app.locals.models;
        if (req.params.id) {
            return ReasonMst.findOne({
                where: { id: req.params.id }
            }).then((reason) => {
                if (!reason) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(req.query.reason_type === '1' ? rfqReasonModuleName : reasonModuleName), err: null, data: null });
                }
                reason.reason = COMMON.getTextAngularValueFromDB(reason.reason);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reason, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Remove Reason
    // POST : /api/v1/reason/deleteReason
    // @return list of reason by ID
    deleteReason: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.Reason.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(parseInt(req.body.objIDs.reason_type) === 1 ? rfqReasonDeleteModuleName : parseInt(req.body.objIDs.reason_type) === 2 ? reasonDeleteModuleName : invoiceapprovalModuleName));
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
    // Retrive list of Reason
    // GET : /api/v1/reason/getAllReason
    // @return list of Reason
    getReasonList: (req, res) => {
        const { ReasonMst } = req.app.locals.models;

        return ReasonMst.findAll({
            where: {
                reason_type: req.body.reason_type
            },
            attributes: ['id', 'reasonCategory', 'reason', 'isActive']
        }).then(reasonList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reasonList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Reason By Reason Type
    // GET : /api/v1/reason/getActiveReasonListByReasonType
    // @return list of Reason
    getActiveReasonListByReasonType: (req, res) => {
        const { ReasonMst } = req.app.locals.models;

        return ReasonMst.findAll({
            where: {
                isActive: true,
                reason_type: req.body.reason_type
            },
            attributes: ['id', 'reason']
        }).then(reasonList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reasonList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Check reason category exist or not
    // post:/api/v1/checkDuplicateResonCategory
    // @retrun validity of reason category
    checkDuplicateResonCategory: (req, res) => {
        const { ReasonMst } = req.app.locals.models;
        if (req.body) {
            const whereClauseReason = {
                reasonCategory: req.body.reasonCategory,
                reason_type: req.body.reason_type
            };
            if (req.body.id) {
                whereClauseReason.id = { [Op.notIn]: [req.body.id] };
            }
            return ReasonMst.findOne({
                where: whereClauseReason,
                attributes: ['id']
            }).then((Reason) => {
                if (Reason) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { isDuplicateReason: true }, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateReason: false }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
