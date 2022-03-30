const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
// const Stimulsoft = require('stimulsoft-reports-js');
// var StimulsoftDashboard = require('stimulsoft-dashboards-js');
// const uuidv1 = require('uuid/v1');
// const mkdirp = require('mkdirp');
var MySQLAdapter = require('./../../constant/mySqlAdapter');
const fs = require('fs');
const { Op } = require('sequelize');

const reportModuleName = DATA_CONSTANT.DYNAMIC_REPORT.NAME;

var response;
function onProcess(result) {
    response.end(JSON.stringify(result));
}

module.exports = {
    // Get Report Detail
    // GET : /api/v1/reportdetail/getReport
    // @return Get Report Detail
    // getReport: (req, res) => {
    //     var reportId = req.query.reportId;
    //     if (reportId) {
    //         const { ReportMaster, ReportChangeLogs, User, sequelize } = req.app.locals.models;

    //         return ReportMaster.findOne({
    //             where: {
    //                 fileName: reportId
    //             },
    //             include: [{
    //                 model: ReportChangeLogs,
    //                 as: 'Report_Change_Logs',
    //                 where: { endActivityDate: { [Op.eq]: null } },
    //                 attributes: ['startActivityDate', 'endActivityDate', 'activityStartBy', 'reportId', 'id',
    //                     [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone',
    //                         sequelize.col('Report_Change_Logs.startActivityDate')), 'activityStartAt']],
    //                 require: false,
    //                 include: [{
    //                     model: User,
    //                     as: 'user',
    //                     require: false,
    //                     attributes: ['firstName', 'lastName']
    //                 }]
    //             }],
    //             paranoid: false
    //         }).then((reportDetail) => {
    //             if (reportDetail) {
    //                 // Creating new report
    //                 const report = new Stimulsoft.Report.StiReport();
    //                 const fileName = reportDetail.draftFileName ? reportDetail.draftFileName : reportDetail.fileName;

    //                 const endUserReportPath = reportDetail.isEndUserReport ? DATA_CONSTANT.DYNAMIC_REPORT.END_USER_REPORT_FILE_PATH :
    //                     DATA_CONSTANT.DYNAMIC_REPORT.SYSTEM_REPORT_FILE_PATH;
    //                 // Loading report template
    //                 report.loadFile(endUserReportPath + fileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION);

    //                 try {
    //                     return report.renderAsync(() => {
    //                         // Saving rendered report to JSON string

    //                         var reportJson = report.saveToJsonString();
    //                         var reportJsonDet = { jsonDet: reportJson, reportDetail: reportDetail };

    //                         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportJsonDet);
    //                     });
    //                 } catch (err) {
    //                     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                 }
    //             } else {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(reportModuleName), err: null, data: null });
    //             }
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
    //             } else {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //             }
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },
    // Get Dashboard Detail
    // GET : /api/v1/reportdetail/getDashboard
    // @return Get Dashboard Detail
    // getDashboard: (req, res) => {
    //     // Creating new dashboard
    //     var report = Stimulsoft.Report.StiReport.createNewDashboard();
    //     // Loading dashboard template
    //     report.loadFile('reports/dashboard/dashboardDemo.mrt');

    //     // Saving dashboard to JSON string
    //     const dashboardJson = report.saveToJsonString();

    //     // Send dashboard
    //     res.end(dashboardJson);
    // },
    // Save Report Detail
    // POST : /api/v1/reportdetail/addReport
    // @return Save Report Detail
    // addReport: (req, res) => {
    //     var reportId = req.body.reportId;
    //     if (reportId) {
    //         const { ReportMaster } = req.app.locals.models;

    //         return ReportMaster.findOne({
    //             where: {
    //                 id: reportId
    //             },
    //             paranoid: false
    //         }).then((reportDetail) => {
    //             if (reportDetail) {
    //                 const reportStatus = reportDetail.status === (DATA_CONSTANT.DYNAMIC_REPORT.REPORT_STATUS.DRAFT).toString()
    //                     && (req.body.isDraft) ? reportDetail.status : (DATA_CONSTANT.DYNAMIC_REPORT.REPORT_STATUS.PUBLISHED).toString();
    //                 const updateObj = {
    //                     isDraft: req.body.isDraft,
    //                     status: reportStatus,
    //                     draftFileName: req.body.isDraft ?
    //                         (reportDetail.draftFileName ? reportDetail.draftFileName : uuidv1())
    //                         : null,
    //                     reportVersion: req.body.isDraft ? reportDetail.reportVersion : req.body.reportVersion
    //                 };
    //                 return ReportMaster.update(updateObj, {
    //                     where: {
    //                         id: reportId
    //                     },
    //                     fields: ['status', 'draftFileName', 'reportVersion']
    //                 }).then((rowsUpdated) => {
    //                     if (rowsUpdated[0] === 1) {
    //                         // Creating new report
    //                         const report = new Stimulsoft.Report.StiReport();
    //                         try {
    //                             const endUserReportPath = reportDetail.isEndUserReport ? DATA_CONSTANT.DYNAMIC_REPORT.END_USER_REPORT_FILE_PATH :
    //                                 DATA_CONSTANT.DYNAMIC_REPORT.SYSTEM_REPORT_FILE_PATH;
    //                             if (reportDetail.isEndUserReport && reportDetail.fileName) {
    //                                 mkdirp(endUserReportPath, () => { });
    //                             }

    //                             if (!updateObj.isDraft && reportDetail.draftFileName) {
    //                                 fs.unlink(`${endUserReportPath}${reportDetail.draftFileName}${DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION}`, () => { });
    //                             }
    //                             report.load(req.body.reportJsonObj);
    //                             const fileName = updateObj.isDraft ? updateObj.draftFileName : reportDetail.fileName;
    //                             report.saveFile(endUserReportPath + fileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION);

    //                             return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(reportModuleName));
    //                         } catch (err) {
    //                             console.trace();
    //                             console.error(err);
    //                             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                         }
    //                     } else {
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(reportModuleName), err: null, data: null });
    //                     }
    //                 }).catch((err) => {
    //                     console.trace();
    //                     console.error(err);
    //                     if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
    //                     } else if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY(reportModuleName), err: null, data: null });
    //                     } else {
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                     }
    //                 });
    //             } else {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(reportModuleName), err: null, data: null });
    //             }
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
    //             } else {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //             }
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },

    // Save Dashboard Detail
    // POST : /api/v1/reportdetail/addDashboardReport
    // @return Save Dashboard Detail
    // addDashboardReport: (req, res) => {
    //     // Creating new report
    //     var report = StimulsoftDashboard.Report.StiReport.createNewDashboard();

    //     // Loading report template
    //     // report.loadFile("reports/Standard Type Master.mrt");
    //     try {
    //         req.body = JSON.stringify(req.body);
    //         report.load(req.body);
    //         //
    //         // report.dictionary.variables.getByName("employeeId").valueObject = parseInt(req.params.employeeNo);
    //         // Renreding report
    //         try {
    //             try {
    //                 return report.renderAsync(() => {
    //                     // Saving rendered report to JSON string
    //                     // report.saveDocumentToJsonString(req.body);

    //                     report.saveFile(`reports/dashboard/${req.body.ReportFile}`);

    //                     return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
    //                 });
    //             } catch (err) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //             }
    //         } catch (err) {
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         }
    //     } catch (err) {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     }
    // },
    // Connection on Preview Report fetch data using Data Adapter
    // POST : /api/v1/reportdetail/connectionAdapter
    // @return Data base on request database query
    connectionAdapter: (req, res) => {
        response = res;
        let data = '';
        req.on('data', (buffer) => {
            data += buffer;
        });

        req.on('end', () => {
            const command = JSON.parse(data.toString());

            if (command.database === 'MySQL') MySQLAdapter.process(command, onProcess);
        });
    },
    // Stop Activity
    // POST : /api/v1/reportdetail/stopActivity
    // @return Stop Activity
    stopActivity: (req, res) => {
        if (req.body.reportId) {
            const { ReportChangeLogs, ReportMaster, sequelize } = req.app.locals.models;
            return ReportMaster.findOne({
                where: {
                    [Op.or]: [
                        { fileName: req.body.reportId },
                        { draftFileName: req.body.reportId }
                    ]
                },
                paranoid: false
            }).then((reportDetail) => {
                if (reportDetail) {
                    const whereClause = {
                        reportId: reportDetail.id,
                        endActivityDate: { [Op.eq]: null }
                    };

                    // COMMON.setModelUpdatedByArrayFieldValue(req);
                    req.body.endActivityDate = COMMON.getCurrentUTC();
                    COMMON.setModelUpdatedByArrayFieldValue(req);
                    // req.body.endActivityDate = COMMON.getCurrentUTC();
                    return sequelize.transaction().then((t) => {
                        var promises = [];

                        COMMON.setModelUpdatedByFieldValue(req);

                        req.body.startDesigningDate = null;
                        req.body.editingBy = null;

                        promises.push(ReportMaster.update(req.body, {
                            where: { id: { [Op.eq]: reportDetail.id } },
                            transaction: t,
                            fields: ['editingBy', 'startDesigningDate']
                        }).then(() => ({ Status: STATE.SUCCESS })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { Status: STATE.FAILED, Error: err };
                        }));

                        req.body.endActivityDate = COMMON.getCurrentUTC();

                        promises.push(ReportChangeLogs.update(req.body, {
                            where: whereClause,
                            transaction: t,
                            fields: ['endActivityDate', 'updatedBy', 'updatedAt']
                        }).then(() => ({ Status: STATE.SUCCESS })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { Status: STATE.FAILED, Error: err };
                        }));

                        return Promise.all(promises).then((result) => {
                            var failedDetail = result.find(a => a.Status === STATE.FAILED);
                            if (!failedDetail) {
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.REPORT.STOP_ACTIVITY_SUCCESS));
                            } else {
                                if (!t.finished) t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetail.Error, data: null });
                            }
                        }).catch((err) => {
                            if (!t.finished) t.rollback();
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(reportModuleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Discard Draft Change
    // POST : /api/v1/reportdetail/discardDraftChange
    // @return Discard Draft Change
    // discardDraftChange: (req, res) => {
    //     var reportId = req.body.reportId;
    //     if (reportId) {
    //         const { ReportMaster } = req.app.locals.models;
    //         return ReportMaster.findOne({
    //             where: {
    //                 id: reportId
    //             },
    //             paranoid: false
    //         }).then((reportDetail) => {
    //             if (reportDetail) {
    //                 // Creating new report
    //                 const report = new Stimulsoft.Report.StiReport();

    //                 const endUserReportPath = reportDetail.isEndUserReport ? DATA_CONSTANT.DYNAMIC_REPORT.END_USER_REPORT_FILE_PATH :
    //                     DATA_CONSTANT.DYNAMIC_REPORT.SYSTEM_REPORT_FILE_PATH;

    //                 mkdirp(endUserReportPath, () => { });

    //                 const fileLocationPath = endUserReportPath + reportDetail.fileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION;
    //                 const fileNameWithName = endUserReportPath + reportDetail.draftFileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION;

    //                 // Copying the file to a the same name
    //                 return fs.copyFile(fileLocationPath, fileNameWithName, (err) => {
    //                     if (err) {
    //                         console.trace();
    //                         console.error(err);
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                     } else {
    //                         // Loading report template
    //                         report.loadFile(endUserReportPath + reportDetail.draftFileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION);
    //                         try {
    //                             return report.renderAsync(() => {
    //                                 // Saving rendered report to JSON string
    //                                 var reportJson = report.saveToJsonString();
    //                                 var reportJsonDet = { jsonDet: reportJson, reportDetail: reportDetail };

    //                                 return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportJsonDet);
    //                             });
    //                         } catch (ex) {
    //                             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                         }
    //                     }
    //                 });
    //             } else {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
    //                     {
    //                         hasPublishVersion: false

    //                     });
    //             }
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
    //             } else {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //             }
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },
    // Delete Country
    // DELETE : /api/v1/reportmaster/deleteReports
    // @param {countryId} int
    // @return API response
    deleteReportOnDiscardDraft: (req, res) => {
        const { sequelize, ReportMaster } = req.app.locals.models;
        var reportId = req.body.reportId;
        if (reportId) {
            const whereClause = {
                id: { [Op.in]: [reportId] }
            };

            return ReportMaster.findAll({
                where: whereClause
            }).then((reportList) => {
                const tableName = COMMON.AllEntityIDS.REPORT_MASTER.Name;
                return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                    replacements: {
                        tableName: tableName,
                        IDs: reportId,
                        deletedBy: COMMON.getRequestUserID(req) || null,
                        entityID: null,
                        refrenceIDs: null,
                        countList: false,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req) || null
                    }
                }).then((reportDetail) => {
                    if (reportDetail.length === 0) {
                        reportList.forEach((item) => {
                            var endUserReportPath = item.isEndUserReport ? DATA_CONSTANT.DYNAMIC_REPORT.END_USER_REPORT_FILE_PATH :
                                DATA_CONSTANT.DYNAMIC_REPORT.SYSTEM_REPORT_FILE_PATH;
                            var filePath = endUserReportPath + item.fileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION;
                            fs.unlink(filePath, () => { });
                            if (item.draftFileName) {
                                const draftFilePath = endUserReportPath + item.draftFileName + DATA_CONSTANT.DYNAMIC_REPORT.REPORT_EXTENSTION;
                                fs.unlink(draftFilePath, () => { });
                            }
                        });
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reportDetail, MESSAGE_CONSTANT.DELETED(reportModuleName));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: reportDetail, IDs: req.body.objIDs.id }, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
