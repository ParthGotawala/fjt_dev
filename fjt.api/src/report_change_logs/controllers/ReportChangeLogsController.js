const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const reportModuleName = DATA_CONSTANT.DYNAMIC_REPORT.NAME;
const inputFields = [
    'id',
    'reportId',
    'startActivityDate',
    'endActivityDate',
    'activityStartBy',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const reportChangeLogModuleName = DATA_CONSTANT.REPORT_CHANGE_LOGS.NAME;

module.exports = {
    // Start Activity
    // POST : /api/v1/reportchangelog/startActivity
    // @return Start Activity
    startActivity: (req, res) => {
        if (req.body.reportId) {
            const { ReportChangeLogs, ReportMaster, User, sequelize } = req.app.locals.models;

            const whereClause = {
                reportId: { [Op.eq]: req.body.reportId },
                endActivityDate: { [Op.eq]: null }
            };
            return ReportChangeLogs.findOne({
                where: whereClause,
                attributes: ['startActivityDate', 'endActivityDate', 'activityStartBy', 'reportId', 'id',
                    [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('ReportChangeLogs.startActivityDate')), 'activityStartAt']],
                include: [{
                    model: User,
                    as: 'user',
                    require: false,
                    attributes: ['firstName', 'lastName']
                }]
            }).then((response) => {
                if (response) {
                    if (response.activityStartBy === req.user.id) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body);
                    }
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.REPORT.ACTIVITY_ALREADY_STARTED);
                    messageContent.message = COMMON.stringFormat(messageContent.message, response.dataValues.activityStartAt, response.user.firstName.concat(' ', response.user.lastName));
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: { unique: true } });
                } else {
                    return ReportMaster.findOne({
                        where: { id: { [Op.eq]: req.body.reportId } }
                    }).then((reportDetail) => {
                        if (reportDetail.createdBy && Number(reportDetail.createdBy) === req.user.id) {
                            return sequelize.transaction().then((t) => {
                                var promises = [];
                                COMMON.setModelCreatedByFieldValue(req);
                                req.body.startActivityDate = COMMON.getCurrentUTC();
                                req.body.activityStartBy = req.user.id;
                                req.body.updateByRoleId = req.user.defaultLoginRoleID;
                                promises.push(ReportChangeLogs.create(req.body, {
                                    fields: inputFields,
                                    transaction: t
                                }).then(() => ({ Status: STATE.SUCCESS })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { Status: STATE.SUCCESS, Error: err };
                                }));

                                req.body.startDesigningDate = req.body.startActivityDate;
                                req.body.editingBy = req.user.id;
                                COMMON.setModelUpdatedByFieldValue(req);

                                promises.push(ReportMaster.update(req.body, {
                                    where: { id: { [Op.eq]: req.body.reportId } },
                                    fields: ['editingBy', 'startDesigningDate'],
                                    transaction: t
                                }).then(() => ({ Status: STATE.SUCCESS })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { Status: STATE.SUCCESS, Error: err };
                                }));
                                return Promise.all(promises).then((result) => {
                                    if (result && Array.isArray(result)) {
                                        const failedDetail = result.find(a => a.Status === STATE.FAILED);
                                        if (!failedDetail) {
                                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body));
                                        } else {
                                            if (!t.finished) t.rollback();
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetail.Error, data: null });
                                        }
                                    } else {
                                        if (!t.finished) t.rollback();
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                }).catch((err) => {
                                    if (!t.finished) t.rollback();
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
    // Check Activity Started or not
    // GET : /api/v1/reportchangelog/checkActivityStarted
    // @return Check Activity Started or not
    checkActivityStarted: (req, res) => {
        if (req.body.reportId) {
            const { ReportChangeLogs } = req.app.locals.models;

            const whereClause = {
                reportId: { [Op.eq]: req.body.reportId },
                endActivityDate: { [Op.ne]: null }
            };
            return ReportChangeLogs.findOne({
                where: whereClause
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Current Activity Detail by Report Id
    // GET : /api/v1/reportchangelog/checkActivityStarted
    // @return Check Activity Started or not
    currentActivityDetById: (req, res) => {
        if (req.body.reportId) {
            const { ReportChangeLogs } = req.app.locals.models;

            const whereClause = {
                reportId: req.body.reportId,
                endActivityDate: { [Op.ne]: null }
            };
            return ReportChangeLogs.findOne({
                where: whereClause
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Stop Activity
    // POST : /api/v1/reportchangelog/stopActivity
    // @return Stop Activity
    stopActivity: (req, res) => {
        if (req.body.reportId) {
            const { ReportChangeLogs, ReportMaster, sequelize } = req.app.locals.models;
            return sequelize.transaction().then((t) => {
                COMMON.setModelUpdatedByFieldValue(req);
                var promises = [];
                req.body.endActivityDate = COMMON.getCurrentUTC();
                promises.push(ReportChangeLogs.update(req.body, {
                    where: { 
                        reportId: { [Op.eq]: req.body.reportId },
                        endActivityDate: { [Op.eq]: null }
                    },
                    fields: inputFields,
                    transaction: t
                }).then(() => {
                    return { Status: STATE.SUCCESS }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { Status: STATE.FAILED, Error: err };
                }));

                req.body.startDesigningDate = null;
                req.body.editingBy = null;
                promises.push(ReportMaster.update(req.body, {
                    where: { id: { [Op.eq]: req.body.reportId } },
                    fields: ['editingBy', 'startDesigningDate'],
                    transaction: t
                }).then(() => {
                    return { Status: STATE.SUCCESS }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { Status: STATE.FAILED, Error: err };
                }));

                return Promise.all(promises).then((result) => {
                    if (result && Array.isArray(result)) {
                        const failedDetail = result.find(a => a.Status === STATE.FAILED);
                        if (!failedDetail) {
                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, "Activity Stopped Successfully."));
                        } else {
                            if (!t.finished) t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetail.Error, data: null });
                        }
                    } else {
                        if (!t.finished) t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    if (!t.finished) t.rollback();
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
    }
};
