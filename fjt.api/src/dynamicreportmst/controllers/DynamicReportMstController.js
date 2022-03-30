const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');


const inputFields = [
    'ID',
    'ReportName',
    'Filter',
    'ReportType',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'chartRawDataCatID',
    'isDeleted',
    'pivotJsonData',
    'chartCategoryID',
    'isPinToDashboard'
];

const MISReportModuleName = DATA_CONSTANT.MIS_REPORT.NAME;

module.exports = {

    // Retrive list all DynamicReport Names that allowed to access by employee
    // GET : /api/v1/dynamicreportmst/getDynamicReportNames
    // @return list all DynamicReportNames
    getDynamicReportNames: (req, res) => {
        if (req.params.EmployeeID && req.params.isUserSuperAdmin) {
            const { DynamicReportMst, DynamicReportAccess } = req.app.locals.models;
            const whereStatement = {
                refTableName: COMMON.DBTableName.DynamicReportMst
            };
            req.params.isUserSuperAdmin = JSON.parse(req.params.isUserSuperAdmin);
            if (req.params.isUserSuperAdmin) {
                whereStatement.deletedAt = null;
                // whereStatement = '1=1';
            } else {
                whereStatement.EmployeeID = req.params.EmployeeID;
            }

            return DynamicReportMst.findAll({
                where: { isDeleted: false },
                attributes: ['ID', 'ReportName', 'chartRawDataCatID'],
                include: [
                    {
                        model: DynamicReportAccess,
                        as: 'dynamicReportAccess',
                        required: true,
                        attributes: ['ID', 'EmployeeID'],
                        // where:{ EmployeeID :req.params.EmployeeID}
                        where: whereStatement
                    }
                ]
            }).then(dynamicReportMstlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicReportMstlist: dynamicReportMstlist }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive DynamicReport details By Reoprt ID
    // GET : /api/v1/dynamicreportmst/getDynamicReportDetailsByReportID
    // @return Dynamic Report details
    getDynamicReportDetailsByReportID: (req, res) => {
        const { DynamicReportMst, DynamicReportFields, DynamicReportAccess, ChartRawdataCategory, ChartRawdataCategoryFields } = req.app.locals.models;
        if (req.body.id) {
            return DynamicReportMst.findOne({
                where: {
                    ID: req.body.id
                },
                attributes: ['ID', 'ReportName', 'Filter', 'ReportType', 'chartRawDataCatID', 'createdBy', 'pivotJsonData'],
                include: [{
                    model: DynamicReportFields,
                    as: 'dynamicReportFields',
                    required: true,
                    order: [
                        [DynamicReportFields, 'orderBy', 'ASC']
                    ],
                    attributes: ['ID', 'dynamicReportID', 'Fields', 'orderBy']

                },
                {
                    where: { refTableName: COMMON.DBTableName.DynamicReportMst },
                    model: DynamicReportAccess,
                    as: 'dynamicReportAccess',
                    required: false,
                    attributes: ['ID', 'refTransID', 'EmployeeID']
                },
                {
                    model: ChartRawdataCategory,
                    as: 'chartRawdataCategory',
                    required: true,
                    attributes: ['dbViewName'],
                    include: [
                        {
                            model: ChartRawdataCategoryFields,
                            as: 'chartRawdataCategoryFields',
                            attributes: ['displayName', 'field', 'aggregate']
                        }
                    ]
                }
                ]
            }).then((dynamicReportMstdet) => {
                if (!dynamicReportMstdet) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(req.body.reportName ? req.body.reportName : MISReportModuleName), err: null, data: null });
                }
                /* Report type - Summary */
                if (dynamicReportMstdet.ReportType === DATA_CONSTANT.MIS_REPORT.MISCommonReportType.Summary) {
                    const chartRawdataCategoryFields = dynamicReportMstdet.chartRawdataCategory.chartRawdataCategoryFields
                        .map(x => ({
                            field: x.field,
                            aggregate: x.aggregate
                        }));
                    // delete array from original object as no longer need it
                    delete dynamicReportMstdet.chartRawdataCategory.chartRawdataCategoryFields;
                    return module.exports.getMISReportData(req, res, dynamicReportMstdet, chartRawdataCategoryFields);
                } else {  /* Report type - Detail */
                    return module.exports.getMISReportData(req, res, dynamicReportMstdet, null);
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

    /* local function for getting mis report data by defined fields */
    getMISReportData: (req, res, dynamicReportMstdet, ViewFieldlist) => {
        const { sequelize } = req.app.locals.models;
        let pfields = null;
        let pgroupby = '';

        /* Report type - Summary */
        if (ViewFieldlist && ViewFieldlist.length > 0) {
            const FIELD_DATATYPES = COMMON.FIELD_DATATYPES;
            const DateFormatForFilter = DATA_CONSTANT.MIS_REPORT.DateFormatForFilter;
            const whereFieldsList = [];
            const groupByFieldsList = [];

            _.each(dynamicReportMstdet.dynamicReportFields, (item) => {
                // let _matchField = _.find(ViewFieldlist, ['field', item.Fields]);
                const matchField = _.find(ViewFieldlist, ViewFieldlistItem => ViewFieldlistItem.field.toLowerCase() === item.Fields.toLowerCase());
                if (!matchField) {
                    return;
                }

                if (matchField.aggregate === DATA_CONSTANT.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.SUM) {
                    whereFieldsList.push(`${'SUM(`'}${item.Fields}\`) AS \`${item.Fields}\``);
                } else if (matchField.aggregate === DATA_CONSTANT.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.GROUP) {
                    whereFieldsList.push(`\`${item.Fields}\``);
                    groupByFieldsList.push(`\`${item.Fields}\``);
                } else {
                    whereFieldsList.push(`\`${item.Fields}\``);
                }

                /* group by - fields */
                if (matchField.Data_Type === FIELD_DATATYPES.VARCHAR) {
                    groupByFieldsList.push(`\`${item.Fields}\``);
                }
                if (matchField.Data_Type === FIELD_DATATYPES.DATETIME) {
                    /* get date in 'mm-dd-yyyy' format. */
                    groupByFieldsList.push(`${'DATE_FORMAT(`'}${item.Fields}\` , '${DateFormatForFilter}')`);
                }
            });

            pfields = whereFieldsList.join();
            pgroupby = groupByFieldsList.join();
        } else {  /* Report type - Detail */
            pfields = _.map(dynamicReportMstdet.dynamicReportFields, item => `\`${item.Fields}\``).join();
        }

        const ptablename = dynamicReportMstdet.chartRawdataCategory.dbViewName;
        const filteroption = req.body.filterOption ? req.body.filterOption : dynamicReportMstdet.Filter;

        let pwherecluse = module.exports.generateWhereClause(filteroption);
        let porderby = null;

        if (req.body.order && JSON.parse(req.body.order).length > 0) {
            const orderField = JSON.parse(req.body.order)[0];
            porderby = `\`${orderField[0]}\` ${orderField[1]}`;
        }

        if (req.body.search && req.body.search.length > 0) {
            const searcharray = JSON.parse(req.body.search);

            _.each(searcharray, (obj) => {
                if (obj.ColumnDataType && obj.ColumnDataType === COMMON.GridFilterColumnDataType.Number) {
                    if (pwherecluse) {
                        pwherecluse += (COMMON.stringFormat(' and `{0}` = \'{1}\'', obj.ColumnName, obj.SearchString.replace(/'/g, '\'\'')));
                        // pwherecluse += ' and  `' + obj.ColumnName + '` ' + '=' + ' ' + obj.SearchString;
                    } else {
                        pwherecluse = (COMMON.stringFormat(' `{0}` = \'{1}\'', obj.ColumnName, obj.SearchString.replace(/'/g, '\'\'')));
                        // pwherecluse = ' `' + obj.ColumnName + '` ' + '=' + ' ' + obj.SearchString;
                    }
                } else if (pwherecluse) {
                    pwherecluse += (COMMON.stringFormat(' and `{0}` like \'%{1}%\'', obj.ColumnName, obj.SearchString.replace(/'/g, '\'\'')));
                    // pwherecluse += ' and `' + obj.ColumnName + '` ' + 'like' + ' ' + '"%' + obj.SearchString + '%"' + '';
                } else {
                    pwherecluse = (COMMON.stringFormat(' `{0}` like \'%{1}%\'', obj.ColumnName, obj.SearchString.replace(/'/g, '\'\'')));
                    // pwherecluse = ' `' + obj.ColumnName + '` ' + 'like' + ' ' + '"%' + obj.SearchString + '%"' + '';
                }
            });
        }

        sequelize
            .query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)',
                {
                    replacements:
                    {
                        pfields: pfields, ptablename: ptablename, pwherecluse: pwherecluse, pgroupby: pgroupby, porderby: porderby
                    }
                })
            .then(resplist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { reportDatalist: resplist, dynamicReportMstdet: dynamicReportMstdet }, null)).catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
    },


    // Get where condition from JSON string
    // @param {filterData} string
    // @return where condition
    generateWhereClause: (filterData) => {
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

    // Save DynamicReportMst details
    // POST : /api/v1/dynamicreportmst/saveDynamicReportData
    // @return new mis report details
    saveDynamicReportData: (req, res) => {
        const { sequelize, DynamicReportMst, DynamicReportAccess, DynamicReportFields } = req.app.locals.models;
        if (req.body) {
            if (req.body.ReportName) { req.body.ReportName = COMMON.TEXT_WORD_CAPITAL(req.body.ReportName, false); }

            let generatedReportID = null;

            return sequelize.transaction(t => DynamicReportMst.count({
                where: {
                    ReportName: req.body.ReportName
                }
            }).then((count) => {
                if (count > 0) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Report name');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                }

                const dynamicReportMstObj = {
                    ReportName: req.body.ReportName,
                    Filter: req.body.Filter,
                    ReportType: req.body.ReportType,
                    createdBy: req.user.id,
                    chartRawDataCatID: req.body.chartRawDataCatID,
                    chartCategoryID: req.body.chartCategoryID,
                    isPinToDashboard: req.body.isPinToDashboard
                };

                return DynamicReportMst.create(dynamicReportMstObj, {
                    transaction: t
                }).then((reportmst) => {
                    if (!reportmst) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(MISReportModuleName), err: null, data: null });
                    }

                    generatedReportID = reportmst.ID;
                    const dynamicReportFieldslist = [];
                    _.each(req.body.fieldsSelectionList, (item) => {
                        const obj = {};
                        obj.Fields = item.Fields;
                        obj.dynamicReportID = reportmst.ID;
                        obj.orderBy = item.orderBy;
                        obj.createdBy = req.user.id;
                        obj.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                        dynamicReportFieldslist.push(obj);
                    });

                    return DynamicReportFields.bulkCreate(dynamicReportFieldslist, {
                        individualHooks: true,
                        transaction: t
                    }).then((dyReopFieldslist) => {
                        if (!dyReopFieldslist || dyReopFieldslist.length === 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(MISReportModuleName), err: null, data: null });
                        }

                        if (req.body.employeeListForAllowedToViewReport.length > 0) {
                            const dynamicReportAccesslist = [];
                            _.each(req.body.employeeListForAllowedToViewReport, (item) => {
                                const obj = {};
                                obj.EmployeeID = item;
                                obj.refTransID = reportmst.ID;
                                obj.refTableName = COMMON.DBTableName.DynamicReportMst;
                                obj.createdBy = req.user.id;
                                obj.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                dynamicReportAccesslist.push(obj);
                            });

                            return DynamicReportAccess.bulkCreate(dynamicReportAccesslist, {
                                transaction: t
                            }).then((dyReopAccesslist) => {
                                if (!dyReopAccesslist || dyReopAccesslist.length === 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(MISReportModuleName), err: null, data: null });
                                }
                                // return resHandler.successRes(res, 200, STATE.SUCCESS, { dynamicReportID: generatedReportID, userMessage: MESSAGE_CONSTANT.CREATED(MISReportModuleName + ": " + req.body.ReportName) });
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicReportID: generatedReportID }, MESSAGE_CONSTANT.CREATED(`${MISReportModuleName}: ${req.body.ReportName}`));
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            // return resHandler.successRes(res, 200, STATE.SUCCESS, { dynamicReportID: generatedReportID, userMessage: MESSAGE_CONSTANT.CREATED(MISReportModuleName + ": " + req.body.ReportName) });
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicReportID: generatedReportID }, MESSAGE_CONSTANT.CREATED(`${MISReportModuleName}: ${req.body.ReportName}`));
                        }
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
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update DynamicReportMst and get related (mis report) details
    // POST : /api/v1/dynamicreportmst/updateDynamicReportData
    // @return new mis report details
    updateDynamicReportData: (req, res) => {
        const { sequelize, DynamicReportMst, DynamicReportAccess, DynamicReportFields } = req.app.locals.models;
        if (req.body && req.params.id) {
            if (req.body.ReportName) { req.body.ReportName = COMMON.TEXT_WORD_CAPITAL(req.body.ReportName, false); }
            return DynamicReportMst.count({
                where: {
                    ReportName: req.body.ReportName,
                    id: { [Op.ne]: req.params.id }
                }
            }).then((count) => {
                if (count > 0) {
                    // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.MIS_REPORT.REPORT_NAME_UNIQUE));
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Report name');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                }
                return DynamicReportMst.findOne({
                    where: {
                        ID: req.params.id
                    },
                    attributes: ['ID'],
                    include: [{
                        model: DynamicReportFields,
                        as: 'dynamicReportFields',
                        required: true,
                        attributes: ['ID', 'dynamicReportID', 'Fields', 'orderBy']
                    },
                    {
                        where: { refTableName: COMMON.DBTableName.DynamicReportMst },
                        model: DynamicReportAccess,
                        as: 'dynamicReportAccess',
                        required: false,
                        attributes: ['ID', 'refTransID', 'EmployeeID']
                    }
                    ]
                }).then((dynamicReportMstdet) => {
                    if (!dynamicReportMstdet) {
                        // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(MISReportModuleName + " " + req.body.ReportName)));
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(`${MISReportModuleName} ${req.body.ReportName}`), err: null, data: null });
                    }

                    return sequelize.transaction((t) => {
                        const dynamicReportMstObj = {
                            ReportName: req.body.ReportName,
                            Filter: req.body.Filter,
                            ReportType: req.body.ReportType,
                            updatedBy: req.user.id,
                            pivotJsonData: req.body.pivotJsonData,
                            chartCategoryID: req.body.chartCategoryID,
                            isPinToDashboard: req.body.isPinToDashboard
                        };
                        var allPromises = [];
                        allPromises.push(
                            DynamicReportMst.update(dynamicReportMstObj, {
                                where: {
                                    ID: req.params.id
                                },
                                fields: inputFields,
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);


                                return STATE.FAILED;
                            }));


                        const oldFieldsString = _.map(dynamicReportMstdet.dynamicReportFields, 'Fields');
                        const requestedFieldString = _.map(req.body.fieldsSelectionList, 'Fields');

                        const oldFields = _.map(dynamicReportMstdet.dynamicReportFields, (item) => {
                            var oldValue = { orderBy: item.orderBy, field: item.Fields };
                            return oldValue;
                        });

                        const fieldsToDelete = _.difference(oldFieldsString, requestedFieldString);

                        const objUpdateReportFields = {
                            isDeleted: 1,
                            deletedBy: req.user.id,
                            deletedAt: COMMON.getCurrentUTC(),
                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        if (fieldsToDelete.length > 0) {
                            allPromises.push(
                                DynamicReportFields.update(objUpdateReportFields, {
                                    where: {
                                        dynamicReportID: req.params.id,
                                        Fields: { [Op.in]: fieldsToDelete },
                                        deletedAt: null
                                    },
                                    // fields: ['isDeleted','deletedBy','deletedAt'],
                                    transaction: t
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);

                                    return STATE.FAILED;
                                }));
                        }

                        const newFieldsToInsert = _.difference(requestedFieldString, oldFieldsString);
                        let dataToInsert = [];
                        dataToInsert = newFieldsToInsert.map(data => req.body.fieldsSelectionList.find(a => a.Fields === data));

                        const dynamicReportFieldslist = [];
                        _.each(dataToInsert, (item) => {
                            const objFields = {};
                            objFields.Fields = item.Fields;
                            objFields.dynamicReportID = req.params.id;
                            objFields.createdBy = req.user.id;
                            objFields.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                            objFields.orderBy = item.orderBy;
                            dynamicReportFieldslist.push(objFields);
                        });

                        if (dynamicReportFieldslist.length > 0) {
                            allPromises.push(
                                DynamicReportFields.bulkCreate(dynamicReportFieldslist, {
                                    individualHooks: true,
                                    transaction: t
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                        }

                        const existingFieldsToUpdate = _.difference(req.body.fieldsSelectionList, oldFields);
                        const dynamicReportFieldlistToUpdate = [];
                        _.each(existingFieldsToUpdate, (item) => {
                            const objRpt = {};
                            objRpt.Fields = item.Fields;
                            objRpt.orderBy = item.orderBy;
                            objRpt.updatedAt = COMMON.getCurrentUTC();
                            objRpt.updatedBy = COMMON.getRequestUserID(req);
                            objRpt.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                            dynamicReportFieldlistToUpdate.push(objRpt);
                        });

                        _.each(dynamicReportFieldlistToUpdate, (updateObj) => {
                            allPromises.push(DynamicReportFields.update(updateObj, {
                                where: {
                                    Fields: updateObj.Fields
                                },
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            }));
                        });


                        return Promise.all(allPromises).then((responses) => {
                            var resObj = _.find(responses, resDet => resDet === STATE.FAILED);
                            if (resObj) {
                                if (!t.finished) { t.rollback(); }
                                // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(MISReportModuleName + " " + req.body.ReportName)));
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(`${MISReportModuleName} ${req.body.ReportName}`), err: null, data: null });
                            } else {
                                t.commit();
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dynamicReportMstdet, MESSAGE_CONSTANT.UPDATED(MISReportModuleName));
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finish()) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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

    // delete DynamicReport details By Report ID with deletion of access users and fields
    // GET : /api/v1/dynamicreportmst/deleteDynamicReportDetailsByReportID
    // @return Dynamic Report status details
    deleteDynamicReportDetailsByReportID: (req, res) => {
        const { sequelize, DynamicReportMst, DynamicReportFields, DynamicReportAccess } = req.app.locals.models;

        if (req.query.id) {
            return DynamicReportMst.count({
                where: {
                    ID: req.query.id
                }
            }).then((dynamicReportMstCount) => {
                if (dynamicReportMstCount === 0) {
                    // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(req.query.reportName ? req.query.reportName : MISReportModuleName)));
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(req.query.reportName ? req.query.reportName : MISReportModuleName), err: null, data: null });
                }

                return sequelize.transaction((t) => {
                    const deleteDynamicReportObj = {
                        deletedBy: req.user.id,
                        deletedAt: COMMON.getCurrentUTC(),
                        isDeleted: true
                    };

                    return DynamicReportMst.update(deleteDynamicReportObj, {
                        where: {
                            ID: req.query.id
                        },
                        fields: inputFields,
                        transaction: t
                    }).then(() => DynamicReportFields.update(deleteDynamicReportObj, {
                        where: {
                            dynamicReportID: req.query.id,
                            deletedAt: null
                        },
                        transaction: t
                    }).then(() => DynamicReportAccess.update(deleteDynamicReportObj, {
                        where: {
                            refTableName: COMMON.DBTableName.DynamicReportMst,
                            refTransID: req.query.id,
                            deletedAt: null
                        },
                        transaction: t
                    }).then(() =>
                        // return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.DELETED(req.query.reportName ? req.query.reportName : MISReportModuleName) });
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(req.query.reportName ? req.query.reportName : MISReportModuleName))).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
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

    // Update DynamicReportMstJsonData for pivot table
    // POST : /api/v1/dynamicreportmst/updateDynamicReportPivotJsonData
    // @return new mis report details
    updateDynamicReportPivotJsonData: (req, res) => {
        const { DynamicReportMst } = req.app.locals.models;
        if (req.body.ID) {
            const dynamicReportObj = {
                pivotJsonData: req.body.pivotJsonData
            };
            return DynamicReportMst.update(dynamicReportObj, {
                where: {
                    ID: req.body.ID
                },
                fields: inputFields
            }).then(() =>
                // return resHandler.successRes(res, 200, STATE.SUCCESS, { dynamicReportID: req.body.ID, userMessage: MESSAGE_CONSTANT.UPDATED(MISReportModuleName + " " + req.body.ReportName) });
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicReportID: req.body.ID }, MESSAGE_CONSTANT.UPDATED(`${MISReportModuleName} ${req.body.ReportName}`))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive DynamicReport all details By Reoprt ID
    // GET : /api/v1/dynamicreportmst/getDynamicReportMstDetByReportID
    // @return Dynamic Report details
    getDynamicReportMstDetByReportID: (req, res) => {
        const { DynamicReportMst, DynamicReportFields, User, Employee } = req.app.locals.models;
        if (req.body.id) {
            return DynamicReportMst.findOne({
                where: {
                    ID: req.body.id
                },
                attributes: ['ID', 'ReportName', 'Filter', 'ReportType', 'chartRawDataCatID', 'createdBy', 'pivotJsonData', 'chartCategoryID', 'isPinToDashboard'],
                include: [{
                    model: DynamicReportFields,
                    as: 'dynamicReportFields',
                    required: true,
                    order: [
                        [DynamicReportFields, 'orderBy', 'ASC']
                    ],
                    attributes: ['ID', 'dynamicReportID', 'Fields', 'orderBy']

                },
                // {
                //    where: { refTableName: COMMON.DBTableName.DynamicReportMst },
                //    model: DynamicReportAccess,
                //    as: 'dynamicReportAccess',
                //    required: false,
                //    attributes: ['ID', 'refTransID', 'EmployeeID']
                // },
                {
                    model: User,
                    as: 'user',
                    attributes: ['employeeID'],
                    where: {
                        id: { [Op.col]: 'DynamicReportMst.createdBy' }
                    },
                    include: [{
                        model: Employee,
                        as: 'employee',
                        attributes: ['firstName', 'lastName']
                    }]
                }
                ]
            }).then((dynamicReportMstdet) => {
                if (!dynamicReportMstdet) {
                    // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(req.body.reportName ? req.body.reportName : MISReportModuleName)));
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(req.body.reportName ? req.body.reportName : MISReportModuleName), err: null, data: null });
                } else {
                    // return resHandler.successRes(res, 200, STATE.SUCCESS, { dynamicReportMstdet: dynamicReportMstdet });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicReportMstdet: dynamicReportMstdet }, null);
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

    // Retrive list all DynamicReport Names that allowed to access by employee and pinned to dashboard
    // GET : /api/v1/dynamicreportmst/getPinnedToDashboardMISReports
    // @return list all DynamicReportNames
    getPinnedToDashboardMISReports: (req, res) => {
        if (req.body.EmployeeID) {
            const { DynamicReportMst, DynamicReportAccess, ChartCategory } = req.app.locals.models;
            const whereStatement = {
                refTableName: COMMON.DBTableName.DynamicReportMst
            };
            if (req.body.isUserSuperAdmin) {
                whereStatement.deletedAt = null;
                // whereStatement = '1=1';
            } else {
                whereStatement.EmployeeID = req.body.EmployeeID;
            }

            return DynamicReportMst.findAll({
                where: {
                    isDeleted: false,
                    isPinToDashboard: true
                },
                attributes: ['ID', 'ReportName', 'chartCategoryID'],
                include: [
                    {
                        model: DynamicReportAccess,
                        as: 'dynamicReportAccess',
                        required: true,
                        attributes: ['ID', 'EmployeeID'],
                        where: whereStatement
                    },
                    {
                        model: ChartCategory,
                        as: 'chartCategory',
                        required: false,
                        attributes: ['id', 'name', 'order']
                    }
                ]
            }).then(dynamicReportMstlist =>
                // return resHandler.successRes(res, 200, STATE.SUCCESS, { pinnedReportList: dynamicReportMstlist });
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { pinnedReportList: dynamicReportMstlist }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // pin/unpin Mis ReportTo DashBoard
    // POST : /api/v1/dynamicreportmst/pinMisReportToDashBoard
    // @return new mis report details
    pinMisReportToDashBoard: (req, res) => {
        const { DynamicReportMst } = req.app.locals.models;
        if (req.body && req.body.ID) {
            if (req.body.ReportName) { req.body.ReportName = COMMON.TEXT_WORD_CAPITAL(req.body.ReportName, false); }
            return DynamicReportMst.count({
                where: {
                    ID: req.body.ID
                }
            }).then((count) => {
                if (count === 0) {
                    // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(MISReportModuleName + " " + req.body.ReportName)));
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(`${MISReportModuleName} ${req.body.ReportName}`), err: null, data: null });
                }

                const dynamicReportMstObj = {
                    isPinToDashboard: req.body.isPinToDashboard,
                    updatedBy: req.user.ID,
                    updatedAt: COMMON.getCurrentUTC()
                };

                return DynamicReportMst.update(dynamicReportMstObj, {
                    where: {
                        ID: req.body.ID
                    },
                    fields: ['isPinToDashboard', 'updatedBy', 'updatedAt']
                }).then(() => {
                    const messageContent = Object.assign({}, req.body.isPinToDashboard ? MESSAGE_CONSTANT.MASTER.REPORT_PIN_TO_DASHBOARD : MESSAGE_CONSTANT.MASTER.REPORT_UNPIN_FROM_DASHBOARD);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.ReportName);
                    // return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: COMMON.stringFormat(pinUnpinMessage, req.body.ReportName) });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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

    // check duplicate report name to create
    // POST : /api/v1/dynamicreportmst/checkDuplicateReportName
    // @return details if report name already exists or not
    checkDuplicateReportName: (req, res) => {
        if (req.body && req.body.ReportName) {
            const { DynamicReportMst } = req.app.locals.models;
            return DynamicReportMst.count({
                where: {
                    ReportName: req.body.ReportName,
                    ID: { [Op.ne]: req.body.ID }
                }
            }).then((count) => {
                if (count > 0) {
                    // return resHandler.successRes(res, 200, STATE.EMPTY, { isDuplicateReportName: true });
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateReportName: true } });
                }
                // return resHandler.successRes(res, 201, STATE.SUCCESS, { isDuplicateReportName: false });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateReportName: false }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // copy (create) new report from existing report
    // POST : /api/v1/dynamicreportmst/copyMISReportFromExistingReport
    // @return details of newly created report
    copyMISReportFromExistingReport: (req, res) => {
        if (req.body && req.body.copyFromDynamicReportMstID) {
            const { sequelize } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_CopyMISReportFromExistingReport (:pfromDynamicReportMstID,:ploginUserID,:ploginUserRoleID)',
                    {
                        replacements:
                        {
                            pfromDynamicReportMstID: req.body.copyFromDynamicReportMstID,
                            ploginUserID: req.user.id,
                            ploginUserRoleID: COMMON.getRequestUserLoginRoleID(req)
                        }
                    }).then((respOfCopyReportSp) => {
                        if (respOfCopyReportSp && respOfCopyReportSp[0] && respOfCopyReportSp[0].ID) {
                            return resHandler.successRes(res, 201, STATE.SUCCESS, {
                                userMessage: MESSAGE_CONSTANT.CREATED(`${MISReportModuleName}: ${respOfCopyReportSp[0].ReportName}`),
                                createdReportDet: respOfCopyReportSp[0]
                            });
                        } else {
                            // return resHandler.errorRes(res, 200, STATE.FAILED, new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG));
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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
