const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
var Excel = require('exceljs');
Excel.config.setValue('promise', require('bluebird'));
const mkdirp = require('mkdirp');
const fs = require('fs');

const laborCostMstFields = [
    'id',
    'mountingTypeID',
    'laborcostmstID',
    'qpa',
    'orderedQty',
    'price',
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

const laborCostTemplateFields = [
    'id',
    'pricetype',
    'templateName',
    'isActive',
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

const laborCostModuleName = DATA_CONSTANT.LABOR_COST_TEMPLATE.Name;
module.exports = {

    // Check Unique template name
    // POST : /api/v1/rfqsetting/checkUniqueTemplateName
    // @return find Unique template name
    checkUniqueTemplateName: (req, res) => {
        if (req.body.name) {
            const { LaborCostTemplate } = req.app.locals.models;
            const whereStatement = [{ templateName: req.body.name }];

            if (req.body.id) {
                whereStatement.push({
                    id: { [Op.ne]: req.body.id }
                });
            }
            return LaborCostTemplate.findOne({
                where: whereStatement
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateName: true } });
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
    // Retrive list of labor cost
    // POST : /api/v1/rfqsetting/getLabourCostTemplateList
    // @return list of labor cost
    getLabourCostTemplateList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveLaorCostTemplateList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { LaborCost: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of labor cost
    // GET : /api/v1/rfqsetting/retriveLaborCostTemplate
    // @return list of labor cost
    retriveLaborCostTemplate: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.id) {
            return sequelize.query('CALL Sproc_RetrieveLaborCostDetailsByTemplateId (:pLaborCostTemplateId)', {
                replacements: {
                    pLaborCostTemplateId: req.params.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (!response || _.isEmpty(response[0]) || _.isEmpty(response[1])) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { LaborCostTemplate: _.values(response[0]), LaborCostTemplateDetail: _.values(response[1]) }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Delete Labor cost template
    // DELETE : /api/v1/deleteLaborCostTemplate
    // @return API response
    deleteLaborCostTemplate: (req, res) => {
        if (req.body.objIDs && req.body.objIDs.id) {
            const { sequelize } = req.app.locals.models;
            const tableName = COMMON.AllEntityIDS.Labor_Cost_Template.Name;
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
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(laborCostModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Add/Update packing slip detail
    // POST : /api/v1/saveLaborCostDetails
    saveLaborCostDetails: (req, res) => {
        if (req.body && req.body.laborCostTemplate) {
            const { LaborCostTemplate, sequelize } = req.app.locals.models;
            if (req.body.laborCostTemplate.id) {
                req.body.laborCostTemplate.updatedBy = COMMON.getRequestUserID(req);
                req.body.laborCostTemplate.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                return sequelize.transaction().then((t) => {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return LaborCostTemplate.update(req.body.laborCostTemplate, {
                        where: {
                            id: req.body.laborCostTemplate.id
                        },
                        fields: ['pricetype', 'templateName', 'isActive', 'updatedBy', 'updateByRoleId'],
                        transaction: t
                    }).then((response) => {
                        if (response && response.length > 0) {
                            return module.exports.addUpdateLaborCostDetailsInbulk(req, res, null, t).then((responseLaborCostDetail) => {
                                if (responseLaborCostDetail.status === STATE.SUCCESS) {
                                    t.commit();
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { response: response }, MESSAGE_CONSTANT.UPDATED(laborCostModuleName));
                                } else {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(laborCostModuleName), err: null, data: null });
                                }
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(laborCostModuleName), err: null, data: null });
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                COMMON.setModelCreatedByFieldValue(req);
                req.body.laborCostTemplate.createdBy = COMMON.getRequestUserID(req);
                req.body.laborCostTemplate.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                req.body.laborCostTemplate.updatedBy = COMMON.getRequestUserID(req);
                req.body.laborCostTemplate.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                return sequelize.transaction().then(t => LaborCostTemplate.create(req.body.laborCostTemplate, {
                    fields: laborCostTemplateFields,
                    transaction: t
                }).then(response => module.exports.addUpdateLaborCostDetailsInbulk(req, res, response.id, t).then((responseLaborCostDetail) => {
                    if (responseLaborCostDetail.status === STATE.SUCCESS) {
                        t.commit();
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { response: response }, MESSAGE_CONSTANT.UPDATED(laborCostModuleName));
                    } else {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(laborCostModuleName), err: null, data: null });
                    }
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    /* Used to add Labor cost details*/
    addUpdateLaborCostDetailsInbulk: (req, res, laborCostTemplateId, t) => {
        const { LaborCostPriceDet } = req.app.locals.models;
        const promises = [];
        _.each(req.body.laborCostDetails, (item) => {
            item.laborcostmstID = laborCostTemplateId ? laborCostTemplateId : req.body.laborcostmstID;
            if (item.id) {
                item.updatedBy = COMMON.getRequestUserID(req);
                item.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                promises.push(LaborCostPriceDet.update(item, {
                    where: {
                        id: item.id
                    },
                    fields: laborCostMstFields,
                    transaction: t
                }).then(() => ({
                    status: STATE.SUCCESS
                })).catch(err => ({
                    status: STATE.FAILED,
                    error: err
                })));
            } else {
                item.createdBy = COMMON.getRequestUserID(req);
                item.updatedBy = COMMON.getRequestUserID(req);
                item.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                item.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                promises.push(LaborCostPriceDet.create(item, {
                    fields: laborCostMstFields,
                    transaction: t
                }).then(() => ({
                    status: STATE.SUCCESS
                })).catch(err => ({
                    status: STATE.FAILED,
                    error: err
                })));
            }
            if (req.body.deletedLaborCostDetails.length > 0) {
                _.each(req.body.deletedLaborCostDetails, (deletedItem) => {
                    deletedItem.deletedAt = COMMON.getCurrentUTC();
                    deletedItem.isDeleted = 1;
                    deletedItem.deletedBy = COMMON.getRequestUserID(req);
                    deletedItem.deleteByRoleId = COMMON.getRequestUserLoginRoleID(req);
                    promises.push(LaborCostPriceDet.update(deletedItem, {
                        where: {
                            id: deletedItem.id
                        },
                        fields: ['isDeleted', 'deletedAt', 'deletedBy', 'deleteByRoleId'],
                        transaction: t
                    }).then(() => ({
                        status: STATE.SUCCESS
                    })).catch(err => ({
                        status: STATE.FAILED,
                        error: err
                    })));
                });
            }
        });
        return Promise.all(promises).then((response) => {
            const failedresponse = _.find(response, i => i.status === STATE.FAILED);
            if (!failedresponse) {
                const data = {
                    id: laborCostTemplateId
                };
                return {
                    status: STATE.SUCCESS,
                    data: data
                };
            } else {
                return failedresponse;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            // if (!t.finished)         t.rollback();
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // check download labor cost template
    // GET : /api/v1/rfqSettings/downloadLaborCostTemplate
    // @return API response
    // eslint-disable-next-line consistent-return
    downloadLaborCostTemplate: (req, res) => {
        if (req.params.module) {
            const categoryTypeName = `${req.params.module}.xlsx`;
            const path = DATA_CONSTANT.LABOR_COST_TEMPLATE.DOWNLOAD_PATH + categoryTypeName;
            // eslint-disable-next-line consistent-return
            fs.readFile(path, (err) => {
                if (err) {
                    if (err.code === COMMON.FileErrorMessage.NotFound) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);// new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
                    } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                    }
                } else {
                    const file = path;
                    res.setHeader('Content-disposition', `attachment; filename=${categoryTypeName}`);
                    res.setHeader('Content-type', 'application/vnd.ms-excel');
                    const filestream = fs.createReadStream(file);
                    filestream.pipe(res);
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get template name
    // POST : /api/v1/rfqsetting/getTemplateDetails
    // @return used to get template id and name
    getTemplateDetails: (req, res) => {
        const { LaborCostTemplate } = req.app.locals.models;
        if (req.params && req.params.pPriceType) {
            return LaborCostTemplate.findAll({
                where: {
                    deletedAt: null,
                    isActive: true,
                    pricetype: req.params.pPriceType
                },
                attributes: ['id', 'templateName', 'pricetype']
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get Price detail for labot tempalte
    // GET : /api/v1/getLaborTemplateWisePriceDetail
    // @return API response
    getLaborTemplateWisePriceDetail: (req, res) => {
        if (req.params.laborTemplateID) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('CALL Sproc_GetLaborTemplateWisePriceDetail (:plaborTemplateID)', {
                replacements: {
                    plaborTemplateID: req.params.laborTemplateID
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // check download labor cost template with Data
    // GET : /api/v1/rfqSettings/ExportLaborCostDetailTemplate
    // @return API response
    ExportLaborCostDetailTemplate: (req, res) => {
        if (req.params.module && req.params.id) {
            const { sequelize } = req.app.locals.models;
            // let categoryTypeName = req.params.module + ".xlsx";
            // var path = DATA_CONSTANT.LABOR_COST_TEMPLATE.DOWNLOAD_PATH + categoryTypeName;
            return sequelize.query('CALL Sproc_getExportLaborTemplateDetail (:pLaborCostTemplateId)', {
                replacements: {
                    pLaborCostTemplateId: req.params.id
                }
            }).then((response) => {
                var rowData = response;
                var workbook1 = new Excel.Workbook();
                var sheet1 = workbook1.addWorksheet('Sheet1');
                sheet1.columns = [];
                let columns = [];
                _.each(rowData, (item) => {
                    let keys = [];
                    keys = Object.keys(item);
                    _.each(keys, (key) => {
                        const obj = { header: key, key: key };
                        columns.push(obj);
                    });
                });
                columns = _.uniqBy(columns, e => e.header);
                sheet1.columns = columns;
                _.each(rowData, (item) => {
                    sheet1.addRow(item);
                });
                sheet1.eachRow((row, rowNumber) => {
                    if (rowNumber !== 1) {
                        row.eachCell((cell, colNumber) => {
                            if (colNumber > 3) {
                                row.eachCell((cellobj, colobjNumber) => {
                                    if (colNumber > 2 && colobjNumber < colNumber) {
                                        if (row.getCell(colNumber).value > row.getCell(colobjNumber).value) {
                                            row.getCell(colNumber).fill = {
                                                type: 'pattern',
                                                pattern: 'solid',
                                                fgColor: { argb: 'ff0000' }
                                            };
                                        }
                                    }
                                });
                            }
                        });
                    }
                    if (rowNumber === 1) {
                        row.eachCell((cell, colNumber) => {
                            row.getCell(colNumber).font = {
                                bold: true
                            };
                        });
                    }
                });

                const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
                mkdirp(path, () => { });
                const timespan = Date.now();
                const filename = `Parts_${timespan}.xls`;
                res.setHeader('Content-Type', 'application/vnd.ms-excel');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                // entity=entity?entity:'error';

                return workbook1.xlsx.writeFile(path + filename).then(() => {
                    // let file = path + entity + ".xls";
                    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
                    res.setHeader('Content-type', 'application/vnd.ms-excel');
                    const filestream = fs.createReadStream(path + filename);
                    fs.unlink(path + filename, () => { });
                    filestream.pipe(res);
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get labor cost template name
    // GET : /api/v1/getLaborCostTemplateMstNumber
    // @return API response
    getLaborCostTemplateMstNumber: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterLaborCostSearchList (:searchString,:plborID)', {
                replacements: {
                    searchString: req.body.searchString || null,
                    plborID: req.body.plborID || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};