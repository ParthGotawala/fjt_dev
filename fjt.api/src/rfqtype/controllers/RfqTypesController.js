const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'name',
    'description',
    'isActive',
    'termsandcondition',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const rfqTypeModuleName = DATA_CONSTANT.RFQ_TYPES.ADDUPDATEDISAPLAYNAME;
const rfqTypeDeleteName = DATA_CONSTANT.RFQ_TYPES.DISPLAYNAME;
module.exports = {
    // Create RFQ Type
    // POST : /api/v1/rfq_type/saveRfqType
    // @return created RFQtype
    createRfqType: (req, res) => {
        const RFQType = req.app.locals.models.RFQType;
        if (req.body) {
            if (req.body.name) {
                req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false);
            }
            const where = {
                [Op.or]: [{ name: req.body.name }]
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            req.body.termsandcondition = COMMON.setTextAngularValueForDB(req.body.termsandcondition);
            return RFQType.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'RFQ Type');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: { unique: true } });
                } else if (req.body.id) {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return RFQType.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(rfqTypeModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return RFQType.create(req.body, {
                        fields: inputFields
                    }).then(rfqType => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rfqType, MESSAGE_CONSTANT.CREATED(rfqTypeModuleName))).catch((err) => {
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
    // Retrive list of Rfq Type
    // GET : /api/v1/rfq_type/retriveRfqTypeList
    // @return list of RFQtype
    retriveRfqTypeList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveRfqTypeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { RfqType: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive detail of Rfq Type
    // GET : /api/v1/rfq_type/retriveRfqType
    // @return detail of RFQtype
    retriveRfqType: (req, res) => {
        if (req.query.id) {
            const RFQType = req.app.locals.models.RFQType;
            return RFQType.findOne({
                where: { id: req.query.id }

            }).then((rfqType) => {
                if (!rfqType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(rfqTypeModuleName), err: null, data: null });
                }
                rfqType.termsandcondition = COMMON.getTextAngularValueFromDB(rfqType.termsandcondition);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rfqType, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove RFQ Type
    // POST : /api/v1/rfq_type/deleteRfqType
    // @return list of RFQtype by ID
    deleteRfqType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.RFQType.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(rfqTypeDeleteName));
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
    // Retrive list of RFQ Type
    // GET : /api/v1/rfq_type/getAllRfqType
    // @return list of RFQ Type
    getRfqTypeList: (req, res) => {
        const { RFQType } = req.app.locals.models;

        return RFQType.findAll({
            attributes: ['id', 'name', 'isActive']
        }).then(rfqTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rfqTypeList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Check Unique rfqtype
    // GET : /api/v1/rfq_type/findSameRFQType
    // @return find Unique validation
    findSameRFQType: (req, res) => {
        const { RFQType } = req.app.locals.models;
        var where = {};
        if (req.body.name) { where.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

        if (req.body.id) { where.id = { [Op.ne]: req.body.id }; }

        return RFQType.findOne({
            where: where,
            attributes: ['id', 'name']
        }).then((rfqType) => {
            if (rfqType) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'RFQ type');
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
