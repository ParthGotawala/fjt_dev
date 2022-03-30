
const _ = require('lodash');
const { Op } = require('sequelize');
var Excel = require('exceljs');
var MySQLAdapter = require('./../../constant/mySqlAdapter');

var dataResponse;
// Method use for retrieve record using 'MYSQL Adapter'
function onProcess(result) {
    dataResponse.end(JSON.stringify(result));
}

Excel.config.setValue('promise', require('bluebird'));
const mkdirp = require('mkdirp');
const fs = require('fs');
// const config = require('./../../../config/config');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
// const jsreport = require('jsreport-core')({
//    logger: {
//        silent: false // when true, it will silence all transports defined in logger
//    },
//    templatingEngines: {
//        numberOfWorkers: 2,
//        strategy: "in-process",
//        templateCache: {
//            max: 100, //LRU cache with max 100 entries, see npm lru-cache for other options
//            enabled: true //disable cache
//        }
//    },
const uuidv1 = require('uuid/v1');
// const Stimulsoft = require('stimulsoft-reports-js');
// // Font rendering on load report using NodeJs
// Stimulsoft.Base.StiFontCollection.addOpentypeFontFile('assets/stimulsoft/Roboto-Black.ttf');

const btoa = require('btoa');
// });
// jsreport.use(require('jsreport-assets')({
//    searchOnDiskIfNotFoundInStore: true,
//    allowedFiles: '**/*.*'
// }))
// jsreport.use(require('jsreport-phantom-pdf')());
// jsreport.use(require('jsreport-jsrender')());
// jsreport.use(require('jsreport-chrome-pdf')());
// jsreport.use(require('jsreport-handlebars')());
// jsreport.use(require('jsreport-pdf-utils')());
// jsreport.use(require('jsreport-templates')());
// jsreport.init();
// const QRCode = require('qrcode');
// const jsrender = require('jsrender');
// const printWoOpDetObj = DATA_CONSTANT.TIMLINE.PRINT_WORKORDER_OPERATION_DETAILS;
// const timelineObjForPrintWoOpDet = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.PRINT_WORKORDER_OPERATION_DETAILS;
// const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;

const reportModuleName = DATA_CONSTANT.REPORT.NAME;
const dynamicReportModuleName = DATA_CONSTANT.DYNAMIC_REPORT.NAME;
const templateModuleName = DATA_CONSTANT.DYNAMIC_REPORT.TEMPLATE.NAME;
const licenseModuleName = DATA_CONSTANT.LICENSE_INFO.NAME;
const reportParameterSettings = DATA_CONSTANT.REPORT_PARAMETER_SETTING_MAPPING.NAME;

const inputFields = [
    'id',
    'reportName',
    'rdlcReportFileName',
    'reportTitle',
    'customerID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'partID',
    'companyID',
    'fromDate',
    'toDate',
    'customerSelectType',
    'withAlternateParts',
    'partSelectType',
    'employeeID',
    'employeeSelectType',
    'supplierID',
    'supplierSelectType',
    'mfgCodeID',
    'mfgCodeSelectType',
    'assyID',
    'assySelectType',
    'mountingTypeID',
    'mountingTypeSelectType',
    'functionalTypeID',
    'functionalTypeSelectType',
    'partStatusID',
    'partStatusSelectType',
    'workorderID',
    'workorderSelectType',
    'operationID',
    'operationSelectType',
    'reportCategoryId',
    'reportViewType',
    'reportAPI',
    'isExcel',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'fromTime',
    'toTime',
    'fileName',
    'draftFileName',
    'isEndUserReport',
    'additionalNotes',
    'radioButtonFilter',
    'isCSVReport',
    'csvReportAPI',
    'refReportId',
    'status',
    'entityId',
    'editingBy',
    'startDesigningDate',
    'reportGenerationType',
    'reportVersion',
    'isDefaultReport'
];

const inputFieldsScheduleMst = [
    'id',
    'reportID',
    'entity',
    'customerID',
    'schedule',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'IsActive',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const inputFieldsReportMasterParameter = [
    'id',
    'reportId',
    'parmeterMappingid',
    'isRequired',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'createdAt',
    'updatedAt',
    'deletedAt'
];


module.exports = {
    // Retrive list of Reports
    // GET : /api/v1/reportmaster/retriveReportList
    // @return list of Reports
    retriveReportList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveReportList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pIsDynamicReport,:pIsPublishReport,:pIsTemplateReport)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pIsDynamicReport: req.body.isDynamicReport ? req.body.isDynamicReport : false,
                    pIsPublishReport: req.body.isPublishReport ? req.body.isPublishReport : false,
                    pIsTemplateReport: req.body.isTemplateReport ? req.body.isTemplateReport : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { Reports: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    /* Comment by BT - 20-05-2021 - Update RDLC Parameter flow so have to update Method. */
    // Retrive list of Reports
    // GET : /api/v1/reportmaster/retriveReportById
    // @return list of Reports
    retriveReportById: (req, res) => {
        const { ReportMaster } = req.app.locals.models;
        if (req.params.id) {
            return ReportMaster.findOne({
                where: { id: req.params.id },
                attributes: inputFields
            }).then(report => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, report, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    /* New Method for RDLC parameter - 20-05-2021 */
    // Retrive list of Reports
    // GET : /api/v1/reportmaster/retriveReportById
    // @return list of Reports
    // retriveReportById: (req, res) => {
    //     const { ReportMaster, ReportMasterParameter, ReportParameterSettingMapping } = req.app.locals.models;
    //     if (req.params.id) {
    //         return ReportMaster.findOne({
    //             where: { id: req.params.id },
    //             attributes: inputFields,
    //             include: [{
    //                 model: ReportMasterParameter,
    //                 as: 'ReportMasterParameter',
    //                 attributes: ['id', 'reportId', 'parmeterMappingid','isRequired'],
    //                 required: false,
    //                 include: [{
    //                     model: ReportParameterSettingMapping,
    //                     as: 'ReportParameterSettingMapping',
    //                     attributes: ['id', 'dbColumnName', 'displayName'],
    //                     required: false
    //                 }]
    //             }]
    //         }).then(report => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, report, null)).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },
    // Create Report
    // POST : /api/v1/assyType/createReport
    // @return created or updated Report
    saveReport: (req, res) => {
        var fieldName = DATA_CONSTANT.DYNAMIC_REPORT.REPORT_NAME;
        const { sequelize, ReportMaster } = req.app.locals.models;
        if (req.body) {
            if (req.body.reportName) { req.body.reportName = COMMON.TEXT_WORD_CAPITAL(req.body.reportName, false); }

            return module.exports.checkNameUnique(req).then((response) => {
                if (response) {
                    if (response && response.STATE === STATE.FAILED) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                            { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: response.err, data: null });
                    }
                    // Update
                    if (req.body.id) {
                        COMMON.setModelUpdatedByFieldValue(req);
                        return ReportMaster.update(req.body, {
                            where: {
                                id: req.body.id
                            },
                            fields: inputFields
                        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(dynamicReportModuleName)))
                            .catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                    } else {
                        // Create
                        const whereClause = {};

                        whereClause.id = (req.body.reportCreateType === DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CREATE_TYPE.CreateNew) ?
                            req.body.templateId : req.body.refReportId;

                        if (req.body.refReportId) {
                            whereClause.fileName = { [Op.ne]: null };
                        } else {
                            whereClause.reportGenerationType = { [Op.eq]: DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CATEGORY.TEMPLATE_REPORT };
                        }

                        return ReportMaster.findOne({
                            where: whereClause
                        }).then((reportTemplateDetail) => {
                            var moduleName = (req.body.reportCreateType === DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CREATE_TYPE.CreateNew) ?
                                templateModuleName : reportModuleName;
                            if (!reportTemplateDetail) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
                            }

                            const filePath = (req.body.reportCreateType === DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CREATE_TYPE.CreateNew) ? DATA_CONSTANT.DYNAMIC_REPORT.TEMPLATE_FILE_PATH :
                                (reportTemplateDetail.isEndUserReport ? DATA_CONSTANT.DYNAMIC_REPORT.END_USER_REPORT_FILE_PATH :
                                    DATA_CONSTANT.DYNAMIC_REPORT.SYSTEM_REPORT_FILE_PATH);

                            const fileLocationPath = filePath + reportTemplateDetail.fileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION;

                            if (!fs.existsSync(fileLocationPath)) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
                            }
                            const addReportObj = Object.assign({}, reportTemplateDetail.dataValues);
                            delete addReportObj.id;

                            addReportObj.reportName = req.body.reportName;
                            addReportObj.rdlcReportFileName = req.body.reportName;
                            addReportObj.isEndUserReport = true;
                            addReportObj.fileName = uuidv1();
                            addReportObj.refReportId = req.body.templateId ? null : req.body.refReportId;
                            addReportObj.entityId = req.body.templateId ? req.body.entityId : reportTemplateDetail.entityId;
                            addReportObj.reportViewType = req.body.reportType;
                            addReportObj.status = DATA_CONSTANT.DYNAMIC_REPORT.REPORT_STATUS.DRAFT;
                            addReportObj.reportGenerationType = DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CATEGORY.END_USER_REPORT;

                            COMMON.setModelCreatedByFieldValue(addReportObj);

                            return sequelize.transaction().then(t => ReportMaster.create(addReportObj, {
                                fields: inputFields,
                                transaction: t
                            }).then((reportDetail) => {
                                // Creating new report
                                var endUserReportPath = DATA_CONSTANT.DYNAMIC_REPORT.END_USER_REPORT_FILE_PATH;
                                mkdirp(endUserReportPath, () => { });

                                const fileNameWithName = endUserReportPath + reportDetail.fileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION;

                                // Copying the file to a the same name
                                fs.copyFile(fileLocationPath, fileNameWithName, (err) => {
                                    if (err) {
                                        if (!t.finished) t.rollback();
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    } else {
                                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportDetail, MESSAGE_CONSTANT.CREATED(dynamicReportModuleName)));
                                    }
                                });
                            }).catch((err) => {
                                if (!t.finished) t.rollback();
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }
                } else {
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
    },
    // check Name Unique
    // POST : /api/v1/reportmaster/checkNameUnique
    // @return API response
    checkNameUnique: (req, res) => {
        const { ReportMaster } = req.app.locals.models;
        var fieldName = DATA_CONSTANT.DYNAMIC_REPORT.REPORT_NAME;
        if (req.body) {
            const whereClause = {
                reportName: req.body.reportName
            };
            whereClause.reportGenerationType = { [Op.ne]: DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CATEGORY.TEMPLATE_REPORT };
            if (req.body.id) {
                whereClause.id = { [Op.ne]: req.body.id };
            }
            return ReportMaster.findAll({
                where: whereClause
            }).then((isExists) => {
                // In case use this method internally call not pass (res) details
                if (!res) {
                    return {
                        STATE: isExists.length > 0 ? STATE.FAILED : STATE.SUCCESS,
                        messageContent: isExists.length > 0 ? MESSAGE_CONSTANT.UNIQUE(fieldName) : null,
                        err: null
                    };
                } else {
                    if (isExists.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                if (!res) {
                    return {
                        STATE: STATE.FAILED,
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err
                    };
                }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Report
    // GET : /api/v1/reportmaster/getReportList
    // @return list of Report
    getReportList: (req, res) => {
        const { ReportMaster } = req.app.locals.models;
        ReportMaster.findAll({
            where: {
                isDeleted: false
            },
            attributes: ['id', 'reportName']
        }).then(reportlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportlist, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors, data: null });
        });
    },
    // Retrive Customer/Report list
    // GET : /api/v1/reportmaster/retriveCustomerReport
    // @return list of customer report list
    retriveCustomerReport: (req, res) => {
        if (req.query.id) {
            const { EmailScheduleMst, EmailAddressDetail } = req.app.locals.models;
            return EmailScheduleMst.findOne({
                where: { id: req.query.id },
                attributes: inputFieldsScheduleMst,
                include: [{
                    model: EmailAddressDetail,
                    as: 'EmailAddressDetail',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'refID', 'refEmailID'],
                    required: false
                }]
            }).then(report => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, report, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive Customer/Report list
    // POST : /api/v1/reportmaster/retriveCustomerReportList
    // @return list of customer report list
    retriveCustomerReportList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveCustomerReportList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pcustomerID,:preportID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pcustomerID: req.body.customerID ? req.body.customerID : null,
                    preportID: req.body.reportID ? req.body.reportID : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { EmailSettings: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // save  Customer/Report
    // GET : /api/v1/reportmaster/saveCustomerReport
    // @return save report detail
    saveCustomerReport: (req, res) => {
        const { EmailScheduleMst, EmailAddressDetail, sequelize } = req.app.locals.models;
        if (req.body) {
            const emailScheduleObj = req.body.emailScheduleObj;
            return EmailScheduleMst.findOne({
                where: {
                    reportID: emailScheduleObj.reportID,
                    customerID: emailScheduleObj.customerID,
                    isDeleted: false
                }
            }).then((isExist) => {
                if (isExist) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMAIL_DUPLICATE_REPORT_SETTING, err: null, data: null });
                } else {
                    const emailSchedule = {
                        reportID: emailScheduleObj.reportID,
                        entity: emailScheduleObj.entity,
                        customerID: emailScheduleObj.customerID,
                        schedule: emailScheduleObj.schedule,
                        IsActive: emailScheduleObj.IsActive,
                        createdBy: req.user.id,
                        updatedBy: req.user.id
                    };
                    return sequelize.transaction().then((t) => {
                        EmailScheduleMst.create(emailSchedule, {
                            fields: inputFieldsScheduleMst,
                            transaction: t
                        }).then((report) => {
                            if (report) {
                                const duplicate = _(emailScheduleObj.addedPersons).groupBy('refEmailID').pickBy(x => x.length > 1).keys()
                                    .value();
                                if (duplicate && duplicate.length > 0) {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMAIL_DUPLICATE_RECIPIENT, err: null, data: null });
                                } else {
                                    _.each(emailScheduleObj.addedPersons, (emailschedule) => {
                                        emailschedule.refID = report.id;
                                        emailschedule.createdBy = req.user.id;
                                        emailschedule.updatedBy = req.user.id;
                                    });

                                    return EmailAddressDetail.bulkCreate(emailScheduleObj.addedPersons, {
                                        fields: ['refID', 'refEmailID', 'createdBy', 'updatedBy'],
                                        transaction: t
                                    }).then(() => {
                                        t.commit();
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.SAVED(reportModuleName));
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                }
                            } else {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMAIL_DUPLICATE_RECIPIENT, err: null, data: null });
                            }
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
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
    },
    // update  Customer/Report
    // GET : /api/v1/reportmaster/updateCustomerReport
    // @return update  report detail
    updateCustomerReport: (req, res) => {
        const { EmailScheduleMst, EmailAddressDetail, sequelize } = req.app.locals.models;
        if (req.body) {
            const emailScheduleObj = req.body.emailScheduleObj;
            return EmailScheduleMst.findOne({
                where: {
                    reportID: emailScheduleObj.reportID,
                    customerID: emailScheduleObj.customerID,
                    isDeleted: false,
                    id: {
                        [Op.ne]: emailScheduleObj.id
                    }
                }
            }).then((isExist) => {
                if (isExist) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMAIL_DUPLICATE_REPORT_SETTING, err: null, data: null });
                } else {
                    const emailSchedule = {
                        reportID: emailScheduleObj.reportID,
                        entity: emailScheduleObj.entity,
                        customerID: emailScheduleObj.customerID,
                        schedule: emailScheduleObj.schedule,
                        IsActive: emailScheduleObj.IsActive,
                        updatedBy: COMMON.getRequestUserID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    return sequelize.transaction().then((t) => {
                        EmailScheduleMst.update(emailSchedule, {
                            where: {
                                id: emailScheduleObj.id,
                                isDeleted: false
                            },
                            transaction: t,
                            fields: ['reportID', 'entity', 'customerID', 'schedule', 'updatedBy', 'IsActive', 'updateByRoleId']
                        }).then((report) => {
                            if (report) {
                                const duplicate = _(emailScheduleObj.addedPersons).groupBy('refEmailID').pickBy(x => x.length > 1).keys()
                                    .value();
                                if (duplicate && duplicate.length > 0) {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMAIL_DUPLICATE_RECIPIENT, err: null, data: null });
                                } else {
                                    const emailpromise = [];
                                    _.each(emailScheduleObj.deletedPersons, (emailschedule) => {
                                        emailSchedule.deletedBy = COMMON.getRequestUserID(req);
                                        emailSchedule.deletedAt = COMMON.getCurrentUTC();
                                        emailSchedule.deleteByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                        emailschedule.isDeleted = true;
                                        emailpromise.push(EmailAddressDetail.update(emailschedule, {
                                            where: {
                                                id: emailschedule.id,
                                                isDeleted: false
                                            },
                                            fields: ['deletedBy', 'deletedAt', 'deleteByRoleId', 'isDeleted'],
                                            transaction: t
                                        }).then(() => ({
                                            status: STATE.SUCCESS
                                        })).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return {
                                                status: STATE.FAILED
                                            };
                                        }));
                                    });
                                    _.each(emailScheduleObj.addedPersons, (emailschedule) => {
                                        emailschedule.refID = emailScheduleObj.id;
                                        emailschedule.createdBy = COMMON.getRequestUserID(req);
                                        emailschedule.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                        emailschedule.updatedBy = COMMON.getRequestUserID(req);
                                        emailschedule.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                        emailpromise.push(
                                            EmailAddressDetail.findOne({
                                                where: {
                                                    refID: emailScheduleObj.id,
                                                    isDeleted: false,
                                                    refEmailID: emailschedule.refEmailID
                                                },
                                                transaction: t
                                            }).then((isExistEmailAddress) => {
                                                if (isExistEmailAddress) {
                                                    if (!t.finished) { t.rollback(); }
                                                    return {
                                                        status: STATE.FAILED,
                                                        message: MESSAGE_CONSTANT.MASTER.EMAIL_DUPLICATE_RECIPIENT
                                                    };
                                                } else {
                                                    return EmailAddressDetail.create(emailschedule, {
                                                        fields: ['refID', 'refEmailID', 'createdBy', 'updatedBy', 'createByRoleId', 'updateByRoleId'],
                                                        transaction: t
                                                    }).then(() => ({
                                                        status: STATE.SUCCESS
                                                    })).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        return {
                                                            status: STATE.FAILED
                                                        };
                                                    });
                                                }
                                            }).catch((err) => {
                                                if (!t.finished) { t.rollback(); }
                                                console.trace();
                                                console.error(err);
                                                return {
                                                    status: STATE.FAILED
                                                };
                                            })
                                        );
                                    });

                                    return Promise.all(emailpromise).then((responses) => {
                                        var data = _.find(responses, status => status.status === STATE.FAILED);
                                        if (data) {
                                            if (!t.finished) { t.rollback(); }
                                            if (data.message) {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: data.message, err: null, data: null });
                                            } else {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(reportModuleName), err: null, data: null });
                                            }
                                        } else {
                                            t.commit();
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(reportModuleName));
                                        }
                                    });
                                }
                            } else {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMAIL_DUPLICATE_RECIPIENT, err: null, data: null });
                            }
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
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
    },
    // delete  Customer/Report
    // GET : /api/v1/reportmaster/deleteCustomerReport
    // @return delete customer report
    deleteCustomerReport: (req, res) => {
        const {
            EmailScheduleMst
        } = req.app.locals.models;
        if (req.body.listObj.id) {
            COMMON.setModelDeletedByFieldValue(req);
            const objReport = {
                isDeleted: true,
                deletedBy: COMMON.getRequestUserID(req),
                deletedAt: COMMON.getCurrentUTC(),
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            EmailScheduleMst.update(objReport, {
                where: {
                    id: {
                        [Op.in]: req.body.listObj.id
                    },
                    isDeleted: false
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(reportModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    /* Comment By BT on 11-03-2021 (now user can not edit category on ui so.)*/
    // update  Customer/Report
    // GET : /api/v1/reportmaster/updateReportCategory
    // @return update  report detail
    // updateReportCategory: (req, res) => {
    //     const { ReportMaster } = req.app.locals.models;
    //     if (req.body.id) {
    //         return ReportMaster.findOne({
    //             where: {
    //                 id: req.body.id
    //             }
    //         }).then((isExist) => {
    //             if (!isExist) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(reportModuleName), err: null, data: null });
    //             } else {
    //                 COMMON.setModelUpdatedByFieldValue(req);

    //                 return ReportMaster.update(req.body, {
    //                     where: {
    //                         id: req.body.id
    //                     },
    //                     fields: ['reportCategoryId', 'updatedAt', 'updatedBy', 'updateByRoleId']
    //                 }).then((report) => {
    //                     if (report) {
    //                         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(reportModuleName));
    //                     } else {
    //                         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.ERROR, null, MESSAGE_CONSTANT.NOT_UPDATED(reportModuleName));
    //                     }
    //                 }).catch((err) => {
    //                     console.trace();
    //                     console.error(err);
    //                     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
    //                 });
    //             }
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },
    // update  Customer/Report
    // GET : /api/v1/reportmaster/updateReportAdditionalNotes
    // @return update  report detail
    updateReportAdditionalNotes: (req, res) => {
        const { ReportMaster } = req.app.locals.models;
        if (req.body.id) {
            return ReportMaster.findOne({
                where: {
                    id: req.body.id
                }
            }).then((isExist) => {
                if (!isExist) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(reportModuleName), err: null, data: null });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return ReportMaster.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: ['additionalNotes', 'updatedAt', 'updatedBy', 'updateByRoleId']
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(reportModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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
    },
    // Retrive list of Employee Performance Report
    // GET : /api/v1/reportmaster/getEmployeePerformanceDetail
    // @return Emp performance report
    getEmployeePerformanceDetail: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetEmployeePerformanceReportDetail (:pStartDate,:pEndDate,:pwoID,:poPID,:pempID)', {
                replacements: {
                    pStartDate: req.body.pStartDate,
                    pEndDate: req.body.pEndDate,
                    pwoID: req.body.pwoID || null,
                    poPID: req.body.poPID || null,
                    pempID: req.body.pempID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { EmployeeDetails: _.values(response[0]), PauseResumelist: _.values(response[1]) }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of life cycle details of Assembly
    // POST : /api/v1/reportmaster/getAssyLifeCycleAnalysis
    // @return Assy Life Cycle Analysis
    getAssyLifeCycleAnalysis: (req, res) => {
        const { sequelize, RFQLineitemsAlternatepart, RFQLineItems, ComponentROHSAlternatePN, ComponentPartStatus, Component, RFQRoHS, MfgCodeMst, ComponentDataSheets, PartSubAssyRelationship } = req.app.locals.models;
        var partStatusWiseSummary = [];
        var partRoHSWiseSummary = [];
        var partMountingAndFunctionalTypeWiseSummary = [];
        var partMountingAndFunctionalTypeWiseSemiSummary = [];
        var VerticalAvailableReport = [];
        var HorizontalAvailableReport = [];
        var RiskAnalysisReport = [];
        if (req.body.assyID) {
            return sequelize.query('CALL Sproc_GetAssyLifeCycleDetails (:pPartID)', {
                replacements: {
                    pPartID: req.body.assyID
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                partStatusWiseSummary = _.values(response[0]);
                const totalqty = _.sumBy(partStatusWiseSummary, sum => sum.Qty);
                const partstatusSummary = [{
                    PartStatus: 'Total Part ',
                    qty: totalqty,
                    percentage: ((totalqty * 100) / (totalqty))
                }];

                _.each(partStatusWiseSummary, (item) => {
                    const obj = {
                        PartStatus: item.PartStatusName,
                        qty: item.Qty,
                        percentage: ((item.Qty * 100) / (totalqty))
                    };
                    partstatusSummary.push(obj);
                });
                partRoHSWiseSummary = _.values(response[1]);
                const totalRoshqty = _.sumBy(partRoHSWiseSummary, sum => sum.Qty);
                const partRohsstatusSummary = [{
                    PartStatus: 'Total Part ',
                    qty: totalqty,
                    percentage: ((totalqty * 100) / (totalqty))
                }];
                _.each(partRoHSWiseSummary, (item) => {
                    const obj = {
                        PartStatus: item.PartStatusName,
                        qty: item.Qty,
                        percentage: ((item.Qty * 100) / (totalRoshqty))
                    };
                    partRohsstatusSummary.push(obj);
                });
                partMountingAndFunctionalTypeWiseSummary = _.values(response[2]);
                partMountingAndFunctionalTypeWiseSemiSummary = _.values(response[3]);
                return PartSubAssyRelationship.findAll({
                    where: {
                        partID: req.body.assyID
                    },
                    model: PartSubAssyRelationship,
                    attributes: ['prPerPartID', 'level']
                }).then((asseblyList) => {
                    if (asseblyList && asseblyList.length > 0) {
                        const assyIds = _.map(asseblyList, data => data.prPerPartID);
                        return RFQLineitemsAlternatepart.findAll({
                            where: {
                                partID: {
                                    [Op.in]: assyIds
                                },
                                isDeleted: false
                            },
                            attributes: ['id', 'org_mfgCode', 'org_mfgPN', 'org_distributor', 'org_distPN', 'rfqLineItemsID', 'distributor', 'distPN', 'mfgCode', 'mfgPN', 'distMfgPNID', 'mfgPNID', 'description', 'partID'],
                            include: [{
                                model: Component,
                                as: 'mfgComponent',
                                where: {
                                    isDeleted: false
                                },
                                required: false,
                                attributes: ['id', 'mfgcodeID', 'mfgPN', 'PIDCode', 'mfgPNDescription', 'partStatus', 'RoHSStatusID', 'packaging', 'updatedAtApi', 'eolDate'],
                                include: [{
                                    model: MfgCodeMst,
                                    as: 'mfgCodemst',
                                    where: {
                                        isDeleted: false
                                    },
                                    attributes: ['id', 'mfgCode', 'mfgName'],
                                    required: false
                                }, {
                                    model: ComponentDataSheets,
                                    as: 'component_datasheets',
                                    where: {
                                        isDeleted: false
                                    },
                                    attributes: ['id', 'datasheetURL'],
                                    required: false
                                }, {
                                    model: RFQRoHS,
                                    as: 'rfq_rohsmst',
                                    where: {
                                        isDeleted: false
                                    },
                                    attributes: ['id', 'name', 'refMainCategoryID'],
                                    required: false
                                }, {
                                    model: ComponentPartStatus,
                                    as: 'componentPartStatus',
                                    where: {
                                        isDeleted: false
                                    },
                                    attributes: ['id', 'name'],
                                    required: false
                                }, {
                                    model: ComponentROHSAlternatePN,
                                    as: 'mfgPNRfqLineitemsRohsAlternatepn',
                                    where: {
                                        isDeleted: false
                                    },
                                    attributes: ['id'],
                                    required: false
                                }]
                            },
                            {
                                model: RFQLineItems,
                                as: 'rfqLineItems',
                                where: {
                                    isDeleted: false
                                },
                                required: false,
                                attributes: ['id', 'lineID', 'qpa', 'customerDescription', 'description', 'refDesig', 'org_lineID', 'org_qpa', 'org_refDesig', 'org_custPN', 'org_customerRev']
                            }, {
                                model: Component,
                                as: 'component',
                                where: {
                                    isDeleted: false
                                },
                                required: false,
                                attributes: ['id', 'PIDCode', 'RoHSStatusID', 'rohsDeviation'],
                                include: [{
                                    model: RFQRoHS,
                                    as: 'rfq_rohsmst',
                                    where: {
                                        isDeleted: false
                                    },
                                    attributes: ['id', 'name', 'refMainCategoryID'],
                                    required: false
                                }]
                            }]
                        }).then((partDetails) => {
                            var assyBOMDEtails = [];
                            _.each(partDetails, (data) => {
                                assyBOMDEtails.push({
                                    AssyID: data.component.PIDCode,
                                    AssyRoHSDeviation: data.component.rohsDeviation ? data.component.rohsDeviation : DATA_CONSTANT.RoHSDeviationDet.Yes,
                                    AssyRoHSStatusID: data.component.RoHSStatusID,
                                    Item: data.rfqLineItems.lineID,
                                    UploadedCPN: data.rfqLineItems.org_custPN,
                                    UploadedCPNRev: data.rfqLineItems.org_customerRev,
                                    UploadedMFR: data.org_mfgCode,
                                    UploadedMFRPN: data.org_mfgPN,
                                    UploadedSupplier: data.org_dist,
                                    UploadedSupplierPN: data.org_distPN,
                                    UploadedDescription: data.rfqLineItems.customerDescription,
                                    UploadedDesignator: data.rfqLineItems.org_refDesig,
                                    MFR: data.mfgComponent && data.mfgComponent.mfgCodemst ? data.mfgComponent.mfgCodemst.mfgName : null,
                                    MFRPN: data.mfgComponent ? data.mfgComponent.mfgPN : null,
                                    PIDCode: data.mfgComponent ? data.mfgComponent.PIDCode : null,
                                    RoHSStatusID: data.mfgComponent ? data.mfgComponent.RoHSStatusID : null,
                                    Description: data.mfgComponent ? data.mfgComponent.mfgPNDescription : null,
                                    UpdatedAtApi: data.mfgComponent ? data.mfgComponent.updatedAtApi : null,
                                    MatchStatus: DATA_CONSTANT.ExportReportHeader.Exact,
                                    PartStatus: data.mfgComponent && data.mfgComponent.componentPartStatus ? data.mfgComponent.componentPartStatus.name : null,
                                    EOLDate: data.mfgComponent ? data.mfgComponent.eolDate : null,
                                    LifecycleRisk: null,
                                    RoHS: data.mfgComponent && data.mfgComponent.rfq_rohsmst ? data.mfgComponent.rfq_rohsmst.name : null,
                                    RoHSAlternative: data.mfgComponent && data.mfgComponent.mfgPNRfqLineitemsRohsAlternatepn && data.mfgComponent.mfgPNRfqLineitemsRohsAlternatepn.length > 0 ? 'Yes' : 'No',
                                    RoHSRisk: null,
                                    MultiSourceRisk: null,
                                    SupplierCount: 0,
                                    AvailabilityRisk: null,
                                    DatasheetURL: data.mfgComponent && data.mfgComponent.component_datasheets && data.mfgComponent.component_datasheets.length ? data.mfgComponent.component_datasheets[0].datasheetURL : null,
                                    PartID: data.mfgPNID
                                });
                            });
                            const partIDList = _.map(_.filter(assyBOMDEtails, item => item.PartID), 'PartID');
                            const mongodb = global.mongodb;
                            const myquery = { PartNumberId: { $in: partIDList }, IsDeleted: false, isPurchaseApi: { $ne: true } };
                            const promises = [
                                mongodb.collection('FJTMongoQtySupplier').find(myquery).toArray()
                            ];
                            return Promise.all(promises).then((responseDet) => {
                                var partList = _.values(responseDet[0]);
                                _.each(assyBOMDEtails, (data) => {
                                    if (data.PartID) {
                                        const supplierWiseDetails = _.groupBy(_.orderBy(_.filter(partList, { PartNumberId: data.PartID }), ['OrgInStock', 'asc']), 'SupplierName');
                                        if (supplierWiseDetails) {
                                            _.each(supplierWiseDetails, (supplierPart, supplier) => {
                                                var packaingWiseDetails = _.groupBy(supplierPart, 'Packaging');
                                                if (packaingWiseDetails) {
                                                    _.each(packaingWiseDetails, (packaingPart, packaging) => {
                                                        var verticalObj = _.clone(data);
                                                        var latestPart = _.head(_.sortBy(packaingPart, ['TimeStamp']).reverse());
                                                        verticalObj.packaging = packaging;
                                                        verticalObj.Distributor = supplier;
                                                        verticalObj.sku = latestPart.SupplierPN;
                                                        verticalObj.qty = latestPart.OrgInStock;
                                                        verticalObj.ProductUrl = latestPart.ProductUrl;
                                                        VerticalAvailableReport.push(verticalObj);
                                                    });
                                                } else {
                                                    const verticalObj = _.clone(data);
                                                    VerticalAvailableReport.push(verticalObj);
                                                }
                                            });
                                        } else {
                                            const verticalObj = _.clone(data);
                                            VerticalAvailableReport.push(verticalObj);
                                        }
                                        const RiskAnalysisObj = _.clone(data);
                                        if (RiskAnalysisObj) {
                                            RiskAnalysisObj.SupplierCount = _.size(supplierWiseDetails);
                                            if (RiskAnalysisObj.SupplierCount <= 1) {
                                                RiskAnalysisObj.MultiSourceRisk = DATA_CONSTANT.RiskType.HighRisk;
                                                RiskAnalysisObj.AvailabilityRisk = DATA_CONSTANT.RiskType.HighRisk;
                                            } else {
                                                RiskAnalysisObj.MultiSourceRisk = DATA_CONSTANT.RiskType.LowRisk;
                                                if (_.sumBy(_.filter(partList, { PartNumberId: data.PartID }), 'OrgInStock') > 0) {
                                                    RiskAnalysisObj.AvailabilityRisk = DATA_CONSTANT.RiskType.LowRisk;
                                                } else { RiskAnalysisObj.AvailabilityRisk = DATA_CONSTANT.RiskType.HighRisk; }
                                            }
                                            RiskAnalysisObj.LifecycleRisk = DATA_CONSTANT.RiskType.HighRisk;
                                            if (RiskAnalysisObj.PartStatus === DATA_CONSTANT.COMPONENT.PART_STATUS.ACTIVE) {
                                                RiskAnalysisObj.LifecycleRisk = DATA_CONSTANT.RiskType.LowRisk;
                                            }
                                            RiskAnalysisObj.RoHSRisk = DATA_CONSTANT.RiskType.LowRisk;
                                            if (RiskAnalysisObj.AssyRoHSDeviation === DATA_CONSTANT.RoHSDeviationDet.Yes && RiskAnalysisObj.AssyRoHSStatusID !== RiskAnalysisObj.RoHSStatusID) {
                                                RiskAnalysisObj.RoHSRisk = DATA_CONSTANT.RiskType.HighRisk;
                                            }
                                            RiskAnalysisReport.push(RiskAnalysisObj);
                                        }
                                    } else {
                                        const verticalObj = _.clone(data);
                                        VerticalAvailableReport.push(verticalObj);
                                    }
                                });
                                VerticalAvailableReport = _.sortBy(VerticalAvailableReport, ['Item']);
                                RiskAnalysisReport = _.sortBy(RiskAnalysisReport, ['Item']);
                                const vericalDataClone = _.clone(VerticalAvailableReport);
                                const itemWiseVerticalDataList = _.groupBy(vericalDataClone, 'Item');
                                _.each(itemWiseVerticalDataList, (itemWiseVerticalData, item) => {
                                    var partWiseVerticalDataList = _.groupBy(itemWiseVerticalData, 'PartID');
                                    _.each(partWiseVerticalDataList, (partWiseVerticalData, partId) => {
                                        var defaultObj = _.head(_.filter(assyBOMDEtails, data => ((data.Item && data.Item.toString() === item) && (data.PartID && data.PartID.toString() === partId))));

                                        var orderbyqty = _.sortBy(partWiseVerticalData, ['qty']).reverse();
                                        var distibutorOrder = [];
                                        // var distributorWiseDataList = _.groupBy(orderbyqty, 'Distributor');
                                        var maxRow = _.max(_.values(_.countBy(orderbyqty, 'Distributor')));
                                        for (let i = 0; i < maxRow; i += 1) {
                                            const cloneObj = _.clone(defaultObj);
                                            HorizontalAvailableReport.push(cloneObj);
                                        }
                                        _.each(orderbyqty, (details) => {
                                            if (!_.includes(distibutorOrder, details.Distributor)) {
                                                distibutorOrder.push(details.Distributor);
                                            }
                                            const distIndex = _.indexOf(distibutorOrder, details.Distributor) + 1;
                                            if (distIndex > 0 && HorizontalAvailableReport && HorizontalAvailableReport.length) {
                                                if (distIndex === 1) {
                                                    const obj = _.find(HorizontalAvailableReport, data => data && !data['MostInventory'] && (data.Item && data.Item.toString() === item) && (data.PartID && data.PartID.toString() === partId));
                                                    if (obj) {
                                                        const detailsText = (`${details.Distributor} [${details.qty}] ${details.packaging != null && details.packaging !== '' && details.packaging.toString() !== 'null' ? `(${details.packaging})` : ''}`);
                                                        obj['MostInventory'] = details.ProductUrl ? { text: detailsText, hyperlink: details.ProductUrl, tooltip: details.ProductUrl } : detailsText;
                                                    }
                                                } else {
                                                    const obj = _.find(HorizontalAvailableReport, data => data && !data[`Inventory${distIndex}`] && (data.Item && data.Item.toString() === item) && (data.PartID && data.PartID.toString() === partId));
                                                    if (obj) {
                                                        const detailsText = (`${details.Distributor} [${details.qty}] ${details.packaging != null && details.packaging !== '' && details.packaging.toString() !== 'null' ? `(${details.packaging})` : ''}`);
                                                        obj[`Inventory${distIndex}`] = details.ProductUrl ? { text: detailsText, hyperlink: details.ProductUrl, tooltip: details.ProductUrl } : detailsText;
                                                    }
                                                }
                                            }
                                        });
                                    });
                                });
                                // HorizontalAvailableReport = _.orderBy(HorizontalAvailableReport, ['Item', 'asc']);
                                // VerticalAvailableReport = _.map(VerticalAvailableReport, function(VerticalAvailable) {
                                //     return _.omit(VerticalAvailable, function(value, key) {
                                //         return key == "PartID";
                                //     });
                                // });
                                const workbook1 = new Excel.Workbook();
                                const restrictColumnName = ['PartID', 'UpdatedAtApi', 'PartStatus', 'RoHS', 'EOLDate', 'UploadedCPN', 'UploadedCPNRev', 'RoHSAlternative', 'UploadedSupplier', 'UploadedMFR',
                                    'AssyRoHSDeviation', 'AssyRoHSStatusID', 'RoHSStatusID', 'SupplierCount', 'MultiSourceRisk', 'AvailabilityRisk', 'LifecycleRisk', 'RoHSRisk'];
                                if (HorizontalAvailableReport.length > 0) {
                                    const sheet1 = workbook1.addWorksheet('Horizontal Availablility');
                                    sheet1.columns = [];
                                    let columns = [];
                                    _.each(HorizontalAvailableReport, (resobj) => {
                                        if (resobj) {
                                            let keys = [];
                                            keys = Object.keys(resobj);
                                            _.each(keys, (key) => {
                                                if (!_.includes(restrictColumnName, key)) {
                                                    // if (key != 'PartID' && key != 'UpdatedAtApi' && key != 'PartStatus' && key != 'RoHS' && key != 'EOLDate' && key != 'UploadedCPN' && key != 'UploadedCPNRev' && key != 'RoHSAlternative' && key != 'AssyRoHSDeviation') {
                                                    let header = key;
                                                    let width = 20;
                                                    if (key === 'Item') {
                                                        width = 6;
                                                    }
                                                    if (key === 'UploadedMFRPN') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedMFRPN;
                                                        width = 23;
                                                    }
                                                    if (key === 'UploadedSupplierPN') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedSupplierPN;
                                                        width = 18;
                                                    }
                                                    if (key === 'UploadedDescription') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedDescription;
                                                        width = 21;
                                                    }
                                                    if (key === 'UploadedDesignator') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedDesignator;
                                                        width = 20;
                                                    }
                                                    if (key === 'MFRPN') {
                                                        header = DATA_CONSTANT.ExportReportHeader.MFRPN;
                                                        width = 23;
                                                    }
                                                    if (key === 'MatchStatus') {
                                                        header = DATA_CONSTANT.ExportReportHeader.MatchStatus;
                                                        width = 12;
                                                    }
                                                    if (key === 'DatasheetURL') {
                                                        header = DATA_CONSTANT.ExportReportHeader.DatasheetURL;
                                                        width = 16;
                                                    }
                                                    const obj = { header: header, key: key, width: width };
                                                    columns.push(obj);
                                                }
                                            });
                                        }
                                    });
                                    columns = _.uniqBy(columns, e => e.header);
                                    sheet1.columns = columns;
                                    _.each(HorizontalAvailableReport, (item) => {
                                        sheet1.addRow(item);
                                    });
                                    /* eslint-disable no-underscore-dangle */
                                    sheet1.eachRow((row, rowNumber) => {
                                        if (rowNumber > 1) {
                                            row.eachCell((cell, colNumber) => {
                                                if (cell.value && cell._column._key === 'DatasheetURL') {
                                                    row.getCell(colNumber).font = { color: { argb: '004e47cc' } };
                                                    row.getCell(colNumber).value = { text: 'Link to Datasheet', hyperlink: row.getCell(colNumber).value, tooltip: row.getCell(colNumber).value };
                                                }
                                                if (cell.value && cell._column._key.includes('Inventory')) {
                                                    row.getCell(colNumber).font = { color: { argb: '004e47cc' } };
                                                }
                                                row.getCell(colNumber).alignment = { wrapText: true };
                                            });
                                        } else {
                                            row.eachCell((cell, colNumber) => {
                                                row.getCell(colNumber).fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: '00FF00' }
                                                };
                                            });
                                        }
                                    });
                                }
                                if (VerticalAvailableReport.length > 0) {
                                    const sheet1 = workbook1.addWorksheet('Vertical Available');
                                    sheet1.columns = [];
                                    let columns = [];
                                    _.each(VerticalAvailableReport, (resobj) => {
                                        let keys = [];
                                        keys = Object.keys(resobj);
                                        _.each(keys, (key) => {
                                            if (!_.includes(restrictColumnName, key)) {
                                                let header = key;
                                                let width = 20;
                                                if (key === 'Item') {
                                                    width = 6;
                                                }
                                                if (key === 'UploadedMFRPN') {
                                                    header = DATA_CONSTANT.ExportReportHeader.UploadedMFRPN;
                                                    width = 23;
                                                }
                                                if (key === 'UploadedSupplierPN') {
                                                    header = DATA_CONSTANT.ExportReportHeader.UploadedSupplierPN;
                                                    width = 18;
                                                }
                                                if (key === 'UploadedDescription') {
                                                    header = DATA_CONSTANT.ExportReportHeader.UploadedDescription;
                                                    width = 21;
                                                }
                                                if (key === 'UploadedDesignator') {
                                                    header = DATA_CONSTANT.ExportReportHeader.UploadedDesignator;
                                                    width = 20;
                                                }
                                                if (key === 'MFRPN') {
                                                    header = DATA_CONSTANT.ExportReportHeader.MFRPN;
                                                    width = 23;
                                                }
                                                if (key === 'MatchStatus') {
                                                    header = DATA_CONSTANT.ExportReportHeader.MatchStatus;
                                                    width = 12;
                                                }
                                                if (key === 'DatasheetURL') {
                                                    header = DATA_CONSTANT.ExportReportHeader.DatasheetURL;
                                                    width = 16;
                                                }
                                                if (key === 'packaging') {
                                                    header = DATA_CONSTANT.ExportReportHeader.Packaging;
                                                    width = 16;
                                                }
                                                if (key === 'Distributor') {
                                                    header = DATA_CONSTANT.ExportReportHeader.Distributor;
                                                    width = 9;
                                                }
                                                if (key === 'sku') {
                                                    header = DATA_CONSTANT.ExportReportHeader.SKU;
                                                    width = 25;
                                                }
                                                if (key === 'qty') {
                                                    header = DATA_CONSTANT.ExportReportHeader.Qty;
                                                    width = 8;
                                                }
                                                if (key === 'ProductUrl') {
                                                    header = DATA_CONSTANT.ExportReportHeader.BuyNow;
                                                    width = 9;
                                                }
                                                const obj = { header: header, key: key, width: width, wrapText: true };
                                                columns.push(obj);
                                            }
                                        });
                                    });
                                    columns = _.uniqBy(columns, e => e.header);
                                    sheet1.columns = columns;
                                    _.each(VerticalAvailableReport, (item) => {
                                        sheet1.addRow(item);
                                    });
                                    sheet1.eachRow((row, rowNumber) => {
                                        if (rowNumber > 1) {
                                            row.eachCell((cell, colNumber) => {
                                                if (cell.value && (cell._column._key === 'DatasheetURL' || cell._column._key === 'ProductUrl')) {
                                                    row.getCell(colNumber).font = { color: { argb: '004e47cc' } };
                                                    if (cell._column._key === 'DatasheetURL') {
                                                        row.getCell(colNumber).value = { text: 'Link to Datasheet', hyperlink: row.getCell(colNumber).value, tooltip: row.getCell(colNumber).value };
                                                    } else {
                                                        row.getCell(colNumber).value = { text: 'Buy Now', hyperlink: row.getCell(colNumber).value, tooltip: row.getCell(colNumber).value };
                                                    }
                                                }
                                                row.getCell(colNumber).alignment = { wrapText: true };
                                            });
                                        } else {
                                            row.eachCell((cell, colNumber) => {
                                                row.getCell(colNumber).fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: '00FF00' }
                                                };
                                            });
                                        }
                                    });
                                }
                                if (partstatusSummary.length > 0) {
                                    const partStatusWiseSummarySheet = workbook1.addWorksheet('Part Status Summary');
                                    partStatusWiseSummarySheet.columns = [];
                                    let columns = [];
                                    _.each(partstatusSummary, (resobj) => {
                                        let keys = [];
                                        keys = Object.keys(resobj);
                                        _.each(keys, (key) => {
                                            var header = key;
                                            var width = 15;
                                            if (key === 'PartStatus') {
                                                header = DATA_CONSTANT.ExportReportHeader.Status;
                                                width = 18;
                                            }
                                            if (key === 'percentage') {
                                                header = DATA_CONSTANT.ExportReportHeader.Percentage;
                                                width = 14;
                                            }
                                            if (key === 'qty') {
                                                header = DATA_CONSTANT.ExportReportHeader.PartsCount;
                                                width = 12;
                                            }
                                            const obj = { header: header, key: key, width: width };
                                            columns.push(obj);
                                        });
                                    });
                                    columns = _.uniqBy(columns, e => e.header);
                                    partStatusWiseSummarySheet.columns = columns;
                                    _.each(partstatusSummary, (item) => {
                                        partStatusWiseSummarySheet.addRow(item);
                                    });
                                    partStatusWiseSummarySheet.eachRow((row, rowNumber) => {
                                        if (rowNumber === 1) {
                                            row.eachCell((cell, colNumber) => {
                                                row.getCell(colNumber).fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: '00FF00' }
                                                };
                                            });
                                        }
                                    });
                                }
                                if (partRohsstatusSummary.length > 0) {
                                    const partStatusWiseSummarySheet = workbook1.addWorksheet('Part RoHS Summary');
                                    partStatusWiseSummarySheet.columns = [];
                                    let columns = [];
                                    _.each(partRohsstatusSummary, (resobj) => {
                                        let keys = [];
                                        keys = Object.keys(resobj);
                                        _.each(keys, (key) => {
                                            var header = key;
                                            var width = 15;
                                            if (key === 'PartStatus') {
                                                header = DATA_CONSTANT.ExportReportHeader.Status;
                                                width = 18;
                                            }
                                            if (key === 'percentage') {
                                                header = DATA_CONSTANT.ExportReportHeader.Percentage;
                                                width = 14;
                                            }
                                            if (key === 'qty') {
                                                header = DATA_CONSTANT.ExportReportHeader.PartsCount;
                                                width = 12;
                                            }
                                            const obj = { header: header, key: key, width: width };
                                            columns.push(obj);
                                        });
                                    });
                                    columns = _.uniqBy(columns, e => e.header);
                                    partStatusWiseSummarySheet.columns = columns;
                                    _.each(partRohsstatusSummary, (item) => {
                                        partStatusWiseSummarySheet.addRow(item);
                                    });
                                    partStatusWiseSummarySheet.eachRow((row, rowNumber) => {
                                        if (rowNumber === 1) {
                                            row.eachCell((cell, colNumber) => {
                                                row.getCell(colNumber).fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: '00FF00' }
                                                };
                                            });
                                        }
                                    });
                                }
                                if (partMountingAndFunctionalTypeWiseSummary.length > 0) {
                                    const sheet1 = workbook1.addWorksheet('Part Category Summary');
                                    sheet1.columns = [];
                                    let columns = [];
                                    _.each(partMountingAndFunctionalTypeWiseSummary, (resobj) => {
                                        let keys = [];
                                        keys = Object.keys(resobj);
                                        _.each(keys, (key) => {
                                            var header = key;
                                            var width = 15;
                                            if (key === 'FunctionType') {
                                                header = DATA_CONSTANT.ExportReportHeader.FunctionType;
                                                width = 16;
                                            }
                                            if (key === 'MountingType') {
                                                header = DATA_CONSTANT.ExportReportHeader.MountingType;
                                                width = 16;
                                            }
                                            if (key === 'Qty') {
                                                header = DATA_CONSTANT.ExportReportHeader.PartsCount;
                                                width = 12;
                                            }
                                            const obj = { header: header, key: key, width: width };
                                            columns.push(obj);
                                        });
                                    });
                                    columns = _.uniqBy(columns, e => e.header);
                                    sheet1.columns = columns;
                                    _.each(partMountingAndFunctionalTypeWiseSummary, (item) => {
                                        sheet1.addRow(item);
                                    });
                                    sheet1.eachRow((row, rowNumber) => {
                                        if (rowNumber === 1) {
                                            row.eachCell((cell, colNumber) => {
                                                row.getCell(colNumber).fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: '00FF00' }
                                                };
                                            });
                                        }
                                    });
                                }
                                if (partMountingAndFunctionalTypeWiseSemiSummary.length > 0) {
                                    const sheet1 = workbook1.addWorksheet('Part Category Semi Summary');
                                    sheet1.columns = [];
                                    let columns = [];
                                    _.each(partMountingAndFunctionalTypeWiseSemiSummary, (resobj) => {
                                        let keys = [];
                                        keys = Object.keys(resobj);
                                        _.each(keys, (key) => {
                                            var header = key;
                                            var width = 15;
                                            if (key === 'FunctionType') {
                                                header = DATA_CONSTANT.ExportReportHeader.FunctionType;
                                                width = 16;
                                            }
                                            if (key === 'MountingType') {
                                                header = DATA_CONSTANT.ExportReportHeader.MountingType;
                                                width = 16;
                                            }
                                            if (key === 'functionalCategoryText') {
                                                header = DATA_CONSTANT.ExportReportHeader.FunctionalCategoryText;
                                                width = 19;
                                            }
                                            if (key === 'MountingTypeText') {
                                                header = DATA_CONSTANT.ExportReportHeader.MountingTypeText;
                                                width = 19;
                                            }
                                            if (key === 'Qty') {
                                                header = DATA_CONSTANT.ExportReportHeader.PartsCount;
                                                width = 12;
                                            }
                                            const obj = { header: header, key: key, width: width };
                                            columns.push(obj);
                                        });
                                    });
                                    columns = _.uniqBy(columns, e => e.header);
                                    sheet1.columns = columns;
                                    _.each(partMountingAndFunctionalTypeWiseSemiSummary, (item) => {
                                        sheet1.addRow(item);
                                    });
                                    sheet1.eachRow((row, rowNumber) => {
                                        if (rowNumber === 1) {
                                            row.eachCell((cell, colNumber) => {
                                                row.getCell(colNumber).fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: '00FF00' }
                                                };
                                            });
                                        }
                                    });
                                }
                                if (RiskAnalysisReport.length > 0) {
                                    const sheet1 = workbook1.addWorksheet('Risk Analysis');
                                    sheet1.columns = [];
                                    const restrictRiskColumnName = ['PartID', 'DatasheetURL', 'UploadedDesignator', 'UploadedSupplier', 'UploadedSupplierPN', 'AssyRoHSDeviation', 'AssyRoHSStatusID', 'RoHSStatusID'];
                                    let columns = [];
                                    _.each(RiskAnalysisReport, (resobj) => {
                                        if (resobj) {
                                            let keys = [];
                                            keys = Object.keys(resobj);
                                            _.each(keys, (key) => {
                                                if (!_.includes(restrictRiskColumnName, key)) {
                                                    let header = key;
                                                    let width = 20;
                                                    if (key === 'Item') {
                                                        width = 6;
                                                    }
                                                    if (key === 'UploadedCPN') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedCPN;
                                                        width = 23;
                                                    }
                                                    if (key === 'UploadedCPNRev') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedCPNRev;
                                                        width = 20;
                                                    }
                                                    if (key === 'UploadedMFR') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedMFR;
                                                        width = 18;
                                                    }
                                                    if (key === 'UploadedMFRPN') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedMFRPN;
                                                        width = 18;
                                                    }
                                                    if (key === 'PIDCode') {
                                                        header = DATA_CONSTANT.ExportReportHeader.PIDCode;
                                                        width = 18;
                                                    }
                                                    if (key === 'UploadedDescription') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UploadedDescription;
                                                        width = 21;
                                                    }
                                                    if (key === 'MFRPN') {
                                                        header = DATA_CONSTANT.ExportReportHeader.MFRPN;
                                                        width = 23;
                                                    }
                                                    if (key === 'Description') {
                                                        header = DATA_CONSTANT.ExportReportHeader.Description;
                                                        width = 20;
                                                    }
                                                    if (key === 'UpdatedAtApi') {
                                                        header = DATA_CONSTANT.ExportReportHeader.UpdatedAtApi;
                                                        width = 21;
                                                    }
                                                    if (key === 'PartStatus') {
                                                        header = DATA_CONSTANT.ExportReportHeader.LifeCycleStatus;
                                                        width = 16;
                                                    }
                                                    if (key === 'EOLDate') {
                                                        header = DATA_CONSTANT.ExportReportHeader.EOLDate;
                                                        width = 21;
                                                    }
                                                    if (key === 'LifecycleRisk') {
                                                        header = DATA_CONSTANT.ExportReportHeader.LifecycleRisk;
                                                        width = 16;
                                                    }
                                                    if (key === 'RoHS') {
                                                        header = DATA_CONSTANT.ExportReportHeader.RoHS;
                                                        width = 23;
                                                    }
                                                    if (key === 'RoHSAlternative') {
                                                        header = DATA_CONSTANT.ExportReportHeader.RoHSAlternative;
                                                        width = 20;
                                                    }
                                                    if (key === 'RoHSRisk') {
                                                        header = DATA_CONSTANT.ExportReportHeader.RoHSRisk;
                                                        width = 20;
                                                    }
                                                    if (key === 'SupplierCount') {
                                                        header = DATA_CONSTANT.ExportReportHeader.SupplierCount;
                                                        width = 20;
                                                    }
                                                    if (key === 'MultiSourceRisk') {
                                                        header = DATA_CONSTANT.ExportReportHeader.MultiSourceRisk;
                                                        width = 20;
                                                    }
                                                    if (key === 'AvailabilityRisk') {
                                                        header = DATA_CONSTANT.ExportReportHeader.AvailabilityRisk;
                                                        width = 20;
                                                    }

                                                    const obj = { header: header, key: key, width: width };
                                                    columns.push(obj);
                                                }
                                            });
                                        }
                                    });
                                    columns = _.uniqBy(columns, e => e.header);
                                    sheet1.columns = columns;
                                    _.each(RiskAnalysisReport, (item) => {
                                        sheet1.addRow(item);
                                    });
                                    sheet1.eachRow((row, rowNumber) => {
                                        if (rowNumber > 1) {
                                            row.eachCell((cell, colNumber) => {
                                                if (cell.value === DATA_CONSTANT.RiskType.LowRisk) {
                                                    row.getCell(colNumber).font = { color: { argb: '32900B' } };
                                                }
                                                if (cell.value === DATA_CONSTANT.RiskType.HighRisk) {
                                                    row.getCell(colNumber).font = { color: { argb: 'FF0F00' } };
                                                }
                                                row.getCell(colNumber).alignment = { wrapText: true };
                                            });
                                        } else {
                                            row.eachCell((cell, colNumber) => {
                                                row.getCell(colNumber).fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: '00FF00' }
                                                };
                                            });
                                        }
                                    });
                                }
                                const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
                                mkdirp(path, () => { });
                                const timespan = Date.now();
                                const filename = `${req.body.reportName}_${timespan}.xls`;
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
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(reportModuleName), err: null, data: null });
                    }
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
    // Retreive Company Client ID detail
    // GET : /api/v1/reportmaster/retrieveClientId
    // @return retrieve  Company Client ID detail
    retrieveClientId: (req, res) => {
        const { LicenseInfo } = req.app.locals.models;
        LicenseInfo.findOne().then((licenseDet) => {
            if (licenseDet && licenseDet.clientId) {
                const clientSecret = `${licenseDet.clientId}:${licenseDet.client_secret}`;
                const clientId = btoa(clientSecret);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, clientId, null);
            }
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(licenseModuleName), err: null, data: null });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Delete Country
    // DELETE : /api/v1/reportmaster/deleteReports
    // @param {countryId} int
    // @return API response
    deleteReports: (req, res) => {
        const { sequelize, ReportMaster, ReportMasterParameter } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const whereClause = {
                id: { [Op.in]: [req.body.objIDs.id.toString()] }
                // editingBy: { [Op.ne]: null }
            };
            // AS Per Flow we can not delete multiple reports.
            return ReportMaster.findOne({
                where: whereClause,
                attributes: ['reportName', 'id', 'isDefaultReport', 'entityId', 'isEndUserReport', 'editingBy', 'createdBy', [sequelize.fn('fun_getUserNameByID', sequelize.col('ReportMaster.createdBy')), 'createdByName']]
            }).then((reportDetail) => {
                if (reportDetail && !reportDetail.isEndUserReport) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.REPORT.SYSTEM_GENERATED_REPORTS_DELETE_NOT_ALLOWED);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                }
                if (reportDetail && reportDetail.createdBy !== COMMON.getLoginUserID()) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.REPORT.OTHER_USERS_REPORT_DELETE_NOT_ALLOWED);
                    messageContent.message = COMMON.stringFormat(messageContent.message, reportDetail.dataValues.createdByName);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                }
                if (reportDetail && reportDetail.editingBy) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.REPORT.DYNAMIC_REPORT_DELETE_MESSAGE);
                    messageContent.message = COMMON.stringFormat(messageContent.message, reportDetail.reportName);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                }
                return sequelize.transaction().then((t) => {
                    const tableName = COMMON.AllEntityIDS.REPORT_MASTER.Name;
                    return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                        replacements: {
                            tableName: tableName,
                            IDs: req.body.objIDs.id.toString(),
                            deletedBy: req.user.id,
                            entityID: null,
                            refrenceIDs: null,
                            countList: req.body.objIDs.CountList,
                            pRoleID: COMMON.getRequestUserLoginRoleID(req)
                        },
                        transaction: t
                    }).then((deleteReportDet) => {
                        if (deleteReportDet.length === 0) {
                            const promises = [];
                            if (reportDetail.isDefaultReport) {
                                promises.push(ReportMaster.findOne({
                                    where: {
                                        reportGenerationType: DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CATEGORY.SYSTEM_GENERATED_REPORT,
                                        entityId: reportDetail.entityId
                                    },
                                    attributes: ['id'],
                                    transaction: t
                                }).then((systemGeneratedReport) => {
                                    if (systemGeneratedReport && systemGeneratedReport.id) {
                                        const updateReportMaster = {};
                                        COMMON.setModelUpdatedByFieldValue(updateReportMaster);
                                        updateReportMaster.isDefaultReport = true;
                                        return ReportMaster.update(updateReportMaster, {
                                            where: {
                                                id: systemGeneratedReport.id
                                            },
                                            fields: ['isDefaultReport', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                            transaction: t
                                        });
                                    } else {
                                        return Promise.resolve(true);
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
                                }));
                            }

                            const updateReportMasterPrameter = {};
                            COMMON.setModelDeletedByFieldValue(updateReportMasterPrameter);
                            promises.push(ReportMasterParameter.update(updateReportMasterPrameter, {
                                where: {
                                    reportId: { [Op.in]: [req.body.objIDs.id.toString()] }
                                },
                                fields: ['isDeleted', 'deletedBy', 'deleteByRoleId', 'deletedAt'],
                                paranoid: false,
                                transaction: t
                            }));

                            return Promise.all(promises).then((result) => {
                                if (result && Array.isArray(result)) {
                                    const failedDetail = result.find(a => a && a.status === STATE.FAILED);
                                    if (failedDetail) {
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: failedDetail.messageContent ? failedDetail.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetail.err, data: null });
                                    }
                                    t.commit().then(() =>
                                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, deleteReportDet, MESSAGE_CONSTANT.DELETED(reportModuleName))
                                    ).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            t.commit().then(() =>
                                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: deleteReportDet, IDs: req.body.objIDs.id }, null)
                            ).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                if (!res) {
                    return {
                        STATE: STATE.FAILED,
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err
                    };
                }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // // Get Viewer Reports
    // // GET : /api/v1/reportmaster/getViewerReport
    // // @param {reportId} int
    // // @return API response
    // getViewerReport: (req, res) => {
    //     var reportId = req.query.reportId;
    //     if (reportId) {
    //         const { ReportMaster, ReportParameterSettingMapping } = req.app.locals.models;

    //         return ReportMaster.findOne({
    //             where: {
    //                 fileName: reportId
    //             },
    //             paranoid: false
    //         }).then((reportDetail) => {
    //             ReportParameterSettingMapping.findAll().then((parameterDetails) => {
    //                 if (reportDetail) {
    //                     const filterList = parameterDetails.filter(item => (reportDetail[item.dbColumnName] >= 1));

    //                     // Creating new report
    //                     const report = new Stimulsoft.Report.StiReport();
    //                     const endUserReportPath = reportDetail.isEndUserReport ? DATA_CONSTANT.DYNAMIC_REPORT.END_USER_REPORT_FILE_PATH :
    //                         DATA_CONSTANT.DYNAMIC_REPORT.SYSTEM_REPORT_FILE_PATH;

    //                     // Loading report template
    //                     report.loadFile(endUserReportPath + reportDetail.fileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION);

    //                     report.dictionary.databases.getByIndex(0).connectionString = DATA_CONSTANT.REPORT_DETAIL.REPORT_DB_CONNECTION;

    //                     // Manage Image URL for get it from currnet FJT API By replace domain
    //                     const getFileOverride = Stimulsoft.System.IO.File.getFile;
    //                     Stimulsoft.System.IO.File.getFile = (filePath, binary, contentType, headers) => {
    //                         var url = `${config.APIUrl}/`;
    //                         var path = filePath.replace(url, '');
    //                         return getFileOverride(path, binary, contentType, headers);
    //                     };

    //                     filterList.forEach((item) => {
    //                         if (req.body[item.dbColumnName]) {
    //                             report.setVariable(item.reportParamName, req.body[item.dbColumnName]);
    //                         }
    //                     });

    //                     // [S] - Default Parameter Configure
    //                     report.setVariable(DATA_CONSTANT.DYNAMIC_REPORT.DEFAULT_REPORT_PARAMETER.ReportTitle, reportDetail.reportName);
    //                     const rohsImagePath = (DATA_CONSTANT.ROHS.UPLOAD_PATH).slice(1);
    //                     report.setVariable(DATA_CONSTANT.DYNAMIC_REPORT.DEFAULT_REPORT_PARAMETER.ROHSImagePath, config.APIUrl + rohsImagePath);
    //                     report.setVariable(DATA_CONSTANT.DYNAMIC_REPORT.DEFAULT_REPORT_PARAMETER.AdditionalNotes, reportDetail.additionalNotes);
    //                     report.setVariable(DATA_CONSTANT.DYNAMIC_REPORT.DEFAULT_REPORT_PARAMETER.Employee, req.body.loginUserEmployeeID);
    //                     report.setVariable(DATA_CONSTANT.DYNAMIC_REPORT.DEFAULT_REPORT_PARAMETER.AssyPN, req.body.assyPN);
    //                     // report.setVariable(DATA_CONSTANT.DYNAMIC_REPORT.DEFAULT_REPORT_PARAMETER.WhereCluse, req.body.Para_WhereCluse || null);
    //                     // [E] - Default Parameter Configure

    //                     // Renreding report
    //                     try {
    //                         return report.renderAsync(() => {
    //                             // Saving rendered report to JSON string
    //                             var reportJson = report.saveDocumentToJsonString();
    //                             var reportJsonDet = { jsonObj: reportJson };

    //                             return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportJsonDet);
    //                         });
    //                     } catch (err) {
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                     }
    //                 } else {
    //                     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(dynamicReportModuleName), err: null, data: null });
    //                 }
    //             }).catch((err) => {
    //                 console.trace();
    //                 console.error(err);
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //             });
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
    //             } else {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //             }
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },
    // // retrive ECODFM detail Report
    // // POST: /api/v1/reportmaster/getECODFMDetailReport
    // // @return ECODFM detail report pdf
    // getECODFMDetailReport: (req, res) => {
    //    try {
    //        const { sequelize } = req.app.locals.models;
    //        let index = 0;
    //        let templateFilePath = './uploads/template/eco_dfm_report.html';
    //        let headertemplateFilePath = './uploads/template/common_header.html';
    //        let commonParam = null;
    //        let ecodfmDetail = null;
    //        let companyDetail = null;
    //        fs.readFile(templateFilePath, 'utf8', function (error, content) {
    //            var template = jsrender.templates(content);

    //            fs.readFile(headertemplateFilePath, 'utf8', function (error, headercontent) {
    //                // var headertemplate = jsrender.templates(headercontent);

    //                module.exports.getCommonReportParameter(req, res).then((response) => {
    //                    commonParam = response;
    //                })

    //                return sequelize.query("call Sproc_getECODFMReportDetail(:pCategoryType,:pFromDate,:pToDate,:pFinalStatus,:pWoID,:pAssyID,:pCustomerID)", {
    //                    replacements: {
    //                        pCategoryType: req.body.ECODFMRequestType,
    //                        pFromDate: req.body.fromdate || null,
    //                        pToDate: req.body.todate || null,
    //                        pFinalStatus: req.body.FinalStatus || "A",
    //                        pWoID: req.body.workorderID || null,
    //                        pAssyID: req.body.assyID || null,
    //                        pCustomerID: req.body.customerID || null
    //                    },
    //                    type: sequelize.QueryTypes.SELECT
    //                }).then((resECODFMReportDetail) => {
    //                    ecodfmDetail = _.values(resECODFMReportDetail[0]);
    //                    companyDetail = _.values(resECODFMReportDetail[1]);

    //                    let templateData = {
    //                        ecodfmdetail: ecodfmDetail,
    //                        companydetail: companyDetail,
    //                        commonparam: commonParam,
    //                        Title: req.body.reportName,
    //                        woNumber: "0009-01",
    //                        rev: "A"
    //                    };
    //                    //const $pdf = await jsreport.pdfUtils.parse(res.content, true)

    //                    //  var headerhtml = headertemplate.render(templateData);
    //                    //let data = { items: [{ name: "Jan Blaha" }, { name: "John Lennon" }] };
    //                    var html = template.render(templateData);
    //                    // jsreport.documentStore.collection('templates').insert({
    //                    //     content: headerhtml,
    //                    //     name: 'headertmp',
    //                    //     shortid: 'headertmp',
    //                    //     engine: 'jsrender',
    //                    //     recipe: 'phantom-pdf',
    //                    //     helpers: `function getPageNumber (pageIndex) {if (pageIndex == null) { return ''}
    //                    //      const pageNumber = pageIndex + 1
    //                    //      return pageNumber}
    //                    //      function getTotalPages (pages) {
    //                    //          if (!pages) {return ''}
    //                    //          return pages.length}
    //                    //          function getPageInfo (pages, index) {
    //                    //             const group = pages[index].group
    //                    //             let gstart = index
    //                    //             while (gstart - 1 > -1 && pages[gstart - 1].group === group) {
    //                    //                 gstart--
    //                    //             }
    //                    //             let gend = index
    //                    //             while ((gend + 1 < pages.length) && pages[gend + 1].group === group) {
    //                    //                 gend++
    //                    //             }
    //                    //             return (index - gstart + 1) + ' of ' + (gend - gstart + 1)
    //                    //         }`,
    //                    // })

    //                    // jsreport.documentStore.collection('templates').insert({
    //                    //     content: fs.readFileSync('./uploads/template/common_footer.html').toString(),
    //                    //     name: 'footertmp',
    //                    //     shortid: 'footertmp',
    //                    //     engine: 'handlebars',
    //                    //     recipe: 'chrome-pdf',
    //                    //     helpers: `function getPageNumber (pageIndex) {if (pageIndex == null) { return ''}
    //                    //          const pageNumber = pageIndex + 1
    //                    //          return pageNumber}
    //                    //          function getTotalPages (pages) {
    //                    //              if (!pages) {return ''}
    //                    //              return pages.length}
    //                    //              function getPageInfo (pages, index) {
    //                    //                 const group = pages[index].group
    //                    //                 let gstart = index
    //                    //                 while (gstart - 1 > -1 && pages[gstart - 1].group === group) {
    //                    //                     gstart--
    //                    //                 }
    //                    //                 let gend = index
    //                    //                 while ((gend + 1 < pages.length) && pages[gend + 1].group === group) {
    //                    //                     gend++
    //                    //                 }
    //                    //                 return (index - gstart + 1) + ' of ' + (gend - gstart + 1)
    //                    //             }`,
    //                    // })
    //                    return jsreport.render({
    //                        // template: {
    //                        //     recipe: "phantom-pdf",
    //                        //     engine: "jsrender",
    //                        //     phantom: {
    //                        //         format: "Letter",
    //                        //         margin: { "top": "5px", "left": "20px", "right": "20px", "bottom": "5px" },
    //                        //         headerHeight: "0px",
    //                        //         footerHeight: "100px",
    //                        //         printDelay: 500,
    //                        //        // header: headerhtml.toString(),//fs.readFileSync('./uploads/template/common_header.html').toString(),
    //                        //         footer: fs.readFileSync('./uploads/template/common_footer.html').toString(),
    //                        //     },
    //                        //     content: html,
    //                        //     pdfOperations: [{
    //                        //         type: "append",
    //                        //         mergeWholeDocument: true,
    //                        //         renderForEveryPage: true,
    //                        //         //templateShortid: "headertmp"
    //                        //         template: {
    //                        //             content: headerhtml,
    //                        //             name: 'headertmp',
    //                        //             shortid: 'headertmp',
    //                        //             engine: 'jsrender',
    //                        //             recipe: 'phantom-pdf',
    //                        //             phantom: {
    //                        //                 margin: { "top": "5px", "left": "10px", "right": "10px", "bottom": "5px" },

    //                        //             }
    //                        //         }
    //                        //     }]
    //                        // }
    //                        // template: {
    //                        //     name: "Main",
    //                        //     recipe: "chrome-pdf",
    //                        //     engine: "handlebars",
    //                        //     chrom: {
    //                        //         "printBackground": true,
    //                        //         "marginTop": "2cm",
    //                        //         "marginRight": "2cm",
    //                        //         "marginBottom": "2cm",
    //                        //         "marginLeft": "2cm"
    //                        //     },
    //                        //     content: content,
    //                        //     helpers:`function getPageNumber (pageIndex) {
    //                        //         if (pageIndex == null) {
    //                        //             return ''
    //                        //         }

    //                        //         const pageNumber = pageIndex + 1

    //                        //         return pageNumber
    //                        //     }

    //                        //     function getTotalPages (pages) {
    //                        //         if (!pages) {
    //                        //             return ''
    //                        //         }

    //                        //         return pages.length
    //                        //     }`,
    //                        //     pdfOperations: [{
    //                        //         type: "merge",
    //                        //         mergeWholeDocument: true,
    //                        //         renderForEveryPage: true,
    //                        //         // templateShortid: "headertmp",
    //                        //         template: {
    //                        //             content: fs.readFileSync('./uploads/template/common_header.html').toString(),
    //                        //             name: 'headertmp',
    //                        //             shortid: 'headertmp',
    //                        //             engine: 'handlebars',
    //                        //             recipe: 'chrome-pdf',
    //                        //             helpers: `function getPageNumber (pageIndex) {if (pageIndex == null) { return ''}
    //                        //      const pageNumber = pageIndex + 1
    //                        //      return pageNumber}
    //                        //      function getTotalPages (pages) {
    //                        //          if (!pages) {return ''}
    //                        //          return pages.length}
    //                        //          function getPageInfo (pages, index) {
    //                        //             const group = pages[index].group
    //                        //             let gstart = index
    //                        //             while (gstart - 1 > -1 && pages[gstart - 1].group === group) {
    //                        //                 gstart--
    //                        //             }
    //                        //             let gend = index
    //                        //             while ((gend + 1 < pages.length) && pages[gend + 1].group === group) {
    //                        //                 gend++
    //                        //             }
    //                        //             return (index - gstart + 1) + ' of ' + (gend - gstart + 1)
    //                        //         }`,
    //                        //         }
    //                        //     },
    //                        //     ]
    //                        // }
    //                        // template: {
    //                        //     "name": "Main",
    //                        //     "recipe": "chrome-pdf",
    //                        //     "engine": "handlebars",
    //                        //     "content": "{{#each items}}\n    {{#if @index}}\n        <div style='page-break-before: always;'></div>\n    {{/if}}\n    <h1>{{name}}</h1>\n    {{{pdfCreatePagesGroup name}}}\n    <h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2><h2>Content</h2>\n{{/each}}",
    //                        //     "chrome": {
    //                        //         "marginTop": "2cm",
    //                        //         "marginRight": "1cm",
    //                        //         "marginBottom": "1cm",
    //                        //         "marginLeft": "1cm",
    //                        //         // "headerTemplate": fs.readFileSync('./uploads/template/common_header.html').toString(),
    //                        //     },
    //                        //     "data": {
    //                        //         dataJson: JSON.stringify(data)
    //                        //     },
    //                        //     "pdfOperations": [{
    //                        //         "type": "merge",
    //                        //         "renderForEveryPage": false,
    //                        //         "mergeWholeDocument": true,
    //                        //         "template": {
    //                        //             "name": "Header",
    //                        //             "title": 'Header',
    //                        //             "content": "<html>\n    <head>\n        <style>\n            {#asset uploads/template/styles/Header-Footer.css @encoding=utf8}\n        </style>\n    </head>\n    <body>\n        {{#each $pdf.pages}}\n          {{#if @index}}\n            <div style=\"page-break-before: always;\"></div>\n          {{/if}}\n          <main class=\"main\"> \n            <header class=\"header\">\n              dynamic header with page value \n              {{#with (lookup ../$pdf.pages @index)}}\n                {{group}}\n              {{/with}}  \n            </header>\n            <footer class=\"footer\">\n                <span>Page {{getPageInfo ../$pdf.pages @index}}</span>\n            </footer>\n          </main>\n        {{/each}}\n    </body>\n</html>",
    //                        //             "recipe": "chrome-pdf",
    //                        //             // "data": JSON.stringify(data),
    //                        //             "engine": "handlebars",
    //                        //             "helpers": "\nfunction getPageInfo (pages, index) {\n    const group = pages[index].group\n    \n    let gstart = index\n    while (gstart - 1 > -1 && pages[gstart - 1].group === group) {\n        gstart--\n    }\n\n    let gend = index\n    while ((gend + 1 < pages.length) && pages[gend + 1].group === group) {\n        gend++\n    }\n           \n    return (index - gstart + 1) + ' of ' + (gend - gstart + 1)\n}\n\n\n",

    //                        //         },
    //                        //     }],
    //                        // }

    //                        template: {
    //                            name: "Main",
    //                            recipe: "chrome-pdf",
    //                            engine: "handlebars",
    //                            content: html,
    //                            //content: fs.readFileSync('./uploads/template/eco_dfm_report.html').toString(),
    //                            chrome: {
    //                                "marginTop": "2cm",
    //                                "marginRight": "1cm",
    //                                "marginBottom": "1cm",
    //                                "marginLeft": "1cm",
    //                                // "headerTemplate": fs.readFileSync('./uploads/template/common_header.html').toString(),
    //                            },
    //                            helpers: `function getPageNumber (pageIndex) {if (pageIndex == null) { return ''}
    //                            const pageNumber = pageIndex + 1
    //                            return pageNumber}
    //                            function getTotalPages (pages) { if (!pages) {return ''} return pages.length}`,
    //                            "data": {
    //                                "dataJson": JSON.stringify(templateData).toString(),
    //                            },
    //                            "pdfOperations": [{
    //                                "type": "merge",
    //                                "renderForEveryPage": false,
    //                                "mergeWholeDocument": true,
    //                                "template": {
    //                                    "name": "Header",
    //                                    "title": 'Header',
    //                                    "content": "<html>\n    <head>\n        <style>\n            {#asset uploads/template/styles/Header-Footer.css @encoding=utf8}\n        </style>\n    </head>\n    <body>\n        {{#each $pdf.pages}}\n          {{#if @index}}\n            <div style=\"page-break-before: always;\"></div>\n          {{/if}}\n          <main class=\"main\"> \n            <header class=\"header\">\n              <img class=\"company_logo\" style=\"width:200px;height:80px;\" src=\"{{getCompanyLogo}}\" /> \n   {{gettitle}}           {{#with (lookup ../$pdf.pages @index)}}\n                {{group}}\n              {{/with}}  \n            </header>\n            <footer class=\"footer\">\n                <span>Page {{getPageInfo ../$pdf.pages @index}}</span>\n            </footer>\n          </main>\n        {{/each}}\n    </body>\n</html>",
    //                                    "recipe": "chrome-pdf",

    //                                    "engine": "handlebars",
    //                                    "helpers": "function getCompanyLogo(){return 'https://www.flextronassembly.com/wp-content/uploads/2018/12/3.png'}function gettitle(){return '" + templateData.Title + "'}\nfunction getPageInfo (pages, index) {\n    const group = pages[index].group\n    \n    let gstart = index\n    while (gstart - 1 > -1 && pages[gstart - 1].group === group) {\n        gstart--\n    }\n\n    let gend = index\n    while ((gend + 1 < pages.length) && pages[gend + 1].group === group) {\n        gend++\n    }\n           \n    return (index - gstart + 1) + ' of ' + (gend - gstart + 1)\n}\n\n\n",

    //                                },
    //                            }],
    //                        }
    //                    }).then((resp) => {
    //                        // resHandler.successRes(res, 200, STATE.SUCCESS, resp.content, null);
    //                        res.send(resp.content);
    //                    }).catch((err) => {
    //                        console.trace();
    //                        console.error(err);
    //                        return resHandler.errorRes(res, 200, STATE.EMPTY, null);
    //                    });
    //                }).catch((err) => {
    //                    console.trace();
    //                    console.error(err);
    //                    return resHandler.errorRes(res, 200, STATE.EMPTY, null);
    //                })

    //            });
    //        });
    //    }
    //    catch (err) {
    //        console.trace();
    //        console.error(err);
    //        return resHandler.errorRes(res, 200, STATE.EMPTY, null);
    //    }
    // },

    // getCommonReportParameter: (req, res) => {
    //    const { sequelize } = req.app.locals.models;
    //    return sequelize.query('call sproc_getCommonReportSystemConfiguration()', {
    //        type: sequelize.QueryTypes.SELECT
    //    }).then((resConfig) => {
    //        return model = _.values(resConfig[0][0]);
    //    })
    // }

    /* Comment by BT(21-04-2021) -  as save parameter configuration in separate table*/
    // Retrive list of Report Parameter Setting
    // GET : /api/v1/reportmaster/retriveParameterSettingList
    // @return list of Report Parameter Setting
    // retriveParameterSettings: (req, res) => {
    //     const { ReportParameterSettingMapping } = req.app.locals.models;
    //     ReportParameterSettingMapping.findAll({
    //         where: {
    //             isHiddenParameter: { [Op.ne]: true },
    //             isDeleted: false
    //         }
    //     }).then(report => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, report, null)).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     });
    // },

    // Retrive list of Report Parameter Setting
    // GET : /api/v1/reportmaster/retriveParameterSettingList
    // @return list of Report Parameter Setting
    retriveParameterSettings: (req, res) => {
        const { ReportParameterSettingMapping, ReportMasterParameter } = req.app.locals.models;
        if (req.params.id) {
            ReportParameterSettingMapping.findAll({
                where: {
                    isDisplay: true,
                    isDeleted: false
                },
                include: [{
                    model: ReportMasterParameter,
                    where: {
                        reportId: req.params.id
                    },
                    as: 'reportMasterParameters',
                    attributes: ['isRequired'],
                    required: false
                }]
            }).then(reportParameter => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportParameter, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /* Comment by BT(21-04-2021) -  as save parameter configuration in separate table*/
    // Save Report Filter Parameter Mapping
    // POST : /api/v1/reportmaster/reportParameterSettings
    // @return save Report Filter Parameter Mapping
    // saveReportParameterSettings: (req, res) => {
    //     const { ReportMaster } = req.app.locals.models;
    //     if (req.body) {
    //         const where = {};
    //         where.reportName = { [Op.eq]: req.body.reportName };
    //         if (req.body.id) {
    //             where.id = { [Op.ne]: req.body.id };
    //         }
    //         COMMON.setModelUpdatedByFieldValue(req);
    //         return ReportMaster.update(req.body, {
    //             where: {
    //                 id: req.body.id
    //             },
    //             fields: inputFields
    //         }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(reportParameterSettings))).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },

    // Save Report Filter Parameter Mapping
    // POST : /api/v1/reportmaster/saveReportParameterSettings
    // @return save Report Filter Parameter Mapping
    saveReportParameterSettings: (req, res) => {
        const { ReportMasterParameter, sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.transaction().then((t) => {
                var promises = [];
                _.forEach(req.body.parameterList, (data) => {
                    promises.push(ReportMasterParameter.findOne({
                        where: {
                            reportId: req.body.id,
                            parmeterMappingid: data.parameterId
                        },
                        paranoid: false
                    }).then((reportMasterParameter) => {
                        if (reportMasterParameter) {
                            if (reportMasterParameter.isDeleted == data.isSelected || reportMasterParameter.isRequired != data.isRequired) {
                                var updateReportMasterParameter = {
                                    isRequired: data.isRequired
                                };
                                if (data.isSelected) {
                                    COMMON.setModelUpdatedByFieldValue(updateReportMasterParameter);
                                    updateReportMasterParameter.isDeleted = false;
                                    updateReportMasterParameter.deletedBy = null;
                                    updateReportMasterParameter.deletedAt = null;
                                    updateReportMasterParameter.deleteByRoleId = null;
                                }
                                else {
                                    COMMON.setModelDeletedByFieldValue(updateReportMasterParameter);
                                }
                                return ReportMasterParameter.update(updateReportMasterParameter, {
                                    where: {
                                        reportId: req.body.id,
                                        parmeterMappingid: data.parameterId
                                    },
                                    fields: inputFieldsReportMasterParameter,
                                    paranoid: false,
                                    transaction: t
                                }).then(() => {
                                    return { Status: STATE.SUCCESS };
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { Status: STATE.FAILED, Error: err };
                                });
                            }
                        }
                        else {
                            if (data.isSelected) {
                                let updateReportMasterParameter = {
                                    reportId: req.body.id,
                                    parmeterMappingid: data.parameterId,
                                    isRequired: data.isRequired
                                };
                                COMMON.setModelCreatedByFieldValue(updateReportMasterParameter);
                                return ReportMasterParameter.create(updateReportMasterParameter, {
                                    transaction: t
                                }).then(() => {
                                    return { Status: STATE.SUCCESS };
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { Status: STATE.FAILED, Error: err };
                                });
                            }
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
                });

                Promise.all(promises).then((result) => {
                    if (result && Array.isArray(result)) {
                        const failedDetail = result.find(a => a && a.Status === STATE.FAILED);
                        if (!failedDetail) {
                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(reportParameterSettings)));
                        } else {
                            if (!t.finished) t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetail.Error, data: null });
                        }
                    } else {
                        if (!t.finished) t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
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

    // Retrive Report Filter Parameter Mapping
    // POST : /api/v1/reportmaster/retriveReportFilterParameterDetail
    // @return Report Filter Parameter Mapping
    retriveReportFilterParameterDetail: (req, res) => {
        const { ReportMasterParameter, ReportParameterSettingMapping, FixedEntityDataelement } = req.app.locals.models;
        if (req.params.id) {
            return ReportMasterParameter.findAll({
                where: { reportId: req.params.id },
                attributes: ['id', 'reportId', 'parmeterMappingid', 'isRequired'],
                include: [{
                    model: ReportParameterSettingMapping,
                    as: 'ReportParameterSettingMapping',
                    attributes: ['id', 'dbColumnName', 'displayName', 'type', 'dataSourceId', 'options', 'pageRouteState'],
                    include: [{
                        model: FixedEntityDataelement,
                        as: 'FixedEntityDataelement',
                        attributes: ['displayColumnPKField', 'displayColumnField'],
                        required: false
                    }],
                    required: true
                }]
            }).then((reportMasterParameters) => {
                var promiseMultiSelection = [];
                const itemToRemove = [];
                req.body.isNotFromUI = true;
                _.forEach(reportMasterParameters, (reportMasterParameterItem) => {
                    if (reportMasterParameterItem.ReportParameterSettingMapping.type === 'M') {
                        promiseMultiSelection.push(module.exports.getAutoCompleteFileterParameterData(req, res, reportMasterParameterItem));
                        itemToRemove.push(reportMasterParameterItem);
                    }
                });
                _.forEach(itemToRemove, (item) => {
                    reportMasterParameters.splice(reportMasterParameters.indexOf(item), 1);
                });
                return Promise.all(promiseMultiSelection).then((response) => {
                    const combinedResponse = reportMasterParameters.concat(response);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, combinedResponse, null);
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

    // Retrive datalist for bind Autocomplete/MultiSelection.
    // POST : /api/v1/reportmaster/getAutoCompleteFileterParameterData
    // @return datalist for bind Autocomplete/MultiSelection.
    getAutoCompleteFileterParameterData: (req, res, reportMasterParameter) => {
        const { sequelize, FixedEntityDataelement } = req.app.locals.models;
        if ((req.body && req.body.listObj) || reportMasterParameter) {
            if (req.body.isNotFromUI && reportMasterParameter) {
                const searchObj = {
                    dataSourceId: reportMasterParameter.ReportParameterSettingMapping.dataSourceId
                };
                req.body.listObj = searchObj;
            }

            return FixedEntityDataelement.findOne({
                where: {
                    id: req.body.listObj.dataSourceId
                },
                attributes: ['id', 'tableName', 'displayColumnPKField', 'displayColumnField', 'filter', 'displayFormattedColumnField']
            }).then((response) => {
                /* get fixed entity master data */
                let pwhereclause = ' deletedAt IS NULL ';
                var displayFormattedColumnField = JSON.parse(response.displayFormattedColumnField);

                const pfields = `${response.displayColumnPKField}, ${displayFormattedColumnField.displayFormat} as ${response.displayColumnField}`;
                pwhereclause += ` ${response.filter ? ` and ${response.filter}` : ''}`;/* where condition - filter data from table */

                /* set whereclause: 1. autocomplete with searchText 2. retrive all data*/
                if (req.body.listObj.searchText) {
                    pwhereclause += ` and (`;
                    _.forEach(displayFormattedColumnField.searchColmns, (searchColumn) => {
                        pwhereclause += ` ${searchColumn}  LIKE "%${req.body.listObj.searchText}%"  or`;
                    });
                    pwhereclause = pwhereclause.slice(1, pwhereclause.length - 2);
                    pwhereclause += `) `;
                } else if (req.body && req.body.listObj.searchID) {
                    pwhereclause += ` and ${response.displayColumnPKField} = ${req.body.listObj.searchID} `;
                }
                /* Set Order BY */
                let porderby = null;
                if (displayFormattedColumnField.sortBy.length > 0) {
                    porderby = '';
                    _.forEach(displayFormattedColumnField.sortBy, (sortArray) => {
                        porderby += `${sortArray[0]} ${sortArray[1]},`;
                    });
                    porderby = porderby.slice(0, porderby.length - 1);
                }

                return sequelize.query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)', {
                    replacements:
                    {
                        pfields: pfields, ptablename: response.tableName, pwherecluse: pwhereclause, pgroupby: '', porderby: porderby
                    }
                }).then((resp) => {
                    if (req.body.isNotFromUI) {
                        reportMasterParameter.dataValues.fieldValueToDisplay = reportMasterParameter.dataValues.FieldValue = resp;
                        return reportMasterParameter;
                    }
                    else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
                    }
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

    // Get report Template list
    // GET: /api/v1/reportmaster/retrieveReportTempleteList
    // @return Report Template list
    retrieveReportTempleteList: (req, res) => {
        const { ReportMaster } = req.app.locals.models;
        return ReportMaster.findAll({
            where: {
                reportGenerationType: DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CATEGORY.TEMPLATE_REPORT
            }
        }).then(templateList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, templateList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get List of Report master for Autocomplete list
    // POST : /api/v1/reportmaster/getReportNameSearch
    // @return List of Report master for Autocomplete list
    getReportNameSearch: (req, res) => {
        const { ReportMaster } = req.app.locals.models;

        var whereClause = {
            reportGenerationType: { [Op.ne]: DATA_CONSTANT.DYNAMIC_REPORT.REPORT_CATEGORY.TEMPLATE_REPORT },
            fileName: { [Op.ne]: null },
            isDeleted: false
        };

        if (req.body.listObj.query) {
            whereClause.reportName = { [Op.like]: `%${req.body.listObj.query}%` };
        }
        if (req.body.listObj.id) {
            whereClause.id = req.body.listObj.id;
        }
        if (req.body.listObj.entityId) {
            whereClause.entityId = req.body.listObj.entityId;
        }

        return ReportMaster.findAll({
            where: whereClause
        }).then((reportList) => {
            reportList = reportList && Array.isArray(reportList) && reportList.length > 0 ? reportList : [];
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportList, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get Record for retreive recrod from DB
    // GET : /api/v1/reportmaster/connectionAdapter
    // @return API response
    connectionAdapter: (req, res) => {
        dataResponse = res;
        let data = '';
        req.on('data', (buffer) => {
            data += buffer;
        });

        req.on('end', () => {
            const command = JSON.parse(data.toString());

            if (command.database === 'MySQL') MySQLAdapter.process(command, onProcess);
        });
    },
    // Get report list by entity
    // GET: /api/v1/reportmaster/getReportListByEntity
    // @return Report list by Entity.
    getReportListByEntity: (req, res) => {
        const { ReportMaster } = req.app.locals.models;
        if (req.body) {
            var whereClause = {
                entityId: req.body.listObj.entityId,
                isDeleted: false
            };

            if (req.body.listObj.query) {
                whereClause.reportName = {
                    [Op.like]: `%${req.body.listObj.query}%`
                };
            }
            if (req.body.listObj.id) {
                whereClause.id = {
                    [Op.eq]: `${req.body.listObj.id}`
                };
            }

            return ReportMaster.findAll({
                where: whereClause
            }).then(reportList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportList, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get Default report by entity
    // GET: /api/v1/reportmaster/getDefaultReportByEntity
    // @return Default Report by Entity.
    getDefaultReportByEntity: (req, res) => {
        const { ReportMaster } = req.app.locals.models;
        if (req.body) {
            var whereClause = {
                entityId: req.body.listObj.entityId,
                isDefaultReport: true,
                isDeleted: false
            };

            return ReportMaster.findOne({
                where: whereClause
            }).then(defaultReport => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, defaultReport ? STATE.SUCCESS : STATE.EMPTY, defaultReport, defaultReport ? null : "Default Report Couldn't be found for This Entity.");
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
