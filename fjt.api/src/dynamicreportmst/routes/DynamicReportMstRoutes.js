const router = require('express').Router(); // eslint-disable-line
const DynamicReportMst = require('../controllers/DynamicReportMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveDynamicReportData')
        .post(DynamicReportMst.saveDynamicReportData);

    router.route('/updateDynamicReportData/:id')
        .put(DynamicReportMst.updateDynamicReportData);

    router.route('/updateDynamicReportPivotJsonData')
        .post(DynamicReportMst.updateDynamicReportPivotJsonData);

    router.route('/getDynamicReportNames/:EmployeeID/:isUserSuperAdmin')
        .get(DynamicReportMst.getDynamicReportNames);

    router.route('/getDynamicReportDetailsByReportID')
        .post(DynamicReportMst.getDynamicReportDetailsByReportID);

    router.route('/deleteDynamicReportDetailsByReportID/:id/:reportName')
        .delete(DynamicReportMst.deleteDynamicReportDetailsByReportID);

    router.route('/getDynamicReportMstDetByReportID')
        .post(DynamicReportMst.getDynamicReportMstDetByReportID);

    router.route('/getPinnedToDashboardMISReports')
        .post(DynamicReportMst.getPinnedToDashboardMISReports);

    router.route('/pinMisReportToDashBoard')
        .post(DynamicReportMst.pinMisReportToDashBoard);

    router.route('/checkDuplicateReportName')
        .post(DynamicReportMst.checkDuplicateReportName);

    router.route('/copyMISReportFromExistingReport')
        .post(DynamicReportMst.copyMISReportFromExistingReport);

    app.use(
        '/api/v1/dynamicreportmst',

        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
