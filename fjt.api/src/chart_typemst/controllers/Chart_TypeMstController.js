const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const inputFields = [
    'chartTypeID',
    'name',
    'iconClass',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy'
];

const moduleName = DATA_CONSTANT.CHART_TYPEMST.NAME;

module.exports = {
    // Get List of chart type
    // GET : /api/v1/charttypemst
    // @return List of chart type
    getChartTypeList: (req, res) => {
        const { ChartTypeMst } = req.app.locals.models;
        return ChartTypeMst.findAll({
            where: {
                isActive: true
            },
            attributes: ['chartTypeID', 'name']
        }).then(chartTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, chartTypeList, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Create Chart Type
    // POST : /api/v1/createcharttype
    // @return created charttype
    createChartType: (req, res) => {
        const { ChartTypeMst } = req.app.locals.models;
        if (req.body) {
            const where = {
                [Op.or]: [
                    { name: req.body.name }
                ]
            };
            if (req.body.chartTypeID) {
                where.chartTypeID = { [Op.ne]: req.body.chartTypeID };
            }
            return ChartTypeMst.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ALREADY_EXISTS);
                    messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.CHART_TYPES_UNIQUE_FIELD.TYPE);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else if (req.body.chartTypeID) {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return ChartTypeMst.update(req.body, {
                        where: {
                            chartTypeID: req.body.chartTypeID
                        },
                        fields: inputFields
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    // Create
                    COMMON.setModelCreatedByFieldValue(req);
                    return ChartTypeMst.create(req.body, {
                        fields: inputFields
                    }).then(chartType => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, chartType, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
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
    // Retrive list of chart Type
    // GET : /api/v1/retriveChartTypeList
    // @return list of charttype
    retriveChartTypeList: (req, res) => {
        const { ChartTypeMst, sequelize } = req.app.locals.models;
        if (req.query.chartTypeID) {
            ChartTypeMst.findOne({
                where: { chartTypeID: req.query.chartTypeID }

            }).then((chartType) => {
                if (!chartType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.SUCCESS, chartType, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }

            sequelize
                .query('CALL Sproc_ChartTypeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
                    {
                        replacements: {
                            ppageIndex: req.query.page,
                            precordPerPage: filter.limit,
                            pOrderBy: strOrderBy,
                            pWhereClause: strWhere
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { ChartType: _.values(response[1]), Count: response[0][0]['COUNT(*)'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        }
    },
    // Remove Chart Type
    // POST : /api/v1/removeChartType
    // @return list of charttype by ID
    deleteChartType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)',
                {
                    replacements: {
                        tableName: COMMON.AllEntityIDS.ChartType.Name,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: COMMON.getRequestUserID(req),
                        entityID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((response) => {
                    response = response[0];
                    if (response && response.TotalCount === 0) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, MESSAGE_CONSTANT.DELETED(moduleName));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, response, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    }
};