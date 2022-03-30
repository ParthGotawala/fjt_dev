const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const {
    STATE,
    GENERICCATEGORY,
    COMMON
} = require('../../constant');
const fs = require('fs');
var mime = require('mime');
const fsextra = require('fs-extra');
const uuidv1 = require('uuid/v1');
var csv = require('fast-csv');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');

const inputFields = [
    'id',
    'Name',
    'isActive',
    'isVerified',
    'defaultLabelTemplate',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'verifiedBy',
    'verifiedAt',
    'verifiedByRoleId'
];
const moduleName = DATA_CONSTANT.LABEL_TEMPLATE.NAME;
const labelInfo = DATA_CONSTANT.LABEL_TEMPLATE.LABEL_INFORMATION;

module.exports = {
    // get list of Label Template
    // POST : /api/v1/labeltemplates/retriveLabelTemplatesList
    // @return list of Label Template
    retriveLabelTemplatesList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        let filter;
        let strWhere = '';
        if (req.body.searchText) {
            strWhere = `\`Name\` like '%${req.body.searchText}%' `;
        } else {
            filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        }

        sequelize.query('CALL Sproc_RetrieveLabelTemplates (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter ? filter.limit : null,
                pOrderBy: filter ? filter.strOrderBy : null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                labeltemplates: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    retriveLabelTemplates: (req, res) => {
        const {
            LabelTemplatesMst
        } = req.app.locals.models;
        if (req.params.id) {
            return LabelTemplatesMst.findByPk(req.params.id).then((labeltemplates) => {
                if (!labeltemplates) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    labeltemplates: labeltemplates
                }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err.errors,
                    data: err.fields
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            });
        }
    },

    createLabelTemplate: (req, res) => {
        const {
            LabelTemplatesMst,
            sequelize
        } = req.app.locals.models;

        const checkUniqueName = req.body.listObj.Name;
        const uniqueDefaultLabelTemplate = req.body.listObj.defaultLabelTemplate;
        let assignedDefaultTemplate = null;

        if (checkUniqueName) {
            LabelTemplatesMst.findOne({
                where: {
                    Name: checkUniqueName
                }
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.UNIQUE(COMMON.stringFormat(DATA_CONSTANT.LABEL_TEMPLATE_UNIQUE_FIELD_NAME.NAME, req.body.listObj.Name)),
                        err: null,
                        data: null
                    });
                }

                return LabelTemplatesMst.findOne({
                    where: {
                        defaultLabelTemplate: uniqueDefaultLabelTemplate
                    }
                }).then((findlabel) => {
                    if (findlabel) {
                        assignedDefaultTemplate = findlabel;
                    }

                    const LabelObj = {
                        Name: req.body.listObj.Name,
                        isActive: req.body.listObj.isActive,
                        isVerified: req.body.listObj.isVerified,
                        defaultLabelTemplate: req.body.listObj.isActive && req.body.listObj.isVerified ? req.body.listObj.defaultLabelTemplate : null,
                        verifiedBy: req.body.listObj.isVerified ? req.user.id : null,
                        verifiedAt: req.body.listObj.isVerified ? COMMON.getCurrentUTC() : null,
                        verifiedByRoleId: req.body.listObj.isVerified ? COMMON.getRequestUserLoginRoleID(req) : null,
                        isDeleted: false,
                        createdBy: req.user.id,
                        updatedBy: req.user.id,
                        cratedAt: COMMON.getCurrentUTC(),
                        updatedAt: COMMON.getCurrentUTC(),
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };

                    const promises = [];
                    return sequelize.transaction().then((t) => {
                        if (assignedDefaultTemplate) {
                            const oldLabelObj = {
                                defaultLabelTemplate: null,
                                updatedBy: req.user.id,
                                updatedAt: COMMON.getCurrentUTC(),
                                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                            };
                            promises.push(
                                LabelTemplatesMst.update(oldLabelObj, {
                                    where: {
                                        id: assignedDefaultTemplate.id
                                    },
                                    fields: inputFields,
                                    transaction: t
                                })
                            );
                        }

                        promises.push(
                            LabelTemplatesMst.create(LabelObj, {
                                fields: inputFields,
                                transaction: t
                            })
                        );

                        return Promise.all(promises).then(labelmst => t.commit().then(() =>
                            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                response: labelmst.length === 1 ? labelmst[0] : labelmst.length === 2 ? labelmst[1] : null
                            }, MESSAGE_CONSTANT.CREATED(`${moduleName}: ${req.body.listObj.Name}`)))).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
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
    },

    updateLabelTemplate: (req, res) => {
        const {
            LabelTemplatesMst,
            sequelize
        } = req.app.locals.models;

        let assignedDefaultTemplate = null;
        const checkUniqueName = req.body.listObj.Name;
        const uniqueDefaultLabelTemplate = req.body.listObj.defaultLabelTemplate;

        const checkDuplicateDefaultTemplate = () => {
            LabelTemplatesMst.findOne({
                where: {
                    defaultLabelTemplate: uniqueDefaultLabelTemplate,
                    id: {
                        [Op.not]: req.body.listObj.id
                    }
                }
            }).then((findlabel) => {
                if (findlabel) {
                    assignedDefaultTemplate = findlabel;
                }
                // eslint-disable-next-line no-use-before-define
                updateTemplate();
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        };

        let updateTemplate = () => {
            const LabelObj = {
                Name: req.body.listObj.Name,
                isActive: req.body.listObj.isActive,
                isVerified: req.body.listObj.isVerified,
                defaultLabelTemplate: req.body.listObj.isVerified && req.body.listObj.isActive ? req.body.listObj.defaultLabelTemplate : null,
                verifiedBy: req.body.listObj.isVerified ? req.user.id : null,
                verifiedAt: req.body.listObj.isVerified ? COMMON.getCurrentUTC() : null,
                verifiedByRoleId: req.body.listObj.isVerified ? COMMON.getRequestUserLoginRoleID(req) : null,
                isDeleted: false,
                updatedBy: req.user.id,
                updatedAt: COMMON.getCurrentUTC(),
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };

            var promises = [];
            return sequelize.transaction().then((t) => {
                if (assignedDefaultTemplate) {
                    const oldLabelObj = {
                        defaultLabelTemplate: null,
                        updatedBy: req.user.id,
                        updatedAt: COMMON.getCurrentUTC(),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)

                    };
                    promises.push(
                        LabelTemplatesMst.update(oldLabelObj, {
                            where: {
                                id: assignedDefaultTemplate.id
                            },
                            fields: inputFields,
                            transaction: t
                        })

                    );
                }

                promises.push(
                    LabelTemplatesMst.update(LabelObj, {
                        where: {
                            id: req.body.listObj.id
                        },
                        fields: inputFields,
                        transaction: t
                    })
                );

                return Promise.all(promises).then(labelmst => t.commit().then(() => {
                    if (req.body.listObj.notShowNotifyMessage) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, labelmst, MESSAGE_CONSTANT.UPDATED(moduleName));
                    }
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
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
        };

        if (checkUniqueName) {
            LabelTemplatesMst.findOne({
                where: {
                    Name: checkUniqueName,
                    id: {
                        [Op.not]: req.body.listObj.id
                    }
                }
                // eslint-disable-next-line consistent-return
            }).then((findlabel) => {
                if (findlabel) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.UNIQUE(COMMON.stringFormat(DATA_CONSTANT.LABEL_TEMPLATE_UNIQUE_FIELD_NAME.NAME, req.body.listObj.Name)),
                        err: null,
                        data: null
                    });
                }

                if (req.body.listObj.isListPage) {
                    if (uniqueDefaultLabelTemplate) {
                        return LabelTemplatesMst.findOne({
                            where: {
                                id: req.body.listObj.id,
                                [Op.or]: [{
                                        isActive: false
                                    },
                                    {
                                        isVerified: false
                                    }
                                ]
                            }
                            // eslint-disable-next-line consistent-return
                        }).then((labelObj) => {
                            if (labelObj) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: (!labelObj.isVerified ? MESSAGE_CONSTANT.MASTER.UNVERIFIED_LABEL_TEMPLATE : MESSAGE_CONSTANT.MASTER.INACTIVE_LABEL_TEMPLATE),
                                    err: null,
                                    data: null
                                });
                            } else {
                                checkDuplicateDefaultTemplate();
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
                        updateTemplate();
                    }
                } else {
                    checkDuplicateDefaultTemplate();
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
        }
    },

    verifyLabelTemplate: (req, res) => {
        const LabelTemplatesMst = req.app.locals.models.LabelTemplatesMst;
        const id = req.body.listObj.id;
        if (id !== null) {
            LabelTemplatesMst.findOne({
                where: {
                    id: id,
                    isDeleted: false
                }
            }).then((isExists) => {
                if (!isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(labelInfo),
                        err: null,
                        data: null
                    });
                }
                const VerifyLabelObj = {
                    isVerified: req.body.listObj.isVerified,
                    defaultLabelTemplate: req.body.listObj.isVerified ? req.body.listObj.defaultLabelTemplate : null,
                    verifiedBy: req.body.listObj.isVerified ? req.user.id : null,
                    verifiedAt: req.body.listObj.isVerified ? COMMON.getCurrentUTC() : null,
                    verifiedByRoleId: req.body.listObj.isVerified ? COMMON.getRequestUserLoginRoleID(req) : null,
                    updatedBy: req.user.id,
                    updatedAt: COMMON.getCurrentUTC(),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };

                return LabelTemplatesMst.update(VerifyLabelObj, {
                    where: {
                        id: req.body.listObj.id
                    }
                }).then((labelverification) => {
                    if (!labelverification) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: DATA_CONSTANT.LABEL_TEMPLATE.NOT_VERIFIED,
                            err: null,
                            data: null
                        });
                    }
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WEBSERVICE_CHECK_SUCCESS);
                    messageContent.message = COMMON.stringFormat(messageContent.message, isExists.Name);
                    messageContent.displayDialog = true;

                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, labelverification, messageContent);
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
    },

    // eslint-disable-next-line consistent-return
    uploadLabelTemplatesDocuments: (req, res) => {
        const dir = './uploads/genericfiles/generic_category/';
        if (typeof (req.files) === 'object' && Array.isArray(req.files.documents)) {
            const file = req.files.documents[0];
            const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
            const fileName = `${uuidv1()}.${ext}`;
            const path = dir + fileName;
            fsextra.move(file.path, path, (err) => {
                if (err) {
                    console.trace();
                    console.error(err);
                }

                const categoryTypeName = req.body.categoryType;
                let LabelTemplateDataList = [];
                let AllDataWithError = [];
                let index = 0;
                let onErrorIndex = 0;
                const stream = fs.createReadStream(path);

                const Yes = GENERICCATEGORY.Yes;
                const No = GENERICCATEGORY.No;
                const labeltemplateError = GENERICCATEGORY;
                const Name = labeltemplateError.LABELTEMPLATESNAME;
                const Status = labeltemplateError.STATUS;
                const FailureOperationStatus = GENERICCATEGORY.FAILED;
                fs.unlinkSync(path);
                csv.fromStream(stream, {
                        headers: true,
                        ignoreEmpty: true
                    }).validate((data) => {
                        if (data) {
                            let isValid = true;

                            data.index = index++;
                            data.OperationStatus = '';
                            data.errorMessageList = [];

                            if (!data.Name || !data.Status || data.Name.length < 0 || data.Name.length > 100 || data.Status.toUpperCase() === Yes) {
                                if (!data.Name || data.Name.length <= 0) {
                                    data.errorMessageList.push(COMMON.stringFormat(GENERICCATEGORY.Required, Name));
                                }
                                if (data.Name && data.Name.length > 100) {
                                    data.errorMessageList.push(COMMON.stringFormat(GENERICCATEGORY.NAME_LENGTH_INVALID, Name));
                                }
                                if (!data.Status || data.Status.length <= 0) {
                                    data.errorMessageList.push(COMMON.stringFormat(GENERICCATEGORY.STATUS_REQUIRED, Status));
                                }
                                if (data.Status && data.Status.toUpperCase() === Yes) {
                                    data.errorMessageList.push(GENERICCATEGORY.InvalidStatus);
                                }
                                if (data.Status && data.Status.toUpperCase() === No) {
                                    data.errorMessageList.push(GENERICCATEGORY.InvalidStatus);
                                }
                                data.OperationStatus = FailureOperationStatus;
                                isValid = false;
                            }
                            return isValid;
                        }
                        return false;
                    }).on('data-invalid', (data) => {
                        if (data) {
                            AllDataWithError.push(data);
                        }
                    }).on('data', (data) => {
                        if (data) {
                            const checkExists = _.find(LabelTemplateDataList, item => item.Name === data.Name);
                            if (checkExists) {
                                data.errorMessageList = GENERICCATEGORY.CATEGORY_NAME_EXISTS;
                                data.OperationStatus = FailureOperationStatus;
                                AllDataWithError.push(data);
                            } else {
                                LabelTemplateDataList.push(data);
                            }
                        }
                    })
                    // eslint-disable-next-line consistent-return
                    .on('end', () => {
                        if (LabelTemplateDataList && LabelTemplateDataList.length > 0) {
                            const {
                                LabelTemplatesMst
                            } = req.app.locals.models;
                            const allPromises = [];
                            allPromises.push(LabelTemplatesMst.findAll({
                                where: {
                                    Name: {
                                        [Op.in]: _.map(LabelTemplateDataList, 'Name')
                                    }
                                }
                            }).then((findlabel) => {
                                if (findlabel && findlabel.length > 0) {
                                    _.each(findlabel, (item) => {
                                        const error = {
                                            Name: item.Name,
                                            Status: _.find(LabelTemplateDataList, {
                                                Name: item.Name
                                            }).Status,
                                            errorMessageList: GENERICCATEGORY.CATEGORY_NAME_EXISTS,
                                            OperationStatus: FailureOperationStatus
                                        };
                                        LabelTemplateDataList = _.reject(LabelTemplateDataList, o => o.Name.toUpperCase() === item.Name.toUpperCase());
                                        AllDataWithError.push(error);
                                    });
                                }
                            }).catch((templateFindErr) => {
                                console.trace();
                                console.error(templateFindErr);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            }));
                            // eslint-disable-next-line consistent-return
                            return Promise.all(allPromises).then(() => {
                                if (LabelTemplateDataList && LabelTemplateDataList.length > 0) {
                                    _.each(LabelTemplateDataList, (LabelItem) => {
                                        LabelItem.Name = LabelItem.Name;
                                        LabelItem.isActive = LabelItem.Status.toUpperCase() === GENERICCATEGORY.ACTIVE ? true : false;
                                        LabelItem.isVerified = false;
                                        LabelItem.isDeleted = false;
                                        COMMON.setModelCreatedObjectFieldValue(req.user, LabelItem);
                                    });
                                    return LabelTemplatesMst.bulkCreate(LabelTemplateDataList, {
                                        fields: inputFields
                                        // eslint-disable-next-line consistent-return
                                    }).then((resObj) => {
                                        if (AllDataWithError && AllDataWithError.length > 0) {
                                            // eslint-disable-next-line no-use-before-define
                                            DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
                                        } else {
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resObj, MESSAGE_CONSTANT.CREATED(DATA_CONSTANT.LABEL_TEMPLATE.NAME));
                                        }
                                    }).catch((createErr) => {
                                        console.trace();
                                        console.error(createErr);
                                        AllDataWithError = [...AllDataWithError, ..._.map(LabelTemplateDataList, item => ({
                                                Name: item.Name,
                                                status: item.Status,
                                                errorMessageList: GENERICCATEGORY.ERROR_IN_DATA_PROCESSING,
                                                OperationStatus: FailureOperationStatus
                                        }))];
                                        // eslint-disable-next-line no-use-before-define
                                        DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
                                    });
                                } else {
                                    // eslint-disable-next-line no-use-before-define
                                    DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
                                }
                                // eslint-disable-next-line consistent-return
                            }).catch((promiseErr) => {
                                console.trace();
                                console.error(promiseErr);
                                if (AllDataWithError && AllDataWithError.length > 0) {
                                    // eslint-disable-next-line no-use-before-define
                                    DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: promiseErr,
                                        data: null
                                    });
                                }
                            });
                        } else if (AllDataWithError && AllDataWithError.length > 0) {
                            // eslint-disable-next-line no-use-before-define
                            DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.NOT_CREATED(DATA_CONSTANT.LABEL_TEMPLATE.NAME),
                                err: null,
                                data: null
                            });
                        }
                    })
                    // eslint-disable-next-line consistent-return
                    .on('error', (error) => {
                        console.trace();
                        console.error(error);
                        onErrorIndex++;
                        /* data in loop called error part everytime if error so to display error only once put condition */
                        if (onErrorIndex === 1) {
                            stream.destroy();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: error,
                                data: null
                            });
                        }
                    });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            });
        }
    },

    deleteLabelTemplates: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.LabelTemplatesMst.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((labelTemplateDetail) => {
                if (labelTemplateDetail && labelTemplateDetail.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, labelTemplateDetail, MESSAGE_CONSTANT.DELETED(moduleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: labelTemplateDetail,
                        IDs: req.body.objIDs.id
                    }, null);
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

    getPrinterAndLabelTemplateData: (req, res) => {
        const {
            GenericCategory,
            LabelTemplatesMst
        } = req.app.locals.models;
        const promises = [];

        promises.push(
            GenericCategory.findAll({
                where: {
                    categoryType: {
                        [Op.eq]: 'Printers'
                    },
                    isDeleted: false,
                    isActive: true
                },
                attributes: ['gencCategoryID', 'gencCategoryName']
            }));

        promises.push(
            LabelTemplatesMst.findAll({
                where: {
                    isVerified: true,
                    isDeleted: false,
                    isActive: true
                },
                attributes: ['id', 'Name', 'isVerified', 'isActive', 'defaultLabelTemplate']
            }));

        Promise.all(promises).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                printer: response && response[0] ? response[0] : [],
                labeltemplate: response && response[1] ? response[1] : []
            }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    downloadSampleFileIntegration: (req, res) => {
        const file = `.${DATA_CONSTANT.LABEL_TEMPLATE.BARETENDER_INTEGRATION_FILE_PATH}`;
        // eslint-disable-next-line consistent-return
        fs.readFile(file, (err) => {
            if (err) {
                if (err.code === COMMON.FileErrorMessage.NotFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
                } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                }
            } else {
                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        });
    }
};

let DownloadCSVFile = (path, categoryTypeName, res, AllDataWithError) => {
    const PrintAllData = [];
    _.each(AllDataWithError, (item) => {
        item = _.omit(item, ['index']);
        PrintAllData.push(item);
    });

    const ws = fs.createWriteStream(path);
    csv.write(PrintAllData, {
        headers: true
    }).pipe(ws);
    setTimeout(() => {
        const file = path;
        const mimetype = mime.lookup(`${file}.text/csv`);
        res.setHeader('Content-disposition', `attachment; filename=${categoryTypeName}`);
        res.setHeader('Content-type', mimetype);
        const filestream = fs.createReadStream(file);
        fs.unlinkSync(path);
        filestream.pipe(res);
    }, 2000);
};