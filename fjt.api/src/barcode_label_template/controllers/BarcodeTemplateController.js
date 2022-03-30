const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const barcodeTemplateModuleName = DATA_CONSTANT.BARCODE_LABEL_TEMPLATE.NAME;
const barcodeTemplateDelimiterModuleName = DATA_CONSTANT.BARCODE_LABEL_TEMPLATE_DELIMITER.NAME;

const barcodeLabelTemplateFields = [
    'id',
    'name',
    'prefixlength',
    'suffixlength',
    'tempregexp',
    'wildcardformat',
    'Samplereaddata',
    'barcodeType',
    'description',
    'mfgcodeid',
    'status',
    'separator',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'barcodeCategory'
];
const barcodeLabelTemplateDelimiterFields = [
    'refbrID',
    'delimiter',
    'length',
    'dataElementId',
    'notes',
    'dataTypeID',
    'fieldType',
    'displayOrder',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
module.exports = {
    // Retrive list of barcode label template
    // GET : /api/v1/barcodeLabelTemplate/retrieveBarcodeLabelTemplateList
    // @return list of barcode label template
    retrieveBarcodeLabelTemplateList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveBarcodeLabelTemplate (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { barcodeTemplate: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive detail of barcode label template
    // GET : /api/v1/barcodeLabelTemplate/:id
    // @param {id} int
    // @return detail of barcode label template
    getBarcodeLabelTemplateByID: (req, res) => {
        if (req.params.id) {
            const { BRLabelTemplate, BRLabelTemplateDelimiter } = req.app.locals.models;
            return BRLabelTemplate.findOne({
                where: {
                    id: parseInt(req.params.id)
                },
                include: [{
                    model: BRLabelTemplateDelimiter,
                    as: 'barcodeDelimiter',
                    where: { isDeleted: false },
                    attributes: ['id', 'refbrID', 'delimiter', 'length', 'dataElementId', 'notes', 'dataTypeID', 'fieldType', 'displayOrder'],
                    required: false
                }]
            }).then((BarcodeTemplateDetail) => {
                if (!BarcodeTemplateDetail) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(barcodeTemplateModuleName),
                        err: null,
                        data: null
                    });
                }
                BarcodeTemplateDetail.description = COMMON.getTextAngularValueFromDB(BarcodeTemplateDetail.description);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, BarcodeTemplateDetail, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Save barcode label template
    // POST : /api/v1/barcodeLabelTemplate
    // @return API response
    saveBarcodeLabelTemplate: (req, res) => {
        const { BRLabelTemplate, BRLabelTemplateDelimiter } = req.app.locals.models;
        if (req.body.name) {
            req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false);
        }

        if (req.params.id) {
            const promises = [];
            let createData = [];
            let updateData = [];
            let isDuplicate = false;
            let isUpdate = false;
            let Exp;
            let messageContent;
            if (req.body.barcodeCategory !== DATA_CONSTANT.BARCODDE_CATEGORY.PACKINGSLIP && req.body && req.body.tempregexp === '^$') {
                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BARCODE_CONTAIN_MFGPN);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: messageContent,
                    err: null,
                    data: null
                });
            }

            return BRLabelTemplate.findAll({
                where: {
                    [Op.or]: [
                        { name: req.body.name },
                        { tempregexp: req.body.tempregexp }
                    ],
                    [Op.and]: {
                        id: { [Op.ne]: req.params.id },
                        barcodeCategory: req.body.barcodeCategory,
                        deletedAt: null
                    }
                }
            }).then((barcodeTemplateData) => {
                isDuplicate = barcodeTemplateData.length > 0 ? true : false;
                if (barcodeTemplateData.length > 0) {
                    const Name = _.find(barcodeTemplateData, x => (x.name).toLowerCase() === (req.body.name).toLowerCase());
                    if (Name) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BARCODE_TEMPLATE_NAME_UNIQUE);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: {
                                isDuplicateName: true
                            }
                        });
                    }

                    if (req.body.barcodeType === 1) {
                        Exp = _.find(barcodeTemplateData, x => x.tempregexp === req.body.tempregexp);
                    } else {
                        Exp = _.find(barcodeTemplateData, x => x.tempregexp === req.body.tempregexp && x.mfgcodeid === req.body.mfgcodeid);
                    }

                    if (Exp) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BARCODE_TEMPLATE_EXPRESSION_UNIQUE);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: {
                                isDuplicateExpression: true
                            }
                        });
                    } else {
                        isDuplicate = false;
                        isUpdate = true;
                        COMMON.setModelUpdatedByFieldValue(req);
                        req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                        return BRLabelTemplate.update(req.body, {
                            where: {
                                id: req.params.id
                            },
                            fields: barcodeLabelTemplateFields
                        });
                    }
                } else {
                    isUpdate = true;
                    COMMON.setModelUpdatedByFieldValue(req);
                    req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                    return BRLabelTemplate.update(req.body, {
                        where: {
                            id: req.params.id
                        },
                        fields: barcodeLabelTemplateFields
                    });
                }
            }).then(() => {
                if (!isDuplicate) {
                    if (req.body.delimiterData && req.body.delimiterData.length > 0) {
                        let duplicateDisplayOrder;
                        const createIDs = _.filter(req.body.delimiterData, item => item.id === 0);
                        const updateIDs = _.filter(req.body.delimiterData, item => item.id !== 0);
                        createData = _.difference(createIDs, updateIDs);
                        updateData = _.difference(updateIDs, createIDs);
                        _.each(createData, (item) => {
                            item.id = null;
                            item.dataElementId = item.elementID ? item.elementID : null;
                            item.refbrID = req.params.id;
                        });
                        _.each(updateData, (item) => {
                            item.refbrID = req.params.id;
                            item.dataElementId = item.elementID ? item.elementID : null;
                        });
                        const CreateUpdateOperation = () => {
                            isUpdate = true;
                            if (createData && createData.length > 0) {
                                COMMON.setModelCreatedArrayFieldValue(req.user, createData);
                                _.each(createData, (item) => {
                                    promises.push(BRLabelTemplateDelimiter.create(item, {
                                        fields: barcodeLabelTemplateDelimiterFields
                                    }).then(response => Promise.resolve(response)));
                                });
                            }

                            if (updateData && updateData.length > 0) {
                                COMMON.setModelUpdatedByArrayFieldValue(req.user, updateData);
                                _.each(updateData, (item) => {
                                    promises.push(BRLabelTemplateDelimiter.update(item, {
                                        fields: barcodeLabelTemplateDelimiterFields,
                                        where: {
                                            id: item.id
                                        }
                                    }).then(response => Promise.resolve(response)));
                                });
                            }
                        };
                        promises.push(BRLabelTemplateDelimiter.findAll({
                            where: {
                                refbrID: { [Op.eq]: req.params.id },
                                deletedAt: null
                            }
                        }).then((response) => {
                            if (response && response.length > 0) {
                                _.each(req.body.delimiterData, (item) => {
                                    duplicateDisplayOrder = _.find(response, x => x.displayOrder === item.displayOrder && x.id !== item.id);
                                });
                                if (duplicateDisplayOrder) {
                                    isUpdate = false;
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BARCODE_DISPLAY_ORDER_DUPLICATE_MESSAGE);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: messageContent,
                                        err: null,
                                        data: null
                                    });
                                } else {
                                    CreateUpdateOperation();
                                }
                            } else {
                                CreateUpdateOperation();
                            }
                            return Promise.resolve(response);
                        }));
                    }
                }
                return Promise.all(promises);
            }).then(saveData => Promise.resolve(saveData))
                .then((response) => {
                    if ((createData.length === 0 && updateData.length === 0 && !isDuplicate) || (isUpdate && !isDuplicate)) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(barcodeTemplateModuleName));
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.FAILED, response, MESSAGE_CONSTANT.NOT_UPDATED(barcodeTemplateModuleName));
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            let whereClause = {};
            if (req.body.barcodeType === 1) {
                whereClause = {
                    [Op.or]: [
                        { name: req.body.name },
                        {
                            // tempregexp: req.body.tempregexp.replace(new RegExp(/\\\\/, 'g'), '\\')
                            // tempregexp: new RegExp(req.body.tempregexp)
                            tempregexp: req.body.tempregexp
                        }
                    ],
                    [Op.and]: {
                        barcodeCategory: req.body.barcodeCategory
                    }
                };
            } else {
                whereClause = {
                    [Op.or]: [
                        { name: req.body.name },
                        {
                            // tempregexp: req.body.tempregexp.replace(new RegExp(/\\\\/, 'g'), '\\')
                            // tempregexp: new RegExp(req.body.tempregexp)
                            tempregexp: req.body.tempregexp,
                            mfgcodeid: req.body.mfgcodeid
                        }
                    ],
                    [Op.and]: {
                        barcodeCategory: req.body.barcodeCategory
                    }
                };
            }

            return BRLabelTemplate.findAll({
                where: whereClause
            }).then((barcodeTemplateData) => {
                if (barcodeTemplateData.length > 0) {
                    let messageContent;
                    let Exp;
                    const Name = _.find(barcodeTemplateData, x => (x.name).toLowerCase() === (req.body.name).toLowerCase());
                    if (Name) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BARCODE_TEMPLATE_NAME_UNIQUE);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: {
                                isDuplicateName: true
                            }
                        });
                    }

                    if (req.body.barcodeType === 1) {
                        Exp = _.find(barcodeTemplateData, x => x.tempregexp === req.body.tempregexp);
                    } else {
                        Exp = _.find(barcodeTemplateData, x => x.tempregexp === req.body.tempregexp && x.mfgcodeid === req.body.mfgcodeid);
                    }

                    if (Exp) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BARCODE_TEMPLATE_EXPRESSION_UNIQUE);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: {
                                isDuplicateExpression: true
                            }
                        });
                    }
                    return resHandler.errorRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(barcodeTemplateModuleName),
                        err: null,
                        data: null
                    }
                    );
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                    return BRLabelTemplate.create(req.body, {
                        fields: barcodeLabelTemplateFields
                    }).then((response) => {
                        if (response && response.id) {
                            if (req.body.delimiterData && req.body.delimiterData.length > 0) {
                                const createData = req.body.delimiterData;
                                const delPromises = [];
                                COMMON.setModelCreatedArrayFieldValue(req.user, createData);
                                _.each(createData, (item) => {
                                    item.id = null;
                                    item.dataElementId = item.elementID ? item.elementID : null;
                                    item.refbrID = response.id;
                                    delPromises.push(BRLabelTemplateDelimiter.create(item, {
                                        fields: barcodeLabelTemplateDelimiterFields
                                    }).then(() => STATE.SUCCESS).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    }));
                                });
                                return Promise.all(delPromises).then((delResponse) => {
                                    if (_.find(delResponse, dRes => dRes === STATE.FAILED)) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: MESSAGE_CONSTANT.NOT_CREATED(barcodeTemplateModuleName),
                                            err: null,
                                            data: null
                                        });
                                    } else {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(barcodeTemplateModuleName));
                                    }
                                });
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(barcodeTemplateModuleName));
                            }
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.NOT_CREATED(barcodeTemplateModuleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
                //    let  messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BARCODE_TEMPLATE_NAME_UNIQUE);
                //     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                //         messageContent:messageContent,
                //         err: null,
                //         data: null
                //     });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
    },
    // Delete barcode label template requests
    // DELETE : /api/v1/barcodeLabelTemplate
    // @param {id} int
    // @return API response
    deleteBarcodeLabelTemplate: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.BarcodeTemplete.Name;
            const entityID = COMMON.AllEntityIDS.BarcodeTemplete.ID;
            const refrenceIDs = null;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((templateDetail) => {
                if (templateDetail.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(barcodeTemplateModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: templateDetail, IDs: req.body.objIDs.id }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Delete barcode label template delimiter requests
    // DELETE : /api/v1/barcodeLabelTemplateelimiter
    // @param {id} int
    // @return API response
    deleteBarcodeLabelTemplateDelimiter: (req, res) => {
        const { BRLabelTemplateDelimiter } = req.app.locals.models;
        if (req.body.id) {
            COMMON.setModelDeletedByFieldValue(req);
            BRLabelTemplateDelimiter.update(req.body, {
                where: {
                    id: { [Op.in]: req.body.id },
                    deletedAt: null
                },
                fields: ['isDeleted', 'deletedBy', 'deletedAt', 'deleteByRoleId']
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(barcodeTemplateDelimiterModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
    },

    // Retrive list of component data element & manual fields of components.
    // GET : /api/v1/component
    // @return list of component field(dynamic) and manual fields
    getDataElementFields: (req, res) => {
        const { BRLabelTemplateManualField, DataElement, ComponentDataelement } = req.app.locals.models;
        let fieldDetails = {};
        let dynamicDetail = [];
        const tableName = [COMMON.AllEntityIDS.Component_sid_stock.Name, COMMON.AllEntityIDS.Packing_Slip.Name, COMMON.AllEntityIDS.Packing_Slip_Detail.Name];
        const entityID = COMMON.AllEntityIDS.Component_sid_stock.ID;
        DataElement.findAll({
            where: {
                entityID: entityID
            },
            include: [{
                model: ComponentDataelement,
                as: 'componentDataelement'
            }]
        }).then((dynamicData) => {
            if (dynamicData && dynamicData.length > 0) {
                dynamicDetail = dynamicData;
            }
            BRLabelTemplateManualField.findAll({
                where: {
                    tableName: { [Op.in]: tableName }
                }
            }).then((manualData) => {
                if (manualData && manualData.length > 0) {
                    fieldDetails = {
                        manualData: manualData,
                        dynamicData: dynamicDetail
                    };
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, fieldDetails, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    }
};