const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { getSystemIdPromise } = require('../../utility/controllers/UtilityController');

const inputFields = [
    'id',
    'systemID',
    'systemGenerated',
    'category',
    'dateCodeFormat',
    'description',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const dcFormatModuleName = DATA_CONSTANT.DC_FORMAT.NAME;

module.exports = {
    // get list of DC Format
    // POST : /api/v1/datecodeformat/retrieveDCFormatList
    // @return list of DC Format
    retrieveDCFormatList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetDCFormatList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pSearchDCFormat,:pSearchDCFormatType)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pSearchDCFormat: req.body.searchDCFormat || null,
                pSearchDCFormatType: req.body.searchDCFormatType || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { DCFormatList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // get detail of DC Format by ID
    // GET : /api/v1/datecodeformat/retriveDCFormatById
    // @return detail of DC Format details
    retriveDCFormatById: (req, res) => {
        if (req.params.id) {
            const { DateCodeFormatMst } = req.app.locals.models;
            return DateCodeFormatMst.findOne({
                where: {
                    id: req.params.id
                }
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
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
    // Manage DC Format Details
    // POST : /api/v1/datecodeformat/saveDCFormatDetails
    // @return dc format details
    saveDCFormatDetails: (req, res) => {
        const { DateCodeFormatMst, sequelize } = req.app.locals.models;
        let messageContent = null;
        if (req.body) {
            if (!req.body.dateCodeFormat) {
                messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.SELECT_VALUE);
                messageContent.message = COMMON.stringFormat(messageContent.message, dcFormatModuleName, dcFormatModuleName);
            } else if (!req.body.systemGenerated) {
                if (!req.body.dateCodeFormat.includes(DATA_CONSTANT.DateCodeFormats.Year)) {
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.INVALID_MFR_DATE_CODE);
                } else if (req.body.dateCodeFormat.includes('YYYYY')) {
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.INVALID_MFR_DATE_CODE);
                } else if (!(req.body.dateCodeFormat.includes(DATA_CONSTANT.DateCodeFormats.Month) || req.body.dateCodeFormat.includes(DATA_CONSTANT.DateCodeFormats.Week))) {
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.INVALID_MFR_DATE_CODE);
                }
            }
            if (messageContent) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
            } else {
                const where = {
                    dateCodeFormat: req.body.dateCodeFormat,
                    isDeleted: false
                };
                if (req.body.id) {
                    where.id = {
                        [Op.ne]: req.body.id
                    };
                }
                return sequelize.transaction().then(t => DateCodeFormatMst.findOne({
                    where: where
                }).then((response) => {
                    if (response) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                        messageContent.message = COMMON.stringFormat(messageContent.message, dcFormatModuleName);
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                    } else if (req.body.id) {
                        // Update
                        COMMON.setModelUpdatedByFieldValue(req);
                        return DateCodeFormatMst.update(req.body, {
                            where: {
                                id: req.body.id
                            },
                            fields: inputFields,
                            transaction: t
                        }).then(() => {
                            t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(dcFormatModuleName)));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        // Create
                        COMMON.setModelCreatedByFieldValue(req);
                        return getSystemIdPromise(req, res, DATA_CONSTANT.DCFORMAT_SYSID, t).then((dcFormat) => {
                            if (dcFormat.status === STATE.SUCCESS) {
                                req.body.systemID = dcFormat.systemId;
                                return DateCodeFormatMst.create(req.body, {
                                    fields: inputFields,
                                    transaction: t
                                }).then(details =>
                                    t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, details, MESSAGE_CONSTANT.CREATED(dcFormatModuleName)))
                                ).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: dcFormat.message,
                                    err: dcFormat.err ? dcFormat.err : null,
                                    data: null
                                });
                            }
                        });
                    }
                }));
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Check DC Format exist or not
    // post:/api/v1/datecodeformat/checkDuplicateDCFormat
    // @retrun validity of dc format
    checkDuplicateDCFormat: (req, res) => {
        const { DateCodeFormatMst } = req.app.locals.models;
        if (req.body) {
            const where = {
                name: req.body.name,
                isDeleted: false
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return DateCodeFormatMst.findOne({
                where: where,
                attributes: ['id']
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicate: false }, null);
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
    // Remove DC Format Details
    // POST : /api/v1/datecodeformat/deleteDCFormat
    // @return list of DC Format by ID
    deleteDCFormat: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.DC_FORMAT.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response && response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(dcFormatModuleName));
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
    // Retreive list of DC Format
    // GET : /api/v1/datecodeformat/retriveDateCodeFormatList
    // @return list of DC Format
    retriveDateCodeFormatList: (req, res) => {
        const { DateCodeFormatMst, sequelize } = req.app.locals.models;
        return DateCodeFormatMst.findAll({
            attributes: [[sequelize.fn('CONCAT', sequelize.col('dateCodeFormat'), ' (', sequelize.literal('CASE WHEN category = "J" THEN "Julian" ELSE "Gregorian" END'), ')'), 'dateCodeFormatValue'], 'id', 'dateCodeFormat', 'category']
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // update component/mfr date code format
    // GET : /api/v1/datecodeformat/setDateCodeFormatData
    // @return API response
    setDateCodeFormatData: (req, res) => {
        const { sequelize, Component, MfgCodeMst } = req.app.locals.models;
        let updateDataObj = {};
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                if (!req.body.mfgCodeFormat) {
                    updateDataObj = {
                        dateCodeFormatID: req.body.dateCodeFormatID,
                        isDateCodeFormat: true
                    };
                    return Component.update(updateDataObj, {
                        where: {
                            id: req.body.partId
                        },
                        fields: ['dateCodeFormatID', 'isDateCodeFormat'],
                        transaction: t
                    }).then(() => {
                        t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(dcFormatModuleName)));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    updateDataObj = {
                        dateCodeFormatID: req.body.dateCodeFormatID
                    };
                    return MfgCodeMst.update(updateDataObj, {
                        where: {
                            id: req.body.mfgCodeId
                        },
                        fields: ['dateCodeFormatID'],
                        transaction: t
                    }).then(() => {
                        t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(dcFormatModuleName)));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
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
    // update component/mfr date code format
    // GET : /api/v1/datecodeformat/getDateCodeFormatData
    // @return API response
    getDateCodeFormatData: (req, res) => {
        const { Component, MfgCodeMst } = req.app.locals.models;
        if (req.body) {
            const where = {
                id: req.body.id,
                isDeleted: false
            };
            return Component.findOne({
                where: where,
                attributes: ['id', 'dateCodeFormatID'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'dateCodeFormatID']
                }]
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};