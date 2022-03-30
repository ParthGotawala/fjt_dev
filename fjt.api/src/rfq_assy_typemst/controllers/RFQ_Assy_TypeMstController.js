const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');


const inputFields = [
    'id',
    'name',
    'isActive',
    'isDeleted',
    'isPCBRequire',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'noOfSide',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const assyTypeModuleName = DATA_CONSTANT.ASSY_TYPES.ADDUPDATEDISAPLAYNAME;
const assyTypeDeleteModuleName = DATA_CONSTANT.ASSY_TYPES.DISPLAYNAME;
module.exports = {
    // Create assy Type
    // POST : /api/v1/assyType/createassyType
    // @return created or updated assy type
    createassyType: (req, res) => {
        const { RFQAssyTypeMst } = req.app.locals.models;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            const where = {};
            where.name = { [Op.eq]: req.body.name };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return RFQAssyTypeMst.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const fieldName = DATA_CONSTANT.ASSY_TYPES.UNIQUE_FIELD_NAME;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: { unique: true } });
                } else if (req.body.id) {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return RFQAssyTypeMst.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(assyTypeModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return RFQAssyTypeMst.create(req.body, {
                        fields: inputFields
                    }).then(assyType => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assyType, MESSAGE_CONSTANT.CREATED(assyTypeModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Assy Type
    // POST : /api/v1/assyType/retriveAssyTypeList
    // @return list of assytype
    retriveAssyTypeList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveAssyTypeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { AssyType: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Assy Type
    // GET : /api/v1/assyType/retriveAssyType
    // @return list of assytype
    retriveAssyType: (req, res) => {
        const { RFQAssyTypeMst } = req.app.locals.models;
        if (req.query.id) {
            RFQAssyTypeMst.findOne({
                where: { id: req.query.id }

            }).then((assyType) => {
                if (!assyType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assyType, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Remove Assy Type
    // POST : /api/v1/assyType/deleteAssyType
    // @return list of assyType by ID
    deleteAssyType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.RFQAssyTypeMst.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(assyTypeDeleteModuleName));
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
    // Retrive list of Assy Type
    // GET : /api/v1/assyType/getAssyTypeList
    // @return list of Assy Type
    getAssyTypeList: (req, res) => {
        const { RFQAssyTypeMst, sequelize } = req.app.locals.models;

        return RFQAssyTypeMst.findAll({
            where: {
                isDeleted: false
            },
            paranoid: false,
            attributes: ['id', 'name', 'isActive', 'noOfSide'],
            order: [sequelize.fn('ISNULL', sequelize.col('RFQAssyTypeMst.displayOrder')), ['displayOrder', 'ASC'], ['name', 'ASC']]
        }).then(assyTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assyTypeList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Check Unique Assytype
    // GET : /api/v1/rfqsetting/findSameAssyType
    // @return find Unique validation
    findSameAssyType: (req, res) => {
        const { RFQAssyTypeMst } = req.app.locals.models;
        var where = {};
        if (req.body.name) { where.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

        if (req.body.id) { where.id = { [Op.ne]: req.body.id }; }

        return RFQAssyTypeMst.findOne({
            where: where,
            attributes: ['id', 'name', 'noOfSide']
        }).then((assyType) => {
            if (assyType) {
                // var msg = MESSAGE_CONSTANT.ASSY_TYPES.ASSY_TYPES_UNIQUE;
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.ASSY_TYPES.UNIQUE_FIELD_NAME), err: null, data: null });
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // update Display Order
    // POST:/api/v1/assyType/updateAssyTypeDisplayOrder
    updateAssyTypeDisplayOrder: (req, res) => {
        const { RFQAssyTypeMst } = req.app.locals.models;
        if (req.body) {
            return RFQAssyTypeMst.findOne({
                where: {
                    id: {
                        [Op.ne]: req.body.id
                    },
                    displayOrder: req.body.displayOrder,
                    isDeleted: false
                }
            }).then((isexist) => {
                if (isexist && req.body.displayOrder) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Display Order');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    const updateobj = {
                        displayOrder: req.body.displayOrder,
                        updatedBy: req.body.updatedBy,
                        updateByRoleId: req.body.updateByRoleId
                    };
                    return RFQAssyTypeMst.update(updateobj, {
                        where: {
                            id: req.body.id,
                            isDeleted: false
                        }
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(assyTypeModuleName))).catch((err) => {
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
    }
};
