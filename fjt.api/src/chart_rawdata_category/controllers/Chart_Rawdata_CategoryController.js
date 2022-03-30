const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const moduleName = DATA_CONSTANT.CHART_RAWDATA_CATEGORY.NAME;
const inputFields = [
    'chartRawDataCatID',
    'name',
    'dbViewName',
    'isSystemGenerated',
    'isDeleted',
    'createdBy',
    'updatedBy'
];
module.exports = {
    // Get List of Chart raw data category
    // GET : /api/v1/chartrawdatacategory
    // @return list of Chart raw data category
    getChartRawDataList: (req, res) => {
        const { ChartRawdataCategory } = req.app.locals.models;
        return ChartRawdataCategory.findAll({
            attributes: ['chartRawDataCatID', 'name', 'dbViewName']
        }).then(chartRawDataList =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, chartRawDataList, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Get Chart raw data by dbViewName
    // GET : /api/v1/chartrawdatacategory/getChartRawViewColumns
    // @param {dbViewName} string
    // @return detail of chart raw data
    getChartRawViewColumns: (req, res) => {
        const { ChartRawdataCategoryFields } = req.app.locals.models;

        ChartRawdataCategoryFields.findAll({
            where: {
                isActive: true,
                chartRawdataCatID: req.params.id
            },
            attributes: ['field', 'displayName', 'dataType', 'aggregate', 'displayOrder', 'fieldWidth'],
            order: [['displayOrder', 'ASC']]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get Chart raw data by DB view name
    // GET : /api/v1/chartrawdatacategory/getChartRawdatalist
    // @param {object} paging into model
    // @return detail of chart raw data
    getChartRawdatalist: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        let strOrderBy = null;
        if (filter.order[0]) {
            strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }
        sequelize.query('CALL Sproc_RetrieveChartRawdataCategory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pRoleID)', {
            replacements: {
                ppageIndex: req.query.page,
                precordPerPage: filter.limit,
                pOrderBy: strOrderBy,
                pWhereClause: strWhere,
                pRoleID: req.query.roleID ? req.query.roleID : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { Chart_Rawdata_Category: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Save chart Rawdata category
    // Post : /api/v1/saveChartrawdataCategory
    // @param Object of Chart Rawdata category
    // @return API response
    saveChartrawdataCategory: (req, res) => {
        const { ChartRawdataCategory } = req.app.locals.models;
        if (req.body) {
            return ChartRawdataCategory.findOne({
                attributes: ['name', 'dbViewName'],
                where: {
                    [Op.or]: {
                        name: req.body.name
                        // dbViewName: req.body.dbViewName,
                    },
                    chartRawdataCatID: { [Op.ne]: req.body.chartRawDataCatID || null }
                }
            }).then((rawdatacategory) => {
                if (rawdatacategory) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.CHART_RAWDATA_CATEGORY_UNIQUE_FIELD.NAME), err: null, data: null });
                }

                const { sequelize, ChartRawdataCategoryAccessRole } = req.app.locals.models;
                const userID = COMMON.getRequestUserID(req);

                // update case
                if (req.body.chartRawDataCatID) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return sequelize.transaction().then(t => ChartRawdataCategory.update(req.body, {
                        where: {
                            chartRawdataCatID: req.body.chartRawDataCatID
                        },
                        fields: ['name', 'dbViewName', 'updatedBy'],
                        transaction: t
                    }).then(updaterawdatacategory => ChartRawdataCategoryAccessRole.findAll({
                        where: {
                            chartRawDataCatID: req.body.chartRawDataCatID
                        },
                        attributes: ['roleID'],
                        transaction: t
                    }).then((allDBAccessRole) => {
                        var newAddedAccessRole = [];
                        var deletedAccessRole = [];

                        if (req.body.rawDataAccessRoleIDs) {
                            allDBAccessRole.forEach((item) => {
                                const roleExistsInDb = req.body.rawDataAccessRoleIDs.find(x => x === item.roleID);
                                if (!roleExistsInDb) { deletedAccessRole.push(item.roleID); }
                            });

                            req.body.rawDataAccessRoleIDs.forEach((item) => {
                                var roleExists = allDBAccessRole.find(x => x.roleID === item);
                                if (!roleExists) {
                                    const addData = {
                                        roleID: item,
                                        chartRawDataCatID: req.body.chartRawDataCatID,
                                        createdBy: userID
                                    };
                                    newAddedAccessRole.push(addData);
                                }
                            });
                        }
                        const promises = [];
                        if (newAddedAccessRole.length) {
                            COMMON.setModelCreatedByFieldValue(req);
                            promises.push(ChartRawdataCategoryAccessRole.bulkCreate(newAddedAccessRole, {
                                transaction: t
                            }));
                        }
                        if (deletedAccessRole.length) {
                            const updatedData = {
                                deletedAt: COMMON.getCurrentUTC(req),
                                isDeleted: true,
                                deletedBy: userID
                            };
                            promises.push(ChartRawdataCategoryAccessRole.update(updatedData, {
                                where: {
                                    roleID: { [Op.in]: deletedAccessRole },
                                    chartRawDataCatID: req.body.chartRawDataCatID,
                                    deletedAt: null
                                },
                                transaction: t,
                                fields: ['deletedBy', 'deletedAt', 'isDeleted']
                            }));
                        }

                        return Promise.all(promises).then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, updaterawdatacategory, MESSAGE_CONSTANT.UPDATED(moduleName));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
                } else {  // add case
                    COMMON.setModelCreatedByFieldValue(req);
                    return sequelize.transaction().then(t => ChartRawdataCategory.create(req.body, {
                        fields: inputFields,
                        transaction: t
                    }).then((createrawdatacategory) => {
                        if (!req.body.rawDataAccessRoleIDs || req.body.rawDataAccessRoleIDs.length === 0) {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, createrawdatacategory, MESSAGE_CONSTANT.CREATED(moduleName));
                        }

                        const addNewRoleAccessList = [];

                        req.body.rawDataAccessRoleIDs.forEach((item) => {
                            const addDataObj = {
                                roleID: item,
                                chartRawDataCatID: createrawdatacategory.chartRawDataCatID,
                                createdBy: userID
                            };
                            addNewRoleAccessList.push(addDataObj);
                        });

                        return ChartRawdataCategoryAccessRole.bulkCreate(addNewRoleAccessList, {
                            transaction: t
                        }).then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, createrawdatacategory, MESSAGE_CONSTANT.CREATED(moduleName));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
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

    // Remove line items
    // POST : /api/v1/rfqlineitems/deleteRawdatacategory
    // @param {id} Array of ids
    // @return API response
    deleteRawdatacategory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.ChartRawdataCategory.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:chartRawdataCatID,:refrenceIDs, :countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        chartRawdataCatID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((rawdatacategory) => {
                    var rawdatacategoryDetail = rawdatacategory[0];
                    if (rawdatacategoryDetail && rawdatacategoryDetail.TotalCount === 0) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rawdatacategoryDetail, MESSAGE_CONSTANT.DELETED(moduleName));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rawdatacategoryDetail, null);
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

    // Get List of Chart raw data category
    // GET : /api/v1/chartrawdatacategory/getChartRawDataListByAccessRole
    // @return list of Chart raw data category by user access role
    getChartRawDataListByAccessRole: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize
            .query('CALL Sproc_RetrieveChartRawDataCatByAccessRole (:pRoleID,:pSelectedChartRawDataCatID)',
                {
                    replacements: {
                        pRoleID: req.body.roleID,
                        pSelectedChartRawDataCatID: req.body.selectedChartRawDataCatID ? req.body.selectedChartRawDataCatID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { chartRawdataCategoryList: _.values(response[0]) }, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // check unique details for Raw Data Category
    // GET : /api/v1/chartrawdatacategory/checkDuplicateRawDataCategoryDetails
    // @return unique type message
    checkDuplicateRawDataCategoryDetails: (req, res) => {
        const { ChartRawdataCategory } = req.app.locals.models;
        if (req.body && req.body.name) {
            const whereClause = {
                chartRawdataCatID: { [Op.ne]: req.body.chartRawDataCatID || null },
                [Op.or]: []
            };
            // if(req.body.name){
            whereClause[Op.or] = [
                { name: req.body.name }
            ];

            return ChartRawdataCategory.findOne({
                attributes: ['name', 'dbViewName'],
                where: whereClause
            }).then((rawdatacategory) => {
                if (rawdatacategory) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.CHART_RAWDATA_CATEGORY_UNIQUE_FIELD.NAME), err: null, data: null });
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
    }
};