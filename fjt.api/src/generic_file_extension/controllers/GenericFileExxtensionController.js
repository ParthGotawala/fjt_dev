/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { Op } = require('sequelize');
const _ = require('lodash');
/* errors file*/

const genericFileExtensionInputFields = [
    'id',
    'fileExtension',
    'type',
    'systemGenerated',
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
const genericFileExtensionModuleName = DATA_CONSTANT.CONFIGURE_RESTRICTED_FILE_TYPE.NAME;

module.exports = {

    // Retrive list of restrict file types
    // GET : /api/v1/retriveConfigureFileType
    // @return restrict file types
    retriveConfigureFileType: (req, res) => {
        const { GenericFileExtension } = req.app.locals.models;
        const where = {
            isDeleted: false
        };
        return GenericFileExtension.findAll({
            attributes: ['id', 'fileExtension'],
            order: [['fileExtension', 'ASC']],
            where: where,
            paranoid: false
        }).then(response => {
            if(!response){
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND('Extension'),
                    err: null,
                    data: null
                });
            }
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Fetch single file extension by its id
    // GET : /api/v1/retriveConfigureFileTypeById
    // @return restrict file type
    retriveConfigureFileTypeById: (req, res) => {
        const { GenericFileExtension } = req.app.locals.models;
        return GenericFileExtension.findByPk(req.query.id).then(response => {
            if(!response){
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND('Extension'),
                    err: null,
                    data: null
                });
            }
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrive all file extensions data for display on ui-grid
    // POST : /api/v1/retriveConfigureFileTypeForUIGrid
    // @return restrict file types
    retriveConfigureFileTypeForUIGrid: (req, res) => {
        const { sequelize, GenericFileExtension } = req.app.locals.models;
        let filter;
        let strWhere =  '';
        filter = COMMON.UiGridFilterSearch(req);
        strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        return sequelize.query('CALL Sproc_RetrieveGenericFileExtension (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => 
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            genericfileextension: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Remove File Extension
    // POST : /api/v1/deleteConfigureFileType
    // @return list of File Extension by ID
    deleteConfigureFileType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.GENERIC_FILE_EXTENSION.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response && response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(genericFileExtensionModuleName));
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
    // Create File Extension
    // POST : /api/v1/saveConfigureFileType
    // @return created file extension
    saveConfigureFileType: (req, res) => {
        const { GenericFileExtension } = req.app.locals.models;
        if (req.body) {
            const where = {
                fileExtension: req.body.fileExtension,
                isDeleted: false
            };
            if (req.body.id) {
                where.id = {
                    [Op.ne]: req.body.id
                };
            }
            return GenericFileExtension.findOne({
                where: where
            }).then((fileTypeRes) => {
                if (fileTypeRes) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Extension');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                } else if (req.body.id) {
                    // Update
                    COMMON.setModelUpdatedByFieldValue(req);

                    return GenericFileExtension.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: genericFileExtensionInputFields
                    }).then(() =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(genericFileExtensionModuleName))
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    // Create
                    COMMON.setModelCreatedByFieldValue(req);
                    return GenericFileExtension.create(req.body, {
                        fields: genericFileExtensionInputFields
                    }).then(response =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(genericFileExtensionModuleName))
                    ).catch((err) => {
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
    // Check Extension exist or not
    // post:/api/v1/checkDuplicateExtension
    // @retrun validity of extension
    checkDuplicateExtension: (req, res) => {
        const { GenericFileExtension } = req.app.locals.models;
        if (req.body) {
            const where = {
                fileExtension: req.body.fileExtension,
                isDeleted: false
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }

            return GenericFileExtension.findOne({
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
    }
};