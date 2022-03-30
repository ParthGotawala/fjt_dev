const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const inputFields = [
    'nameOfChart',
    'chartTypeID',
    'chartRawDataCatID',
    'chartCatID',
    'xAxisVal',
    'yAxisVal',
    'xAxisName',
    'yAxisName',
    'filterData',
    'isDeleted',
    'createdBy',
    'createdAt',
    'deletedAt',
    'deletedBy',
    'isPinToDashboard',
    'isPinToTraveler',
    'chartCategoryID',
    'isRenderTable',
    'isSystemGenerated',
    'dataRefreshTime'
];

const updateFields = [
    'nameOfChart',
    'chartTypeID',
    'chartRawDataCatID',
    'xAxisVal',
    'yAxisVal',
    'xAxisName',
    'yAxisName',
    'filterData',
    'updatedBy',
    'updatedAt',
    'compareVariables',
    'drilldown',
    'xAxisFormat',
    'chartCategoryID',
    'isRenderTable',
    'dataRefreshTime'
];

const moduleName = DATA_CONSTANT.CHART_TEMPLATEMST.NAME;

module.exports = {
    // Get Widget detail by chartTemplate id
    // GET : /api/v1/charttemplatemst
    // @param {chartTemplateID} int
    // @return detail Widget
    getChartTemplateDetail: (req, res) => {
        const { ChartTemplateMst, ChartRawdataCategory } = req.app.locals.models;

        ChartTemplateMst.findOne({
            where: {
                chartTemplateID: req.params.chartTemplateID
            },
            include: [
                {
                    model: ChartRawdataCategory,
                    as: 'chartRawdataCategory',
                    attributes: ['dbViewName']
                }
            ]
        }).then((response) => {
            if (!response) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get Widget detail with data by chartTemplate id
    // POST : /api/v1/charttemplatemst/getChartDetailsByChartTemplateID
    // @param {chartTemplateID} int
    // @param {filter} array
    // @return detail Widget with data
    getChartDetailsByChartTemplateID: (req, res) => {
        const { sequelize, ChartTemplateMst, ChartRawdataCategory, ChartRawdataCategoryFields } = req.app.locals.models;

        ChartTemplateMst.findOne({
            where: {
                chartTemplateID: req.body.chartTemplateID
            },
            include: [
                {
                    model: ChartRawdataCategory,
                    as: 'chartRawdataCategory',
                    attributes: ['dbViewName'],
                    include: [
                        {
                            model: ChartRawdataCategoryFields,
                            as: 'chartRawdataCategoryFields',
                            attributes: ['field', 'aggregate', 'displayName', 'dataType']
                        }
                    ]
                }
            ]
        }).then((chatTemplateMst) => {
            if (chatTemplateMst) {
                let pfields = '';
                let pgroupby = '';
                const chartRawdataCategoryFields = chatTemplateMst.chartRawdataCategory.chartRawdataCategoryFields
                    .map(x => ({
                        field: x.field,
                        aggregate: x.aggregate
                    }));
                // delete array from original object as no longer need it
                delete chatTemplateMst.chartRawdataCategory.chartRawdataCategoryFields;

                const xAxisAggregate = _.find(chartRawdataCategoryFields, item => item.field === chatTemplateMst.yAxisVal);

                if (chatTemplateMst.xAxisFormat) {
                    let dateFormat = null;
                    switch (chatTemplateMst.xAxisFormat) {
                        case DATA_CONSTANT.CHART_TEMPLATEMST.AXIS_FORMAT.YEAR.NAME: {
                            dateFormat = DATA_CONSTANT.CHART_TEMPLATEMST.AXIS_FORMAT.YEAR.VALUE;
                            break;
                        }
                        case DATA_CONSTANT.CHART_TEMPLATEMST.AXIS_FORMAT.MONTH.NAME: {
                            dateFormat = DATA_CONSTANT.CHART_TEMPLATEMST.AXIS_FORMAT.MONTH.VALUE;
                            break;
                        }
                        case DATA_CONSTANT.CHART_TEMPLATEMST.AXIS_FORMAT.DATE.NAME: {
                            dateFormat = DATA_CONSTANT.CHART_TEMPLATEMST.AXIS_FORMAT.DATE.VALUE;
                            break;
                        }
                        default:
                            break;
                    }

                    switch (xAxisAggregate.aggregate) {
                        case DATA_CONSTANT.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.GROUP: {
                            pfields = COMMON.stringFormat('date_format(`{0}`,\'{1}\') AS `{0}`, `{2}`'
                                , chatTemplateMst.xAxisVal, dateFormat, chatTemplateMst.yAxisVal);
                            pgroupby = COMMON.stringFormat('date_format(`{0}`,\'{1}\'), `{2}`', chatTemplateMst.xAxisVal
                                , dateFormat, chatTemplateMst.yAxisVal);
                            break;
                        }
                        case DATA_CONSTANT.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.SUM:
                        default: {
                            pfields = COMMON.stringFormat('date_format(`{0}`,\'{1}\') AS `{0}`, SUM(`{2}`) AS `{2}`'
                                , chatTemplateMst.xAxisVal, dateFormat, chatTemplateMst.yAxisVal);
                            pgroupby = COMMON.stringFormat('date_format(`{0}`,\'{1}\')', chatTemplateMst.xAxisVal
                                , dateFormat);
                            break;
                        }
                    }
                } else {
                    switch (xAxisAggregate.aggregate) {
                        case DATA_CONSTANT.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.GROUP: {
                            pfields = COMMON.stringFormat('`{0}`, `{1}`', chatTemplateMst.xAxisVal, chatTemplateMst.yAxisVal);
                            pgroupby = COMMON.stringFormat('`{0}`, `{1}`', chatTemplateMst.xAxisVal, chatTemplateMst.yAxisVal);
                            break;
                        }
                        case DATA_CONSTANT.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.SUM:
                        default: {
                            pfields = COMMON.stringFormat('`{0}`, SUM(`{1}`) AS `{1}`', chatTemplateMst.xAxisVal, chatTemplateMst.yAxisVal);
                            pgroupby = `\`${chatTemplateMst.xAxisVal}\``;
                            break;
                        }
                    }
                }

                if (chatTemplateMst.compareVariables) {
                    // var compVarArr = chatTemplateMst.compareVariables.split(',');
                    const compVarArr = JSON.parse(chatTemplateMst.compareVariables);

                    compVarArr.forEach((item) => {
                        var itemAggregate = _.find(chartRawdataCategoryFields, x => x.field === item.field);
                        if (itemAggregate) {
                            switch (itemAggregate.aggregate) {
                                case DATA_CONSTANT.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.GROUP: {
                                    pfields += COMMON.stringFormat(', `{0}`', item.field);
                                    pgroupby += COMMON.stringFormat(', `{0}`', item.field);
                                    break;
                                }
                                case DATA_CONSTANT.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.SUM:
                                default: {
                                    pfields += COMMON.stringFormat(', SUM(`{0}`) AS `{0}`', item.field);
                                    break;
                                }
                            }
                        }
                    });
                }

                const ptablename = chatTemplateMst.chartRawdataCategory.dbViewName;

                let pwherecluse = null;
                // If external filter data is passed from UI then ignore chart filter/
                // This filter data comes from traveller page when we pass woID and opID related informations
                if (req.body.filter) { pwherecluse = module.exports.generateCustomWhareClause(req.body.filter); } else { pwherecluse = module.exports.generateWhareClause(chatTemplateMst.filterData); }

                return sequelize
                    .query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)',
                        {
                            replacements:
                            {
                                pfields: pfields, ptablename: ptablename, pwherecluse: pwherecluse, pgroupby: pgroupby, porderby: null
                            }
                        })
                    .then((resp) => {
                        var data = {
                            chatTemplateMst: chatTemplateMst,
                            chartData: resp
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, data, null);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null }); }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get drilldown data from given axis
    // POST : /api/v1/charttemplatemst/getChartDrilldownDetails
    // @param {chartTemplateID} int
    // @param {drilldownAxis} string
    // @param {axis} array
    // @return widget data list
    getChartDrilldownDetails: (req, res) => {
        const { sequelize, ChartTemplateMst, ChartRawdataCategory } = req.app.locals.models;

        ChartTemplateMst.findOne({
            where: {
                chartTemplateID: req.body.chartTemplateID
            },
            attributes: ['yAxisVal', 'filterData'],
            include: [
                {
                    model: ChartRawdataCategory,
                    as: 'chartRawdataCategory',
                    attributes: ['dbViewName']
                }
            ]
        }).then((chatTemplateMst) => {
            if (chatTemplateMst) {
                const drilldownAxis = req.body.drilldownAxis;
                const yAxisVal = req.body.yAxisVal;
                const pfields = COMMON.stringFormat('`{0}`,SUM(`{1}`) AS `{1}`', drilldownAxis, yAxisVal);
                const pgroupby = `\`${drilldownAxis}\``;

                const ptablename = chatTemplateMst.chartRawdataCategory.dbViewName;

                const whereClauseArr = [];
                (req.body.axis || []).forEach((x) => {
                    whereClauseArr.push(COMMON.stringFormat('`{0}`= \'{1}\'', x.name, x.value));
                });
                const whereClause = whereClauseArr.join(' AND ');
                let pwherecluse = module.exports.generateWhareClause(chatTemplateMst.filterData);
                if (pwherecluse) { pwherecluse = COMMON.stringFormat('{0} AND ({1})', whereClause, pwherecluse); } else { pwherecluse = whereClause; }

                return sequelize
                    .query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)',
                        {
                            replacements:
                            {
                                pfields: pfields, ptablename: ptablename, pwherecluse: pwherecluse, pgroupby: pgroupby, porderby: null
                            }
                        })
                    .then(resp => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null))
                    .catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: err, data: null }));
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get where condition from JSON string
    // @param {filterData} string
    // @return where condition
    generateWhareClause: (filterData) => {
        if (!filterData) return null;

        const filterObj = JSON.parse(filterData);
        const obj = {
            groupCount: 0,
            count: 0,
            sublevelCount: 0,
            expressionui: ''
        };

        _.each(filterObj, (group) => {
            if (group.Nodes.length > 0) {
                module.exports.getSubExpression(group, obj);
            }
        });
        if (obj.sublevelCount > 0) {
            for (let o = 0; o < obj.sublevelCount; o++) {
                obj.expressionui += ' ) ';
            }
        }
        return obj.expressionui;
    },
    // Get where condition from custom object
    // @param {filter} string
    // @return where condition
    generateCustomWhareClause: (filter) => {
        var whereArr = [];
        filter.forEach((x) => {
            whereArr.push(COMMON.stringFormat('`{0}` = \'{1}\'', x.name, x.value));
        });
        return whereArr.length ? whereArr.join(' AND ') : null;
    },
    // Get sub expression with condition string
    // @param {group} object
    // @param {obj} object
    getSubExpression: (group, obj) => {
        var optionTypesArr = DATA_CONSTANT.CHART_TEMPLATEMST.OPTIONTYPES;
        var datatypes = DATA_CONSTANT.CHART_TEMPLATEMST.DATATYPE;

        group.Nodes.forEach((node, index) => {
            if (index > 0 && group.Condition) {
                obj.expressionui += ` ${node.Condition || group.Condition} `;
            }
            if (node.Selected) {
                if (obj.groupCount > 0 && obj.count !== obj.groupCount) {
                    obj.count = obj.groupCount;
                    obj.expressionui += ' ( ';
                }
                if (node.Selected.OptionType === optionTypesArr[0]) {
                    let valText = '';
                    if (datatypes.NUMBER.indexOf(node.datatype) !== -1) {
                        valText = node.OperatorValue != null ? node.OperatorValue : '';
                        obj.expressionui += ` \`${node.Selected.FieldName.field}\` ${node.Selected.Operator.Value} ${valText}`;
                    } else if (datatypes.STRING.indexOf(node.datatype) !== -1) {
                        let operatorValue = node.Selected.Operator.Value;
                        if (node.OperatorValue == null) { valText = ''; } else if (node.Selected.Operator.Value === DATA_CONSTANT.CHART_TEMPLATEMST.TEXT_OPERATOR.CONTAINS) {
                            valText = COMMON.stringFormat('\'%{0}%\'', node.OperatorValue);
                            operatorValue = DATA_CONSTANT.CHART_TEMPLATEMST.TEXT_OPERATOR.CONTAINS;
                        } else if (node.Selected.Operator.Value === DATA_CONSTANT.CHART_TEMPLATEMST.TEXT_OPERATOR.STARTSWITH) {
                            valText = COMMON.stringFormat('\'{0}%\'', node.OperatorValue);
                            operatorValue = DATA_CONSTANT.CHART_TEMPLATEMST.TEXT_OPERATOR.CONTAINS;
                        } else if (node.Selected.Operator.Value === DATA_CONSTANT.CHART_TEMPLATEMST.TEXT_OPERATOR.ENDSWITH) {
                            valText = COMMON.stringFormat('\'%{0}\'', node.OperatorValue);
                            operatorValue = DATA_CONSTANT.CHART_TEMPLATEMST.TEXT_OPERATOR.CONTAINS;
                        } else if (node.Selected.Operator.Value === DATA_CONSTANT.CHART_TEMPLATEMST.TEXT_OPERATOR.DOESNOTCONTAIN) {
                            valText = COMMON.stringFormat('\'%{0}%\'', node.OperatorValue);
                        } else { valText = COMMON.stringFormat('\'{0}\'', node.OperatorValue); }
                        obj.expressionui += ` \`${node.Selected.FieldName.field}\` ${operatorValue} ${valText}`;
                    } else if (datatypes.DATE.indexOf(node.datatype) !== -1) {
                        valText = COMMON.stringFormat('\'{0}\'', COMMON.formatDate(node.OperatorValue));
                        obj.expressionui += ` DATE_FORMAT(\`${node.Selected.FieldName.field}\`,'%Y-%m-%d')${node.Selected.Operator.Value} ${valText}`;
                    } else if (datatypes.TIME.indexOf(node.datatype) !== -1) {
                        valText = COMMON.stringFormat('\'{0}\'', node.OperatorValue);
                        obj.expressionui += ` \`${node.Selected.FieldName.field}\` ${node.Selected.Operator.Value} ${valText}`;
                    } else {
                        valText = node.Selected.BooleanVal != null ? node.Selected.BooleanVal.Value : '';
                        obj.expressionui += ` \`${node.Selected.FieldName.field}\` ${node.Selected.Operator.Value} ${valText}`;
                    }
                } else if (node.Selected.OptionType === optionTypesArr[1]) {
                    obj.expressionui += ` ( ${node.Selected.SelectedExpression.Expression.replace(/[{}]/g, '`')} ${node.Selected.Operator.Value} ${node.OperatorValue} ) `;
                }
            }

            if (obj.groupCount > 0 && group.ParentGroupLevel != null && index === group.Nodes.length - 1) {
                if (group.SubLevel === 1) {
                    obj.expressionui += ' ) ';
                }

                if (group.SubLevel > 1) {
                    obj.sublevelCount++;
                }
            }

            if (node.Nodes && node.Nodes.length > 0) {
                obj.groupCount++;
                module.exports.getSubExpression(node, obj);
            }
        });
    },
    // Get Save widget detail
    // POST : /api/v1/charttemplatemst
    // @return Save widget detail
    saveChartTemplateDetail: (req, res) => {
        const ChartTemplateMst = req.app.locals.models.ChartTemplateMst;
        if (req.body.nameOfChart) { req.body.nameOfChart = COMMON.TEXT_WORD_CAPITAL(req.body.nameOfChart, false); }

        if (req.body.chartTemplateID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return ChartTemplateMst.update(req.body, {
                where: {
                    chartTemplateID: req.body.chartTemplateID
                },
                fields: updateFields
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { chartTemplateDetail: req.body }, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            const { sequelize, ChartTemplateAccess } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            req.body.isPinToDashboard = false;
            req.body.isPinToTraveler = false;

            return sequelize.transaction(t => ChartTemplateMst.create(req.body, {
                fields: inputFields,
                transaction: t
            }).then((chartTemplate) => {
                const chartTemplateAccessObj = {
                    chartTemplateID: chartTemplate.chartTemplateID,
                    employeeID: req.user.employeeID,
                    createdBy: req.body.createdBy
                };

                return ChartTemplateAccess.create(chartTemplateAccessObj, {
                    transaction: t
                }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { chartTemplateDetail: chartTemplate }, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                if (!t.finished) { t.rollback(); }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Get List of Widget
    // GET : /api/v1/charttemplatemst/getAllChartTemplete
    // @return List of Widget
    getAllChartTemplete: (req, res) => {
        const { ChartTemplateMst, ChartRawdataCategory, ChartCategory, ChartTemplateOperations,
            ChartTypeMst, ChartTemplateAccess, User, Employee } = req.app.locals.models;
        ChartTemplateMst.findAll({
            where: req.body,
            include: [
                {
                    model: ChartRawdataCategory,
                    as: 'chartRawdataCategory',
                    attributes: ['dbViewName']
                },
                {
                    model: ChartCategory,
                    as: 'chartCategory',
                    attributes: ['id', 'name', 'order']
                },
                {
                    model: ChartTemplateOperations,
                    as: 'chartTemplateOperations',
                    attributes: ['opID']
                },
                {
                    model: ChartTypeMst,
                    as: 'chartTypeMst',
                    attributes: ['name']
                },
                {
                    model: ChartTemplateAccess,
                    as: 'chartTemplateAccess',
                    attributes: ['ID', 'chartTemplateID', 'employeeID'],
                    required: false
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['employeeID'],
                    where: {
                        id: { [Op.col]: 'ChartTemplateMst.createdBy' }
                    },
                    include: [{
                        model: Employee,
                        as: 'employee',
                        attributes: ['firstName', 'lastName']
                    }]
                }
            ]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get Delete Widget by chartTemplateID
    // POST : /api/v1/charttemplatemst/deleteChartTemplete
    // @return API Response
    deleteChartTemplete: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.chartTemplateID) {
            const tableName = COMMON.AllEntityIDS.ChartTemplateMst.Name;

            sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.chartTemplateID.toString(),
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((Chart) => {
                    const chartDetail = Chart[0];
                    if (chartDetail && chartDetail.TotalCount === 0) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, MESSAGE_CONSTANT.DELETED(moduleName));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, chartDetail, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Pin/Unpin Widget into dashboard
    // GET : /api/v1/charttemplatemst/setWidgetToDashboard
    // @param {isPinToDashboard} bool
    // @return API Response
    setWidgetToDashboard: (req, res) => {
        const ChartTemplateMst = req.app.locals.models.ChartTemplateMst;
        if (req.body.chartTemplateID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return ChartTemplateMst.update(req.body, {
                where: {
                    chartTemplateID: req.body.chartTemplateID
                },
                fields: ['isPinToDashboard', 'updatedBy']
            }).then(() => {
                const messageContent = req.body.isPinToDashboard ? MESSAGE_CONSTANT.MASTER.PIN_TO_DASHBOARD : MESSAGE_CONSTANT.MASTER.UNPIN_TO_DASHBOARD;
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Pin/Unpin Widget into traveler page
    // GET : /api/v1/charttemplatemst/setWidgetToTraveler
    // @param {isPinToTraveler} bool
    // @return API Response
    setWidgetToTraveler: (req, res) => {
        const ChartTemplateMst = req.app.locals.models.ChartTemplateMst;
        if (req.body.chartTemplateID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return ChartTemplateMst.update(req.body, {
                where: {
                    chartTemplateID: req.body.chartTemplateID
                },
                fields: ['isPinToTraveler', 'updatedBy']
            }).then(() => {
                const messageContent = req.body.isPinToDashboard ? MESSAGE_CONSTANT.MASTER.PIN_TO_DASHBOARD : MESSAGE_CONSTANT.MASTER.UNPIN_TO_DASHBOARD;
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get List of Widget employee wise
    // GET : /api/v1/charttemplatemst/getEmployeewiseAllChartTemplete
    // @return List of Widget
    getEmployeewiseAllChartTemplete: (req, res) => {
        const { ChartTemplateMst, ChartRawdataCategory, ChartCategory, ChartTemplateOperations,
            ChartTypeMst, ChartTemplateAccess } = req.app.locals.models;
        const whereSt = { isDeleted: false };
        if (req.body.isPinToDashboard) {
            whereSt.isPinToDashboard = req.body.isPinToDashboard;
        }
        ChartTemplateMst.findAll({
            where: whereSt,
            include: [
                {
                    model: ChartRawdataCategory,
                    as: 'chartRawdataCategory',
                    attributes: ['dbViewName']
                },
                {
                    model: ChartCategory,
                    as: 'chartCategory',
                    attributes: ['id', 'name', 'order']
                },
                {
                    model: ChartTemplateOperations,
                    as: 'chartTemplateOperations',
                    attributes: ['opID']
                },
                {
                    model: ChartTypeMst,
                    as: 'chartTypeMst',
                    attributes: ['name']
                },
                {
                    model: ChartTemplateAccess,
                    as: 'chartTemplateAccess',
                    attributes: ['ID', 'chartTemplateID', 'employeeID'],
                    where: {
                        employeeID: req.body.employeeID
                    }
                }
            ]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};