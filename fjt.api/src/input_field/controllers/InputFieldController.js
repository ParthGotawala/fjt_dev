const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFieldsModuleName = DATA_CONSTANT.INPUT_FIELD.NAME;

const inputFields = [
    'inputFieldID',
    'displayName',
    'iconClass',
    'dataType',
    'displayOrder',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrieve list of inputfield
    // POST : /api/v1/inputfield/retriveInputFieldList
    // @return list of inputfield
    retriveInputFieldList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveInputField (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
                {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            ).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { inputfield: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve detail of inputfield
    // GET : /api/v1/inputfield/:id
    // @return detail of inputfield
    retriveInputField: (req, res) => {
        if (req.params.id) {
            const InputField = req.app.locals.models.InputField;
            return InputField.findOne({
                where: { inputFieldID: req.params.id },
                attributes: ['inputFieldID', 'displayName', 'iconClass', 'dataType', 'isActive']
            })
                .then((inputfield) => {
                    if (!inputfield) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(inputFieldsModuleName), err: null, data: null });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, inputfield, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Create inputfield
    // POST : /api/v1/inputfield
    // @return new created inputfield
    createInputField: (req, res) => {
        if (req.body) {
            const InputField = req.app.locals.models.InputField;
            COMMON.setModelCreatedByFieldValue(req);
            return InputField.create(req.body, {
                fields: inputFields
            })
                .then(inputfield =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, inputfield, MESSAGE_CONSTANT.MASTER.INPUT_FIELD_CREATED)
                )
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    if (
                        err.message === COMMON.VALIDATION_ERROR &&
                        err.errors &&
                        err.errors.length > 0
                    ) {
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.FAILED,
                            {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err.errors.map(e => e.message).join(','),
                                data: null
                            }
                        );
                    } else {
                        return resHandler.errorRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY,
                            {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            }
                        );
                    }
                });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    },

    // Update inputfield
    // PUT : /api/v1/inputfield/:id
    // @param {id} int
    // @return API response
    updateInputField: (req, res) => {
        if (req.params.id) {
            const InputField = req.app.locals.models.InputField;
            return InputField.findAll({
                where: {
                    inputFieldID: { [Op.ne]: req.params.id },
                    [Op.and]: [
                        { displayOrder: req.body.displayOrder }
                    ]
                },
                paranoid: true
            }).then((response) => {
                const displayOrderExists = _.find(response, data => data.inputFieldID === req.params.id);
                if (response && response.length > 0 && !displayOrderExists) {
                    const fieldName = DATA_CONSTANT.INPUT_FIELD.DISPLAY_ORDER;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                } else if (req.params.id) { // Update
                    COMMON.setModelUpdatedByFieldValue(req);
                    return InputField.update(req.body, {
                        where: {
                            inputFieldID: req.params.id
                        }
                    })
                        .then((rowsUpdated) => {
                            if (rowsUpdated[0] === 1) {
                                return resHandler.successRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                    STATE.SUCCESS,
                                    rowsUpdated,
                                    MESSAGE_CONSTANT.MASTER.INPUT_FIELD_UPDATED
                                );
                            } else {
                                return resHandler.errorRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.EMPTY,
                                    {
                                        messageContent:
                                            MESSAGE_CONSTANT.MASTER.INPUT_FIELD_NOT_UPDATED,
                                        err: null,
                                        data: null
                                    }
                                );
                            }
                        })
                        .catch((err) => {
                            console.trace();
                            console.error(err);
                            if (
                                err.message === COMMON.VALIDATION_ERROR &&
                                err.errors &&
                                err.errors.length > 0
                            ) {
                                return resHandler.errorRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.FAILED,
                                    {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err.errors
                                            .map(e => e.message).join(','),
                                        data: null
                                    }
                                );
                            } else {
                                return resHandler.errorRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.EMPTY,
                                    {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    }
                                );
                            }
                        });
                } else {
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.FAILED,
                        {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                            err: null,
                            data: null
                        }
                    );
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                );
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    },

    // Delete inputfield
    // DELETE : /api/v1/inputfield/deleteInputField
    // @return API response
    deleteInputField: (req, res) => {
        if (req.body.objIDs && req.body.objIDs.id) {
            const InputField = req.app.locals.models.InputField;
            COMMON.setModelDeletedByFieldValue(req);

            return InputField.update(req.body, {
                where: {
                    inputFieldID: { [Op.in]: req.body.objIDs.id },
                    deletedAt: null
                },
                fields: [
                    'deletedBy',
                    'deletedAt',
                    'isDeleted',
                    'updatedAt',
                    'updatedBy',
                    'deleteByRoleId',
                    'updateByRoleId'
                ]
            })
                .then((rowsDeleted) => {
                    if (rowsDeleted > 0) {
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS,
                            null,
                            MESSAGE_CONSTANT.MASTER.INPUT_FIELD_DELETED
                        );
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.MASTER.INPUT_FIELD_NOT_DELETED,
                            err: null,
                            data: null
                        });
                    }
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY,
                        {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        }
                    );
                });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    },

    // Check displayName exists or not
    // POST : /api/v1/inputfield/checkUniqueName
    // @return API response displayName exists or not
    checkUniqueName: (req, res) => {
        if (req.body.objs && req.body.objs.displayName) {
            const InputField = req.app.locals.models.InputField;
            const whereClause = { displayName: req.body.objs.displayName };
            if (req.body.objs.inputFieldID) {
                whereClause.inputFieldID = { [Op.ne]: [req.body.objs.inputFieldID] };
            }

            return InputField.findOne({
                attributes: ['displayName'],
                where: whereClause
            })
                .then((ifExists) => {
                    if (ifExists) {
                        return resHandler.errorRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.FAILED,
                            {
                                messageContent: MESSAGE_CONSTANT.UNIQUE(
                                    DATA_CONSTANT.INPUT_FIELD.UNIQUE_FIELD_MESSAGE
                                ),
                                err: null,
                                data: { isDuplicateMessage: true }
                            }
                        );
                    } else {
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS,
                            null,
                            null
                        );
                    }
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY,
                        {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        }
                    );
                });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    }
};
